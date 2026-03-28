/**
 * 2.0 WebUI 兼容接口 - 仪表盘路由
 * 这些接口用于支持 2.0 WebUI 的前端设计验证
 */

import { createSuccessResponse } from '@/server/utils/response'
import { listeners, statusListener } from '@/core/internal'
import {
  WS_CLOSE_ONEBOT,
  WS_CLOSE_PUPPETEER,
  WS_CONNECTION_ONEBOT,
  WS_CONNECTION_PUPPETEER,
} from '@/utils/fs/key'
import { getBotCount } from '@/service/bot'

import type { RequestHandler, Response } from 'express'

/**
 * 2.0 WebUI 数据结构
 */

interface ChartDataPoint {
  timestamp: number
  inboundMessages: number
  outboundMessages: number
}

interface BotInfo {
  id: string
  name: string
  selfId: string
  adapterId: string
  avatarUrl: string
  avatarFallback: string
  inboundMessages: number
  outboundMessages: number
  trend: ChartDataPoint[]
}

interface DashboardMetrics {
  cpuLoad: number
  cpuLoadChange: number
  memoryUsage: number
  memoryTotal: number
  memoryHistory: number[]
  totalPackets: number
  inboundPackets: number
  outboundPackets: number
}

interface AdapterInfo {
  id: string
  name: string
  status: 'connected' | 'disconnected' | 'error'
  latency?: number
  inboundMessages: number
  outboundMessages: number
  trend: ChartDataPoint[]
  bots: BotInfo[]
}

interface DashboardData {
  metrics: DashboardMetrics
  chartData: ChartDataPoint[]
  adapters: AdapterInfo[]
}

interface DashboardRuntimeInfo {
  startTimestamp: number
  days: number
  hours: number
}

interface DashboardRealtimeData {
  version: string
  pluginCount: number
  metrics: DashboardMetrics
  runtime: DashboardRuntimeInfo
  adapters: AdapterInfo[]
}

interface ApiResponse<T> {
  code: number
  message: string
  data: T
}

/**
 * 生成模拟的 Bot 趋势数据
 */
const generateBotTrend = (baseInbound: number, baseOutbound: number): ChartDataPoint[] => {
  const timeline = Array.from({ length: 14 }, (_, i) => {
    const now = Date.now()
    const dayMs = 24 * 60 * 60 * 1000
    return now - (13 - i) * dayMs
  })

  return timeline.map((timestamp, index) => {
    const wave = Math.sin((index / timeline.length) * Math.PI) * 80
    const inboundMessages = Math.max(80, Math.round(baseInbound + wave + Math.random() * 100 - 50))
    const outboundMessages = Math.max(60, Math.round(baseOutbound + wave * 0.84 + Math.random() * 100 - 50))
    return {
      timestamp,
      inboundMessages,
      outboundMessages,
    }
  })
}

/**
 * 聚合趋势数据
 */
const aggregateTrend = (trends: ChartDataPoint[][], timeline: number[]): ChartDataPoint[] => {
  return timeline.map((timestamp) => {
    const inboundMessages = trends.reduce((sum, trend) => sum + (trend.find((point) => point.timestamp === timestamp)?.inboundMessages || 0), 0)
    const outboundMessages = trends.reduce((sum, trend) => sum + (trend.find((point) => point.timestamp === timestamp)?.outboundMessages || 0), 0)
    return {
      timestamp,
      inboundMessages,
      outboundMessages,
    }
  })
}

/**
 * 汇总趋势总量
 */
const summarizeTrend = (trend: ChartDataPoint[]): { inboundMessages: number; outboundMessages: number } => {
  const inboundMessages = trend.reduce((sum, point) => sum + point.inboundMessages, 0)
  const outboundMessages = trend.reduce((sum, point) => sum + point.outboundMessages, 0)
  return { inboundMessages, outboundMessages }
}

/**
 * 构建仪表盘数据
 */
