import './api/api'
import { listeners } from '@/core/internal'
// import { registerHttpBot } from './post/register'
import { WS_CONNECTION_ONEBOT } from '@/utils/fs/key'
import { adapter } from '@/utils/config/file/adapter'
import { createOneBotWsServer } from './connect'
import { createOneBotClient } from '@/adapter/onebot/connect'

import type { WebSocket } from 'ws'
import type { IncomingMessage } from 'node:http'

export * from '@/adapter/onebot/types'
export type { AdapterOneBot } from '@/adapter/onebot/core/core'

const createServer = async () => {
  listeners.on(WS_CONNECTION_ONEBOT, (
    socket: WebSocket,
    request: IncomingMessage,
    call: () => void
  ) => {
    call()
    createOneBotWsServer(socket, request)
  })

  listeners.once('online', () => {
    logger.info(`[server] onebot: ${logger.green(`ws://127.0.0.1:${process.env.HTTP_PORT}`)}`)
    logger.info(`[server] onebot: ${logger.green(`ws://127.0.0.1:${process.env.HTTP_PORT}/onebot/v11/ws`)}`)
    logger.info(`[server] onebot: ${logger.green(`ws://127.0.0.1:${process.env.HTTP_PORT}/puppeteer`)}`)
  })
}

/**
 * @description 初始化OneBot11客户端
 */
export const createClient = async () => {
  const cfg = adapter()
  if (!cfg.onebot.ws_client || !Array.isArray(cfg.onebot.ws_client)) return

  for (const item of cfg.onebot.ws_client) {
    if (!item?.enable || !item?.url) continue
    createOneBotClient(item.url, item.token)
  }
}

export const createHttp = async () => {
  const cfg = adapter()
  if (!cfg.onebot.http_server || !Array.isArray(cfg.onebot.http_server)) return

  for (const data of cfg.onebot.http_server) {
    try {
      if (!data?.enable || !data?.url || !data?.self_id) continue
      if (!data?.self_id || !data?.url || !data?.url.startsWith('http')) {
        logger.bot('error', data.self_id, '请配置正确的 onebot http 信息')
        continue
      }

      // registerHttpBot(data.self_id, data.url, data.api_token, data.post_token)
    } catch (error) {
      logger.error(error)
    }
  }
}

/**
 * @internal
 * @description 初始化OneBot适配器
 */
export const initOneBot = async () => {
  createClient()
  createServer()
  createHttp()
}
