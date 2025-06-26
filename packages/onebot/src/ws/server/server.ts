import { OneBotWsBase } from '../base'
import { DEFAULT_WS_OPTIONS } from '../types'
import { OneBotCloseType, OneBotErrorType, OneBotEventKey } from '../events'
import { oneBotWsServerManager } from './manager'

import type { WebSocket } from 'ws'
import type { IncomingMessage } from 'node:http'
import type { OneBotWsServerOptions as OneBotWsServerOptionsType } from '../types'
import { OneBotWsEvent } from '@/event'

/**
 * OneBot WebSocket 服务端内部选项
 */
type OneBotWsServerOptions = Required<OneBotWsServerOptionsType>

/**
 * OneBot WebSocket 服务端类
 */
export class OneBotWsServer extends OneBotWsBase {
  /** 请求对象 */
  private _request: IncomingMessage

  constructor (socket: WebSocket, request: IncomingMessage, options: OneBotWsServerOptionsType) {
    super(socket, options)
    this._options = this.getOptions(options)
    this._request = request

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

  /**
   * 获取格式化之后的参数
   * @param options - 配置选项
   * @returns 格式化之后的参数
   */
  getOptions (options: OneBotWsServerOptionsType): OneBotWsServerOptions {
    return {
      timeout: options.timeout ?? DEFAULT_WS_OPTIONS.timeout,
      accessToken: options.accessToken ?? '',
    }
  }

  /**
   * 获取客户端信息
   */
  getClientInfo () {
    return {
      ip: this._request.socket.remoteAddress,
      headers: this._request.headers,
    }
  }

  /**
   * 获取请求对象
   */
  getRequest (): IncomingMessage {
    return this._request
  }

  close () {
    super.close()
    oneBotWsServerManager.deleteServer(this)
  }

  /**
   * 设置事件监听器
   * @private
   */
  private _setupEventListeners (): void {
    this?._socket?.removeAllListeners()
    this._socket.on('close', () => {
      if (this._setSocket) return

      if (this._manualClosed) {
        this.emit(OneBotEventKey.CLOSE, OneBotCloseType.MANUAL_CLOSE)
        return
      }

      this._close()
    })

    this._socket.on('error', (error) => {
      this.emit(OneBotEventKey.ERROR, { error, type: OneBotErrorType.ERROR })
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

    this._socket.on('error', (error) => {
      this.emit(OneBotEventKey.ERROR, {
        type: OneBotErrorType.ERROR,
        error,
      })
    })
  }
}
