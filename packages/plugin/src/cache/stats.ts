/**
 * 插件统计管理器
 * @description 提供插件统计信息的获取方法
 */
import type { PluginCacheStorage } from './default'

/**
 * 创建统计管理器
 * @param cache - 插件缓存存储对象
 * @returns 统计管理器对象
 */
export const createStats = (cache: PluginCacheStorage) => {
  return {
    /**
     * 获取全局统计信息
     * @returns 统计信息对象（原始引用，可直接修改）
     * @example
     * ```ts
     * const stats = stats.get()
     * // -> { pkg: 10, command: 50, accept: 20, ... }
     * ```
     */
    get: () => {
      return cache.stats
    },
  }
}
