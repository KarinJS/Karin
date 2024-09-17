import { WebSocketServer } from 'ws'
import { createServer } from 'http'
import Process from '../process/process'
import express, { Express, Request, Response, NextFunction } from 'express'
import { Server as ServerType, ServerResponse, IncomingMessage } from 'http'
import { fileURLToPath } from 'url'
import { dirname } from 'path'
import path from 'path'
import { common, config } from 'karin/utils'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export const dashboardServer = new (class DashboardServer {
  reg: RegExp
  list: string[]
  app: Express
  dashboardServer: ServerType<typeof IncomingMessage, typeof ServerResponse>
  WebSocketServer: WebSocketServer
  RegExp: RegExp
  constructor () {
    this.reg = /(?:)/
    this.list = []
    this.app = express()
    this.dashboardServer = createServer(this.app)
    this.WebSocketServer = new WebSocketServer({ server: this.dashboardServer })
    this.RegExp = new RegExp(`(${process.cwd()}|${process.cwd().replace(/\\/g, '/')})`, 'g')
  }

  async init () {
    const { enable } = config.Server.dashboard
    if (!enable) return
    // 添加基本的身份验证中间件
    const auth = (req: Request, res: Response, next: NextFunction) => {
      const authHeader = req.headers.authorization
      if (!authHeader) {
        res.setHeader('WWW-Authenticate', 'Basic realm="Karin Dashboard"') // 添加自定义标题
        return res.status(401).send('需要身份验证')
      }

      const auth = Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':')
      const user = auth[0]
      const pass = auth[1]
      const { username, password } = config.Server.dashboard
      if (user === username && pass === password) {
        next()
      } else {
        res.setHeader('WWW-Authenticate', 'Basic realm="Karin Dashboard"') // 添加自定义标题
        res.status(401).send('身份验证失败')
      }
    }

    // 在静态文件服务和路由之前应用身份验证中间件
    this.app.use(auth)

    this.app.use(express.static(path.resolve(__dirname, '../../public/dist')))

    try {
      /** 防止多进程端口冲突 启动失败 */
      await Process.check()
      // level.open()

      this.app.get('/dashboard', async (req, res) => {
        res.sendFile(path.resolve(__dirname, '../../public/dist/index.html'))
      })

      const { host } = config.Server.http
      const { port } = config.Server.dashboard
      this.dashboardServer.listen(port, host, () => {
        const localIP = common.getLocalIP()
        logger.mark('[服务器]Dashboard服务器监听在: ' + logger.green(`http://${localIP}:${port}/dashboard`))
      })
    } catch (error) {
      logger.error(error)
    }
  }
})()
