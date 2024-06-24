import fs from 'fs'
import express, { Express } from 'express'
import { createServer } from 'http'
import { WebSocketServer } from 'ws'
import { render } from '../index'
import connect from '../renderer/wormhole'
import HttpRenderer from '../renderer/http'
import logger from '../utils/logger'
import common from '../utils/common'
import config from '../utils/config'
import listener from './listener'
import exec from '../utils/exec'
import { Server as ServerType, ServerResponse, IncomingMessage } from 'http'

export default new (class Server {
  reg: RegExp
  list: string[]
  app: Express
  server: ServerType<typeof IncomingMessage, typeof ServerResponse>
  WebSocketServer: WebSocketServer
  RegExp: RegExp
  constructor() {
    this.reg = /(?:)/
    this.list = []
    this.app = express()
    this.server = createServer(this.app)
    this.WebSocketServer = new WebSocketServer({ server: this.server })
    this.RegExp = new RegExp(`(${process.cwd()}|${process.cwd().replace(/\\/g, '/')})`, 'g')
  }

  /**
   * 监听WebSocket连接并初始化http服务器
   */
  init() {
    try {
      this.WebSocketServer.on('connection', (socket, request) => {
        const path = request.url
        const headers = request.headers
        logger.debug('[反向WS]', path, JSON.stringify(headers, null, 2))
        try {
          const Adapter = listener.getAdapter(path)
          if (!Adapter) {
            logger.error(`[反向WS] 适配器不存在：${path}`)
            return socket.close()
          }
          const KarinAdapter = new Adapter()
          if (typeof KarinAdapter?.server === 'function') {
            KarinAdapter.server(socket, request)
          }
        } catch (error: any) {
          logger.error(`[反向WS] 注册适配器发生错误：${path}`, error.stack || error.message || error)
          socket.close()
        }
      })

      /** GET接口 - 获取当前启动信息 */
      this.app.get('/api/info', (req, res) => {
        /** 只允许本机ip访问 */
        if (req.hostname === 'localhost' || req.hostname === '127.0.0.1') {
          const data = {
            start: process.env.pm_id ? 'pm2' : 'node',
            start_time: process.uptime().toFixed(2),
            memory: (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2),
            time: Date.now(),
          }

          res.json(data)
        }
      })

      /** GET接口 - 退出当前进程 */
      this.app.get('/api/exit', async req => {
        /** 只允许本机ip访问 */
        if (req.hostname === 'localhost' || req.hostname === '127.0.0.1') {
          logger.mark('[服务器][HTTP] 收到退出请求，即将退出')
          /** 关闭服务器 */
          listener.emit('exit.grpc')
          this.server.close()
          /** 如果是pm2 获取当前pm2ID 使用 */
          if (process.env.pm_id) await exec(`pm2 delete ${process.env.pm_id}`)
          /** 正常启动的进程 */
          process.exit()
        }
      })

      /** 监听端口 */
      const { host, port } = config.Server.http
      this.server.listen(port, host, () => {
        logger.mark('[服务器][启动成功][HTTP]: ' + logger.green(`http://${host}:${port}`))
      })

      listener.once('restart.http', () => {
        logger.mark('[服务器][重启][HTTP] 正在重启HTTP服务器...')
        this.#restartServer()
      })

      const { enable, WormholeClient } = config.Server.HttpRender
      if (enable) {
        this.static()
        if (WormholeClient) {
          connect()
          return this
        }
        const { host, post, token } = config.Server.HttpRender
        /** 注册渲染器 */
        const rd = new HttpRenderer(host, post, token)
        render.app({ id: 'puppeteer', type: 'image', render: rd.render.bind(rd) })
      }

      return this
    } catch (error) {
      logger.error('初始化HTTP服务器失败: ', error)
      return false
    }
  }

  /**
   * HTTP渲染器
   */
  static() {
    this.staticPath()

    /** GET接口 - 渲染 */
    this.app.get('/api/renderHtml', (req, res) => {
      try {
        let { html } = req.query
        if (!html) return res.status(404).send(JSON.stringify({ code: 404, msg: 'Not Found' }))
        html = decodeURIComponent(html as string)
          .replace(/\\/g, '/')
          .replace(/^\.\//, '')
        /** 判断是否为html文件且路径存在 */
        if (!html.endsWith('.html') || !fs.existsSync(html)) {
          const not_found = config.Server.HttpRender.not_found
          if (not_found.startsWith('http')) {
            return res.redirect(not_found)
          } else {
            return res.status(404).send(JSON.stringify({ code: 404, msg: not_found || '?' }))
          }
        }

        let content = fs.readFileSync(html, 'utf-8')
        /** 处理所有绝对路径、相对路径 */
        content = content.replace(this.RegExp, '')
        res.send(content)
      } catch (e) {
        logger.error('[服务器][GET接口 - 渲染]', e)
        res.status(500).send(JSON.stringify({ code: 500, msg: 'Internal Server Error' }))
      }
    })

    /** 拦截静态资源 防止恶意访问 */
    this.app.use((req, res, next) => {
      logger.debug(`[静态资源][${req.headers.host}] ${req.url}`)

      /** 解码 */
      req.url = decodeURIComponent(req.url)
      req.url = req.url
        .replace(/\\/g, '/')
        .replace(/^\.\//, '')
        .replace(/^(\.\.\/)+/, '')

      /** 拦截非资源文件 */
      this.reg.lastIndex = 0
      if (!this.reg.test(req.url)) {
        logger.mark(`[${req.ip}][拦截非资源文件]`, req.url)
        res.status(404).send(JSON.stringify({ code: 404, msg: 'Not Found' }))
        return
      }
      next()
    })

    /** 设置静态文件目录 */
    this.app.use(express.static(process.cwd()))
  }

  /**
   * 构建静态资源路径
   */
  staticPath() {
    this.list = []
    /** 读取./resources文件夹 */
    const resDir = './resources'
    const resdirs = fs.readdirSync(resDir)
    for (const dir of resdirs) {
      const file = `${resDir}/${dir}`
      if (common.isDir(file)) this.list.push(file.replace('.', ''))
    }

    /** 读取./temp/html下所有文件夹 */
    const htmlDir = './temp/html'
    const dirs = fs.readdirSync(htmlDir)
    for (const dir of dirs) {
      const file = `${htmlDir}/${dir}`
      if (common.isDir(file)) this.list.push(file.replace('.', ''))
    }

    /** 读取./plugins/html下所有文件夹 */
    const pluginsDir = './plugins'
    const plugins = fs.readdirSync(pluginsDir)
    for (const dir of plugins) {
      const file = `${pluginsDir}/${dir}`
      const resFile = `${file}/resources`
      /** 包含resources文件夹 */
      if (common.isDir(file) && common.isDir(resFile)) this.list.push(resFile.replace('.', ''))
      const componentsFile = `${file}/components`
      /** 包含components文件夹 兼容mys */
      if (common.isDir(file) && common.isDir(componentsFile)) this.list.push(componentsFile.replace('.', ''))
    }
    this.reg = new RegExp(`(${this.list.join('|')})`, 'g')
  }

  /** 重启当前HTTP服务器 */
  async #restartServer() {
    try {
      /** 断开所有 WebSocket 连接 */
      for (const ws of this.WebSocketServer.clients) ws.terminate()

      /** 关闭当前HTTP服务器 */
      this.server.close()
      /** 延迟1秒 */
      await common.sleep(1000)

      /** 创建一个新的服务器实例 */
      this.server = createServer(this.app)
      this.WebSocketServer = new WebSocketServer({ server: this.server })
      this.init()
      this.static()
    } catch (err) {
      logger.error('[服务器][重启失败]', err)
    }
  }
})()
