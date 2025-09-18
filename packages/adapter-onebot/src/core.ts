import express from 'express'
import { app } from '@karinjs/server'
import { emitter } from '@karinjs/events'
import { AdapterOneBot } from './core/adapter'
import { WS_CONNECTION_ONEBOT } from '@karinjs/envs'
import { config, ConfigAdapter } from '@karinjs/core/config'
import {
  OneBotWsClient,
  OneBotWsServer,
  OneBotHttpClient,
} from '@karinjs/onebot'

import type { WebSocket } from 'ws'
import type { IncomingMessage } from 'node:http'

/**
 * onebot核心类 用于初始化OneBot适配器
 */
export class OneBotCore {
  logger: ReturnType<typeof logger.prefix>
  /**
   * 单例实例
   */
  private static _instance: OneBotCore | null = null
  /**
   * 实例缓存
   */
  #cache: {
    ws: {
      /** OneBot WebSocket Server */
      server: Map<string, { core: AdapterOneBot<OneBotWsServer>, timeout: NodeJS.Timeout | null }>,
      /** OneBot WebSocket Client */
      client: Map<string, OneBotWsClient>,
    },
    /** OneBot HTTP */
    http: Map<string, AdapterOneBot<OneBotHttpClient>>,
  }

  constructor () {
    this.#cache = {
      ws: {
        server: new Map(),
        client: new Map(),
      },
      http: new Map(),
    }

    this.logger = logger.prefix('[OneBot]')
  }

  /**
   * 获取单例实例
   * @returns OneBotCore 实例
   */
  static getInstance (): OneBotCore {
    if (!OneBotCore._instance) {
      OneBotCore._instance = new OneBotCore()
    }
    return OneBotCore._instance
  }

  /**
   * 销毁单例实例
   */
  static destroyInstance (): void {
    OneBotCore._instance = null
  }

  /**
   * @public
   * 初始化 OneBot 适配器
   */
  async init () {
    emitter.on(
      WS_CONNECTION_ONEBOT,
      (socket, request, cb) => {
        cb()
        this.createWsServer(socket, request)
      }
    )

    const cfg = config.adapter()

    await Promise.allSettled([
      /** 初始化OneBot WebSocket 客户端 */
      async () => {
        if (!cfg.onebot.ws_client) return
        if (!Array.isArray(cfg.onebot.ws_client)) return
        await Promise.allSettled(
          cfg.onebot.ws_client.map(async (item) => {
            if (!item?.enable || !item?.url) return
            await this.createClient(item)
              .catch((err) => this.logger.error(`连接失败: ${item.url} 原因: ${err.message}`))
          })
        )
      },
      /** 初始化OneBot HTTP 服务 */
      async () => {
        if (!cfg.onebot.http_server) return
        if (!Array.isArray(cfg.onebot.http_server)) return
        await Promise.allSettled(
          cfg.onebot.http_server.map(async (item) => {
            if (!item?.enable || !item?.url) return
            await this.createHttp(item)
              .catch((err) => this.logger.error(`连接失败: ${item.url} 原因: ${err.message}`))
          })
        )
      },
    ])

    this.#createOneBotEventDispatchRouter()
  }

  /**
   * @description 创建OneBot事件分发路由 用于接收OneBot HTTP POST事件
   */
  #createOneBotEventDispatchRouter () {
    const router = express.Router()
    router.post('/', (req, res) => {
      res.status(204).json({})

      const chunks: Buffer[] = []

      req.on('data', (chunk: Buffer) => {
        chunks.push(chunk)
      })

      req.on('end', () => {
        const rawBody = Buffer.concat(chunks).toString('utf8')
        const data = req.body
        const selfId = req.headers['x-self-id']

        if (!selfId || typeof selfId !== 'string') {
          this.logger.warn(`[OneBot] 未知请求: ${JSON.stringify(data)}`)
          return
        }

        const adapter = this.#cache.http.get(selfId)
        if (!adapter) {
          this.logger.warn(`[OneBot] 未知请求: ${JSON.stringify(data)}`)
          return
        }

        adapter.core.verifySignature(rawBody, req.headers)
      })
    })

    app.use('/onebot', router)
  }

  /**
   * 创建OneBot WebSocket服务器实例
   * @param socket - WebSocket实例
   * @param request - HTTP请求对象
   */
  async createWsServer (
    socket: WebSocket,
    request: IncomingMessage
  ) {
    if (!config.adapter().onebot.ws_server.enable) {
      this.logger.warn('未启用 WebSocketServer 服务')
      return
    }

    /** 找一下是否有离线的 */
    const id = request.headers['x-self-id']
    if (!id || typeof id !== 'string') {
      this.logger.error(`不符合标准的 WebSocket Server:\nheaders: ${JSON.stringify(request.headers, null, 2)}`)
      socket.close()
      return
    }
    const value = this.#cache.ws.server.get(id)
    if (value) {
      const { core: adapter, timeout } = value
      /** 清理定时器 */
      timeout && clearTimeout(timeout)

      const url = `ws://${request.headers.host}${request.url}`
      adapter.adapter.address = url
      adapter.setStatus('offline')
      adapter.core.socket.OPEN === adapter.core.socket.readyState && adapter.core.close()
      /** 替换实例 */
      adapter.core.socket = socket
      adapter.core._request = request

      await adapter.core.init() // onebot内部初始化
      await adapter.init() // adapter初始化
      adapter.setStatus('online')
      this.logger.info(`重新连接: ${id}`)
      return
    }

    const onebot = new OneBotWsServer(socket, request, {
      accessToken: process.env.WS_SERVER_AUTH_KEY,
      timeout: config.adapter().onebot.ws_server.timeout,
    })

    onebot.on('close', async (code, reason) => {
      this.logger.error(`连接断开: ${url}, code: ${code}, reason: ${reason.toString() || 'unknown'}`)
      // 如果10分钟没有收到新的连接 则卸载Bot
      const timeout = setTimeout(() => {
        core.unregisterBot()
        this.#cache.ws.server.delete(id)
      }, 10 * 60 * 1000)
      this.#cache.ws.server.get(id)!.timeout = timeout
    })

    onebot.on('error', async (error) => {
      this.logger.error(error)
    })

    await onebot.init()
    const core = new AdapterOneBot(onebot)
    this.#cache.ws.server.set(id, { core, timeout: null })
    const url = `ws://${request.headers.host}${request.url}`
    this.logger.debug(`[OneBot] 服务端连接成功: ${url}`)
    core.account.selfId = id
    core.adapter.address = url
    core.adapter.communication = 'webSocketServer'

    await core.init()
    core.registerBot()
  }

  /**
   * 创建OneBot WebSocket客户端实例
   * @param opt - OneBot WebSocket客户端配置
   */
  async createClient (opt: ConfigAdapter['onebot']['ws_client'][number]) {
    /** 重连次数 */
    let attempts = 0

    const onebot = new OneBotWsClient({
      url: opt.url,
      timeout: config.adapter().onebot.ws_server.timeout,
      accessToken: opt.token,
    })

    this.#cache.ws.client.set(opt.url, onebot)
    await new Promise<void>((resolve, reject) => {
      /** 是否拦截错误事件 */
      let errorIntercepted = true

      onebot.on('open', async () => {
        errorIntercepted = false

        if (core) {
          this.logger.info(`客户端(client)重连成功: ${opt.url}`)
          await onebot.initBotInfo()
          core.setStatus('online')
          return
        }

        this.logger.info(`客户端(client)连接成功: ${opt.url}`)
        await onebot.initBotInfo()
        resolve()
      })

      onebot.on('close', async (code, reason, error) => {
        errorIntercepted = true

        if (core && core.status === 'online') {
          core.setStatus('offline')
        }

        if (attempts >= opt.reconnectAttempts) {
          const errStr = `重连达到上限: ${opt.url} 共 ${attempts} 次`
          this.logger.error(errStr)
          // 重连到达上限 将卸载Bot
          if (core) {
            core.unregisterBot()
            this.#cache.ws.client.delete(opt.url)
            return
          }
          reject(new Error(errStr))
        }

        attempts++
        this.logger.error(
          `连接断开，将在 ${opt.reconnectTime / 1000}秒 后尝试重连(/${attempts}/${opt.reconnectAttempts}): ` +
          `${opt.url}， code: ${code}, reason: ${reason.toString() || error?.message || 'unknown'}`)
        setTimeout(() => onebot.init(), opt.reconnectTime)
      })

      onebot.on('error', async (error) => {
        if (errorIntercepted) {
          this.logger.debug(`客户端连接错误: ${opt.url} message: ${error.message}`)
          return
        }

        this.logger.error(`客户端连接错误: ${opt.url} message: ${error.message}`)
      })

      onebot.init()
    })

    const core = new AdapterOneBot(onebot)
    core.adapter.address = opt.url
    core.adapter.communication = 'webSocketClient'
    await core.init()
    core.registerBot()
  }

  /**
   * 创建OneBot HTTP实例
   * @param options - OneBot HTTP 配置
   */
  async createHttp (options: ReturnType<typeof config.adapter>['onebot']['http_server'][number]) {
    if (!options.enable) {
      this.logger.debug(`未启用Http适配器: ${options.url}`)
      return
    }

    const onebot = new OneBotHttpClient({
      httpHost: options.url,
      timeout: options.timeout,
      heartbeat: options.heartbeat,
      accessToken: options.api_token,
      postEventVerifyToken: options.post_token,
    })

    await onebot.init()

    const selfId = onebot.self.id + ''
    const adapter = new AdapterOneBot(onebot)
    adapter.adapter.address = options.url
    adapter.account.selfId = selfId
    adapter.adapter.communication = 'http'

    onebot.on('close', async (_, reason) => {
      this.logger.info(`${reason.toString()}: ${options.url}`)
      adapter.unregisterBot()
      this.#cache.http.delete(selfId)
    })

    onebot.on('error', (error) => {
      return this.logger.error(error)
    })

    this.#cache.http.set(selfId, adapter)
    await adapter.init()
    return adapter
  }
}
