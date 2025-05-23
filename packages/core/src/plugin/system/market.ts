import { REDIS_PLUGIN_LIST_CACHE_KEY } from '@/env/key'
import { raceRequest } from '@/utils/request'
import type { KarinPluginType } from '@/types/plugin/market'

/** 插件源地址列表 */
const PLUGIN_SOURCES = [
  'https://registry.npmmirror.com/@karinjs/plugins-list/latest',
  'https://registry.npmjs.com/@karinjs/plugins-list/latest',
  'https://mirrors.cloud.tencent.com/npm/@karinjs/plugins-list/latest',
]

/** 缓存有效期 默认12小时 */
const CACHE_TTL = process.env.PLUGIN_MARKET_CACHE_TTL ? Number(process.env.PLUGIN_MARKET_CACHE_TTL) : 12 * 60 * 60

/**
 * 获取插件市场
 * @param forceUpdate - 是否强制从远程获取，忽略缓存
 * @returns 返回最先成功响应的插件列表
 */
export const getPluginMarket = async (forceUpdate = false): Promise<{ plugins: KarinPluginType[] }> => {
  const { redis } = await import('@/core/db/redis/redis')
  if (!forceUpdate) {
    const cachedData = await redis.get(REDIS_PLUGIN_LIST_CACHE_KEY)
    if (cachedData) {
      const data = JSON.parse(cachedData)
      if (data) return data
    }
  }

  const results = await raceRequest<null, { plugins: KarinPluginType[] }>(PLUGIN_SOURCES, { method: 'get' })
  if (!results) throw new Error('无法从任何源获取插件列表')

  await redis.set(REDIS_PLUGIN_LIST_CACHE_KEY, JSON.stringify(results.data), { EX: CACHE_TTL })
  logger.debug(`[插件列表] 数据已缓存，有效期${CACHE_TTL}秒`)

  return results.data
}
