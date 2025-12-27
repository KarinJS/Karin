import type { PluginCacheStorage, PluginEngines } from './default'

/**
 * 创建插件注册器
 * @param cache - 插件缓存存储对象
 * @returns 插件注册器对象
 */
export const createSettings = (cache: PluginCacheStorage) => {
  return {
    /**
     * 设置插件引擎配置
     * @param name - 插件包名称
     * @param value - 配置值
     */
    set: (name: string, value: PluginCacheStorage['engines'][string]) => {
      cache.engines[name] = value
    },
    /**
     * 获取插件引擎配置
     * @param name - 插件包名称，若不传则返回所有插件引擎配置对象
     * @returns 插件引擎配置对象或所有插件引擎配置对象
     */
    get: <T extends string | 'all'> (
      name?: T
    ): T extends 'all' ? Record<string, PluginEngines> : PluginEngines | null => {
      if (!name || name === 'all') {
        return { ...cache.engines } as T extends 'all' ? Record<string, PluginEngines> : PluginEngines | null
      }
      return (cache.engines[name] || null) as T extends 'all' ? Record<string, PluginEngines> : PluginEngines | null
    },
  }
}
