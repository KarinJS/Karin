import { OneBotWsBase } from '../base'
import { DEFAULT_WS_OPTIONS } from '../types'
import { OneBotCloseType, OneBotErrorType, OneBotEventKey } from '../events'
import { OneBotWsEvent } from '../../event'

import type { WebSocket } from 'ws'
import type { IncomingMessage } from 'node:http'
import type { OneBotWsServerOptions as OneBotWsServerOptionsType } from '../types'

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
  }

  async init () {
    this._setupEventListeners()
    await super.init()
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
   */
  setSocket (socket: WebSocket) {
    const status = super.setSocket(socket)
    this._setupEventListeners()
    return status
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

  /**
   * 设置事件监听器
   * @private
   */
  private _setupEventListeners (): void {
    this?._socket?.removeAllListeners()
    this.emit(OneBotEventKey.OPEN)
    this._socket.on('close', () => {
      /** 在更新socket时，会触发一个close事件，此时需要忽略 */
      if (this._setSocket) return
      /** 主动关闭 */
      if (this._manualClosed) return

      /** 异常关闭 销毁主实例的事件监听 */
      this.#close(OneBotCloseType.ERROR)
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
