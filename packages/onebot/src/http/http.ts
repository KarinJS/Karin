import { http } from '../tools'
import { createHmac } from 'node:crypto'
import { OneBotCore } from '../core/core'
import { OneBotCloseType, OneBotErrorType, OneBotEventKey } from '../ws'

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

/** http客户端内部配置 */
export type OneBotHttpClientInternalOptions = Required<OneBotHttpClientOptions>

/** http 默认配置 */
const DEFAULT_OPTIONS: OneBotHttpClientInternalOptions = {
  /** self_id */
  self_id: 0,
  /** OneBot httpHost 地址 */
  httpHost: '',
  /** 上报事件鉴权秘钥 */
  accessToken: '',
  /** OneBot http鉴权秘钥 */
  OneBotAccessToken: '',
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
  /** 是否已关闭 */
  _closed: boolean = false
  /** 心跳失败次数 */
  _heartbeatFailCount: number = 0
  /** 配置 */
  _options: OneBotHttpClientInternalOptions
  /** 心跳计时器 */
  _heartbeatInterval?: NodeJS.Timeout

  constructor (options: OneBotHttpClientOptions) {
    super(options)
    this._options = this.getOptions(options)
    this.self.id = options.self_id
  }

  /**
   * 获取格式化后的配置
   * @param options - 配置选项
   * @returns 内部配置
   */
  static getOptions (options: OneBotHttpClientOptions): OneBotHttpClientInternalOptions {
    const mergedOptions = {
      headers: {
        ...options.headers || {},
      },
      self_id: options.self_id,
      httpHost: options.httpHost,
      accessToken: options.accessToken || '',
      OneBotAccessToken: options.OneBotAccessToken || '',
      heartbeat: options.heartbeat || DEFAULT_OPTIONS.heartbeat,
      maxReconnectAttempts: options.maxReconnectAttempts || DEFAULT_OPTIONS.maxReconnectAttempts,
      timeout: options.timeout || DEFAULT_OPTIONS.timeout,
    }

    if (mergedOptions.accessToken) {
      mergedOptions.headers.authorization = `Bearer ${mergedOptions.accessToken}`
    }

    return mergedOptions
  }

  /**
   * 获取格式化后的配置
   * @param options - 配置选项
   * @returns 内部配置
   */
  getOptions (options: OneBotHttpClientOptions): OneBotHttpClientInternalOptions {
    return OneBotHttp.getOptions(options)
  }

  _close () {
    this._closed = true
    this.removeAllListeners()
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
    this.emit(OneBotEventKey.SEND_API, { action, params, request, echo: '' })
    const data = await http.post(this._options.httpHost, request, { timeout, headers: this._options.headers })

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

      if (this._heartbeatFailCount >= this._options.maxReconnectAttempts) {
        this.emit(OneBotEventKey.ERROR, { error: error as Error, type: OneBotErrorType.ERROR })
        this.emit(OneBotEventKey.CLOSE, OneBotCloseType.HEARTBEAT_FAILED_MAX_RETRIES)
        this._stopHeartbeat()
        this._close()
        return false
      }

      this.emit(OneBotEventKey.ERROR, { error: error as Error, type: OneBotErrorType.ERROR })
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
    this._heartbeatInterval = setInterval(() => this._sendHeartbeat(), this._options.heartbeat)
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
      throw new Error(`发送第一次心跳失败: 请检查目标地址是否可访问: ${this._options.httpHost}`)
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
    this.emit(OneBotEventKey.CLOSE, OneBotCloseType.MANUAL_CLOSE)
    this._close()
  }

  /**
   * 更新配置
   * @param options 新配置
   */
  async updateOptions (options: Partial<OneBotHttpClientOptions>) {
    this._options = {
      self_id: this._options.self_id,
      accessToken: typeof options.accessToken !== 'undefined' ? options.accessToken : this._options.accessToken,
      OneBotAccessToken: typeof options.OneBotAccessToken !== 'undefined' ? options.OneBotAccessToken : this._options.OneBotAccessToken,
      httpHost: typeof options.httpHost !== 'undefined' ? options.httpHost : this._options.httpHost,
      heartbeat: typeof options.heartbeat !== 'undefined' ? options.heartbeat : this._options.heartbeat,
      maxReconnectAttempts: typeof options.maxReconnectAttempts !== 'undefined' ? options.maxReconnectAttempts : this._options.maxReconnectAttempts,
      timeout: typeof options.timeout !== 'undefined' ? options.timeout : this._options.timeout,
      headers: typeof options.headers !== 'undefined' ? options.headers : this._options.headers,
    }

    if (this._options.accessToken) {
      this._options.headers.authorization = `Bearer ${this._options.accessToken}`
    }

    /** 重载心跳计时器 */
    this._stopHeartbeat()
    this._startHeartbeat()
  }

  /**
   * 收到事件
   * @param event - 事件
   * @param headers - 头部
   */
  handleEvent (event: OneBotEvent | string, headers: Record<string, string>) {
    if (this._closed) return

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
    if (!this._options.accessToken) {
      return true
    }

    if (typeof headers !== 'object' || !headers['x-signature']) {
      return false
    }

    const sign = createHmac('sha1', this._options.accessToken).update(JSON.stringify(event)).digest('hex')
    if (`sha1=${sign}` !== headers['x-signature']) {
      return false
    }

    return true
  }
}
