import { randomUUID } from 'node:crypto'
import { EventKeys, OneBotCore } from './core'

import type { WebSocket } from 'ws'
import type { IncomingMessage } from 'node:http'
import type { OneBotApi } from '../api'
import type { Echo, OneBotWsEvent } from '../event'

/** WebSocket 客户端请求参数 */
export type OneBotWsClientOptions = {
  /** 鉴权秘钥 */
  accessToken?: string
  /** 头部 */
  headers?: Record<string, string>
  /** 是否自动重连 */
  autoReconnect?: boolean
  /** 重连间隔 默认5000ms */
  reconnectInterval?: number
  /** 最大重连次数 默认100次 */
  maxReconnectAttempts?: number
} & OneBotCore['_options']

/** WebSocket 服务端请求参数 */
export type OneBotWsServerOptions = {
  /** 鉴权秘钥，客户端连接时需要提供相同的token */
  accessToken?: string
} & OneBotCore['_options']

/** WebSocket 错误类型 */
export enum OneBotWsErrorType {
  /** 鉴权失败 - 缺少Authorization头 */
  AUTH_MISSING_HEADER = 4001,
  /** 鉴权失败 - Authorization头格式错误 */
  AUTH_INVALID_FORMAT = 4002,
  /** 鉴权失败 - 无效的Token */
  AUTH_INVALID_TOKEN = 4003,
  /** 主动关闭连接 */
  MANUAL_CLOSE = 4000,
}

/** WebSocket 默认配置 */
const DEFAULT_OPTIONS: Required<Pick<OneBotWsClientOptions, 'autoReconnect' | 'reconnectInterval' | 'maxReconnectAttempts' | 'timeout'>> = {
  autoReconnect: true,
  reconnectInterval: 5000,
  maxReconnectAttempts: 100,
  timeout: 10000,
}

/**
 * OneBot WebSocket 核心类
 */
export class OneBotWs extends OneBotCore {
  echo: bigint
  _socket: WebSocket
  _autoReconnect: boolean
  _reconnectInterval: number
  _maxReconnectAttempts: number

  constructor (socket: WebSocket, options?: OneBotWsClientOptions) {
    super(options)
    this.echo = BigInt(0)
    this._socket = socket
    this._autoReconnect = options?.autoReconnect ?? DEFAULT_OPTIONS.autoReconnect
    this._reconnectInterval = options?.reconnectInterval ?? DEFAULT_OPTIONS.reconnectInterval
    this._maxReconnectAttempts = options?.maxReconnectAttempts ?? DEFAULT_OPTIONS.maxReconnectAttempts
  }

  /**
   * 关闭连接
   */
  close () {
    this.emit(EventKeys.manualClose)
  }

  /**
   * 更新socket 用于`WebSocket`掉线之后重连
   */
  setSocket (socket: WebSocket) {
    this._socket = socket
  }

  /**
   * 判断是否为echo事件
   * @param data - 事件数据
   */
  isEcho (data: OneBotWsEvent): data is Echo {
    return 'echo' in data && 'status' in data && 'data' in data
  }

  async init () {
    this._socket.on('message', (event) => {
      const raw = event.toString() || '{}'
      const data = JSON.parse(raw) as OneBotWsEvent

      if (this.isEcho(data)) {
        this.emit(`echo:${data.echo}`, data)
        return
      }

      this._dispatch(data)
    })

    this._socket.on('error', (error) => {
      this.emit(EventKeys.error, error)
    })

    /** 初始化Bot基本信息 */
    await this._initBotInfo()
  }

