import { OneBotWsBase } from '../base'
import { OneBotWsEvent } from '../../event'
import { DEFAULT_WS_OPTIONS } from '../types'
import { oneBotWsClientManager } from './manager'
import { OneBotEventKey, OneBotErrorType, OneBotCloseType } from '../events'

import type { WebSocket } from 'ws'
import type { OneBotWsClientOptions as OneBotWsClientOptionsType } from '../types'

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
   * 关闭之前的一些操作
   * @param type - 关闭事件类型
   */
  #close (type: OneBotCloseType) {
    this.emit(OneBotEventKey.CLOSE, type)
    this.removeAllListeners()
  }

  /**
   * 更新socket
   * @param socket - 新的socket
   * @returns 返回一个状态函数 请在处理设置socket相关后调用 否则close事件无法触发
   */
  setSocket (socket: WebSocket) {
    const status = super.setSocket(socket)
    this._setupEventListeners()
    return status
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
   * @param options - 连接配置 默认使用当前配置
   * @returns 是否重连成功
   */
  async reconnect (url: string, options: OneBotWsClientOptionsType = this._options): Promise<boolean> {
    this._options = this.getOptions(options)
    const _socket = oneBotWsClientManager.createWebSocket(url, options)
    this.setSocket(_socket)()
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
      /** 在更新socket时，会触发一个close事件，此时需要忽略 */
      if (this._setSocket) return
      /** 主动关闭 */
      if (this._manualClosed) {
        this.#close(OneBotCloseType.MANUAL_CLOSE)
        return
      }

      /** 自动重连 */
      if (this._options.autoReconnect) {
        /** 连接成功后断开 */
        if (isConnected) {
          this.#close(OneBotCloseType.CONNECTION_FAILED)
        }

        /** 重连次数达到上限 */
        if (this._options.maxReconnectAttempts < 0) {
          this.emit(OneBotEventKey.ERROR, {
            error: new Error(`[OneBot] 重连次数达到上限: ${this._url}`),
            type: OneBotErrorType.RECONNECT_FAILED,
            totalReconnectAttempt: this._reconnectAttempts,
            maxReconnectAttempt: this._options.maxReconnectAttempts,
          })
          this.#close(OneBotCloseType.MAX_RETRIES)
          return
        }

        this._reconnectAttempts++

        setTimeout(() => {
          this.reconnect(this._url, {
            ...this._options,
            maxReconnectAttempts: this._options.maxReconnectAttempts - 1,
          })
        }, this._options.reconnectInterval)
        return
      }

      /** 异常关闭 销毁主实例的事件监听 */
      this.emit(OneBotEventKey.CLOSE, OneBotCloseType.ERROR)
      this.removeAllListeners()
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
