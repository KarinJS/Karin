import { WebSocketServer } from 'ws'
import { createServer } from 'http'
import Process from '../process/process'
import express, { Express } from 'express'
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
    this.app.use(express.static(path.resolve(__dirname, '../../public/dist')))
    try {
      /** 防止多进程端口冲突 启动失败 */
      await Process.check()
      // level.open()

      this.app.get('/dashboard', async (req, res) => {
        res.sendFile(path.resolve(__dirname, '../../public/dist/index.html'))
      })

      const { host } = config.Server.http
      this.dashboardServer.listen(8000, host, () => {
        const localIP = common.getLocalIP()
        logger.mark('[服务器]Dashboard服务器监听在: ' + logger.green(`http://${localIP}:8000/dashboard`))
      })
    } catch (error) {
      logger.error(error)
    }
  }
})()
