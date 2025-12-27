/**
 * 插件环境变量管理器
 * @description 提供插件环境变量的获取和设置方法
 */
import type { PluginCacheStorage } from './default'
import type { PackageEnv } from '../config'

/**
 * 创建环境变量管理器
 * @param cache - 插件缓存存储对象
 * @returns 环境变量管理器对象
 */
export const createEnvs = (cache: PluginCacheStorage) => {
  return {
    /**
     * 设置插件环境变量
     * @param packageName - 插件包名称
     * @param envs - 环境变量对象
     * @example
     * ```ts
     * envs.set('karin-plugin-example', {
     *   KEY: { value: 'value', comment: '示例环境变量' }
     * })
     * ```
     */
    set: (packageName: string, envs: PackageEnv) => {
      cache.envs[packageName] = envs
    },

    /**
     * 获取插件环境变量
     * @param packageName - 插件包名称，若不传则返回所有插件环境变量对象
     * @returns 插件环境变量对象或所有插件环境变量对象
     * @example
     * ```ts
     * // 获取某个插件的环境变量
     * const envs = envs.get('karin-plugin-example')
     * // -> { KEY: { value: 'value', comment: '示例环境变量' } }
     *
     * // 获取所有插件的环境变量
     * const allEnvs = envs.get('all')
     * // -> { 'plugin1': {...}, 'plugin2': {...} }
     * ```
     */
    get: <T extends string | 'all'> (
      packageName?: T
    ): T extends 'all' ? Record<string, PackageEnv> : PackageEnv | null => {
      if (!packageName || packageName === 'all') return { ...cache.envs } as T extends 'all' ? Record<string, PackageEnv> : PackageEnv | null
      return (cache.envs[packageName] || null) as T extends 'all' ? Record<string, PackageEnv> : PackageEnv | null
    },
  }
}
