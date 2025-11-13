import fs from 'node:fs'
import path from 'node:path'
import { AxiosError } from 'axios'
import { webuiDB } from '@karinjs/db'
import { spawnProcess } from './utils'
// import { getPluginMarket } from '@karinjs/plugin'
// @ts-ignore TODO
// import { reloadPackage } from '@/plugins/hmr'
import { karinPathPlugins } from '@karinjs/store'
import { isPnpm10, isWorkspace } from '@karinjs/envs'
// import { downloadFile, getFastGithub, raceRequest } from '@karinjs/utils'

import type { Response } from 'express'
import type { TaskEntity } from '@karinjs/db'
import type { PluginAdminInstall, PluginAdminCustomInstall, PluginAdminMarketInstall, PluginAdminMarketInstallApp } from './types'
// import type { KarinPluginType } from '@karinjs/plugin'

/**
 * 插件安装管理类
 * 负责处理插件的安装操作，包括市场安装和自定义安装
 */
export class PluginInstaller {
  /**
   * 安装插件
   * @param res - 响应对象
   * @param data - 安装数据，包含插件名称、目标、类型等
   * @param ip - 操作者IP地址
   * @returns 操作响应
   */
  public static async install (
    res: Response,
    data: PluginAdminInstall,
    ip: string = '0.0.0.0'
  ) {
    if (!this.validatePluginRequest(res, data.name, data.target, data.pluginType, ['npm', 'git', 'apps'])) {
      return
    }

    if (data.source === 'market') {
      return this.installMarket(res, data, ip)
    }

    if (data.source === 'custom') {
      return this.installCustom(res, data, ip)
    }

    return this.handleReturn(res, false, '无效的安装来源')
  }

  /**
   * 验证插件请求基本参数
   * @param res - 响应对象
   * @param name - 插件名称
   * @param target - 插件目标
   * @param pluginType - 插件类型
   * @param allowedTypes - 允许的插件类型
   * @returns 验证是否通过
   */
  private static validatePluginRequest (
    res: Response,
    name: string,
    target: string,
    pluginType: string,
    allowedTypes: string[]
  ): boolean {
    if (!name || !target) {
      this.handleReturn(res, false, '无效请求: 插件名称或任务名称不能为空')
      return false
    }

    if (!allowedTypes.includes(pluginType)) {
      this.handleReturn(res, false, '无效请求: 插件类型错误')
      return false
    }

    return true
  }

  /**
   * 处理安装、更新依赖响应
   * @param res - 响应对象
   * @param success - 是否成功
   * @param message - 消息
   * @param taskId - 任务ID
   * @returns 操作响应
   */
  static handleReturn (
    res: Response,
    success: boolean,
    message: string,
    taskId?: string
  ) {
    if (taskId) {
      return res.json({ success, message, taskId })
    }

    return res.json({ success, message })
  }

  /**
   * 自定义安装
   * @param res - 响应对象
   * @param data - 安装数据，包含插件名称、目标、类型等
   * @param ip - 操作者IP地址
   * @returns 操作响应
   */
  private static async installCustom (
    res: Response,
    data: PluginAdminCustomInstall,
    ip: string
  ) {
    if (data.pluginType === 'apps') {
      return this.installApp(res, data, ip)
    }

    if (data.pluginType === 'npm') {
      return this.installNpm(res, data, ip)
    }

    if (data.pluginType === 'git') {
      return this.installGit(res, data, ip)
    }
  }

  /**
   * 自定义安装NPM类型的插件
   * @param res - 响应对象
   * @param data - 安装数据，包含插件名称、目标、类型等
   * @param ip - 操作者IP地址
   * @returns 操作响应
   */
  private static async installNpm (
    res: Response,
    data: PluginAdminCustomInstall & { pluginType: 'npm' },
    ip: string
  ) {
    /**
     * 创建安装任务并执行
     */
    const id = await webuiDB.add(
      {
        type: 'install',
        name: data.name,
        target: data.target,
        operatorIp: ip,
      },
      async (_: TaskEntity, emitLog: (message: string) => void) => {
        /** 包名 */
        let pkg = data.target
        /** 自定义版本版本 */
        if (data.version) pkg += `@${data.version}`

        const args = ['add', pkg, '--save']
        if (isWorkspace()) args.push('-w')
        if (data.registry) args.push(`--registry=${data.registry}`)
        if (Array.isArray(data.allowBuild) && data.allowBuild.length && isPnpm10()) {
          data.allowBuild.forEach(pkg => args.unshift(`--allow-build=${pkg}`))
        }

        /** 处理 ERR_PNPM_PUBLIC_HOIST_PATTERN_DIFF 错误 */
        let IS_ERR_PNPM_PUBLIC_HOIST_PATTERN_DIFF = false

        await spawnProcess('pnpm', args, {}, emitLog, () => {
          IS_ERR_PNPM_PUBLIC_HOIST_PATTERN_DIFF = true
        })

        if (IS_ERR_PNPM_PUBLIC_HOIST_PATTERN_DIFF) {
          emitLog('检测到 ERR_PNPM_PUBLIC_HOIST_PATTERN_DIFF 错误，尝试修复...')
          emitLog('执行 pnpm install -f 强制重建模块目录')
          /** 先执行 pnpm install -f 强制重建模块目录 */
          await spawnProcess('pnpm', ['install', '-f'], {}, emitLog)
          emitLog('模块目录重建完成，重新尝试安装插件')
          /** 重新尝试安装 */
          await spawnProcess('pnpm', args, {}, emitLog)
          emitLog('安装完成，尝试加载插件')
        }

        await reloadPackage(data.target)
        return true
      }
    )

    return this.handleReturn(res, true, '安装任务已创建，请通过taskId执行任务', id)
  }

