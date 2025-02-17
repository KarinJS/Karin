import { redis } from '@/index'
import type { PluginLists } from '@/types/server/plugins'

const CACHE_KEY = 'karin:web:plugin:list'
const CACHE_EXPIRE = 300 // 5分钟缓存

/**
 * 获取插件列表缓存
 */
export const getPluginListCache = async (): Promise<PluginLists[] | null> => {
  try {
    const cached = await redis.get(CACHE_KEY)
    if (!cached) return null
    return JSON.parse(cached)
  } catch (error) {
    logger.error('获取插件列表缓存失败:', error)
    return null
  }
}

/**
 * 设置插件列表缓存
 */
export const setPluginListCache = async (plugins: PluginLists[]): Promise<void> => {
  try {
    await redis.set(CACHE_KEY, JSON.stringify(plugins), { EX: CACHE_EXPIRE })
  } catch (error) {
    logger.error('设置插件列表缓存失败:', error)
  }
}

/**
 * 删除插件列表缓存
 */
export const deletePluginListCache = async (): Promise<void> => {
  try {
    await redis.del(CACHE_KEY)
  } catch (error) {
    logger.error('删除插件列表缓存失败:', error)
  }
}

/**
 * 分页处理插件列表
 */
export const paginatePlugins = (plugins: PluginLists[], page: number, pageSize: number): PluginLists[] => {
  const start = (page - 1) * pageSize
  const end = start + pageSize
  return plugins.slice(start, end)
}
