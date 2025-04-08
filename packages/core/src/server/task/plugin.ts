import { isWorkspace } from '@/env'
import { raceRequest } from '@/utils'
import { getPluginMarket } from '@/plugin/market'
import type {
  PluginAdminCustomInstallParams,
  PluginAdminInstall,
  PluginAdminMarketInstall,
} from '@/types/task'

/**
 * 安装插件任务参数转换spawn
 */
export const taskPluginInstallSpawn = (
  params: PluginAdminInstall
): Promise<{ cmd: string, args: string[], cwd: string }> => {
  if (params.source === 'market') {
    return handlePluginMarketInstall(params)
  }

  return handlePluginCustomInstall(params)
}

/**
 * 处理插件市场安装参数
 */
const handlePluginMarketInstall = async (params: PluginAdminMarketInstall) => {
  const market = await getPluginMarket(false)
  const plugin = market.find(item => item.name === params.target)
  if (!plugin) {
    throw new Error(`插件 ${params.target} 不存在`)
  }

  if (plugin.type === 'npm') {
    const args = ['install', plugin.name, '--save']
    if (isWorkspace()) args.push('-w')
    return {
      cmd: 'pnpm',
      args,
      cwd: process.cwd(),
    }
  }

  if (plugin.type === 'git') {
    /** 竞速 */
    const urls: string[] = []
    plugin.repo.forEach(v => {
      if (!v.type.includes('git')) return
      urls.push(v.url)
    })

    const repo = await raceRequest(urls, {
      method: 'HEAD',
      timeout: 5000,
    })

    if (repo?.status !== 200) {
      throw new Error(`插件 ${plugin.name} 克隆失败`)
    }

    const args = ['clone', '--depth=1', repo.config.url!, `./plugins/${plugin.name}`]
    return {
      cmd: 'git',
      args,
      cwd: process.cwd(),
    }
  }

  // 这里不会走到的 因为App类型的插件已经在外部处理了
  throw new Error(`插件 ${plugin.name} 类型错误`)
}

/**
 * 处理自定义安装参数插件
 */
const handlePluginCustomInstall = async (params: PluginAdminCustomInstallParams) => {
  if (params.pluginType === 'npm') {
    const args = [
      'install',
      params.version ? `${params.target}@${params.version}` : params.target,
      '--save',
    ]
    if (isWorkspace()) args.push('-w')
    if (params.registry) args.push(`--registry=${params.registry}`)

    return {
      cmd: 'pnpm',
      args,
      cwd: process.cwd(),
    }
  }

  if (params.pluginType === 'git') {
    const repo = params.repo
    const args = [
      'clone',
      '--depth=1',
      params.branch ? `-b ${params.branch}` : '',
      repo,
      `./plugins/${params.customName || params.target}`,
    ].filter(Boolean)

    return {
      cmd: 'git',
      args,
      cwd: process.cwd(),
    }
  }

  throw new Error(`插件 ${params.target} 类型错误`)
}
