import path from 'node:path'
import { AxiosError } from 'axios'
import { isWorkspace } from '@/env'
import { handleReturn, spawnProcess } from './tool'
import { karinPathPlugins } from '@/root'
import { mkdirSync } from '@/utils/fs/fsSync'
import { downloadFile } from '@/utils/fs/file'
import { taskSystem as task } from '@/service/task'
import { pkgHotReload } from '@/plugin/admin/load'

import type { Response } from 'express'
import type { PluginAdminCustomInstall, TaskEntity } from '@/types/task'

/**
 * 自定义安装
 * @param res - 响应对象
 * @param data - 安装数据，包含插件名称、目标、类型等
 * @param ip - 操作者IP地址
 * @returns 操作响应
 */
export const installCustom = async (
  res: Response,
  data: PluginAdminCustomInstall,
  ip: string
) => {
  if (data.pluginType === 'app') {
    return installApp(res, data, ip)
  }

  if (data.pluginType === 'npm') {
    return installNpm(res, data, ip)
  }

  if (data.pluginType === 'git') {
    return installGit(res, data, ip)
  }
}

/**
 * 自定义安装NPM类型的插件
 * @param res - 响应对象
 * @param data - 安装数据，包含插件名称、目标、类型等
 * @param ip - 操作者IP地址
 * @returns 操作响应
 */
const installNpm = async (
  res: Response,
  data: PluginAdminCustomInstall & { pluginType: 'npm' },
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
      /** 包名 */
      let pkg = data.target
      /** 自定义版本版本 */
      if (data.version) pkg += `@${data.version}`

      const args = ['add', pkg, '--save']
      if (isWorkspace()) args.push('-w')
      if (data.registry) args.push(`--registry=${data.registry}`)

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

      await pkgHotReload('npm', data.target)
      return true
    }
  )

  return handleReturn(res, true, '安装任务已创建，请通过taskId执行任务', id)
}

/**
 * 自定义安装Git类型的插件
 * @param res - 响应对象
 * @param data - 安装数据，包含插件名称、目标、类型等
 * @param ip - 操作者IP地址
 * @returns 操作响应
 */
const installGit = async (
  res: Response,
  data: PluginAdminCustomInstall & { pluginType: 'git' },
  ip: string
) => {
  const pkgName = data.target || path.basename(data.repo).replace('.git', '')
  if (!pkgName.startsWith('karin-plugin-')) {
    return handleReturn(res, false, '插件名称必须以karin-plugin-开头')
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
      const args = [
        data.branch ? `-b ${data.branch}` : '',
        'clone',
        '--depth=1',
        data.repo,
        `./plugins/${pkgName}`,
      ]
      await spawnProcess('git', args, {}, emitLog)
      await pkgHotReload('git', pkgName)
      return true
    }
  )

  return handleReturn(res, true, '安装任务已创建，请通过taskId执行任务', id)
}

/**
 * 自定义安装app类型的插件
 * @param res - 响应对象
 * @param data - 安装数据，包含插件名称、目标、类型等
 * @param ip - 操作者IP地址
 * @returns 操作响应
 */
const installApp = async (
  res: Response,
  data: PluginAdminCustomInstall & { pluginType: 'app' },
  ip: string
) => {
  if (!data.jsUrl) {
    return handleReturn(res, false, 'jsUrl不能为空')
  }

  /** 下载后的文件名称 */
  let filename = data.target || path.basename(data.jsUrl)
  if (!filename.endsWith('.js')) {
    filename += '.js'
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
      /** 插件目录 统一下载到这里方便管理 */
      const dir = path.join(karinPathPlugins, 'karin-plugin-example')
      const fileUrl = path.join(dir, filename)
      mkdirSync(dir)

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

  return handleReturn(res, true, '安装任务已创建，请通过taskId执行任务', id)
}
