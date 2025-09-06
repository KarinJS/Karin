import express from 'express'
import { app } from '@karinjs/server'
import { AdapterOneBot } from './core/adapter'
import { config } from '@karinjs/core/config'
import { emitter } from '@karinjs/events'
import { WS_CONNECTION_ONEBOT } from '@karinjs/envs'
import {
  oneBotHttpManager,
  oneBotWsServerManager,
  oneBotWsClientManager,
  OneBotEventKey,
  OneBotCloseType,
  OneBotErrorType,
} from '@karinjs/onebot'

import type { WebSocket } from 'ws'
import type { IncomingMessage } from 'node:http'
import type { OneBotHttp, OneBotWsClient, OneBotWsServer } from '@karinjs/onebot'

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
      server: Map<string, AdapterOneBot<OneBotWsServer>>,
      /** OneBot WebSocket Client */
      client: Map<string, AdapterOneBot<OneBotWsClient>>,
    },
    /** OneBot HTTP */
    http: Map<string, AdapterOneBot<OneBotHttp>>,
  }

  constructor () {
    this.#cache = {
      ws: {
        server: new Map<string, AdapterOneBot<OneBotWsServer>>(),
        client: new Map<string, AdapterOneBot<OneBotWsClient>>(),
      },
      http: new Map<string, AdapterOneBot<OneBotHttp>>(),
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
            await this.createClient(item.url, item.token)
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
            if (!item?.enable || !item?.url || !item?.self_id) return
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

        adapter.core.handleEvent(rawBody, req.headers)
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
      this.logger.warn('未启用WebSocketServer服务')
      return
    }

    const onebot = oneBotWsServerManager.createServer(socket, request, {
      accessToken: process.env.WS_SERVER_AUTH_KEY,
      timeout: config.adapter().onebot.ws_server.timeout,
    })
    const adapter = new AdapterOneBot(onebot)
    const url = `ws://${request.headers.host}${request.url}`
    adapter.adapter.address = url
    adapter.adapter.communication = 'webSocketServer'
    adapter.account.selfId = String(request.headers['x-self-id'])

    onebot.on(OneBotEventKey.OPEN, async () => {
      this.logger.debug(`[OneBot] 服务端连接成功: ${url}`)
      adapter.registerBot()
    })

    onebot.on(OneBotEventKey.CLOSE, async (type) => {
      adapter.unregisterBot()
      if (type === OneBotCloseType.MANUAL_CLOSE) {
        this.logger.info(`主动关闭: ${url}`)
      }

      return this.logger.error(`连接断开: ${url}`)
    })

    onebot.on(OneBotEventKey.ERROR, async (args) => {
      if (args.type === OneBotErrorType.AUTH_FAILED) {
        return this.logger.error(`鉴权失败: ${args.error.message}`)
      }

      if (args.type === OneBotErrorType.AUTH_INVALID_FORMAT) {
        return this.logger.error(`鉴权头格式错误: ${args.error.message}`)
      }

      return this.logger.error(new Error('发生错误:', { cause: args.error }))
    })

    await adapter.init()
    this.#cache.ws.server.set(url, adapter)
  }

  /** 创建OneBot WebSocket客户端实例
   * @param url - WebSocket服务器地址
   * @param token - 访问令牌
   */
  async createClient (url: string, token?: string) {
    const onebot = await oneBotWsClientManager.createClient(url, {
      timeout: config.adapter().onebot.ws_server.timeout,
      accessToken: token,
      autoReconnect: true,
    })

    const adapter = new AdapterOneBot(onebot)
    adapter.adapter.address = url
    adapter.adapter.communication = 'webSocketClient'

    onebot.on(OneBotEventKey.OPEN, async () => {
      this.logger.info(`[OneBot] 客户端连接成功: ${url}`)
      await adapter.init()
      adapter.registerBot()
    })

    onebot.on(OneBotEventKey.CLOSE, async (type) => {
      adapter.unregisterBot()
      if (type === OneBotCloseType.CONNECTION_FAILED) {
        return this.logger.error(`连接异常断开 即将重连: ${url}`)
      }

      if (type === OneBotCloseType.ERROR) {
        return this.logger.error(`客户端连接关闭: ${url}`)
      }

      if (type === OneBotCloseType.MANUAL_CLOSE) {
        return this.logger.info(`主动关闭: ${url}`)
      }

      if (type === OneBotCloseType.MAX_RETRIES) {
        return this.logger.error(`重连次数过多: ${url}`)
      }

      if (type === OneBotCloseType.SERVER_CLOSE) {
        return this.logger.error(`服务端异常关闭: ${url}`)
      }

      this.logger.info(`客户端连接关闭: ${url}`)
    })

    onebot.on(OneBotEventKey.ERROR, async (args) => {
      if (args.type === OneBotErrorType.CONNECTION_FAILED) {
        return this.logger.error(`连接建立失败，${args.reconnectInterval / 1000}秒后重试(${args.reconnectAttempt}/${args.maxReconnectAttempt}): ${args.error.message}`)
      }

      if (args.type === OneBotErrorType.RECONNECT_FAILED) {
        return this.logger.error(`重连达到上限: ${args.totalReconnectAttempt}次`)
      }

      return this.logger.error(new Error('发生错误:', { cause: args.error }))
    })

    this.#cache.ws.client.set(url, adapter)
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

    const onebot = oneBotHttpManager.createClient({
      httpHost: options.url,
      self_id: +options.self_id,
      timeout: config.adapter().onebot.ws_server.timeout * 1000,
      accessToken: options.post_token,
      OneBotAccessToken: options.token || options.api_token,
    })

    const adapter = new AdapterOneBot(onebot)
    adapter.adapter.address = options.url
    adapter.account.selfId = options.self_id
    adapter.adapter.communication = 'http'

    onebot.on(OneBotEventKey.OPEN, async () => {
      adapter.registerBot()
    })

    onebot.on(OneBotEventKey.CLOSE, async (type) => {
      adapter.unregisterBot()
      if (type === OneBotCloseType.MANUAL_CLOSE) {
        return this.logger.info(`主动关闭: ${options.url}`)
      }

      if (type === OneBotCloseType.HEARTBEAT_FAILED_MAX_RETRIES) {
        return this.logger.error(`心跳失败次数达到上限: ${options.url}`)
      }

      if (type === OneBotCloseType.HEARTBEAT_FAILED) {
        return this.logger.error(`首次心跳失败: ${options.url}`)
      }

      return this.logger.error(`心跳失败: ${options.url}`)
    })

    onebot.on(OneBotEventKey.ERROR, (args) => {
      if (args.type === OneBotErrorType.CONNECTION_FAILED) {
        return this.logger.error(`心跳失败，${args.reconnectInterval / 1000}秒后重试(${args.reconnectAttempt}/${args.maxReconnectAttempt}): ${args.error.message}`)
      }

      if (args.type === OneBotErrorType.RECONNECT_FAILED) {
        return this.logger.error(`重连达到上限: ${args.totalReconnectAttempt}次`)
      }

      return this.logger.error(new Error('发生错误:', { cause: args.error }))
    })

    this.#cache.http.set(options.self_id, adapter)
    await adapter.init()
    return adapter
  }

  /**
   * 断开全部OneBot服务端
   */
  async disconnectAll () {
    for (const [, adapter] of this.#cache.ws.server) {
      adapter.core.close()
    }
    this.#cache.ws.server.clear()

    for (const [, adapter] of this.#cache.ws.client) {
      adapter.core.close()
    }
    this.#cache.ws.client.clear()

    for (const [, adapter] of this.#cache.http) {
      adapter.core.close()
    }
    this.#cache.http.clear()
  }
}
