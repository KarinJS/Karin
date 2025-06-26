import { OneBotWsBase } from '../base'
import { DEFAULT_WS_OPTIONS } from '../types'
import { oneBotWsClientManager } from './manager'
import { OneBotEventKey, OneBotErrorType, OneBotCloseType } from '../events'

import type { WebSocket } from 'ws'
import type { OneBotWsClientOptions as OneBotWsClientOptionsType } from '../types'
import { OneBotWsEvent } from '@/event'

/**
 * OneBot WebSocket 客户端内部选项
 */
type OneBotWsClientOptions = Required<OneBotWsBase['_options'] & OneBotWsClientOptionsType>

/**
 * OneBot WebSocket 客户端类
 */
export class OneBotWsClient extends OneBotWsBase {
  _options: OneBotWsClientOptions

  /** 重连尝试次数 */
  _reconnectAttempts: number = 0
  /** 连接URL */
  _url: string

  constructor (socket: WebSocket, url: string, options: OneBotWsClientOptionsType) {
    super(socket, options)
    this._url = url
    this._options = this.getOptions(options)
    this._setupEventListeners()
  }

  /**
   * 更新socket
   */
  setSocket (socket: WebSocket): void {
    this._setSocket = true
    try {
      this._socket.close()
      this._socket = socket
      this._setupEventListeners()
    } finally {
      this._setSocket = false
    }
  }

  close () {
    super.close()
    oneBotWsClientManager.deleteClient(this._url)
  }

  /**
   * 获取当前URL
   */
  getUrl (): string {
    return this._url
  }

  /**
   * 获取重连尝试次数
   */
  getReconnectAttempts (): number {
    return this._reconnectAttempts
  }

  /**
   * 重置重连尝试次数
   */
  resetReconnectAttempts (): void {
    this._reconnectAttempts = 0
  }

  /**
   * 是否已手动关闭
   */
  isManualClosed (): boolean {
    return this._manualClosed
  }

  /**
   * 设置自动重连选项
   */
  setAutoReconnect (enable: boolean): void {
    this._options.autoReconnect = enable
  }

  /**
   * 设置重连间隔
   */
  setReconnectInterval (interval: number): void {
    this._options.reconnectInterval = interval
  }

  /**
   * 设置最大重连次数
   */
  setMaxReconnectAttempts (max: number): void {
    this._options.maxReconnectAttempts = max
  }

  /**
   * 获取格式化之后的参数
   * @param options - 连接配置
   * @returns 格式化之后的参数
   */
  getOptions (options: Partial<OneBotWsClientOptions>): OneBotWsClientOptions {
    const mergedOptions: OneBotWsClientOptions = {
      ...DEFAULT_WS_OPTIONS,
      ...options,
      accessToken: options.accessToken ?? '',
      headers: options.headers ?? {},
      autoReconnect: options.autoReconnect ?? DEFAULT_WS_OPTIONS.autoReconnect,
      reconnectInterval: options.reconnectInterval ?? DEFAULT_WS_OPTIONS.reconnectInterval,
      maxReconnectAttempts: options.maxReconnectAttempts ?? DEFAULT_WS_OPTIONS.maxReconnectAttempts,
      timeout: options.timeout ?? DEFAULT_WS_OPTIONS.timeout,
    }

    if (options.accessToken) {
      mergedOptions.headers!['authorization'] = `Bearer ${options.accessToken}`
    }

    return mergedOptions
  }

  /**
   * 重连
   * @param url - 连接URL
   * @param options - 连接配置
   * @returns 是否重连成功
   */
  async reconnect (url: string, options: OneBotWsClientOptionsType): Promise<boolean> {
    this._options = this.getOptions(options)
    const _socket = oneBotWsClientManager.createWebSocketClient(url, options)
    this.setSocket(_socket)
    return true
  }

  /**
   * 设置事件监听器
   * @private
   */
  private _setupEventListeners (): void {
    /** 是否连接成功 */
    let isConnected = false
    this._socket.removeAllListeners()

    this._socket.on('open', async () => {
      isConnected = true
      this._reconnectAttempts = 0
      this.emit(OneBotEventKey.OPEN)
    })

    this._socket.on('close', () => {
      if (this._setSocket) return
      if (this._manualClosed) {
        this.emit(OneBotEventKey.CLOSE, OneBotCloseType.MANUAL_CLOSE)
        return
      }

      if (this._options.autoReconnect && this._options.maxReconnectAttempts < 0) {
        this.emit(OneBotEventKey.ERROR, {
          error: new Error(`[OneBot] 重连次数达到上限: ${this._url}`),
          type: OneBotErrorType.RECONNECT_FAILED,
          totalReconnectAttempt: this._reconnectAttempts,
          maxReconnectAttempt: this._options.maxReconnectAttempts,
        })
        this.emit(OneBotEventKey.CLOSE, OneBotCloseType.MAX_RETRIES)
        return
      }

      if (this._reconnectAttempts >= this._options.maxReconnectAttempts) {
        this.emit(OneBotEventKey.CLOSE, OneBotCloseType.MAX_RETRIES)
        return
      }

      // this._close()
      this._reconnectAttempts++

      setTimeout(() => {
        this.reconnect(this._url, {
          ...this._options,
          maxReconnectAttempts: this._options.maxReconnectAttempts - 1,
        })
      }, this._options.reconnectInterval)
    })

    this._socket.on('error', (error) => {
      if (isConnected) {
        this.emit(OneBotEventKey.ERROR, { error, type: OneBotErrorType.ERROR })
      } else {
        this.emit(OneBotEventKey.ERROR, {
          error,
          type: OneBotErrorType.CONNECTION_FAILED,
          reconnectAttempt: this._reconnectAttempts,
          reconnectInterval: this._options.reconnectInterval,
          maxReconnectAttempt: this._options.maxReconnectAttempts,
        })
      }
    })

    this._socket.on('message', (event) => {
      const raw = event.toString() || '{}'
      const data = JSON.parse(raw) as OneBotWsEvent

      if (this.isEcho(data)) {
        this.emit(`echo:${data.echo}`, data)
        return
      }

      this._dispatch(data)
    })
  }
}
