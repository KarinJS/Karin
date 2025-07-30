import {
  isDev,
  WS_CLOSE_ONEBOT,
  WS_CLOSE_PUPPETEER,
  WS_CONNECTION_ONEBOT,
  WS_CONNECTION_PUPPETEER,
} from '@karinjs/envs'
import { emitter, statusListener } from '@karinjs/core'
import { createSuccessResponse } from '../utils/response'

import type { RequestHandler } from 'express'

/**
 * 系统状态接口定义
 * @interface SystemStatus
 */
export interface SystemStatus {
  /** CPU相关信息 */
  cpu: {
    /** CPU型号 */
    model: string
    /** CPU速度 */
    speed: string
    /** CPU使用率 */
    usage: {
      /** 系统CPU使用率 */
      system: string
      /** Karin进程CPU使用率 */
      karin: string
    }
    /** CPU核心数 */
    core: number
  }
  /** 内存相关信息 */
  memory: {
    /** 总内存 */
    total: string
    /** 内存使用率 */
    usage: {
      /** 系统内存使用率 */
      system: string
      /** Karin进程内存使用率 */
      karin: string
    }
    /** 详细内存信息 */
    details: {
      /** 常驻集大小 */
      rss: string
      /** 总堆大小 */
      heapTotal: string
      /** 已用堆大小 */
      heapUsed: string
      /** 外部内存 */
      external: string
      /** 数组缓冲区 */
      arrayBuffers: string
    }
  }
  /** 系统信息 */
  system: {
    /** 系统架构 */
    arch: string
    /** 主机名 */
    hostname: string
    /** 操作系统名称 */
    osName: string
    /** 操作系统版本 */
    osVersion: string
    /** 平台 */
    platform: string
    /** 系统运行时间 */
    uptime: number
    /** 系统负载平均值(仅Unix系统) */
    loadavg?: number[]
    /** 临时目录路径 */
    tmpdir: string
    /** 用户主目录路径 */
    homedir: string
  }
  /** 进程信息 */
  process: {
    /** Node.js版本 */
    nodeVersion: string
    /** 进程ID */
    pid: number
    /** 进程运行时间 */
    uptime: number
    /** Node.js可执行文件路径 */
    execPath: string
    /** 命令行参数 */
    argv: string[]
    /** 环境变量 */
    env: {
      /** Node环境 */
      nodeEnv?: string
      /** 时区 */
      timezone?: string
    }
    /** 用户信息 */
    user?: {
      /** 用户名 */
      username: string
      /** 用户主目录 */
      homedir: string
      /** Shell类型 */
      shell?: string | null
    }
  }
  /** 网络信息 */
  network?: {
    /** 网络接口列表 */
    interfaces: Record<string, any>
  }
}

const wsOneBotSet = new Set<WebSocket>()
const wsPuppeteerSet = new Set<WebSocket>()

emitter.on(WS_CONNECTION_ONEBOT, (socket: WebSocket) => {
  wsOneBotSet.add(socket)
})

emitter.on(WS_CONNECTION_PUPPETEER, (socket: WebSocket) => {
  wsPuppeteerSet.add(socket)
})

emitter.on(WS_CLOSE_ONEBOT, (socket: WebSocket) => {
  wsOneBotSet.delete(socket)
})

emitter.on(WS_CLOSE_PUPPETEER, (socket: WebSocket) => {
  wsPuppeteerSet.delete(socket)
})

/**
 * 系统信息路由
 */
export const statusRouter: RequestHandler = (_req, res) => {
  const data = {
    name: 'karin',
    pid: process.pid,
    pm2_id: process.env.pm_id || '',
    uptime: process.uptime(),
    version: process.env.KARIN_VERSION,
    karin_dev: isDev(),
    karin_lang: process.env.RUNTIME === 'tsx' ? 'ts' : 'js',
    karin_runtime: process.env.RUNTIME,
    platform: process.platform,
    arch: process.arch,
  }

  createSuccessResponse(res, data, '成功')
}

// 获取连接ws的信息
export const infoRouter: RequestHandler = async (_req, res) => {
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

/**
 * 系统状态实时路由
 */
export const systemStatusRealTimeHandler: RequestHandler = async (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream')
  res.setHeader('Connection', 'keep-alive')
  const sendStatus = (status: SystemStatus) => {
    try {
      res.write(`data: ${JSON.stringify(status)}\n\n`)
    } catch (e) {
      logger.error(`An error occurred when writing sendStatus data to client: ${e}`)
    }
  }
  statusListener.on('statusUpdate', sendStatus)
  req.on('close', () => {
    statusListener.off('statusUpdate', sendStatus)
    res.end('data: end\n\n')
  })
}
