import { WebSocket } from 'ws'
import { OneBotCore } from '..'
import type { OneBotWsEvent } from '../../event'

/**
 * OneBot WebSocket 客户端内部选项
 */
type OneBotWsClientOptions = OneBotCore['_options'] & {
  /** 连接URL */
  url: string
  /** 鉴权秘钥 */
  accessToken?: string
  /** 头部 */
  headers?: Record<string, string>
}

type OneBotWsClientOptionsRequired = Required<OneBotWsClientOptions>

/**
 * OneBot WebSocket 客户端类
 */
export class OneBotWsClient extends OneBotCore {
  _options: OneBotWsClientOptionsRequired
  constructor (options: OneBotWsClientOptions) {
    super(options)
    this._options = OneBotWsClient.getOptions(options)
  }

  /**
   * 创建 WebSocket 示例
   * @param url - WebSocket URL
   * @param options - 配置选项
   * @returns WebSocket客户端实例
   */
  static createWebSocket (options: OneBotWsClientOptions): WebSocket {
    const opt = this.getOptions(options)
    const socket = Object.keys(opt.headers || {}).length > 0
      ? new WebSocket(opt.url, { headers: opt.headers })
      : new WebSocket(opt.url)

    return socket
  }

  /**
   * 关闭连接
   */
  close () {
    this.socket.close()
    this.removeAllListeners()
  }

  /**
   * 获取当前URL
   */
  getUrl (): string {
    return this._options.url
  }

  /**
   * 获取格式化之后的参数
   * @param options - 连接配置
   * @returns 格式化之后的参数
   */
  static getOptions (options: OneBotWsClientOptions): OneBotWsClientOptionsRequired {
    const mergedOptions: OneBotWsClientOptionsRequired = {
      ...options,
      accessToken: options.accessToken ?? '',
      headers: options.headers ?? {},
      timeout: options.timeout ?? this.DEFAULT_TIMEOUT,
    }

    if (options.accessToken) {
      if (options.accessToken.includes('Bearer')) {
        mergedOptions.headers['authorization'] = options.accessToken
        return mergedOptions
      }

      mergedOptions.headers['authorization'] = `Bearer ${options.accessToken}`
    }

    return mergedOptions
  }

  /**
   * 初始化事件监听
   */
  async init (): Promise<void> {
    if (this.socket) {
      try {
        this.socket.readyState === WebSocket.OPEN && this.socket.close()
        // 需要移除全部事件监听器
        this.socket.removeAllListeners()
      } catch { }
    }

    this.socket = OneBotWsClient.createWebSocket(this._options)
    /** 保存最后一个错误 */
    let lastError: Error | null = null
    this.socket.removeAllListeners()

    this.socket.on('open', async () => {
      this.emit('open')
    })

    this.socket.on('close', (code: number, reason: Buffer) => {
      this.socket.removeAllListeners()
      // 发送简化的 close 事件: [code, reason, error?]
      if (lastError) {
        this.emit('close', code, reason, lastError)
      } else {
        this.emit('close', code, reason)
      }
    })

    this.socket.on('error', (error) => {
      lastError = error
      this.emit('error', error)
    })

    this.socket.on('message', (event) => {
      const { result } = this.parse<OneBotWsEvent>(event)

      if (this.isEcho(result)) {
        this.emit(`echo:${result.echo}`, result)
        return
      }

      this._dispatch(result)
    })
  }
}
