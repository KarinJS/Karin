import { WebSocketServer } from 'ws'
import { createServer } from 'http'
import Process from '../process/process'
import express, { Express } from 'express'
import { Server as ServerType, ServerResponse, IncomingMessage } from 'http'
import { common, config } from 'karin/utils'
import { apiV2 } from 'karin/utils/api/v2/v2'
import cors from 'cors'

export const api2Server = new (class Api2Server {
  reg: RegExp
  list: string[]
  app: Express
  api2Server: ServerType<typeof IncomingMessage, typeof ServerResponse>
  WebSocketServer: WebSocketServer
  RegExp: RegExp
  constructor () {
    this.reg = /(?:)/
    this.list = []
    this.app = express()
    this.api2Server = createServer(this.app)
    this.WebSocketServer = new WebSocketServer({ server: this.api2Server })
    this.RegExp = new RegExp(`(${process.cwd()}|${process.cwd().replace(/\\/g, '/')})`, 'g')
  }

  async init () {
    try {
      await Process.check()
      // level.open()
      // 基础路由
      this.app.use('/api/v2', express.json())

      // 允许所有源的CORS
      this.app.use(cors({
        origin: '*',
        credentials: true,
      }))

      this.app.get('/api/v2/info/status', async (req, res) => {
        res.json({
          code: 200,
          message: 'ok',
          data: {
            status: 'running',
            karin: apiV2.getKarinInfo(),
            database: apiV2.getRedisInfo(),
            system: apiV2.getSystemInfo(),
          },
        })
      })

      this.app.get('/api/v2/info/cpu', async (req, res) => {
        const cpuInfo = await apiV2.getCPUInfo()
        res.json({
          code: 200,
          message: 'ok',
          data: {
            cpu_info: cpuInfo,
          },
        })
      })

      const { host } = config.Server.http
      this.api2Server.listen(9000, host, () => {
        const localIP = common.getLocalIP()
        logger.mark('[服务器]Api服务器监听在: ' + logger.green(`http://${localIP}:9000/api/v2`))
      })
    } catch (error) {
      logger.error(error)
    }
  }
})()
