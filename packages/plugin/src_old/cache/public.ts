/**
 * 插件静态目录管理器
 * @description 提供插件 public 静态目录的获取和设置方法
 */
import type { PluginCacheStorage } from './default'

/**
 * 创建静态目录管理器
 * @param cache - 插件缓存存储对象
 * @returns 静态目录管理器对象
 */
export const createPublic = (cache: PluginCacheStorage) => {
  return {
    /**
     * 设置public静态目录
     * @param pluginName - 插件包名称
     * @param publicDir - 静态目录路径或路径数组
     * @example
     * ```ts
     * // 设置单个目录
     * public.set('karin-plugin-example', './dist/public')
     *
     * // 设置多个目录
     * public.set('karin-plugin-example', ['./dist/public', './public'])
     * ```
     */
    set: (pluginName: string, publicDir?: string | string[]) => {
      if (Array.isArray(publicDir)) {
        if (publicDir.length === 0) return
        /** 只会在初始化的时候设置一次 直接覆盖即可 */
        cache.public[pluginName] = publicDir
        return
      }

      if (typeof publicDir !== 'string' || publicDir.length === 0) return
      cache.public[pluginName] = [publicDir]
    },

    /**
     * 获取public静态目录
     * @param packageName - 插件包名称，若不传则返回整个public目录对象
     * @returns 静态目录路径数组或整个public目录对象
     * @example
     * ```ts
     * // 获取某个插件的public目录
     * const publicDirs = public.get('karin-plugin-example')
     * // -> ['./dist/public', './public']
     *
     * // 获取所有插件的public目录
     * const allPublicDirs = public.get('all')
     * // -> { 'plugin1': [...], 'plugin2': [...] }
     * ```
     */
    get: <T extends string | 'all'> (
      packageName?: T
    ): T extends 'all' ? PluginCacheStorage['public'] : string[] => {
      if (!packageName || packageName === 'all') return { ...cache.public } as T extends 'all' ? PluginCacheStorage['public'] : string[]
      return [...(cache.public[packageName] || [])] as T extends 'all' ? PluginCacheStorage['public'] : string[]
    },
  }
}