  /**
   * 自定义安装Git类型的插件
   * @param res - 响应对象
   * @param data - 安装数据，包含插件名称、目标、类型等
   * @param ip - 操作者IP地址
   * @returns 操作响应
   */
  private static async installGit (
    res: Response,
    data: PluginAdminCustomInstall & { pluginType: 'git' },
    ip: string
  ) {
    const pkgName = data.target || path.basename(data.repo).replace('.git', '')
    if (!pkgName.startsWith('karin-plugin-')) {
      return this.handleReturn(res, false, '插件名称必须以karin-plugin-开头')
    }

    /**
     * 创建安装任务并执行
     */
    const id = await webuiDB.add(
      {
        type: 'install',
        name: data.name,
        target: data.target,
        operatorIp: ip,
      },
      async (_: TaskEntity, emitLog: (message: string) => void) => {
        const args = [
          data.branch ? `-b ${data.branch}` : '',
          'clone',
          '--depth=1',
          data.repo,
          `./plugins/${pkgName}`,
        ]
        await spawnProcess('git', args, {}, emitLog)
        await reloadPackage(pkgName)
        return true
      }
    )

    return this.handleReturn(res, true, '安装任务已创建，请通过taskId执行任务', id)
  }

  /**
   * 自定义安装app类型的插件
   * @param res - 响应对象
   * @param data - 安装数据，包含插件名称、目标、类型等
   * @param ip - 操作者IP地址
   * @returns 操作响应
   */
  private static async installApp (
    res: Response,
    data: PluginAdminCustomInstall & { pluginType: 'apps' },
    ip: string
  ) {
    if (!data.jsUrl) {
      return this.handleReturn(res, false, 'jsUrl不能为空')
    }

    /** 下载后的文件名称 */
    let filename = data.target || path.basename(data.jsUrl)
    if (!filename.endsWith('.js')) {
      filename += '.js'
    }

    /**
     * 创建安装任务并执行
     */
    const id = await webuiDB.add(
      {
        type: 'install',
        name: data.name,
        target: data.target,
        operatorIp: ip,
      },
      async (_: TaskEntity, emitLog: (message: string) => void) => {
        /** 插件目录 统一下载到这里方便管理 */
        const dir = path.join(karinPathPlugins, 'karin-plugin-example')
        const fileUrl = path.join(dir, filename)
        fs.mkdirSync(dir, { recursive: true })

        emitLog(`开始下载插件文件: ${filename}`)
        const result = await downloadFile(data.jsUrl, fileUrl)
        if (!result.success) {
          let msg = 'app插件下载失败: '
          if (result.data instanceof AxiosError) {
            msg += result.data.message
          } else if (result.data instanceof Error) {
            msg += result.data.message || result.data.stack || '未知错误'
          } else {
            msg += String(result.data)
          }

          logger.error(`[install] 下载app插件失败:\n  url: ${data.jsUrl}\n  message: ${msg}`)
          emitLog(msg)
          return false
        }

        emitLog(`下载完成: ${data.jsUrl}`)
        return true
      }
    )

    return this.handleReturn(res, true, '安装任务已创建，请通过taskId执行任务', id)
  }

