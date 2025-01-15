import WebSocket from 'ws'
import crypto from 'node:crypto'
import { WebSocketRender } from './ws'
import { render } from '@/utils/config/render'

/**
 * @description WebSocket客户端渲染
 * @class WebSocketServerRenderer
 */
export class WebSocketClientRenderer extends WebSocketRender { }

/**
 * @description 创建puppeteer WebSocket客户端
 */
export const createWebSocketRenderClient = () => {
  const cfg = render()
  if (!cfg.ws_server || !Array.isArray(cfg.ws_server) || cfg.ws_server.length === 0) {
    logger.trace('[render][WebSocket] 未配置任何正向WebSocket 已跳过创建')
    return
  }

  return Promise.allSettled(cfg.ws_server.map(async (item) => {
    const { url, token, enable } = item
    if (!enable) return
    const headers = { Authorization: crypto.createHash('md5').update(`Bearer ${token}`).digest('hex') }
    const socket = new WebSocket(url, { headers })

    socket.once('open', async () => {
      logger.info(`[render][WebSocket] 连接成功: ${url}`)
      await new WebSocketClientRenderer(socket).init()
    })
  }))
}
