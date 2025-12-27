/**
 * 插件列表管理器
 * @description 提供插件列表的获取和设置方法
 */
import type { PluginCacheStorage, PackageMetaInfoCache } from './default'
import type { PluginsTypes } from '../package'

/**
 * 创建插件列表管理器
 * @param cache - 插件缓存存储对象
 * @returns 插件列表管理器对象
 */
export const createList = (cache: PluginCacheStorage) => {
  return {
    /**
     * 获取插件包名称列表
     * @param type - 插件类型或 'all' 表示全部类型
     * @returns 插件包名称列表
     * @example
     * ```ts
     * // 获取 npm 类型的插件包名称列表
     * const npmPlugins = list.name('npm')
     * // -> ['karin-plugin-example', 'karin-plugin-another']
     *
     * // 获取所有类型的插件包名称列表，格式为 "type:name"
     * const allPlugins = list.name('all')
     * // -> ['npm:karin-plugin-example', 'git:karin-plugin-git-example', ...]
     * ```
     */
    name: (type: PluginsTypes | 'all'): string[] => {
      if (type === 'all') {
        const result = cache.list.all
        return result.map(item => `${item.type}:${item.name}`)
      }

      const result = cache.list[type]
      return result.map(item => item.name)
    },

    /**
     * 设置插件列表缓存
     * @param type - 插件类型
     * @param list - 插件包列表（单个或数组）
     * @example
     * ```ts
     * // 设置单个插件
     * list.set('npm', { name: 'karin-plugin-example', abs: '...', pkg: '...' })
     *
     * // 设置多个插件（覆盖）
     * list.set('npm', [
     *   { name: 'plugin1', abs: '...', pkg: '...' },
     *   { name: 'plugin2', abs: '...', pkg: '...' }
     * ])
     * ```
     */
    set: (type: PluginsTypes, list: PackageMetaInfoCache | PackageMetaInfoCache[]) => {
      if (Array.isArray(list)) {
        cache.list[type] = list
        return
      }

      cache.list[type].push(list)
    },

    /**
     * 获取插件列表缓存
     * @param type - 插件类型
     * @returns 插件包列表
     * @example
     * ```ts
     * const npmList = list.get('npm')
     * // -> [{ name: 'plugin1', abs: '...', pkg: '...' }, ...]
     *
     * const allList = list.get('all')
     * // -> [{ type: 'npm', name: 'plugin1', ... }, { type: 'git', name: 'plugin2', ... }, ...]
     * ```
     */
    get: <T extends PluginsTypes | 'all'> (
      type: T
    ): T extends 'all' ? PluginCacheStorage['list']['all'] : PackageMetaInfoCache[] => {
      return [...(type === 'all' ? cache.list.all : cache.list[type])] as T extends 'all' ? PluginCacheStorage['list']['all'] : PackageMetaInfoCache[]
    },
  }
}
