import WebSocket from 'ws'
import crypto from 'node:crypto'
import { WebSocketRender } from './ws'
import { render } from '@/utils/config/render'

/**
 * @description WebSocket客户端渲染器
 * @class WebSocketClientRenderer
 */
export class WebSocketClientRenderer extends WebSocketRender {
  /** 重连次数 */
  private reconnectCount: number = 0
  /** 最大重连次数，设为-1表示无限重连 */
  private maxReconnectAttempts: number = -1
  /** 基连延迟(ms) */
  private baseDelay: number = 5000
  /** WebSocket连接URL */
  private url: string
  /** 连接headers */
  private headers: Record<string, string>

  constructor (socket: WebSocket, url: string, headers: Record<string, string>) {
    super(socket)
    this.url = url
    this.headers = headers
  }

  /**
   * @description 重连逻辑
   * @param isPrint 是否打印日志
   */
  reconnect = (isPrint = false) => {
    if (this.maxReconnectAttempts !== -1 && this.reconnectCount >= this.maxReconnectAttempts) {
      logger.error(`[render][WebSocket] 连接失败次数过多(${this.reconnectCount}次), 已停止重连: ${this.url}`)
      return
    }

    this.reconnectCount++
    const delay = this.baseDelay
    const delaySeconds = delay / 1000

    if (isPrint) {
      logger.warn(`[render][WebSocket][${this.reconnectCount}] 连接失败，${delaySeconds}秒后将重连: ${this.url}`)
    }

    setTimeout(() => {
      try {
        const socket = new WebSocket(this.url, { headers: this.headers })
        this.socket = socket

        socket.once('open', async () => {
          logger.info(`[render][WebSocket] 连接成功: ${this.url}`)
          await this.init()
          this.reconnectCount = 0
        })

        socket.once('error', (error) => {
          logger.debug(error)
          logger.error(`[render][WebSocket][${this.reconnectCount}] 连接错误: ${error.message}，${delaySeconds}秒后将重连: ${this.url}`)
          socket.removeAllListeners()
          socket.close()
          this.reconnect(false)
        })

        socket.once('close', () => {
          this.reconnect(true)
        })
      } catch (error) {
        logger.debug(error)
        this.reconnect()
      }
    }, delay)
  }
}

/**
 * @description 创建puppeteer WebSocket客户端
 */
export const createWebSocketRenderClient = () => {
  const cfg = render()
  if (!cfg.ws_client || !Array.isArray(cfg.ws_client) || cfg.ws_client.length === 0) {
    logger.trace('[render][WebSocket] 未配置任何正向WebSocket 已跳过创建')
    return
  }

  return Promise.allSettled(cfg.ws_client.map(async (item) => {
    const { url, token, enable } = item
    if (!enable) return

    const headers = { Authorization: crypto.createHash('md5').update(`Bearer ${token}`).digest('hex') }
    const socket = new WebSocket(url, { headers })
    const renderer = new WebSocketClientRenderer(socket, url, headers)

    socket.once('open', async () => {
      logger.info(`[render][WebSocket] 连接成功: ${url}`)
      await renderer.init()
    })

    socket.once('close', () => {
      // 传入 true 表示这是初始连接的断开
      renderer.reconnect(true)
    })

    socket.once('error', (error) => {
      logger.error(`[render][WebSocket] 连接错误: ${error.message}`)
      socket.close()
    })
  }))
}
