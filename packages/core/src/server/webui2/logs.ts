/**
 * 2.0 WebUI 兼容接口 - 日志流路由
 */

import type { RequestHandler, Response } from 'express'

interface TerminalLog {
  id: string
  timestamp: number
  level: 'INFO' | 'DEBUG' | 'MARK' | 'ERROR' | 'WARN'
  message: string
}

interface ApiResponse<T> {
  code: number
  message: string
  data: T
}

const logsStreamClients = new Set<Response>()
let logsEmissionTimer: ReturnType<typeof setTimeout> | null = null

/**
 * 生成随机日志
 */
const buildLog = (): TerminalLog => {
  const levels: TerminalLog['level'][] = ['INFO', 'DEBUG', 'MARK', 'ERROR', 'WARN']
  const messages = [
    '插件加载成功',
    '消息处理完成',
    '数据库连接建立',
    '缓存更新',
    '任务执行中',
    '配置文件已读取',
    '事件监听器已注册',
    '网络连接正常',
    '系统运行正常',
    '日志记录成功',
  ]

  return {
    id: Math.random().toString(36).substring(2, 11),
    timestamp: Date.now(),
    level: levels[Math.floor(Math.random() * levels.length)],
    message: messages[Math.floor(Math.random() * messages.length)],
  }
}

/**
 * 广播日志到所有 SSE 客户端
 */
const broadcastLog = (log: TerminalLog): void => {
  const serializedLog = JSON.stringify(log)
  logsStreamClients.forEach((client) => {
    client.write(`data: ${serializedLog}\n\n`)
  })
}

/**
 * 按随机间隔持续产生日志并广播
 */
const scheduleLogEmission = (): void => {
  if (logsEmissionTimer) {
    clearTimeout(logsEmissionTimer)
    logsEmissionTimer = null
  }
  const nextDelay = Math.floor(Math.random() * 780) + 120 // 120-900ms
  logsEmissionTimer = setTimeout(() => {
    const log = buildLog()
    broadcastLog(log)
    scheduleLogEmission()
  }, nextDelay)
}

/**
 * 获取日志流 (SSE)
 */
export const getLogsStreamRouter: RequestHandler = (_req, res) => {
  res.setHeader('Content-Type', 'text/event-stream')
  res.setHeader('Cache-Control', 'no-cache')
  res.setHeader('Connection', 'keep-alive')
  res.flushHeaders?.()

  logsStreamClients.add(res)
  broadcastLog(buildLog())
  const keepAliveTimer = setInterval(() => {
    res.write(': keep-alive\n\n')
  }, 15000)

  _req.on('close', () => {
    clearInterval(keepAliveTimer)
    logsStreamClients.delete(res)
    res.end()
  })
}

// 启动日志发射
if (logsStreamClients.size === 0) {
  scheduleLogEmission()
}
