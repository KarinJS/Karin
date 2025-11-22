import { http } from '../../tools'
import { OneBotCore } from '../core'
import { createHmac } from 'node:crypto'

import type { OneBotApi } from '../../api'
import type { OneBotEvent } from '../../event'
import type { IncomingHttpHeaders } from 'node:http'

/**
 * OneBot HTTP 客户端内部选项
 */
export type OneBotHttpClientOptions = {
  /** OneBot httpHost 地址 */
  httpHost: string
  /** OneBot http鉴权秘钥 */
  accessToken?: string
  /** 是否启用心跳 */
  heartbeat?: boolean
  /** 心跳间隔 默认5000ms */
  heartbeatInterval?: number
  /** 头部 */
  headers?: Record<string, string>
  /** 超时时间 */
  timeout?: number
  /** 重连次数 */
  reconnectAttempts: number
}

type OneBotHttpClientOptionsRequired = Required<OneBotHttpClientOptions>

/**
 * OneBot HTTP 客户端服务状态
 */
export enum OneBotHttpServiceStatus {
  /** 未知状态 */
  UNKNOWN = 0,
  /** 服务可用 */
  AVAILABLE = 1,
  /** 服务不可用 */
  UNAVAILABLE = 2,
}

/**
 * OneBot HTTP 客户端类
 * HTTP是无状态协议，每次API调用都是独立的请求
 */
export class OneBotHttpClient extends OneBotCore {
  _options: OneBotHttpClientOptionsRequired
  /** 心跳失败次数 */
  #heartbeatFailCount: number = 0
  /** 心跳计时器 */
  #heartbeatInterval?: NodeJS.Timeout
  /** 服务状态 */
  #serviceStatus: OneBotHttpServiceStatus = OneBotHttpServiceStatus.UNKNOWN

  constructor (options: OneBotHttpClientOptions) {
    super(options)
    this._options = OneBotHttpClient.getOptions(options)
  }

  /**
   * 获取当前服务状态
   */
  get status (): OneBotHttpServiceStatus {
    return this.#serviceStatus
  }

  /**
   * 检查服务是否可用
   */
  get isServiceAvailable (): boolean {
    return this.#serviceStatus === OneBotHttpServiceStatus.AVAILABLE
  }

  async init () {
    /** 发送心跳 */
    const success = await this.heartbeatInterval()
    if (!success) {
      throw new Error('OneBot HTTP 服务初始化失败，无法连接到服务器')
    }

    /** 初始化Bot基本信息 */
    await this.initBotInfo()
    this.#setServiceStatus(OneBotHttpServiceStatus.AVAILABLE)

    if (this._options.heartbeat) {
      /** 设置心跳 */
      this.#heartbeatInterval = setInterval(() => this.heartbeatInterval(), this._options.heartbeatInterval)
    }
  }

  /**
   * 心跳
   */
  async heartbeatInterval (): Promise<boolean> {
    try {
      await this.getVersionInfo()
      this.#setServiceStatus(OneBotHttpServiceStatus.AVAILABLE)
      this.#heartbeatFailCount = 0
      return true
    } catch (error) {
      this.#setServiceStatus(OneBotHttpServiceStatus.UNAVAILABLE)
      this.#heartbeatFailCount++
      this.emit('error', error as Error)

      if (this.#heartbeatFailCount >= OneBotHttpClient.HEARTBEAT_FAILED_MAX) {
        this.emit('close', OneBotHttpClient.HEARTBEAT_FAILED_MAX, Buffer.from('心跳失败次数达到上限'))
        this.removeAllListeners()
      }

      return false
    }
  }

