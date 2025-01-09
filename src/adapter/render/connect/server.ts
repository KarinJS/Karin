import { WebSocketRender } from './ws'
import { render } from '@/utils/config/render'
import { listeners } from '@/core/internal'
import type { WebSocket } from 'ws'
import type { IncomingMessage } from 'node:http'

/**
 * @description WebSocket服务端渲染
 * @class WebSocketServerRenderer
 */
export class WebSocketServerRenderer extends WebSocketRender {
  /** 请求实例 */
  public request: IncomingMessage
  constructor (socket: WebSocket, request: IncomingMessage) {
    super(socket)
    this.request = request

    const cfg = render()
    if (!cfg.ws_server.enable) {
      logger.warn('[WebSocket] 反向ws未启用')
      this.socket.close()
      return
    }

    const url = `ws://${request.headers.host}${request.url}`

    if (process.env.WS_SERVER_AUTH_KEY) {
      const token = request.headers['authorization']
      if (!token || !this.auth(process.env.WS_SERVER_AUTH_KEY, token)) {
        logger.error(`[WebSocket] 鉴权失败: token: ${token} url: ${url}`)
        this.socket.close()
        return
      }
    }

    logger.info(`[WebSocket] 连接成功: url: ${url}`)
  }
}

listeners.on('ws:connection:puppeteer', (socket: WebSocket, request: IncomingMessage) => {
  new WebSocketServerRenderer(socket, request).init()
})
