import { OneBotCore } from '..'

import type { WebSocket } from 'ws'
import type { OneBotWsEvent } from '../../event'
import type { IncomingMessage } from 'node:http'

/**
 * OneBot WebSocket 服务端内部选项
 */
type OneBotWsServerOptions = OneBotCore['_options'] & {
  /** 鉴权秘钥，客户端连接时需要提供相同的token */
  accessToken?: string
}

type OneBotWsServerOptionsRequired = Required<OneBotWsServerOptions>

/**
 * OneBot WebSocket 服务端类
 */
export class OneBotWsServer extends OneBotCore {
  _options: OneBotWsServerOptionsRequired
  /** 请求对象 */
  _request: IncomingMessage

  constructor (socket: WebSocket, request: IncomingMessage, options: OneBotWsServerOptions) {
    super(options)
    this.socket = socket
    this._options = OneBotWsServer.getOptions(options)
    this._request = request
  }

  async init () {
    /** 鉴权检查 */
    if (this._options?.accessToken) {
      const errStr = 'websocket authorization failed'
      const authHeader = this._request.headers['authorization']

      /** 检查Authorization头 */
      if (!authHeader) {
        this.socket.close(1403, errStr)
        throw new Error('WebSocket连接鉴权失败：缺少Authorization头')
      }

      /** 检查token格式 */
      const match = authHeader.match(/^Bearer\s+(.+)$/)
      if (!match) {
        this.socket.close(1403, errStr)
        throw new Error('WebSocket连接鉴权失败：Authorization头格式错误')
      }

      /** 检查token是否匹配 */
      const token = match[1]
      if (token !== this._options.accessToken) {
        this.socket.close(1403, errStr)
        throw new Error('WebSocket连接鉴权失败：无效的Token')
      }
    }

    this.socket.on('error', (error) => {
      this.emit('error', error)
    })

    this.socket.on('close', (code, reason) => {
      this.socket.removeAllListeners()
      this.emit('close', code, reason)
    })

    this.socket.on('message', (event) => {
      const { result } = this.parse<OneBotWsEvent>(event)

      if (this.isEcho(result)) {
        this.emit(`echo:${result.echo}`, result)
        return
      }

      this._dispatch(result)
    })

    await this.initBotInfo()
  }

  /**
   * 关闭连接
   */
  close () {
    this.socket.close()
    this.removeAllListeners()
  }

  /**
   * 更新socket
   * @param socket - 新的 WebSocket 实例
   */
  setSocket (socket: WebSocket) {
    try {
      this.socket.close()
      this.socket.removeAllListeners()
    } catch { }
    this.socket = socket
    this.init()
  }

  /**
   * 获取格式化之后的参数
   * @param options - 配置选项
   * @returns 格式化之后的参数
   */
  static getOptions (options: OneBotWsServerOptions): OneBotWsServerOptionsRequired {
    const timeout = typeof options.timeout === 'number'
      ? options.timeout
      : this.DEFAULT_TIMEOUT

    const accessToken = typeof options.accessToken === 'string'
      ? options.accessToken
      : String(options.accessToken)

    if (accessToken.length > 0) {
      return {
        timeout,
        accessToken: `Bearer ${accessToken.replace(/^Bearer /, '')}`,
      }
    }

    return {
      timeout,
      accessToken,
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
}
