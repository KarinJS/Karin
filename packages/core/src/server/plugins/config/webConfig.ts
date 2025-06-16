import fs from 'fs'
import path from 'path'
import { isDev } from '@/env'
import { imports } from '@/utils'
import { getPlugins } from '@/plugin/system/list'
import type { PkgInfo, PluginAdminListResponse } from '@/types'

/**
 * 传入插件名称 获取插件的web配置
 * @param name 插件名称
 */
export const getWebConfig = async (name: string): Promise<PluginAdminListResponse['webConfig']> => {
  const list = await getPlugins('all', true)
  const plugin = list.find(v => v.name === name)
  if (!plugin) return defaultWebConfig()

  if (plugin.type === 'npm' || plugin.type === 'git') {
    const filepath = getWebConfigPath(plugin)
    if (!filepath) return defaultWebConfig()
    return getWebConfigMore(filepath)
  }

  return defaultWebConfig()
}

/**
 * 默认web.config参数
 */
export const defaultWebConfig = (
  exists?: boolean,
  path?: string,
  customComponent?: boolean,
  defaultComponent?: boolean
): PluginAdminListResponse['webConfig'] => {
  return {
    exists: exists ?? false,
    path: path || '',
    customComponent: customComponent ?? false,
    defaultComponent: defaultComponent ?? false,
  }
}

/**
 * 获取web.config文件绝对路径
 */
const getWebConfigPath = (plugin: PkgInfo) => {
  const dev = isDev()
  const pkg = plugin.pkgData

  if (!pkg.karin?.web) return null

  if (dev) {
    if (!pkg.karin['ts-web']) return null
    const filepath = path.join(plugin.dir, pkg.karin['ts-web'])
    if (!fs.existsSync(filepath)) return null
    return filepath
  }

  const filepath = path.join(plugin.dir, pkg.karin.web)
  if (!fs.existsSync(filepath)) return null
  return filepath
}

/**
 * 存在web.config文件 获取更多信息
 * @param filepath web.config文件绝对路径
 */
const getWebConfigMore = async (filepath: string) => {
  try {
    const web = await imports(filepath, { isImportDefault: true, isRefresh: isDev() })
    return defaultWebConfig(
      true,
      filepath,
      typeof web?.customComponent === 'function',
      typeof web?.components === 'function'
    )
  } catch (error) {
    logger.error(new Error('获取插件web.config文件失败', { cause: error }))
    return defaultWebConfig()
  }
}
