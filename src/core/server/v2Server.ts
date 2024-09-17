import { WebSocketServer } from 'ws'
import { createServer } from 'http'
import Process from '../process/process'
import express, { Express } from 'express'
import { Server as ServerType, ServerResponse, IncomingMessage } from 'http'
import { common, config } from 'karin/utils'
import { apiV2 } from 'karin/utils/api/v2/v2'
import counter from 'karin/utils/counter/counter'
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
      this.app.use(cors({
        origin: '*',
        credentials: true,
      }))

      this.app.use('/api/v2', express.json())

      /** 获取服务器信息 **/
      this.app.get('/api/v2/info/static', async (req, res) => {
        const staticInfo = apiV2.getCachedStaticInfo()
        res.json({
          code: 200,
          message: 'ok',
          data: {
            staticInfo,
          },
        })
      })

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

      this.app.get('/api/v2/info/counter/:key', async (req, res) => {
        if (req.hostname !== 'localhost' && req.hostname !== '127.0.0.1') {
          res.status(403).json({
            code: 403,
            message: 'Forbidden',
          })
          return
        }
        const key = req.params.key
        let value = {}
        if (key === 'total') {
          value = await counter.getTotalCount()
        } else {
          value = {
            today: await counter.getTodayCount(key),
            total: await counter.getTotalCount(key),
          }
        }
        try {
          res.json({
            code: 200,
            message: 'ok',
            data: {
              key,
              value,
            },
          })
        } catch (error: unknown) {
          logger.error(error)
          res.status(500).json({
            code: 500,
            message: 'Error getting counter',
            error: error instanceof Error ? error.message : String(error),
          })
        }
      })

      /** Config处理 **/
      this.app.get('/api/v2/config/get/:type', async (req, res) => {
        if (req.hostname !== 'localhost' && req.hostname !== '127.0.0.1') {
          res.status(403).json({
            code: 403,
            message: 'Forbidden',
          })
          return
        }

        const type = req.params.type
        let _config = {}
        switch (type) {
          case 'app':
            _config = config.App
            break
          case 'config':
            _config = config.Config
            break
          case 'group':
            _config = config.group
            break
          case 'pm2':
            // Where is pm2 config?
            _config = {}
            break
          case 'redis':
            _config = config.redis
            break
          case 'server':
            _config = config.Server
            break
          case 'all':
            _config = config
            break
        }

        res.json({
          code: 200,
          message: 'ok',
          data: {
            config: _config,
          },
        })
      })

      this.app.post('/api/v2/config/save/:type', async (req, res) => {
        if (req.hostname !== 'localhost' && req.hostname !== '127.0.0.1') {
          res.status(403).json({
            code: 403,
            message: 'Forbidden',
          })
          return
        }

        let type = req.params.type
        if (type === 'app') {
          type = 'App'
        } else if (type === 'config') {
          type = 'config'
        } else if (type === 'group') {
          type = 'group'
        } else if (type === 'pm2') {
          type = 'pm2'
        } else if (type === 'redis') {
          type = 'redis'
        } else if (type === 'server') {
          type = 'server'
        } else {
          res.status(400).json({
            code: 400,
            message: 'Invalid config type',
          })
          return
        }

        const data = req.body
        try {
          await config.saveConfig(type as keyof typeof config, data)
          res.json({
            code: 200,
            message: 'ok',
            data: {
              // config: data,
            },
          })
        } catch (error) {
          logger.error(error)
          res.status(500).json({
            code: 500,
            message: 'Error saving config',
          })
        }
      })

      this.app.get('/api/v2/plugins/list', async (req, res) => {
        if (req.hostname !== 'localhost' && req.hostname !== '127.0.0.1') {
          res.status(403).json({
            code: 403,
            message: 'Forbidden',
          })
          return
        }
        const plugins = await apiV2.getPlugins()
        res.json({
          code: 200,
          message: 'ok',
          data: {
            plugins,
          },
        })
      })

      this.app.get('/api/v2/plugins/list/commands/:id', async (req, res) => {
        if (req.hostname !== 'localhost' && req.hostname !== '127.0.0.1') {
          res.status(403).json({
            code: 403,
            message: 'Forbidden',
          })
          return
        }
        const id = req.params.id
        const commands = await apiV2.getPluginCommandsList(id)
        res.json({
          code: 200,
          message: 'ok',
          data: {
            commands,
          },
        })
      })

      const { host } = config.Server.http
      const port = config.Server.api2.port
      this.api2Server.listen(port, host, () => {
        logger.mark('[服务器]Api服务器监听在: ' + logger.green(`http://${host}:${port}/api/v2`))
      })
    } catch (error) {
      logger.error(error)
    }
  }
})()
