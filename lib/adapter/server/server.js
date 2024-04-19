import express from 'express'
import { createServer } from 'http'
import { WebSocketServer } from 'ws'
import { Cfg, logger, Bot } from '#Karin'
import loader from '../../../lib/plugins/loader.js'

const app = express()
export const server = createServer(app)
export default async function Server () {
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
  const http_port = Cfg.Config.http_port
  server.listen(http_port, () => {
    logger.mark(`[服务器][启动成功][HTTP][http://0.0.0.0:${http_port}]`)
    /** 加载插件 */
    loader.load()
  })
}
