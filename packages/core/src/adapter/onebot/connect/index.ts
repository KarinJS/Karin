import { AdapterOneBot } from '../core/core'
import { EventKeys, OneBotHttpManager, OneBotWsManager } from '@karinjs/onebot'
import { adapter as adapterConfig } from '@/utils/config'

import type { WebSocket } from 'ws'
import type { IncomingMessage } from 'node:http'
import type { Adapters } from '@/types'

/** onebot管理器 */
export const oneBotManager = new OneBotWsManager()

/** onebot http管理器 */
export const oneBotHttpManager = new OneBotHttpManager()

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
    logger.warn('[OneBot] 未启用WebSocketServer服务')
    return
  }

  const onebot = oneBotManager.createServer(socket, request, {
    accessToken: process.env.WS_SERVER_AUTH_KEY,
    timeout: adapterConfig().onebot.ws_server.timeout,
  })
  const adapter = new AdapterOneBot(onebot)
  const url = `ws://${request.headers.host}${request.url}`
  adapter.adapter.address = url
  adapter.adapter.communication = 'webSocketServer'
  adapter.account.selfId = String(request.headers['x-self-id'])
  await adapter.init()
}

/**
 * @description 创建OneBot客户端
 * @param url 连接地址
 * @param token 鉴权token
 */
export const createOneBotClient = async (url: string, token?: string) => {
  const onebot = await oneBotManager.createClient(url, {
    timeout: adapterConfig().onebot.ws_server.timeout,
    accessToken: token,
    autoReconnect: true,
  })

  // TODO: 需要重新编写生命周期事件

  onebot.on(EventKeys.open, async () => {
    logger.info(`[OneBot] 客户端连接成功: ${url}`)
    const adapter = new AdapterOneBot(onebot)
    adapter.adapter.address = url
    adapter.adapter.communication = 'webSocketClient'
    await adapter.init()
  })
}

/**
 * @description 创建OneBot Http适配器
 * @param options 适配器配置
 */
export const createOneBotHttp = async (options: Adapters['onebot']['http_server'][number]) => {
  const onebot = await oneBotHttpManager.createClient({
    httpHost: options.url,
    self_id: +options.self_id,
    timeout: adapterConfig().onebot.ws_server.timeout,
    accessToken: options.post_token,
    OneBotAccessToken: options.token || options.api_token,
  })

  const adapter = new AdapterOneBot(onebot)
  adapter.adapter.address = options.url
  adapter.account.selfId = options.self_id
  adapter.adapter.communication = 'http'
  await adapter.init()
  return adapter
}

/**
 * 断开全部OneBot服务端
 */
export const disconnectAllOneBotServer = () => {
  const list = oneBotManager.getServers()
  list.forEach(server => server.close())
}
