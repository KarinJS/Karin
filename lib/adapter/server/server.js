import express from 'express'
import { createServer } from 'http'
import { WebSocketServer } from 'ws'
import { Cfg, logger, Bot, common } from '#Karin'
import loader from '../../../lib/plugins/loader.js'

export default class BotWebSocket {
  constructor () {
    this.app = express()
    this.server = createServer(this.app)
    this.wss = new WebSocketServer({ server: this.server })
  }

  /** 监听WebSocket连接 */
  init (load = false) {
    this.wss.on('connection', async (socket, request) => {
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
    // eslint-disable-next-line no-unused-vars
    this.wss.on('close', (socket, request) => {
      logger.error('WebSocket断开', request.url)
    })

    /** 监听端口 */
    const http_port = Cfg.Config.http_port
    this.server.listen(http_port, () => {
      logger.mark(`[服务器][启动成功][HTTP][http://0.0.0.0:${http_port}]`)
      /** 加载插件 */
      if (load) loader.load()
    })

    Bot.once('restart_http', () => {
      logger.mark('[服务器][重启][HTTP] 正在重启HTTP服务器...')
      this.#restartServer()
    })
  }

  /** 重启当前HTTP服务器 */
  async #restartServer () {
    try {
      /** 断开所有 WebSocket 连接 */
      for (const ws of this.wss.clients) {
        await ws.terminate()
      }

      /** 关闭当前HTTP服务器 */
      this.server.close()
      /** 延迟1秒 */
      await common.sleep(1000)

      /** 创建一个新的服务器实例 */
      this.server = createServer(this.app)
      this.wss = new WebSocketServer({ server: this.server })
      this.init(false)
    } catch (err) {
      logger.error('[服务器][重启失败]', err)
    }
  }
}
