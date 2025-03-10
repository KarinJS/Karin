import { router } from './router'
import { listeners, statusListener } from '@/core/internal'
import { createSuccessResponse } from '../utils/response'
import {
  WS_CLOSE_ONEBOT,
  WS_CLOSE_PUPPETEER,
  WS_CONNECTION_ONEBOT,
  WS_CONNECTION_PUPPETEER
} from '@/utils/fs/key'

import type { SystemStatus } from '@/types/system/status'
import type { RequestHandler } from 'express'
import { isDev } from '@/env'

const wsOneBotSet = new Set<WebSocket>()
const wsPuppeteerSet = new Set<WebSocket>()

listeners.on(WS_CONNECTION_ONEBOT, (socket: WebSocket) => {
  wsOneBotSet.add(socket)
})

listeners.on(WS_CONNECTION_PUPPETEER, (socket: WebSocket) => {
  wsPuppeteerSet.add(socket)
})

listeners.on(WS_CLOSE_ONEBOT, (socket: WebSocket) => {
  wsOneBotSet.delete(socket)
})

listeners.on(WS_CLOSE_PUPPETEER, (socket: WebSocket) => {
  wsPuppeteerSet.delete(socket)
})

const pingRouter: RequestHandler = (_req, res) => {
  createSuccessResponse(
    res,
    {
      ping: 'pong',
    },
    '成功',
  )
}

const statusRouter: RequestHandler = (_req, res) => {
  const data = {
    name: 'karin',
    pid: process.pid,
    pm2_id: process.env.pm_id || '',
    uptime: process.uptime(),
    version: process.env.KARIN_VERSION,
    karin_dev: isDev(),
    karin_lang: process.env.RUNTIME === 'tsx' ? 'ts' : 'js',
    karin_runtime: process.env.RUNTIME,
  }

  createSuccessResponse(res, data, '成功')
}

// 获取连接ws的信息
const infoRouter: RequestHandler = async (_req, res) => {
  // 获取连接ws的信息
  const wsOneBotInfo = Array.from(wsOneBotSet).map(ws => {
    // 获取连接ws的信息
    return {
      // 获取连接ws的信息
      readyState: ws.readyState,
      // 获取连接ws的信息
      url: ws.url,
      // 获取连接ws的信息
      protocol: ws.protocol,
    }
  })

  const wsPuppeteerInfo = Array.from(wsPuppeteerSet).map(ws => {
    // 获取连接ws的信息
    return {
      // 获取连接ws的信息
      readyState: ws.readyState,
      // 获取连接ws的信息
      url: ws.url,
      // 获取连接ws的信息
      protocol: ws.protocol,
    }
  })

  const wsInfo = {
    onebot: wsOneBotInfo,
    puppeteer: wsPuppeteerInfo,
  }

  // 获取连接ws的信息
  createSuccessResponse(res, wsInfo)
}

export const systemStatusRealTimeHandler: RequestHandler = async (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream')
  res.setHeader('Connection', 'keep-alive')
  const sendStatus = (status: SystemStatus) => {
    try {
      res.write(`data: ${JSON.stringify(status)}\n\n`)
    } catch (e) {
      console.error(`An error occurred when writing sendStatus data to client: ${e}`)
    }
  }
  statusListener.on('statusUpdate', sendStatus)
  req.on('close', () => {
    statusListener.off('statusUpdate', sendStatus)
    res.end()
  })
}

// 获取连接ws的信息
router.get('/status/ws', infoRouter)
router.get('/ping', pingRouter)
router.get('/status/karin', statusRouter)
router.get('/status/system', systemStatusRealTimeHandler)