const buildDashboardData = (): DashboardData => {
  const timeline = Array.from({ length: 14 }, (_, i) => {
    const now = Date.now()
    const dayMs = 24 * 60 * 60 * 1000
    return now - (13 - i) * dayMs
  })

  // 模拟 Bot 数据
  const bots: BotInfo[] = [
    {
      id: 'discord-bot-1',
      name: 'Discord Alpha',
      selfId: '10000001',
      adapterId: 'discord',
      avatarUrl: 'https://api.dicebear.com/9.x/shapes/svg?seed=DiscordAlpha',
      avatarFallback: 'DA',
      inboundMessages: 0,
      outboundMessages: 0,
      trend: generateBotTrend(355, 280),
    },
    {
      id: 'qq-bot-1',
      name: 'QQ Bot 01',
      selfId: '20000001',
      adapterId: 'qq',
      avatarUrl: 'https://api.dicebear.com/9.x/shapes/svg?seed=QQBot01',
      avatarFallback: 'Q1',
      inboundMessages: 0,
      outboundMessages: 0,
      trend: generateBotTrend(235, 186),
    },
  ]

  // 计算 Bot 总数
  bots.forEach(bot => {
    const summary = summarizeTrend(bot.trend)
    bot.inboundMessages = summary.inboundMessages
    bot.outboundMessages = summary.outboundMessages
  })

  // 按适配器分组
  const discordBots = bots.filter(bot => bot.adapterId === 'discord')
  const qqBots = bots.filter(bot => bot.adapterId === 'qq')

  // 聚合趋势
  const discordTrend = aggregateTrend(discordBots.map(bot => bot.trend), timeline)
  const qqTrend = aggregateTrend(qqBots.map(bot => bot.trend), timeline)
  const chartData = aggregateTrend([discordTrend, qqTrend], timeline)

  const discordSummary = summarizeTrend(discordTrend)
  const qqSummary = summarizeTrend(qqTrend)

  const inboundPackets = discordSummary.inboundMessages + qqSummary.inboundMessages
  const outboundPackets = discordSummary.outboundMessages + qqSummary.outboundMessages

  return {
    metrics: {
      cpuLoad: Math.random() * 10 + 12,
      cpuLoadChange: Math.random() * 4 - 2,
      memoryUsage: Math.random() * 1.4 + 1.8,
      memoryTotal: 8,
      memoryHistory: Array.from({ length: 10 }, () => Math.floor(Math.random() * 55 + 35)),
      totalPackets: inboundPackets + outboundPackets,
      inboundPackets,
      outboundPackets,
    },
    chartData,
    adapters: [
      {
        id: 'discord',
        name: 'Discord',
        status: 'connected',
        inboundMessages: discordSummary.inboundMessages,
        outboundMessages: discordSummary.outboundMessages,
        trend: discordTrend,
        bots: discordBots,
      },
      {
        id: 'qq',
        name: 'QQ Protocol',
        status: 'connected',
        inboundMessages: qqSummary.inboundMessages,
        outboundMessages: qqSummary.outboundMessages,
        trend: qqTrend,
        bots: qqBots,
      },
    ],
  }
}

/**
 * 构建实时仪表盘数据
 */
const buildDashboardRealtimeData = (): DashboardRealtimeData => {
  const dashboardData = buildDashboardData()
  const startTimestamp = Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000
  const uptimeMilliseconds = Date.now() - startTimestamp
  const days = Math.max(0, Math.floor(uptimeMilliseconds / (24 * 60 * 60 * 1000)))
  const hours = Math.max(0, Math.floor((uptimeMilliseconds % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000)))

  return {
    version: `v${Math.floor(Math.random() * 4) + 2}.${Math.floor(Math.random() * 13)}.${Math.floor(Math.random() * 30)}`,
    pluginCount: Math.floor(Math.random() * 175) + 5,
    metrics: dashboardData.metrics,
    runtime: {
      startTimestamp,
      days,
      hours,
    },
    adapters: dashboardData.adapters,
  }
}

/**
 * 获取仪表盘趋势数据
 */
export const getDashboardTrendRouter: RequestHandler = (_req, res) => {
  const response: ApiResponse<DashboardData> = {
    code: 0,
    message: 'success',
    data: buildDashboardData(),
  }
  res.json(response)
}

/**
 * 获取仪表盘实时流数据 (SSE)
 */
export const getDashboardRealtimeStreamRouter: RequestHandler = (_req, res) => {
  res.setHeader('Content-Type', 'text/event-stream')
  res.setHeader('Cache-Control', 'no-cache')
  res.setHeader('Connection', 'keep-alive')
  res.flushHeaders?.()

  const pushRealtimeData = (): void => {
    const payload: ApiResponse<DashboardRealtimeData> = {
      code: 0,
      message: 'success',
      data: buildDashboardRealtimeData(),
    }
    res.write(`data: ${JSON.stringify(payload)}\n\n`)
  }

  pushRealtimeData()
  const timer = setInterval(pushRealtimeData, 1000)

  _req.on('close', () => {
    clearInterval(timer)
    res.end()
  })
}
