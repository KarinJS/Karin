import path from 'node:path'
import { core } from '../core'
import { requireFile } from '@karinjs/utils'
import type { PluginPackageType } from '../pkg'
import type { PluginCacheKeyPkg } from '../decorators/base'

export type GetPluginReturn<T extends boolean> = T extends true ? PluginCacheKeyPkg[] : string[]

export type GetPluginLocalReturn<T extends boolean, R extends boolean> = T extends true
  ? PluginCacheKeyPkg[]
  : R extends true ? { name: string, type: PluginPackageType }[] : string[]

/**
 * 获取插件
 * @param type 获取插件的方式
 * @param isInfo 是否获取插件详细信息，否则返回插件名称列表
 * @param isForce 是否强制更新缓存
 * @returns 插件列表或详细信息
 * @version 1.0.0
 * ```json // 注意 返回非详细信息时候，插件名称会附带类型前缀
 * [
 *  "npm:plugin-name",
 *  "git:plugin-name",
 *  "apps:plugin-name"
 *  "root:plugin-name"
 * ]
 * ```
 */
export const getPlugins = async <T extends boolean = false> (
  type: PluginPackageType | 'all',
  isInfo?: T,
  isForce: boolean = false
): Promise<GetPluginReturn<T>> => {
  if (!isInfo) {
    const result = await core.promise.getPlugins(isForce)
    if (type === 'all') return result.all as GetPluginReturn<T>
    if (type === 'npm') return result.npm as GetPluginReturn<T>
    if (type === 'git') return result.git as GetPluginReturn<T>
    if (type === 'apps') return result.apps as GetPluginReturn<T>
    if (type === 'root') return result.root as GetPluginReturn<T>
    return []
  }

  const map = await core.promise.getPluginsMap(isForce)
  const list = Array.from(map.values())
  if (type === 'all') return list as GetPluginReturn<T>
  return list.filter(v => {
    const [t] = v.name.split(':')
    return t === type
  }) as GetPluginReturn<T>
}

/**
 * 判断是否为npm插件
 * @param name 包名称
 * @returns 是否为karin插件
 */
export const isNpmPlugin = async (name: string): Promise<boolean> => {
  try {
    const file = path.join(process.cwd(), 'node_modules', name, 'package.json')
    const pkg = await requireFile(file)
    return !!pkg.karin
  } catch {
    return false
  }
}
