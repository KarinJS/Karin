import path from 'node:path'
import { AxiosError } from 'axios'
import { isWorkspace } from '@/env'
import { handleReturn, spawnProcess } from './tool'
import { karinPathPlugins } from '@/root'
import { getFastGithub, raceRequest } from '@/utils/request'
import { mkdirSync } from '@/utils/fs/fsSync'
import { downloadFile } from '@/utils/fs/file'
import { taskSystem as task } from '@/service/task'
import { getPluginMarket } from '@/plugin/system'
import { pkgHotReload } from '@/plugin/admin/load'

import type { Response } from 'express'
import type { KarinPluginType } from '@karinjs/plugins-list'
import type { PluginAdminMarketInstall, PluginAdminMarketInstallApp, TaskEntity } from '@/types/task'

/**
 * 插件市场安装
 * @param res - 响应对象
 * @param data - 安装数据，包含插件名称、目标、类型等
 * @param ip - 操作者IP地址
 * @returns 操作响应
 */
export const installMarket = async (
  res: Response,
  data: PluginAdminMarketInstall,
  ip: string
) => {
  /** tips: 不可以走缓存获取列表哦 */
  const market = await getPluginMarket(true)
  const plugin = market.plugins.find(item => item.name === data.target)
  if (!plugin) {
    return handleReturn(
      res, false, '插件包不存在'
    )
  }

  if (data.pluginType === 'app' && plugin.type === 'app') {
    return installApp(res, plugin, data, ip)
  }

  if (data.pluginType === 'npm' && plugin.type === 'npm') {
    return installNpm(res, plugin, data, ip)
  }

  if (data.pluginType === 'git' && plugin.type === 'git') {
    return installGit(res, plugin, data, ip)
  }
}

/**
 * 插件市场 安装NPM类型的插件
 * @param res - 响应对象
 * @param plugin - 插件信息
 * @param data - 安装数据，包含插件名称、目标、类型等
 * @param ip - 操作者IP地址
 * @returns 操作响应
 */
const installNpm = async (
  res: Response,
  _: KarinPluginType & { type: 'npm' },
  data: PluginAdminMarketInstall,
  ip: string
) => {
  /**
   * 创建安装任务并执行
   */
  const id = await task.add(
    {
      type: 'install',
      name: data.name,
      target: data.target,
      operatorIp: ip,
    },
    async (_: TaskEntity, emitLog: (message: string) => void) => {
      const args = ['add', data.target, '--save']
      if (isWorkspace()) args.push('-w')

      /** 处理 ERR_PNPM_PUBLIC_HOIST_PATTERN_DIFF 错误 */
      let isERR_PNPM_PUBLIC_HOIST_PATTERN_DIFF = false

      await spawnProcess('pnpm', args, {}, emitLog, () => {
        isERR_PNPM_PUBLIC_HOIST_PATTERN_DIFF = true
      })

      if (isERR_PNPM_PUBLIC_HOIST_PATTERN_DIFF) {
        emitLog('检测到 ERR_PNPM_PUBLIC_HOIST_PATTERN_DIFF 错误，尝试修复...')
        emitLog('执行 pnpm install -f 强制重建模块目录')
        /** 先执行 pnpm install -f 强制重建模块目录 */
        await spawnProcess('pnpm', ['install', '-f'], {}, emitLog)
        emitLog('模块目录重建完成，重新尝试安装插件')
        /** 重新尝试安装 */
        await spawnProcess('pnpm', args, {}, emitLog)
        emitLog('安装完成，尝试加载插件')
      }

      await pkgHotReload('npm', data.target)
      return true
    })

  return handleReturn(
    res, true, '安装任务已创建，请通过taskId执行任务', id
  )
}

/**
 * 插件市场 安装Git类型的插件
 * @param res - 响应对象
 * @param plugin - 插件信息
 * @param data - 安装数据，包含插件名称、目标、类型等
 * @param ip - 操作者IP地址
 * @returns 操作响应
 */
const installGit = async (
  res: Response,
  plugin: KarinPluginType & { type: 'git' },
  data: PluginAdminMarketInstall,
  ip: string
) => {
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
    return handleReturn(
      res, false, '测试访问仓库失败，请检查当前网络环境是否正常'
    )
  }

  /**
   * 创建安装任务并执行
   */
  const id = await task.add(
    {
      type: 'install',
      name: data.name,
      target: data.target,
      operatorIp: ip,
    },
    async (_: TaskEntity, emitLog: (message: string) => void) => {
      const args = ['clone', '--depth=1', repo.config.url!, `./plugins/${plugin.name}`]
      await spawnProcess(
        'git', args, {}, emitLog
      )
      await pkgHotReload('git', plugin.name)
      return true
    }
  )

  return handleReturn(
    res, true, '安装任务已创建，请通过taskId执行任务', id
  )
}

/**
 * 插件市场 安装app类型的插件
 * @param res - 响应对象
 * @param plugin - 插件信息
 * @param data - 安装数据，包含插件名称、目标、类型等
 * @param ip - 操作者IP地址
 * @returns 操作响应
 */
const installApp = async (
  res: Response,
  plugin: KarinPluginType & { type: 'app' },
  data: PluginAdminMarketInstallApp,
  ip: string
) => {
  if (!data.urls || !Array.isArray(data.urls)) {
    return handleReturn(
      res, false, 'app插件名称不能为空'
    )
  }

  /** 排除掉files中 不存在插件市场的文件 */
  let urls = plugin.files.filter(item => data.urls.includes(item.url))

  if (!urls.length) {
    return handleReturn(
      res, false, '请传递正确的app插件名称'
    )
  }

  let isRace = false

  /** 对每个url进行判断 如果是github的 竞速换源 */
  for (const app of urls) {
    if (app.url.startsWith('https://raw.githubusercontent.com')) {
      isRace = true
      break
    }
  }

  if (isRace) {
    const result = await getFastGithub('raw')
    urls = urls.map(item => {
      return {
        ...item,
        url: item.url.startsWith('https://raw.githubusercontent.com')
          ? result.raw(item.url)
          : item.url,
      }
    })
  }

  /**
   * 创建安装任务并执行
   */
  const id = await task.add(
    {
      type: 'install',
      name: data.name,
      target: data.target,
      operatorIp: ip,
    },
    async (_: TaskEntity, emitLog: (message: string) => void) => {
      const msg = ['安装任务执行中']
      /** 插件目录 统一下载到这里方便管理 */
      const dir = path.join(karinPathPlugins, 'karin-plugin-example')
      mkdirSync(dir)

      emitLog('开始下载插件文件...')
      await Promise.all(urls.map(async (app) => {
        const filename = path.basename(app.url)
        const fileUrl = path.join(dir, filename)

        emitLog(`正在下载: ${filename}`)
        const result = await downloadFile(app.url, fileUrl)
        if (!result.success) {
          let err = `${filename} 下载失败: `
          if (result.data instanceof AxiosError) {
            err += result.data.message
          } else if (result.data instanceof Error) {
            err += result.data.message || result.data.stack || '未知错误'
          } else {
            err += String(result.data)
          }

          logger.error(`[install] 下载app插件失败:\n  url: ${app.url}\n  message: ${err}`)
          msg.push(err)
          emitLog(err)
          return
        }

        msg.push(`${app.url} 下载成功`)
        emitLog(`${app.url} 下载成功`)
      }))

      emitLog('安装完成')
      return true
    }
  )

  return handleReturn(
    res, true, '安装任务已创建，请通过taskId执行任务', id
  )
}
