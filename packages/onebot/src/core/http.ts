import { http } from '../tools'
import { createHmac, randomUUID } from 'node:crypto'
import { EventKeys, OneBotCore } from './core'
import { createServer, type IncomingMessage, type ServerResponse } from 'node:http'

import type { OneBotApi } from '../api'
import type { OneBotEvent } from '../event'

/** http 客户端请求参数 */
export type OneBotHttpClientOptions = {
  /** self_id */
  self_id: number
  /** OneBot httpHost 地址 */
  httpHost: string
  /** OneBot http鉴权秘钥 */
  OneBotAccessToken?: string
  /** 上报事件鉴权秘钥 */
  accessToken?: string
  /** 心跳 默认5000ms */
  heartbeat?: number
  /** 头部 */
  headers?: Record<string, string>
  /** 最大重连次数 默认100次 */
  maxReconnectAttempts?: number
} & OneBotCore['_options']

/** http 默认配置 */
const DEFAULT_OPTIONS: Required<Pick<
  OneBotHttpClientOptions,
  'maxReconnectAttempts' |
  'timeout' |
  'heartbeat' |
  'headers'
>
> = {
  /** 心跳 默认5000ms */
  heartbeat: 5000,
  /** 最大重连次数 默认100次 */
  maxReconnectAttempts: 100,
  /** 超时时间 默认10000ms */
  timeout: 10000,
  /** 头部 默认{} */
  headers: {},
}

/**
 * OneBot http 核心类
 */
export class OneBotHttp extends OneBotCore {
  /** 心跳 */
  private _heartbeat: number
  /** 收到事件后的校验秘钥 */
  private _accessToken?: string
  /** 最大重连次数 */
  private _maxReconnectAttempts: number
  /** 心跳计时器 */
  private _heartbeatInterval?: NodeJS.Timeout
  /** 当前心跳失败次数 */
  private _heartbeatFailCount: number = 0
  /** 是否已关闭 */
  private _closed: boolean = false
  /** OneBot 信息 */
  private _onebot: {
    /** OneBot httpHost 地址 */
    host: string
    /** OneBot http鉴权秘钥 */
    accessToken?: string
    /** 头部 */
    headers: Record<string, string>
  }

