import { OneBotCore } from '../core/core'
import { OneBotCloseType, OneBotErrorType, OneBotEventKey } from './events'

import type { WebSocket } from 'ws'
import type { OneBotApi } from '../api'
import type { OneBotWsBaseOptions } from './types'
/**
 * OneBot WebSocket 基类
 * 提供客户端和服务端共享的基本功能
 */
export abstract class OneBotWsBase extends OneBotCore {
  /** 请求ID */
  echo: bigint
  /** 是否setSocket */
  _setSocket: boolean = false
  /** WebSocket实例 */
  protected _socket: WebSocket

  constructor (socket: WebSocket, options?: OneBotWsBaseOptions) {
    super(options)
    this.echo = BigInt(0)
    this._socket = socket
  }

  /**
   * 获取关闭类型
   */
  static get CloseType () {
    return {
      /** 常规关闭 */
      ERROR: OneBotCloseType.ERROR,
      /** 主动关闭 */
      MANUAL_CLOSE: OneBotCloseType.MANUAL_CLOSE,

      /** 客户端独有:重连上限 */
      MAX_RETRIES: OneBotCloseType.MAX_RETRIES,
      /** 客户端独有: 服务端关闭 */
      SERVER_CLOSE: OneBotCloseType.SERVER_CLOSE,
    }
  }

  /**
   * 获取错误类型
   */
  static get ErrorType () {
    return {
      /** 常规错误 */
      ERROR: OneBotErrorType.ERROR,

      /** 客户端独有: 初始化失败，正在尝试重连 */
      CONNECTION_FAILED: OneBotErrorType.CONNECTION_FAILED,
      /** 客户端独有: 初始化失败，重连关闭 */
      RECONNECTING: OneBotErrorType.RECONNECTING,
      /** 客户端独有: 初始化失败，重连达到上限 */
      RECONNECT_FAILED: OneBotErrorType.RECONNECT_FAILED,

      /** 服务端独有: 鉴权失败 */
      AUTH_FAILED: OneBotErrorType.AUTH_FAILED,
    }
  }

  /**
   * 关闭连接
   */
  close (): void {
    this._manualClosed = true
    this._socket.close()
    this.emit(OneBotEventKey.CLOSE, OneBotCloseType.MANUAL_CLOSE)
    this.removeAllListeners()
  }

  /**
   * 更新socket
   * @param socket - 新的socket
   * @return 返回一个状态函数 请在处理设置socket相关后调用 否则close事件无法触发
   */
  setSocket (socket: WebSocket): () => void {
    this._setSocket = true
    this._socket.close()
    this._socket.removeAllListeners()
    this._socket = socket
    return () => {
      this._setSocket = false
    }
  }

  /**
   * 初始化WebSocket连接
   */
  async init (): Promise<void> {
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

      this.emit(OneBotEventKey.SEND_API, { echo, action, params, request })
      this._socket.send(request)
      this.once(`echo:${echo}`, data => {
        /** 停止监听器 */
        clearTimeout(timeoutId)

        if (data.status === 'ok') {
          resolve(data.data as OneBotApi[T]['response'])
        } else {
          reject(this._formatApiError(action, request, data))
        }

        this.emit(OneBotEventKey.RESPONSE, { echo, action, params, request, data })
      })
    })
  }
}
