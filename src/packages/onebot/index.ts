import { listeners } from '@/core/internal'
import { server } from '@/utils/config/index'
import { registerHttpBot } from './post/register'
import { AdapterServerOneBot11, HttpAdapterOneBot11 } from './connect'
import { AdapterClientOneBot11 } from '@/packages/onebot/connect/client'

import type { IncomingMessage } from 'node:http'
import type { WebSocket } from 'ws'

const createServer = async () => {
  listeners.on('ws:connection:onebot', (socket: WebSocket, request: IncomingMessage) => {
    new AdapterServerOneBot11(socket, request).init()
  })

  listeners.once('online', () => {
    logger.info(`[server] onebot: ${logger.green(`ws://127.0.0.1:${process.env.karin_port}`)}`)
    logger.info(`[server] onebot: ${logger.green(`ws://127.0.0.1:${process.env.karin_port}/onebot/v11/ws`)}`)
  })
}

const createClient = async () => {
  const cfg = server()
  if (!cfg.forwardWs) return

  for (const item of cfg.forwardWs) {
    if (typeof item === 'string') {
      AdapterClientOneBot11.init(item)
    } else {
      AdapterClientOneBot11.init(item.url, item.token)
    }
  }
}

const createHttp = async () => {
  const cfg = server()
  if (!cfg.onebotHttp || !Array.isArray(cfg.onebotHttp)) return

  for (let { selfId, api, token } of cfg.onebotHttp) {
    try {
      if (selfId === 'default') continue
      selfId = String(selfId)
      token = String(token)
      if (!selfId || !api || !api.startsWith('http')) {
        logger.bot('error', selfId, '请配置正确的 onebot http 信息')
        continue
      }

      registerHttpBot(selfId, token)
      const adapter = new HttpAdapterOneBot11(selfId, api, token)
      await adapter.init()
    } catch (error) {
      logger.error(error)
    }
  }
}

createClient()
createServer()
createHttp()

export * from '@/packages/onebot/types'
export type { AdapterOneBot } from '@/packages/onebot/core/base'
