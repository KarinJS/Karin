import express from 'express'
import { createServer } from 'http'
import { WebSocketServer } from 'ws'
import { Cfg, logger, Bot } from '#Karin'

export default async function Server () {
  const app = express()
  const server = createServer(app)
  const wss = new WebSocketServer({ server })

  /** WebSocket连接 */
  wss.on('connection', async (socket, request) => {
    const url = request.url
    const headers = request.headers
    logger.debug('WebSocket连接', url, JSON.stringify(headers, null, 2))
    try {
      const Adapter = Bot.WebSocket[url]
      const adapter = new Adapter(socket, request)
      const id = headers?.['x-self-id']
      if (id) {
        await adapter.isInit
        /** 注册bot */
        Bot.emit('bot', adapter)
      }
    } catch (e) {
      logger.error(`[WebSocket连接][找不到适配器]：${url}`, e)
    }
  })

  /** 监听连接断开 */
  wss.on('close', (socket, request) => {
    logger.error('WebSocket断开', request.url)
  })

  /** 监听端口 */
  const http_port = Cfg.Config.http_port || 7000
  server.listen(http_port, () => {
    logger.mark(`HTTP服务器启动成功：http://0.0.0.0:${http_port}`)
    Bot.emit('init', '')
  })
}
