import { AdapterOneBot } from '../core/core'
import { adapter as adapterConfig } from '@/utils/config'
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
import type { Adapters } from '@/types'
import { cacheMap } from '../core/cache'

/** 日志前缀 */
const loggerPrefix = '[OneBot]'

/**
 * 创建OneBot WebSocket服务器
 * @param socket - WebSocket实例
 * @param request - 请求对象
 * @returns 适配器实例
 */
export const createOneBotWsServer = async (
  socket: WebSocket,
  request: IncomingMessage
) => {
  if (!adapterConfig().onebot.ws_server.enable) {
    logger.warn(`${loggerPrefix} 未启用WebSocketServer服务`)
    return
  }

  const onebot = oneBotWsServerManager.createServer(socket, request, {
    accessToken: process.env.WS_SERVER_AUTH_KEY,
    timeout: adapterConfig().onebot.ws_server.timeout,
  })
  const adapter = new AdapterOneBot(onebot)
  const url = `ws://${request.headers.host}${request.url}`
  adapter.adapter.address = url
  adapter.adapter.communication = 'webSocketServer'
  adapter.account.selfId = String(request.headers['x-self-id'])

  onebot.on(OneBotEventKey.CLOSE, async (type) => {
    adapter.unregisterBot()
    if (type === OneBotCloseType.MANUAL_CLOSE) {
      logger.info(`${loggerPrefix} 主动关闭: ${url}`)
    }

    return logger.error(`${loggerPrefix} 连接断开: ${url}`)
  })
  await adapter.init()
  cacheMap.wsServer.set(url, adapter)
}

/**
 * @description 创建OneBot客户端
 * @param url 连接地址
 * @param token 鉴权token
 */
export const createOneBotClient = async (url: string, token?: string) => {
  const onebot = await oneBotWsClientManager.createClient(url, {
    timeout: adapterConfig().onebot.ws_server.timeout,
    accessToken: token,
    autoReconnect: true,
  })

  const adapter = new AdapterOneBot(onebot)
  adapter.adapter.address = url
  adapter.adapter.communication = 'webSocketClient'

  onebot.on(OneBotEventKey.OPEN, async () => {
    logger.info(`[OneBot] 客户端连接成功: ${url}`)
    await adapter.init()
    adapter.registerBot()
  })

  onebot.on(OneBotEventKey.CLOSE, async (type) => {
    adapter.unregisterBot()
    if (type === OneBotCloseType.CONNECTION_FAILED) {
      return logger.error(`${loggerPrefix} 连接异常断开 即将重连: ${url}`)
    }

    if (type === OneBotCloseType.ERROR) {
      return logger.error(`${loggerPrefix} 客户端连接关闭: ${url}`)
    }

    if (type === OneBotCloseType.MANUAL_CLOSE) {
      return logger.info(`${loggerPrefix} 主动关闭: ${url}`)
    }

    if (type === OneBotCloseType.MAX_RETRIES) {
      return logger.error(`${loggerPrefix} 重连次数过多: ${url}`)
    }

    if (type === OneBotCloseType.SERVER_CLOSE) {
      return logger.error(`${loggerPrefix} 服务端异常关闭: ${url}`)
    }

    logger.info(`${loggerPrefix} 客户端连接关闭: ${url}`)
  })

  onebot.on(OneBotEventKey.ERROR, async (args) => {
    if (args.type === OneBotErrorType.CONNECTION_FAILED) {
      return logger.error(`${loggerPrefix} 连接建立失败，${args.reconnectInterval / 1000}秒后重试(${args.reconnectAttempt}/${args.maxReconnectAttempt}): ${args.error.message}`)
    }

    if (args.type === OneBotErrorType.RECONNECT_FAILED) {
      return logger.error(`${loggerPrefix} 重连达到上限: ${args.totalReconnectAttempt}次`)
    }

    return logger.error(new Error(`${loggerPrefix} 发生错误:`, { cause: args.error }))
  })

  cacheMap.wsClient.set(url, adapter)
}

/**
 * @description 创建OneBot Http适配器
 * @param options 适配器配置
 */
export const createOneBotHttp = async (options: Adapters['onebot']['http_server'][number]) => {
  if (!options.enable) {
    logger.debug(`${loggerPrefix} 未启用Http适配器: ${options.url}`)
    return
  }

  const onebot = oneBotHttpManager.createClient({
    httpHost: options.url,
    self_id: +options.self_id,
    timeout: adapterConfig().onebot.ws_server.timeout * 1000,
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
      return logger.info(`${loggerPrefix} 主动关闭: ${options.url}`)
    }

    if (type === OneBotCloseType.HEARTBEAT_FAILED_MAX_RETRIES) {
      return logger.error(`${loggerPrefix} 心跳失败次数达到上限: ${options.url}`)
    }

    if (type === OneBotCloseType.HEARTBEAT_FAILED) {
      return logger.error(`${loggerPrefix} 首次心跳失败: ${options.url}`)
    }

    return logger.error(`${loggerPrefix} 心跳失败: ${options.url}`)
  })

  onebot.on(OneBotEventKey.ERROR, (args) => {
    if (args.type === OneBotErrorType.CONNECTION_FAILED) {
      return logger.error(`${loggerPrefix} 心跳失败，${args.reconnectInterval / 1000}秒后重试(${args.reconnectAttempt}/${args.maxReconnectAttempt}): ${args.error.message}`)
    }

    if (args.type === OneBotErrorType.RECONNECT_FAILED) {
      return logger.error(`${loggerPrefix} 重连达到上限: ${args.totalReconnectAttempt}次`)
    }

    return logger.error(new Error(`${loggerPrefix} 发生错误:`, { cause: args.error }))
  })

  cacheMap.http.set(options.self_id, adapter)
  await adapter.init()
  return adapter
}

/**
 * 断开全部OneBot服务端
 */
export const disconnectAllOneBotServer = () => {
  cacheMap.wsServer.forEach(adapter => adapter._onebot.close())
}
