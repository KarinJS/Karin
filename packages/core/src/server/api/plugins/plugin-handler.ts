import { getPlugins } from '@/plugin/list'
import { raceRequest } from './plugin-source'

import type { GetPluginType } from '@/types/plugin'
import type { KarinBase, OnlinePluginInfo } from '@/types/server/plugins'

/**
 * 构建raw url
 */
export const buildRawUrl = (plugin: KarinBase<'all'>[number]['repo'][number], github: (url: string) => string) => {
  const url = plugin.url.replace('.git', '')

  const urlMap = {
    github: () => {
      const rawUrl = url.replace('github.com', 'raw.githubusercontent.com')
      return github(`${rawUrl}/refs/heads/${plugin.branch}/package.json`)
    },
    gitee: () => `${url}/raw/${plugin.branch}/package.json`,
    gitlab: () => `${url}/raw/${plugin.branch}/package.json`,
    gitcode: () => {
      const rawUrl = url.replace('gitcode.com', 'raw.gitcode.com')
      return `${rawUrl}/raw/${plugin.branch}/package.json`
    },
    npm: () => '',
  }

  return urlMap?.[plugin.type]?.() ?? null
}

/**
 * 检查插件是否已安装
 */
export const checkPluginInstalled = async (name: string, type: GetPluginType): Promise<boolean> => {
  try {
    const plugins = await getPlugins(type, false)
    return plugins.some(plugin => plugin === name)
  } catch {
    return false
  }
}

/**
 * 处理 NPM 类型插件
 */
export const handleNpmPlugin = async (plugin: OnlinePluginInfo<'all'>['plugins'][number]) => {
  const urls = [
    `https://registry.npmmirror.com/${plugin.name}/latest`,
    `https://registry.npmjs.com/${plugin.name}/latest`,
  ]

  const registry = await raceRequest<Record<string, any>>(urls)
  logger.debug(`[插件列表] 获取 ${plugin.name} 的最新版本: ${JSON.stringify(registry)}`)
  const version = registry?.version ?? '-'
  const installed = await checkPluginInstalled(plugin.name, 'npm')

  return {
    ...plugin,
    version,
    installed,
  }
}

/**
 * 处理 Git 类型插件
 */
export const handleGitPlugin = async (
  plugin: OnlinePluginInfo<'all'>['plugins'][number],
  createUrl: (url: string) => string
) => {
  const installed = await checkPluginInstalled(plugin.name, 'git')
  const url = buildRawUrl(plugin.repo[0], createUrl)

  if (!url) {
    logger.error(`[插件列表] 无法获取 ${plugin.name} 的package.json`)
    return null
  }

  const pkg = await raceRequest<Record<string, any>>([url])
  logger.debug(`[插件列表] 获取 ${plugin.name} 的最新版本: ${JSON.stringify(pkg)}`)
  return {
    ...plugin,
    version: pkg?.version ?? '-',
    installed,
  }
}

/**
 * 处理 App 类型插件
 */
export const handleAppPlugin = async (plugin: OnlinePluginInfo<'all'>['plugins'][number]) => {
  return {
    ...plugin,
    version: '-',
    installed: false,
  }
}
