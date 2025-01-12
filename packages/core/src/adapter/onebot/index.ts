import { listeners } from '@/core/internal'
import { adapter } from '@/utils/config/adapter'
import { registerHttpBot } from './post/register'
import { AdapterServerOneBot11, HttpAdapterOneBot11 } from './connect'
import { AdapterClientOneBot11 } from '@/adapter/onebot/connect/client'

import type { IncomingMessage } from 'node:http'
import type { WebSocket } from 'ws'

const createServer = async () => {
  listeners.on('ws:connection:onebot', (socket: WebSocket, request: IncomingMessage) => {
    new AdapterServerOneBot11(socket, request).init()
  })

  listeners.once('online', () => {
    logger.info(`[server] onebot: ${logger.green(`ws://127.0.0.1:${process.env.HTTP_PORT}`)}`)
    logger.info(`[server] onebot: ${logger.green(`ws://127.0.0.1:${process.env.HTTP_PORT}/onebot/v11/ws`)}`)
  })
}

const createClient = async () => {
  const cfg = adapter()
  if (!cfg.onebot.ws_client || !Array.isArray(cfg.onebot.ws_client)) return

  for (const item of cfg.onebot.ws_client) {
    if (!item?.enable || !item?.url || !item?.token) continue
    AdapterClientOneBot11.init(item.url, item.token)
  }
}

const createHttp = async () => {
  const cfg = adapter()
  if (!cfg.onebot.http_server || !Array.isArray(cfg.onebot.http_server)) return

  for (const data of cfg.onebot.http_server) {
    try {
      if (!data?.enable || !data?.url || !data?.token || !data?.self_id) continue
      if (!data?.self_id || !data?.url || !data?.url.startsWith('http')) {
        logger.bot('error', data.self_id, '请配置正确的 onebot http 信息')
        continue
      }

      registerHttpBot(data.self_id, data.token)
      const adapter = new HttpAdapterOneBot11(data.self_id, data.url, data.token)
      await adapter.init()
    } catch (error) {
      logger.error(error)
    }
  }
}

createClient()
createServer()
createHttp()

export * from '@/adapter/onebot/types'
export type { AdapterOneBot } from '@/adapter/onebot/core/base'