  /**
   * 插件市场安装
   * @param res - 响应对象
   * @param data - 安装数据，包含插件名称、目标、类型等
   * @param ip - 操作者IP地址
   * @returns 操作响应
   */
  private static async installMarket (
    res: Response,
    data: PluginAdminMarketInstall,
    ip: string
  ) {
    /** tips: 不可以走缓存获取列表哦 */
    const market = await getPluginMarket(true)
    const plugin = market.plugins.find(item => item.name === data.target)
    if (!plugin) {
      return this.handleReturn(res, false, '插件包不存在')
    }

    if (data.pluginType === 'apps' && plugin.type === 'apps') {
      return this.installMarketApp(res, plugin, data as PluginAdminMarketInstallApp, ip)
    }

    if (data.pluginType === 'npm' && plugin.type === 'npm') {
      if (Array.isArray(plugin.allowBuild) && plugin.allowBuild.length) {
        data.allowBuild = plugin.allowBuild
      }

      return this.installMarketNpm(res, plugin, data, ip)
    }

    if (data.pluginType === 'git' && plugin.type === 'git') {
      return this.installMarketGit(res, plugin, data, ip)
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
  private static async installMarketNpm (
    res: Response,
    _: KarinPluginType & { type: 'npm' },
    data: PluginAdminMarketInstall & { pluginType: 'npm' },
    ip: string
  ) {
    /**
     * 创建安装任务并执行
     */
    const id = await webuiDB.add(
      {
        type: 'install',
        name: data.name,
        target: data.target,
        operatorIp: ip,
      },
      async (_: TaskEntity, emitLog: (message: string) => void) => {
        const args = ['add', data.target, '--save']
        if (isWorkspace()) args.push('-w')
        if (Array.isArray(data.allowBuild) && data.allowBuild.length && isPnpm10()) {
          data.allowBuild.forEach(pkg => args.unshift(`--allow-build=${pkg}`))
        }

        /** 处理 ERR_PNPM_PUBLIC_HOIST_PATTERN_DIFF 错误 */
        let IS_ERR_PNPM_PUBLIC_HOIST_PATTERN_DIFF = false

        await spawnProcess('pnpm', args, {}, emitLog, () => {
          IS_ERR_PNPM_PUBLIC_HOIST_PATTERN_DIFF = true
        })

        if (IS_ERR_PNPM_PUBLIC_HOIST_PATTERN_DIFF) {
          emitLog('检测到 ERR_PNPM_PUBLIC_HOIST_PATTERN_DIFF 错误，尝试修复...')
          emitLog('执行 pnpm install -f 强制重建模块目录')
          /** 先执行 pnpm install -f 强制重建模块目录 */
          await spawnProcess('pnpm', ['install', '-f'], {}, emitLog)
          emitLog('模块目录重建完成，重新尝试安装插件')
          /** 重新尝试安装 */
          await spawnProcess('pnpm', args, {}, emitLog)
          emitLog('安装完成，尝试加载插件')
        }

        await reloadPackage(data.target)
        return true
      })

    return this.handleReturn(res, true, '安装任务已创建，请通过taskId执行任务', id)
  }

  /**
   * 插件市场 安装Git类型的插件
   * @param res - 响应对象
   * @param plugin - 插件信息
   * @param data - 安装数据，包含插件名称、目标、类型等
   * @param ip - 操作者IP地址
   * @returns 操作响应
   */
  private static async installMarketGit (
    res: Response,
    plugin: KarinPluginType & { type: 'git' },
    data: PluginAdminMarketInstall,
    ip: string
  ) {
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
      return this.handleReturn(res, false, '测试访问仓库失败，请检查当前网络环境是否正常')
    }

    /**
     * 创建安装任务并执行
     */
    const id = await webuiDB.add(
      {
        type: 'install',
        name: data.name,
        target: data.target,
        operatorIp: ip,
      },
      async (_: TaskEntity, emitLog: (message: string) => void) => {
        const args = ['clone', '--depth=1', repo.config.url!, `./plugins/${plugin.name}`]
        await spawnProcess('git', args, {}, emitLog)
        await reloadPackage(plugin.name)
        return true
      }
    )

    return this.handleReturn(res, true, '安装任务已创建，请通过taskId执行任务', id)
  }

  /**
   * 插件市场 安装app类型的插件
   * @param res - 响应对象
   * @param plugin - 插件信息
   * @param data - 安装数据，包含插件名称、目标、类型等
   * @param ip - 操作者IP地址
   * @returns 操作响应
   */
  private static async installMarketApp (
    res: Response,
    plugin: KarinPluginType & { type: 'apps' },
    data: PluginAdminMarketInstallApp,
    ip: string
  ) {
    if (!data.urls || !Array.isArray(data.urls)) {
      return this.handleReturn(res, false, 'app插件名称不能为空')
    }

    /** 排除掉files中 不存在插件市场的文件 */
    let urls = plugin.files.filter(item => data.urls.includes(item.url))

    if (!urls.length) {
      return this.handleReturn(res, false, '请传递正确的app插件名称')
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
    const id = await webuiDB.add(
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
        fs.mkdirSync(dir, { recursive: true })

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

    return this.handleReturn(res, true, '安装任务已创建，请通过taskId执行任务', id)
  }
}
