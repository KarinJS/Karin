import fs from 'fs'
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
    this._path = process.cwd()
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
      this.static()
    } catch (err) {
      logger.error('[服务器][重启失败]', err)
    }
  }

  /** 静态 */
  static () {
    /** 拦截静态资源 防止恶意访问 */
    this.app.use((req, res, next) => {
      logger.debug(`[静态资源][${req.headers.host}] ${req.url}`)
      const list = ['.css', '.html', '.ttf', '.jpg', '.jpeg', '.png', '.gif', '.bmp', '.ico', '.woff', '.woff2']

      if (!list.some(ext => req.url.endsWith(ext))) {
        logger.mark(`[${req.ip}][拦截非资源文件]`, req.url)
        res.status(404).send(JSON.stringify({ code: 404, msg: 'Not Found' }))
        return
      }
      next()
    })

    /** 设置静态文件目录 */
    this.app.use(express.static(process.cwd()))

    /** GET接口 - 渲染 */
    this.app.get('/api/render', (req, res) => {
      try {
        let { html } = req.query
        /** 获取文件路径 对路径进行处理，去掉../、./ */
        html = `./${html.replace(/\\/g, '/').replace(/(\.\/|\.\.\/)/g, '')}`

        /** 判断是否为html文件且路径存在 */
        if (!html.endsWith('.html') || !fs.existsSync(html)) {
          const not_found = Cfg.Config.http_render.not_found
          if (not_found.startsWith('http')) {
            return res.redirect(not_found)
          } else {
            return res.status(404).send(JSON.stringify({ code: 404, msg: not_found || '?' }))
          }
        }

        let content = fs.readFileSync(html, 'utf-8')
        /** 处理所有绝对路径、相对路径 */
        content = content.replace(new RegExp(`(${this._path}|${this._path.replace(/\\/g, '/')})`, 'g'), '')
        res.send(content)
      } catch (e) {
        logger.error('[服务器][GET接口 - 渲染]', e)
        res.status(500).send(JSON.stringify({ code: 500, msg: 'Internal Server Error' }))
      }
    })
  }
}
