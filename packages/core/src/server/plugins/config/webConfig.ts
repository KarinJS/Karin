import fs from 'fs'
import path from 'path'
import { isDev, isTs } from '@/env'
import { imports } from '@/utils'
import { getPlugins } from '@/plugin/system/list'
import type { Icon, PkgInfo, PluginAdminListResponse } from '@/types'

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
  defaultComponent?: boolean,
  page?: boolean,
  icon?: Icon
): PluginAdminListResponse['webConfig'] => {
  return {
    exists: exists ?? false,
    path: path || '',
    customComponent: customComponent ?? false,
    defaultComponent: defaultComponent ?? false,
    page: page ?? false,
    icon: icon || {
      color: '',
      name: 'star',
      size: 16,
    },
  }
}

/**
 * 获取web.config文件绝对路径
 */
const getWebConfigPath = (plugin: PkgInfo) => {
  const pkg = plugin.pkgData

  if (!pkg?.karin) return null

  const getPath = (value?: string) => {
    if (!value) return null
    const filepath = path.join(plugin.dir, value)
    return fs.existsSync(filepath) ? filepath : null
  }

  /** npm插件处于安装态，即使开发环境也应读取发布产物 */
  if (plugin.type === 'npm' || plugin.dir.includes('node_modules')) {
    return getPath(pkg.karin.web)
  }

  /** 本地源码插件在TS运行时优先读取ts-web */
  if (isTs()) {
    const filepath = getPath(pkg.karin['ts-web'])
    if (filepath) return filepath
  }

  return getPath(pkg.karin.web)
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
      typeof web?.components === 'function',
      typeof web?.page === 'function' || typeof web?.page?.url === 'string',
      web?.info?.icon || web?.icon
    )
  } catch (error) {
    logger.error(new Error('获取插件web.config文件失败', { cause: error }))
    return defaultWebConfig()
  }
}
