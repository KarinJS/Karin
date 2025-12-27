/**
 * 插件市场获取
 * @module marketplace/market
 */

import type { KarinPluginType } from './types'

/** 插件源地址列表 */
const PLUGIN_SOURCES = [
  'https://registry.npmmirror.com/@karinjs/plugins-list/latest',
  'https://registry.npmjs.com/@karinjs/plugins-list/latest',
  'https://mirrors.cloud.tencent.com/npm/@karinjs/plugins-list/latest',
]

/** 缓存有效期 默认12小时 */
const CACHE_TTL = process.env.PLUGIN_MARKET_CACHE_TTL ? Number(process.env.PLUGIN_MARKET_CACHE_TTL) : 12 * 60 * 60

/** Redis 缓存键 */
const REDIS_PLUGIN_LIST_CACHE_KEY = 'karin:plugins:list'

/**
 * 竞速请求 - 返回最先成功的响应
 */
async function raceRequest<T> (urls: string[]): Promise<T | null> {
  const controller = new AbortController()

  const requests = urls.map(async (url) => {
    try {
      const response = await fetch(url, {
        signal: controller.signal,
        headers: { Accept: 'application/json' },
      })
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      const data = await response.json() as T
      controller.abort() // 取消其他请求
      return data
    } catch {
      return null
    }
  })

  const results = await Promise.allSettled(requests)
  for (const result of results) {
    if (result.status === 'fulfilled' && result.value !== null) {
      return result.value
    }
  }
  return null
}

/**
 * 获取插件市场
 * @param forceUpdate - 是否强制从远程获取，忽略缓存
 * @returns 返回最先成功响应的插件列表
 */
export const getPluginMarket = async (forceUpdate = false): Promise<{ plugins: KarinPluginType[] }> => {
  // 尝试从 Redis 缓存获取
  let redis: any = null
  try {
    const db = await import('@karinjs/db')
    redis = db.redis
  } catch {
    // @karinjs/db 是可选依赖
  }

  if (!forceUpdate && redis) {
    try {
      const cachedData = await redis.get(REDIS_PLUGIN_LIST_CACHE_KEY)
      if (cachedData) {
        const data = JSON.parse(cachedData)
        if (data) return data
      }
    } catch {
      // 缓存读取失败，继续从远程获取
    }
  }

  const results = await raceRequest<{ plugins: KarinPluginType[] }>(PLUGIN_SOURCES)
  if (!results) throw new Error('无法从任何源获取插件列表')

  // 规范化类型
  results.plugins = results.plugins.map(v => {
    const type = (v as any).type === 'app' ? 'apps' : v.type
    return { ...v, type } as KarinPluginType
  })

  // 缓存到 Redis
  if (redis) {
    try {
      await redis.set(REDIS_PLUGIN_LIST_CACHE_KEY, JSON.stringify(results), { EX: CACHE_TTL })
    } catch {
      // 缓存写入失败，忽略
    }
  }

  return results
}
