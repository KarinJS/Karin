import { router } from '../router'
import * as si from 'systeminformation'

import type { RequestHandler } from 'express'

// 存储上一次的网络数据，用于计算速率
const lastNetworkStats: Record<string, { rx_bytes: number; tx_bytes: number; timestamp: number }> = {}
// 存储总的网络数据
const totalStats = {
  totalReceived: 0,
  totalSent: 0
}

/**
 * 获取所有网卡的流量数据
 * @returns 网络流量数据
 */
async function getNetworkStats () {
  try {
    // 使用 systeminformation 库获取网络统计信息
    const networkStats = await si.networkStats()

    // 汇总所有网卡的数据
    const stats = { rx_bytes: 0, tx_bytes: 0 }

    for (const net of networkStats) {
      // 跳过回环接口
      if (net.iface === 'lo' || net.iface.includes('loopback')) continue

      stats.rx_bytes += net.rx_bytes
      stats.tx_bytes += net.tx_bytes
    }

    return stats
  } catch (error) {
    logger.error('获取网络统计信息失败:', error)
    return { rx_bytes: 0, tx_bytes: 0 }
  }
}

/**
 * 计算网络速率
 * @returns 上传和下载速率
 */
async function calculateNetworkSpeed () {
  const currentStats = await getNetworkStats()
  const now = Date.now()
  let upload = 0
  let download = 0

  // 计算总的网络数据
  if (totalStats.totalReceived === 0) {
    totalStats.totalReceived = currentStats.rx_bytes
    totalStats.totalSent = currentStats.tx_bytes
  }

  // 如果有上一次的数据，计算速率
  if (lastNetworkStats.total) {
    const timeDiff = (now - lastNetworkStats.total.timestamp) / 1000 // 转换为秒
    if (timeDiff > 0) {
      // 计算上传和下载速率（字节/秒）
      upload = Math.max(0, (currentStats.tx_bytes - lastNetworkStats.total.tx_bytes) / timeDiff)
      download = Math.max(0, (currentStats.rx_bytes - lastNetworkStats.total.rx_bytes) / timeDiff)

      // 更新总数据
      totalStats.totalSent = Math.max(totalStats.totalSent, currentStats.tx_bytes)
      totalStats.totalReceived = Math.max(totalStats.totalReceived, currentStats.rx_bytes)
    }
  }

  // 更新上一次的数据
  lastNetworkStats.total = {
    rx_bytes: currentStats.rx_bytes,
    tx_bytes: currentStats.tx_bytes,
    timestamp: now
  }

  return {
    upload: Math.round(upload),
    download: Math.round(download),
    totalSent: totalStats.totalSent,
    totalReceived: totalStats.totalReceived,
    timestamp: now
  }
}

/**
 * 网络状态 SSE 路由 - 使用 Server-Sent Events
 */
const networkStatusSSERouter: RequestHandler = async (_req, res) => {
  try {
    // 设置 SSE 相关的响应头
    res.setHeader('Content-Type', 'text/event-stream')
    res.setHeader('Cache-Control', 'no-cache')
    res.setHeader('Connection', 'keep-alive')
    res.flushHeaders() // 立即发送响应头

    // 发送初始数据
    const initialData = await calculateNetworkSpeed()
    res.write(`data: ${JSON.stringify(initialData)}\n\n`)

    // 设置定时器，每2秒发送一次数据
    const intervalId = setInterval(async () => {
      try {
        const networkSpeed = await calculateNetworkSpeed()
        res.write(`data: ${JSON.stringify(networkSpeed)}\n\n`)
      } catch (error) {
        logger.error('SSE 发送网络状态失败:', error)
        res.write(`data: ${JSON.stringify({
          upload: 0,
          download: 0,
          totalSent: totalStats.totalSent,
          totalReceived: totalStats.totalReceived,
          timestamp: Date.now(),
          error: true
        })}\n\n`)
      }
    }, 2000)

    // 当客户端断开连接时清除定时器
    res.on('close', () => {
      clearInterval(intervalId)
    })
  } catch (error) {
    logger.error('初始化网络状态 SSE 失败:', error)
    res.status(500).end()
  }
}

router.get('/status/network', networkStatusSSERouter)