  constructor (options: OneBotHttpClientOptions) {
    super(options)

    this.self.id = options.self_id
    this._accessToken = options.accessToken
    this._heartbeat = options.heartbeat ?? DEFAULT_OPTIONS.heartbeat
    this._maxReconnectAttempts = options.maxReconnectAttempts ?? DEFAULT_OPTIONS.maxReconnectAttempts

    this._onebot = {
      host: options.httpHost,
      accessToken: options.OneBotAccessToken,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${options.OneBotAccessToken}`,
      },
    }

    if (!this._onebot.accessToken) {
      delete this._onebot.headers.Authorization
    }
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
    if (this._closed) {
      throw new Error('[OneBot] 连接已关闭')
    }

    const request = JSON.stringify({ action, params })
    this.emit(EventKeys.sendApi, { action, params, request })
    const data = await http.post(this._onebot.host, request, { timeout, headers: this._onebot.headers })

    if (data.data.status === 'ok') {
      return data.data.data
    } else {
      throw this._formatApiError(action, request, data.data)
    }
  }

  /**
   * 发送心跳
   */
  private async _sendHeartbeat () {
    if (this._closed) return false

    try {
      await this.getVersionInfo()
      this._heartbeatFailCount = 0
      return true
    } catch (error) {
      this._heartbeatFailCount++

      if (this._heartbeatFailCount >= this._maxReconnectAttempts) {
        this.emit(EventKeys.error, new Error(`[OneBot] 心跳失败次数超过最大重试次数: ${this._maxReconnectAttempts}`))
        this.emit(EventKeys.close, { isConnected: false, initError: new Error(`心跳失败次数超过最大重试次数: ${this._maxReconnectAttempts}`) })
        this._stopHeartbeat()
        return false
      }

      this.emit(EventKeys.error, new Error(`[OneBot] 心跳失败 (${this._heartbeatFailCount}/${this._maxReconnectAttempts}): ${(error as Error).message}`))
      return false
    }
  }

  /**
   * 停止心跳
   */
  private _stopHeartbeat () {
    if (this._heartbeatInterval) {
      clearInterval(this._heartbeatInterval)
      this._heartbeatInterval = undefined
    }
  }

  /**
   * 开始心跳
   */
  private _startHeartbeat () {
    this._stopHeartbeat()
    this._heartbeatInterval = setInterval(() => this._sendHeartbeat(), this._heartbeat)
  }

  /**
   * 初始化
   */
  async init () {
    if (this._closed) {
      this._closed = false
    }

    /** 需要发一个心跳 */
    const isHeartbeat = await this._sendHeartbeat()

    if (!isHeartbeat) {
      throw new Error(`发送第一次心跳失败: 请检查目标地址是否可访问: ${this._onebot.host}`)
    }

    /** 设置心跳 */
    this._startHeartbeat()
    /** 初始化Bot基本信息 */
    await this._initBotInfo()
  }

  /**
   * 关闭连接
   */
  close () {
    this._closed = true
    this._stopHeartbeat()
    this.emit(EventKeys.manualClose)
    this.emit(EventKeys.close, { isConnected: true, initError: new Error('主动关闭连接') })
  }

  /**
   * 更新配置
   * @param options 新配置
   */
  async updateOptions (options: Partial<OneBotHttpClientOptions>) {
    const wasRunning = !this._closed

    if (wasRunning) {
      this.close()
    }

    if (typeof options.self_id === 'number') {
      this.self.id = options.self_id
    }

    if (options.accessToken !== undefined) {
      this._accessToken = options.accessToken
    }

    if (typeof options.heartbeat === 'number') {
      this._heartbeat = options.heartbeat
    }

    if (typeof options.maxReconnectAttempts === 'number') {
      this._maxReconnectAttempts = options.maxReconnectAttempts
    }

    if (typeof options.timeout === 'number') {
      this._options.timeout = options.timeout
    }

    if (options.httpHost) {
      this._onebot.host = options.httpHost
    }

    if (options.OneBotAccessToken !== undefined) {
      this._onebot.accessToken = options.OneBotAccessToken

      if (options.OneBotAccessToken) {
        this._onebot.headers.Authorization = `Bearer ${options.OneBotAccessToken}`
      } else {
        delete this._onebot.headers.Authorization
      }
    }

    if (options.headers) {
      this._onebot.headers = {
        ...options.headers,
      }

      if (this._onebot.accessToken) {
        this._onebot.headers.Authorization = `Bearer ${this._onebot.accessToken}`
      }
    }

    if (wasRunning) {
      return this.init()
    }
  }

  /**
   * 收到事件
   * @param event - 事件
   * @param headers - 头部
   */
  handleEvent (event: OneBotEvent | string, headers: Record<string, string>) {
    const data: OneBotEvent = typeof event === 'string' ? JSON.parse(event) : event

    if (data.self_id !== this.self.id) {
      throw new Error(`[OneBot] 收到事件的self_id与当前Bot的self_id不一致: ${data.self_id} !== ${this.self.id}`)
    }

    if (this.verifyEvent(data, headers)) {
      return this._dispatch(data)
    }

    throw new Error(`[OneBot] 鉴权失败: ${data?.self_id || this.self.id} x-signature: ${headers?.['x-signature']}`)
  }

  /**
   * 校验一个事件是否合法
   * @param event - 事件
   * @param headers - 头部
   * @returns 是否合法
   */
  verifyEvent (event: OneBotEvent, headers: Record<string, string>) {
    if (!this._accessToken) {
      return true
    }

    if (typeof headers !== 'object' || !headers['x-signature']) {
      return false
    }

    const sign = createHmac('sha1', this._accessToken).update(JSON.stringify(event)).digest('hex')
    if (`sha1=${sign}` !== headers['x-signature']) {
      return false
    }

    return true
  }
}

/**
 * HTTP服务器配置选项
 */
export type OneBotHttpServerOptions = {
  /** 鉴权秘钥，客户端连接时需要提供相同的token */
  accessToken?: string
  /** 监听的端口 */
  port: number
  /** 监听的主机 */
  host?: string
  /** 路径，默认为"/" */
  path?: string
}

/**
 * OneBot Http 管理类
 * 用于创建和管理HTTP连接
 */
export class OneBotHttpManager {
  /** 已连接的客户端实例 */
  private _clients: Map<string, OneBotHttp> = new Map()
  /** 连接配置 */
  private _connectOptions: Map<string, OneBotHttpClientOptions> = new Map()
  /** HTTP服务器实例 */
  private _httpServers: Map<string, {
    server: ReturnType<typeof createServer>,
    options: OneBotHttpServerOptions
  }> = new Map()

  /**
   * 创建HTTP客户端
   * @param options - 配置选项
   * @returns OneBotHttp客户端实例
   */
  async createClient (options: OneBotHttpClientOptions): Promise<OneBotHttp> {
    const id = options.self_id.toString()

    /** 合并默认配置 */
    const mergedOptions: OneBotHttpClientOptions = {
      ...options,
      headers: typeof options.headers === 'object' ? options.headers : {},
      heartbeat: options.heartbeat ?? DEFAULT_OPTIONS.heartbeat,
      maxReconnectAttempts: options.maxReconnectAttempts ?? DEFAULT_OPTIONS.maxReconnectAttempts,
      timeout: options.timeout ?? DEFAULT_OPTIONS.timeout,
    }

    /** 保存连接配置 */
    this._connectOptions.set(id, mergedOptions)

    /** 创建客户端 */
    const client = new OneBotHttp(mergedOptions)

    client.on(EventKeys.close, () => {
      this._clients.delete(id)
    })

    /** 初始化客户端 */
    try {
      await client.init()
      /** 保存客户端实例 */
      this._clients.set(id, client)
      return client
    } catch (error) {
      this._connectOptions.delete(id)
      throw error
    }
  }

  /**
   * 获取所有已连接的客户端
   * @returns 客户端Map
   */
  getClients (): Map<string, OneBotHttp> {
    return this._clients
  }

  /**
   * 获取指定客户端
   * @param id - 客户端ID
   * @returns 客户端实例，不存在则返回undefined
   */
  getClient (id: string): OneBotHttp | undefined {
    return this._clients.get(id)
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
      this._clients.delete(id)
      return true
    }
    return false
  }

  /**
   * 关闭所有客户端连接
   */
  closeAllClients (): void {
    for (const [id, client] of this._clients.entries()) {
      client.close()
      this._clients.delete(id)
    }
  }

  /**
   * 手动重新连接指定客户端
   * @param id - 客户端ID
   * @returns 重连后的客户端实例
   */
  async reconnectClient (id: string): Promise<OneBotHttp | undefined> {
    const options = this._connectOptions.get(id)

    if (!options) {
      return undefined
    }

    /** 先关闭旧连接 */
    this.closeClient(id)

    /** 创建新连接 */
    const client = new OneBotHttp(options)

    await client.init()
    this._clients.set(id, client)
    return client
  }

  /**
   * 更新客户端配置并重新连接
   * @param id - 客户端ID
   * @param options - 新的配置选项（部分更新）
   * @returns 重连后的客户端实例
   */
  async updateClientOptions (id: string, options: Partial<OneBotHttpClientOptions>): Promise<OneBotHttp | undefined> {
    const oldOptions = this._connectOptions.get(id)

    if (!oldOptions) {
      return undefined
    }

    /** 合并新旧配置 */
    const mergedOptions: OneBotHttpClientOptions = {
      ...oldOptions,
      ...options,
    }

    /** 更新保存的配置 */
    this._connectOptions.set(id, mergedOptions)

    /** 获取现有客户端 */
    const client = this._clients.get(id)
    if (!client) {
      /** 如果客户端不存在，创建新的 */
      return this.createClient(mergedOptions)
    } else {
      /** 更新现有客户端配置 */
      await client.updateOptions(options)
      return client
    }
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

    const client = this._clients.get(id)
    if (client) {
      client.emit(EventKeys.close, { isConnected: false, initError: new Error('连接主动关闭') })
    }
    this._connectOptions.delete(id)
    return this._clients.delete(id)
  }

  /**
   * 创建HTTP服务器接收事件
   * @param options 服务器配置
   * @returns 服务器ID
   */
  createHttpServer (options: OneBotHttpServerOptions): Promise<string> {
    return new Promise((resolve, reject) => {
      const id = randomUUID()
      const path = options.path || '/'

      const server = createServer(async (req: IncomingMessage, res: ServerResponse) => {
        try {
          /** 检查路径 */
          if (req.url !== path) {
            res.statusCode = 404
            res.end('Not Found')
            return
          }

          /** 只接受POST请求 */
          if (req.method !== 'POST') {
            res.statusCode = 405
            res.end('Method Not Allowed')
            return
          }

          /** 读取请求体 */
          const buffers: Buffer[] = []
          for await (const chunk of req) {
            buffers.push(Buffer.from(chunk))
          }
          const body = Buffer.concat(buffers).toString('utf-8')

          /** 解析事件数据 */
          let event: OneBotEvent
          try {
            event = JSON.parse(body)
          } catch (error) {
            res.statusCode = 400
            res.end('Invalid JSON')
            return
          }

          /** 获取self_id */
          const selfId = event.self_id
          if (!selfId) {
            res.statusCode = 400
            res.end('Missing self_id')
            return
          }

          /** 查找对应的客户端实例 */
          let foundClient: OneBotHttp | undefined

          for (const client of this._clients.values()) {
            if (client.self.id === selfId) {
              foundClient = client
              break
            }
          }

          if (!foundClient) {
            res.statusCode = 404
            res.end(`{"status":"failed","message":"No client found for self_id: ${selfId}"}`)
            return
          }

          /** 处理事件 */
          try {
            /** 获取所有请求头 */
            const headers: Record<string, string> = {}
            for (const key in req.headers) {
              const value = req.headers[key]
              if (value) {
                headers[key] = Array.isArray(value) ? value[0] : value
              }
            }

            foundClient.handleEvent(event, headers)
            res.statusCode = 200
            res.end('{"status":"ok"}')
          } catch (error) {
            res.statusCode = 403
            res.end(`{"status":"failed","message":"${(error as Error).message}"}`)
          }
        } catch (error) {
          res.statusCode = 500
          res.end(`{"status":"failed","message":"${(error as Error).message}"}`)
        }
      })

      /** 监听错误 */
      server.on('error', (error) => {
        reject(error)
      })

      /** 启动服务器 */
      server.listen(options.port, options.host || '127.0.0.1', () => {
        this._httpServers.set(id, { server, options })
        resolve(id)
      })
    })
  }

  /**
   * 关闭HTTP服务器
   * @param id 服务器ID
   * @returns 是否成功关闭
   */
  closeHttpServer (id: string): boolean {
    const serverInfo = this._httpServers.get(id)
    if (!serverInfo) {
      return false
    }

    /** 关闭服务器 */
    serverInfo.server.close()
    this._httpServers.delete(id)
    return true
  }

  /**
   * 获取所有HTTP服务器
   * @returns 服务器Map
   */
  getHttpServers (): Map<string, { options: OneBotHttpServerOptions }> {
    const servers = new Map<string, { options: OneBotHttpServerOptions }>()
    for (const [id, { options }] of this._httpServers.entries()) {
      servers.set(id, { options })
    }
    return servers
  }

  /**
   * 关闭所有HTTP服务器
   */
  closeAllHttpServers (): void {
    for (const id of this._httpServers.keys()) {
      this.closeHttpServer(id)
    }
  }
}

/**
 * 创建HTTP管理器实例
 * @returns OneBotHttpManager实例
 */
export const createHttpManager = (): OneBotHttpManager => {
  return new OneBotHttpManager()
}