  /**
   * 设置服务状态
   */
  #setServiceStatus (status: OneBotHttpServiceStatus) {
    this.#serviceStatus = status
  }

  /**
   * 收到事件
   * @description 事件仅接受 body.toString()，请不要使用 JSON.parse(body)
   * @param event - 事件 原始请求体
   * @param headers - 请求头
   * @param token - 事件验证令牌
   * @returns HTTP响应内容
   */
  dispatch (event: string, headers: IncomingHttpHeaders, token?: string): { status: number, data: string } {
    try {
      if (this.status !== OneBotHttpServiceStatus.AVAILABLE) {
        return { status: 503, data: '服务不可用' }
      }

      const data: OneBotEvent = JSON.parse(event)
      if (this.self.id !== data.self_id) {
        return { status: 403, data: 'self_id 不匹配' }
      }

      if (!this.verifySignature(event, headers, token)) {
        return { status: 403, data: '签名不匹配' }
      }

      this._dispatch(data)
      return { status: 200, data: 'ok' }
    } catch (error) {
      return { status: 500, data: `内部错误: ${(error as Error)?.message || 'unknown'}` }
    }
  }

  /**
   * 对事件进行签名验证
   * @param event - event.toString()后的原始事件内容
   * @param headers - 头部
   * @param token - 验证令牌
   * @returns 是否验证通过
   */
  verifySignature (event: string, headers: IncomingHttpHeaders, token?: string): boolean {
    if (!token || typeof token !== 'string') {
      return true
    }

    const signature = headers['x-signature']
    if (!signature) return false

    token = `Bearer ${token.replace(/^Bearer/, '').trim()}`

    /** 计算签名: sha1 */
    const expected =
      `sha1=${createHmac('sha1', token)
        .update(event)
        .digest('hex')}`

    return signature === expected
  }

  /**
   * 发送API请求
   * @param action - API动作
   * @param params - API参数
   * @param timeout - 超时时间
   * @returns 返回API响应
   */
  async sendApi<T extends keyof OneBotApi> (
    action: T,
    params: OneBotApi[T]['params'],
    timeout: number = this._options.timeout
  ): Promise<OneBotApi[T]['response']> {
    const host = `${this._options.httpHost}/${action}`
    const request = JSON.stringify(params)
    this.emit('sendApi', { action, params, request, echo: '' })

    try {
      const data = await http.post<{ data: OneBotApi[T]['response'], status: 'ok' | 'fail' }>(host, request, { timeout, headers: this._options.headers })

      if (data.status === 200 && data.data.status === 'ok') {
        if (this.#serviceStatus !== OneBotHttpServiceStatus.AVAILABLE) {
          this.#setServiceStatus(OneBotHttpServiceStatus.AVAILABLE)
        }
        return data.data.data
      } else {
        throw this._formatApiError(action, request, data.data)
      }
    } catch (error) {
      // API请求失败，标记服务不可用
      this.#setServiceStatus(OneBotHttpServiceStatus.UNAVAILABLE)
      throw error
    }
  }

  /**
   * 关闭连接
   */
  close () {
    this.#setServiceStatus(OneBotHttpServiceStatus.UNKNOWN)
    this.#heartbeatInterval && clearInterval(this.#heartbeatInterval)
    this.emit('close', OneBotHttpClient.MANUAL_CLOSE, Buffer.from('主动关闭'))
    this.removeAllListeners()
  }

  /**
   * 获取HTTP主机地址
   */
  getHttpHost (): string {
    return this._options.httpHost
  }

  /**
   * 设置新的配置选项
   * @param options - 新的配置选项
   */
  setOptions (options: Partial<OneBotHttpClientOptions>): void {
    const opt = {
      ...this._options,
      ...options,
    }
    this._options = OneBotHttpClient.getOptions(opt)

    // 处理心跳相关配置变更
    if (options.heartbeat !== undefined) {
      if (this._options.heartbeat) {
        // 启用心跳
        if (!this.#heartbeatInterval) {
          this.#heartbeatInterval = setInterval(() => this.heartbeatInterval(), this._options.heartbeatInterval)
        }
      } else {
        // 禁用心跳
        if (this.#heartbeatInterval) {
          clearInterval(this.#heartbeatInterval)
          this.#heartbeatInterval = undefined
        }
      }
    } else if (options.heartbeatInterval && this.#heartbeatInterval) {
      // 仅更新心跳间隔
      clearInterval(this.#heartbeatInterval)
      this.#heartbeatInterval = setInterval(() => this.heartbeatInterval(), this._options.heartbeatInterval)
    }
  }

  /**
   * 达到心跳失败最大重试次数
   */
  static get HEARTBEAT_FAILED_MAX (): number {
    return 1
  }

  /**
   * 主动关闭
   */
  static get MANUAL_CLOSE (): number {
    return 2
  }

  /**
   * 获取格式化后的配置
   * @param options - 配置选项
   * @returns 内部配置
   */
  static getOptions (options: OneBotHttpClientOptions): OneBotHttpClientOptionsRequired {
    const mergedOptions: OneBotHttpClientOptionsRequired = {
      ...options,
      accessToken: typeof options.accessToken === 'string' ? options.accessToken : '',
      headers: typeof options.headers === 'object' ? options.headers : {},
      heartbeat: typeof options.heartbeat === 'boolean' ? options.heartbeat : true,
      heartbeatInterval: typeof options.heartbeatInterval === 'number' ? options.heartbeatInterval : 5000,
      timeout: typeof options.timeout === 'number' ? options.timeout : this.DEFAULT_TIMEOUT,
      reconnectAttempts: typeof options.reconnectAttempts === 'number' ? options.reconnectAttempts : 100,
    }

    if (options.accessToken) {
      if (options.accessToken.startsWith('Bearer')) {
        mergedOptions.headers['authorization'] = options.accessToken
        return mergedOptions
      }

      mergedOptions.headers['authorization'] = `Bearer ${options.accessToken}`
    }

    return mergedOptions
  }
}