  /**
   * 发送API请求
   * @param action - API动作
   * @param params - API参数
   * @param timeout - 超时时间
   * @returns 返回API响应 注意: 返回的是response.data，而不是response
   */
  async sendApi<T extends keyof OneBotApi> (
    action: T,
    params: OneBotApi[T]['params'],
    timeout: number = this._options.timeout
  ): Promise<OneBotApi[T]['response']> {
    const echo = (++this.echo).toString()
    const request = JSON.stringify({ echo, action, params })

    return new Promise((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        reject(this._formatApiError(action, request, '请求超时'))
      }, timeout * 1000)

      this.emit(EventKeys.sendApi, { echo, action, params, request })
      this._socket.send(request)
      this.once(`echo:${echo}`, data => {
        /** 停止监听器 */
        clearTimeout(timeoutId)

        if (data.status === 'ok') {
          resolve(data.data)
        } else {
          reject(this._formatApiError(action, request, data))
        }

        this.emit(EventKeys.response, { echo, action, params, request, data })
      })
    })
  }
}

/**
 * OneBot WebSocket 管理类
 * 用于创建和管理WebSocket连接
 */
export class OneBotWsManager {
  /** 已连接的客户端实例 */
  private _clients: Map<string, OneBotWs> = new Map()
  /** 已连接的服务端实例 */
  private _servers: Map<string, OneBotWs> = new Map()
  /** 连接配置 */
  private _connectOptions: Map<string, OneBotWsClientOptions> = new Map()
  /** 连接URL */
  private _connectUrls: Map<string, string> = new Map()

  /**
   * 创建WebSocket客户端
   * @param url - WebSocket URL
   * @param options - 配置选项
   * @returns OneBotWs客户端实例
   */
  async createClient (url: string, options?: OneBotWsClientOptions): Promise<OneBotWs> {
    /** 使用URL作为客户端的唯一标识符 */
    const id = url

    /** 合并默认配置 */
    const mergedOptions: OneBotWsClientOptions = {
      ...options,
      headers: typeof options?.headers === 'object' ? options.headers : {},
      autoReconnect: options?.autoReconnect ?? DEFAULT_OPTIONS.autoReconnect,
      reconnectInterval: options?.reconnectInterval ?? DEFAULT_OPTIONS.reconnectInterval,
      maxReconnectAttempts: options?.maxReconnectAttempts ?? DEFAULT_OPTIONS.maxReconnectAttempts,
      timeout: options?.timeout ?? DEFAULT_OPTIONS.timeout,
    }

    /** 保存连接配置 */
    this._connectOptions.set(id, mergedOptions)
    this._connectUrls.set(id, url)

    /** 创建客户端 */
    const client = await this._createClient(url, mergedOptions)

    /** 保存客户端实例 */
    this._clients.set(id, client)

    return client
  }

  /**
   * 创建WebSocket服务端
   * @param socket - WebSocket实例
   * @param request - 请求
   * @param options - 配置选项
   * @returns OneBotWs服务端实例
   */
  createServer (socket: WebSocket, request: IncomingMessage, options?: OneBotWsServerOptions): OneBotWs {
    const id = randomUUID()

    /** 鉴权检查 */
    if (options?.accessToken) {
      const authHeader = request.headers['authorization']

      /** 检查Authorization头 */
      if (!authHeader) {
        socket.close(OneBotWsErrorType.AUTH_MISSING_HEADER, '缺少Authorization头')
        throw new Error('WebSocket连接鉴权失败：缺少Authorization头')
      }

      /** 检查token格式 */
      const match = authHeader.match(/^Bearer\s+(.+)$/)
      if (!match) {
        socket.close(OneBotWsErrorType.AUTH_INVALID_FORMAT, 'Authorization头格式错误')
        throw new Error('WebSocket连接鉴权失败：Authorization头格式错误')
      }

      /** 检查token是否匹配 */
      const token = match[1]
      if (token !== options.accessToken) {
        socket.close(OneBotWsErrorType.AUTH_INVALID_TOKEN, '无效的Token')
        throw new Error('WebSocket连接鉴权失败：无效的Token')
      }
    }

    const mergedOptions: OneBotWsServerOptions = {
      ...options,
      timeout: options?.timeout ?? DEFAULT_OPTIONS.timeout,
    }

    const onebot = new OneBotWs(socket, mergedOptions)
    this._servers.set(id, onebot)
    socket.on('close', () => {
      onebot.emit(EventKeys.close, { isConnected: false, initError: new Error('连接已关闭') })
    })
    onebot.on(EventKeys.manualClose, () => socket.close(OneBotWsErrorType.MANUAL_CLOSE, '主动关闭连接'))

    return onebot
  }

