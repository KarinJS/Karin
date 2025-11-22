import { URL } from 'node:url'
import { TLSSocket } from 'node:tls'

import type { WebSocket } from 'ws'
import type { IncomingMessage } from 'node:http'

export type WsServerCallback = (
  socket: WebSocket,
  request: IncomingMessage,
) => void | Promise<void>

/**
 * WebSocket Server 上下文管理类
 */
export class WsServerContext {
  /** 路由列表 */
  #routes: Record<string, WsServerCallback[]> = {}

  /**
   * 注册一个新的path监听
   * @param path 路由路径
   * @param callback 回调函数
   */
  registerPath (path: string, callback: WsServerCallback): void {
    if (!this.#routes[path]) {
      this.#routes[path] = []
    }

    this.#routes[path].push(callback)
  }

  /**
   * 获取完整的请求地址
   * @param request 请求信息
   */
  getFullWsUrl (request: IncomingMessage) {
    const protocol = request.socket instanceof TLSSocket && request.socket.encrypted ? 'wss' : 'ws'
    const host = request.headers.host // 127.0.0.1:8080 会自己附带端口号
    const path = request.url
    return new URL(`${protocol}://${host}${path}`)
  }

  /**
   * 分发请求到对应路由
   * @param socket WebSocket连接
   * @param request 请求信息
   */
  dispatch (
    socket: WebSocket,
    request: IncomingMessage
  ): void {
    const url = this.getFullWsUrl(request)

    // request.url会完整包含查询参数，因此需要提取路径部分
    const callbacks = this.#routes[url.pathname]
    if (!callbacks || callbacks.length === 0) {
      const url = new URL(request.url || '', `ws://${request.headers.host}`)
      logger.error(`[ws][server] 未找到对应路由处理连接请求, 即将关闭连接: ${url.toString()}`)
      socket.close()
      return
    }

    for (const callback of callbacks) {
      try {
        callback(socket, request)
      } catch (error) {
        logger.error(`[ws][server] 处理路由 ${url.pathname} 时发生错误:`, error)
      }
    }
  }

  /**
   * 快捷鉴权方法
   * @param socket WebSocket连接
   * @param request 请求信息
   * @param options 选项
   * @description 如果不需要鉴权,请不要调用此方法,直接允许连接即可
   */
  public getAuth (
    request: IncomingMessage,
    options: {
      /** 鉴权秘钥 */
      token: string
      query?: {
        /**
         * 鉴权参数名
         * @default 'access_token'
         */
        name?: string
        /** 当请求头没有Authorization时是否从query中获取 */
        enable?: boolean
      }
      /**
       * 是否严格匹配
       * @default true
       * - true: 不会进行任何处理，直接对比字符串
       * - false: 会自动补全 'Bearer ' 前缀后再进行对比
       * @description 在非严格匹配模式下, 会统一去掉 'Bearer ' 前缀并调用 trim() 方法后再进行对比
       */
      strict?: boolean
      /**
       * 自定义判断函数
       * @description 如果提供此函数，则会使用此函数的返回值作为鉴权结果，忽略其他选项
       */
      customCheck?: (
        /** 提供的鉴权token */
        token: string,
        /** 从请求中获取的鉴权token */
        authorization: string | null
      ) => boolean
    }
  ) {
    const headers = request.headers

    /** 从请求中获取Authorization */
    let authorization: string | null = null
    if (headers.authorization) {
      authorization = Array.isArray(headers.authorization)
        ? headers.authorization[0]
        : headers.authorization
    }

    /** 如果没有从请求头中获取到，并且允许从query中获取 */
    if (!authorization && options.query?.enable) {
      const url = new URL(request.url || '', `http://${headers.host}`)
      const params = url.searchParams
      const queryToken = params.get(options.query.name || 'access_token')
      if (queryToken) {
        authorization = queryToken
      }
    }

    /** 使用自定义判断函数 */
    if (options.customCheck) {
      return Boolean(options.customCheck(options.token || '', authorization))
    }

    /** 如果没有提供鉴权token，则直接拒绝 */
    if (!authorization) return false

    /** 严格匹配模式 */
    if (options.strict ?? true) {
      return authorization === options.token
    }

    /**
   * 非严格匹配模式处理
   * @description 去掉 'Bearer ' 前缀并调用 trim() 方法
   * @param token 鉴权token
   */
    const normalize = (token: string) => {
      if (typeof token !== 'string') return ''
      return token.startsWith('Bearer ')
        ? token.slice(7).trim()
        : token.trim()
    }

    const formalToken = normalize(options.token)
    const formalAuthorization = normalize(authorization)

    /** 如果任一为空 则返回false */
    if (formalToken === '' || formalAuthorization === '') {
      return false
    }

    return formalAuthorization === formalToken
  }

  /**
   * 移除路径或回调
   * @param path 路由路径
   * @param callback 回调函数
   */
  removePath (path: string, callback: WsServerCallback): void {
    if (!this.#routes[path]) {
      return
    }

    this.#routes[path] = this.#routes[path].filter(cb => !Object.is(cb, callback))
    if (this.#routes[path].length === 0) {
      delete this.#routes[path]
    }
  }
}

/**
 * WebSocket Server 上下文实例
 */
export const wsServerContext = new WsServerContext()
