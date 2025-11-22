import { AdapterOneBot } from '../core/adapter'
import {
  OneBotWsClient,
  OneBotWsServer,
  OneBotHttpClient,
} from '@karinjs/onebot'
import { config } from '../config'

import type { WebSocket } from 'ws'
import type { IncomingMessage } from 'node:http'
import type { OneBotClientConfig, OneBotHttpClientConfig } from '../config'

/**
 * 实例缓存
 */
export const cache = {
  ws: {
    /** OneBot WebSocket Server */
    server: new Map<string, { core: AdapterOneBot<OneBotWsServer>, timeout: NodeJS.Timeout | null }>(),
    /** OneBot WebSocket Client */
    client: new Map<string, OneBotWsClient>(),
  },
  /** OneBot HTTP */
  http: new Map<string, AdapterOneBot<OneBotHttpClient>>(),
}

/** logger 实例 */
export const log = logger.prefix('[OneBot]')

/**
 * 初始化 OneBot WebSocket 客户端
 */
export const initOneBotWsClients = async () => {
  const cfg = config.getConfigSync('config.json')
  if (!cfg.client.enable) return
  if (!Array.isArray(cfg.client.targets)) return

  await Promise.allSettled(
    cfg.client.targets.map(async (item: OneBotClientConfig) => {
      if (!item?.enable || !item?.url) return
      await createClient(item)
        .catch((err) => log.error(`连接失败: ${item.url} 原因: ${err.message}`))
    })
  )
}

/**
 * 初始化 OneBot HTTP 客户端
 */
export const initOneBotHttpClients = async () => {
  const cfg = config.getConfigSync('config.json')
  if (!cfg.http.client.enable) return
  if (!Array.isArray(cfg.http.client.targets)) return

  await Promise.allSettled(
    cfg.http.client.targets.map(async (item: OneBotHttpClientConfig) => {
      if (!item?.enable || !item?.url) return
      await createHttp(item)
        .catch((err) => log.error(`连接失败: ${item.url} 原因: ${err.message}`))
    })
  )
}

/**
 * 创建OneBot WebSocket服务器实例
 * @param socket - WebSocket实例
 * @param request - HTTP请求对象
 */
export const createWsServer = async (
  socket: WebSocket,
  request: IncomingMessage
) => {
  const cfg = config.getConfigSync('config.json')

  /** 找一下是否有离线的 */
  const id = request.headers['x-self-id']
  if (!id || typeof id !== 'string') {
    log.error(`不符合标准的 WebSocket Server:\nheaders: ${JSON.stringify(request.headers, null, 2)}`)
    socket.close()
    return
  }
  const value = cache.ws.server.get(id)
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
    log.info(`重新连接: ${id}`)
    return
  }

  const onebot = new OneBotWsServer(socket, request, {
    accessToken: process.env.WS_SERVER_AUTH_KEY || cfg.server.token,
    timeout: cfg.server.timeout,
  })

  onebot.on('close', async (code, reason) => {
    log.error(`连接断开: ${url}, code: ${code}, reason: ${reason.toString() || 'unknown'}`)
    // 如果10分钟没有收到新的连接 则卸载Bot
    const timeout = setTimeout(() => {
      core.unregisterBot()
      cache.ws.server.delete(id)
    }, 10 * 60 * 1000)
    cache.ws.server.get(id)!.timeout = timeout
  })

  onebot.on('error', async (error) => {
    log.error(error)
  })

  await onebot.init()
  const core = new AdapterOneBot(onebot)
  cache.ws.server.set(id, { core, timeout: null })
  const url = `ws://${request.headers.host}${request.url}`
  log.debug(`[OneBot] 服务端连接成功: ${url}`)
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
export const createClient = async (opt: OneBotClientConfig) => {
  const cfg = config.getConfigSync('config.json')
  /** 重连次数 */
  let attempts = 0
  /** 重连间隔时间（毫秒）默认5秒 */
  const reconnectTime = 5000
  /** 最大重连次数 默认10次 */
  const reconnectAttempts = 10

  const onebot = new OneBotWsClient({
    url: opt.url,
    timeout: opt.timeout || cfg.client.timeout,
    accessToken: opt.token,
    headers: opt.headers as Record<string, string>,
  })

  cache.ws.client.set(opt.url, onebot)
  await new Promise<void>((resolve, reject) => {
    /** 是否拦截错误事件 */
    let errorIntercepted = true

    onebot.on('open', async () => {
      errorIntercepted = false

      if (core) {
        log.info(`客户端(client)重连成功: ${opt.url}`)
        await onebot.initBotInfo()
        core.setStatus('online')
        return
      }

      log.info(`客户端(client)连接成功: ${opt.url}`)
      await onebot.initBotInfo()
      resolve()
    })

    onebot.on('close', async (code, reason, error) => {
      errorIntercepted = true

      if (core && core.status === 'online') {
        core.setStatus('offline')
      }

      if (attempts >= reconnectAttempts) {
        const errStr = `重连达到上限: ${opt.url} 共 ${attempts} 次`
        log.error(errStr)
        // 重连到达上限 将卸载Bot
        if (core) {
          core.unregisterBot()
          cache.ws.client.delete(opt.url)
          return
        }
        reject(new Error(errStr))
      }

      attempts++
      log.error(
        `连接断开，将在 ${reconnectTime / 1000}秒 后尝试重连(/${attempts}/${reconnectAttempts}): ` +
        `${opt.url}， code: ${code}, reason: ${reason.toString() || error?.message || 'unknown'}`)
      setTimeout(() => onebot.init(), reconnectTime)
    })

    onebot.on('error', async (error) => {
      if (errorIntercepted) {
        log.debug(`客户端连接错误: ${opt.url} message: ${error.message}`)
        return
      }

      log.error(`客户端连接错误: ${opt.url} message: ${error.message}`)
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
export const createHttp = async (options: OneBotHttpClientConfig) => {
  if (!options.enable) {
    log.debug(`未启用Http适配器: ${options.url}`)
    return
  }

  const cfg = config.getConfigSync('config.json')
  const onebot = new OneBotHttpClient({
    httpHost: options.url,
    timeout: options.timeout || cfg.http.client.timeout,
    heartbeat: options.heartbeat,
    heartbeatInterval: options.heartbeatInterval,
    accessToken: options.token,
    headers: options.headers as Record<string, string>,
    reconnectAttempts: 10,
  })

  await onebot.init()

  const selfId = onebot.self.id + ''
  const adapter = new AdapterOneBot(onebot)
  adapter.adapter.address = options.url
  adapter.account.selfId = selfId
  adapter.adapter.communication = 'http'

  onebot.on('close', async (_, reason) => {
    log.info(`${reason.toString()}: ${options.url}`)
    adapter.unregisterBot()
    cache.http.delete(selfId)
  })

  onebot.on('error', (error) => {
    return log.error(error)
  })

  cache.http.set(selfId, adapter)
  await adapter.init()
  return adapter
}