  /**
   * 获取所有已连接的客户端
   * @returns 客户端Map
   */
  getClients (): Map<string, OneBotWs> {
    return this._clients
  }

  /**
   * 获取所有已连接的服务端
   * @returns 服务端Map
   */
  getServers (): Map<string, OneBotWs> {
    return this._servers
  }

  /**
   * 获取指定客户端
   * @param id - 客户端ID
   * @returns 客户端实例，不存在则返回undefined
   */
  getClient (id: string): OneBotWs | undefined {
    return this._clients.get(id)
  }

  /**
   * 获取指定服务端
   * @param id - 服务端ID
   * @returns 服务端实例，不存在则返回undefined
   */
  getServer (id: string): OneBotWs | undefined {
    return this._servers.get(id)
  }

  /**
   * 关闭指定客户端连接
   * @param id - 客户端ID
   * @returns 是否成功关闭
   */
  closeClient (id: string): boolean {
    const client = this._clients.get(id)
    if (client) {
      client.close()
      return true
    }
    return false
  }

  /**
   * 关闭指定服务端连接
   * @param id - 服务端ID
   * @returns 是否成功关闭
   */
  closeServer (id: string): boolean {
    const server = this._servers.get(id)
    if (server) {
      server.close()
      return true
    }
    return false
  }

  /**
   * 关闭所有客户端连接
   */
  closeAllClients (): void {
    for (const client of this._clients.values()) {
      client.close()
    }
  }

  /**
   * 关闭所有服务端连接
   */
  closeAllServers (): void {
    for (const server of this._servers.values()) {
      server.close()
    }
  }

  /**
   * 关闭所有连接
   */
  closeAll (): void {
    this.closeAllClients()
    this.closeAllServers()
  }

  /**
   * 手动重新连接指定客户端
   * @param id - 客户端ID
   * @returns 重连后的客户端实例
   */
  async reconnectClient (id: string): Promise<OneBotWs | undefined> {
    const url = this._connectUrls.get(id)
    const options = this._connectOptions.get(id)

    if (!url || !options) {
      return undefined
    }

    /** 先关闭旧连接 */
    this.closeClient(id)

    /** 创建新连接 */
    const client = await this._createClient(url, options)
    this._clients.set(id, client)

    return client
  }

  /**
   * 设置客户端配置并重新连接
   * @param id - 客户端ID
   * @param options - 新的配置选项（完全替换旧配置）
   * @returns 重连后的客户端实例
   */
  async setClientOptions (id: string, options: OneBotWsClientOptions): Promise<OneBotWs | undefined> {
    const url = this._connectUrls.get(id)

    if (!url) {
      return undefined
    }

    /** 完全替换旧配置 */
    this._connectOptions.set(id, options)

    /** 重新连接 */
    return this.reconnectClient(id)
  }

  /**
   * 删除客户端
   * @param id - 客户端ID
   * @param closeConnection - 是否同时关闭连接
   * @returns 是否成功删除
   */
  deleteClient (id: string, closeConnection = true): boolean {
    if (closeConnection) {
      this.closeClient(id)
    }

    this._connectUrls.delete(id)
    this._connectOptions.delete(id)
    return this._clients.delete(id)
  }

  /**
   * 删除服务端
   * @param id - 服务端ID
   * @param closeConnection - 是否同时关闭连接
   * @returns 是否成功删除
   */
  deleteServer (id: string, closeConnection = true): boolean {
    if (closeConnection) {
      this.closeServer(id)
    }
    return this._servers.delete(id)
  }

  /**
   * 创建OneBotWs客户端实例
   * @param url - WebSocket URL
   * @param options - 配置选项
   * @returns OneBotWs客户端实例
   */
  private async _createClient (url: string, options: OneBotWsClientOptions): Promise<OneBotWs> {
    const socket = await this._createWebSocketClient(url, options)
    const client = new OneBotWs(socket, options)

    this._initWebSocketClient(socket, client, url, options)
    return client
  }

  /**
   * 内部方法：创建WebSocket客户端
   * @private
   */
  private async _createWebSocketClient (url: string, options: OneBotWsClientOptions) {
    /** 添加认证头 */
    if (options.accessToken) {
      options.headers!['authorization'] = `Bearer ${options.accessToken}`
    }

    const socket = await this._createWebSocketInstance(url, options.headers)
    return socket
  }

  /**
   * 初始化WebSocket客户端监听
   * @param socket - WebSocket实例
   * @param client - OneBotWs客户端实例
   * @param url - WebSocket URL
   * @param options - 配置选项
   */
  private _initWebSocketClient (
    socket: WebSocket,
    client: OneBotWs,
    url: string,
    options: OneBotWsClientOptions
  ) {
    /** 是否已连接 */
    let isConnected = false
    /** 初始化错误 */
    let initError: Error | undefined
    /** 是否主动关闭 */
    let manualClosed = false

    /** 监听主动关闭事件 */
    client.on(EventKeys.manualClose, () => {
      manualClosed = true
      socket.close(OneBotWsErrorType.MANUAL_CLOSE, '主动关闭连接')
    })

    socket.on('open', async () => {
      isConnected = true
      await client.init()

      client.emit(EventKeys.open)
    })

    /**
     * - 如果是未连接状态 产生的close事件还会有一个error事件 并且error事件会先于close事件触发
     * - 如果是已连接状态 产生的close事件不会有error事件`(可能?)`
     */
    socket.on('close', () => {
      if (manualClosed) {
        client.emit(EventKeys.close, { isConnected, initError: new Error(`[OneBot][WebSocket] 连接已主动关闭: ${url}`) })
        return
      }

      this._handleReconnect(url, options, client, isConnected, initError)
    })

    socket.on('error', (error) => {
      if (isConnected) {
        client.emit(EventKeys.error, error)
      } else {
        initError = error
      }
    })
  }

  /**
   * 内部方法：处理重连逻辑
   * @private
   */
  private _handleReconnect (
    url: string,
    options: OneBotWsClientOptions,
    client: OneBotWs,
    isConnected: boolean,
    initError: Error | undefined
  ): void {
    const safeError = initError || new Error('未知错误')

    client.emit(EventKeys.close, { isConnected, initError: safeError })

    if (!options.autoReconnect) {
      const msg = `[OneBot][WebSocket] 连接${isConnected ? '关闭' : '失败'}，自动重连已关闭: ${url}`
      client.emit(EventKeys.error, new Error(msg, { cause: initError }))
      return
    }

    if (options.maxReconnectAttempts! <= 0) {
      const msg = `[OneBot][WebSocket] 重连次数用完: ${url}`
      client.emit(EventKeys.error, new Error(msg, { cause: initError }))
      return
    }

    client.emit(EventKeys.reconnect, { isConnected, initError: safeError })
    setTimeout(async () => {
      options.maxReconnectAttempts!--
      /** 重连之后 需要重新创建、监听、设置socket */
      const socket = await this._createWebSocketInstance(url, options.headers)
      client.setSocket(socket)
      this._initWebSocketClient(socket, client, url, options)
    }, options.reconnectInterval!)
  }

  /**
   * 内部方法：创建带有认证头的WebSocket实例
   * @private
   */
  private async _createWebSocketInstance (url: string, headers?: Record<string, string>): Promise<WebSocket> {
    try {
      const { default: WebSocket } = await import('ws')
      return Object.keys(headers || {}).length > 0
        ? new WebSocket(url, headers)
        : new WebSocket(url)
    } catch (error) {
      throw new Error('WebSocket初始化失败，请检查是否安装了ws模块', { cause: error })
    }
  }
}

/**
 * 创建WebSocket管理器实例
 * @returns OneBotWsManager实例
 */
export const createWebSocketManager = (): OneBotWsManager => {
  return new OneBotWsManager()
}
