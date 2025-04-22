import fs from 'node:fs'
import path from 'node:path'
import { getPlugins } from '@/plugin/system/list'
import { karinPathPlugins } from '@/root'
import { taskSystem as task } from '@/service/task'
import { handleReturn, spawnProcess } from './tool'

import type { PluginAdminUninstall } from '@/types/task'
import type { Response } from 'express'

/**
 * 卸载插件
 *
 * 根据插件类型执行不同的卸载操作：
 * - npm: 使用pnpm remove命令卸载npm包
 * - git: 删除插件目录
 * - app: 删除特定的应用文件
 *
 * 过程：
 * 1. 验证请求参数
 * 2. 检查插件是否存在
 * 3. 创建并执行卸载任务
 * 4. 返回操作结果
 *
 * @param res - 响应对象
 * @param name - 插件名称
 * @param target - 插件目标
 * @param pluginType - 插件类型 (npm/git/app)
 * @param operatorIp - 操作者IP地址
 * @returns 操作响应
 */
export const uninstall = async (
  res: Response,
  name: string,
  target: PluginAdminUninstall['target'],
  operatorIp: string = '0.0.0.0'
) => {
  if (!Array.isArray(target) || target.length < 1) {
    return handleReturn(res, false, '无效请求: 插件目标错误')
  }

  /**
   * 执行不同类型插件的卸载操作
   *
   * 根据插件类型选择适当的卸载方法：
   * - npm包：使用pnpm remove
   * - git仓库：删除整个目录
   * - app应用：删除特定文件
   *
   * @returns 操作结果对象
   */
  const performUninstall = async (emitLog: (message: string) => void) => {
    const npm: string[] = []
    const git: string[] = []
    const app: string[] = []
    /** 记录不存在的插件 */
    const notExist: string[] = []

    /** 本地已安装插件列表 */
    const list = await getPlugins('all')

    target.forEach(async (v) => {
      if (v.type === 'npm') {
        list.includes(v.name) ? npm.push(v.name) : notExist.push(v.name)
        return
      }

      if (v.type === 'git') {
        list.includes(v.name) ? git.push(v.name) : notExist.push(v.name)
        return
      }

      if (v.type === 'app') {
        /** 等下直接判断路径更快 因为还需要判断路径穿越的问题 */
        app.push(v.name)
        return
      }

      notExist.push(v.name)
    })

    await spawnProcess('pnpm', ['remove', ...npm, '--save'], { timeout: 60 * 1000 }, emitLog)

    /** tips: 不要使用异步 */
    for (const v of git) {
      emitLog('-----------------------')
      emitLog(`开始卸载 git 插件: ${v}`)
      if (v.includes('..')) {
        emitLog(`卸载 ${v} 失败: 文件名称存在路径穿越风险`)
        continue
      }

      /** 判断git文件夹是否存在 */
      const dir = path.join(karinPathPlugins, v)
      if (!fs.existsSync(path.join(dir, '.git'))) {
        emitLog(`卸载 ${v} 失败: 非git仓库`)
        continue
      }

      try {
        await fs.promises.rm(dir, { recursive: true, force: true })
        emitLog(`卸载 ${v} 成功`)
      } catch (error) {
        emitLog(`卸载 ${v} 失败: ${(error as Error).message}`)
      }
      emitLog('-----------------------\n\n')
    }

    for (const v of app) {
      emitLog('-----------------------')
      emitLog(`开始卸载 app 插件: ${v}`)
      if (v.includes('..')) {
        emitLog(`卸载 ${v} 失败: 文件名称存在路径穿越风险`)
        continue
      }

      /** 判断app文件夹是否存在 */
      const [pkg, file] = v.split(':')
      if (!pkg || !file) {
        emitLog(`卸载 ${v} 失败: 格式错误`)
        continue
      }

      if (!list.includes(pkg)) {
        emitLog(`卸载 ${v} 失败: 插件不存在`)
        continue
      }

      const dir = path.join(karinPathPlugins, pkg)
      if (!fs.existsSync(path.join(dir, file))) {
        emitLog(`卸载 ${v} 失败: 文件不存在`)
        continue
      }

      /** 判断后缀 必须是.js .mjs .cjs .ts .cts .mts */
      const ext = path.extname(file)
      if (!['.js', '.mjs', '.cjs', '.ts', '.cts', '.mts'].includes(ext)) {
        emitLog(`卸载 ${v} 失败: 错误的文件类型`)
        continue
      }

      try {
        /** 这里是文件 不能使用rm函数 */
        await fs.promises.unlink(path.join(dir, file))
        emitLog(`卸载 ${v} 成功`)
      } catch (error) {
        emitLog(`卸载 ${v} 失败: ${(error as Error).message}`)
      }
      emitLog('-----------------------\n\n')
    }

    if (notExist.length) {
      notExist.unshift('以下插件不存在:')
      emitLog(notExist.join('\n') + '\n\n')
    }

    emitLog('卸载任务完成')
  }

  /**
   * 创建并执行卸载任务
   */
  const id = await task.add(
    {
      type: 'uninstall',
      name,
      target: target.map(v => `${v.type}:${v.name}`).join(','),
      operatorIp,
    },
    async (options, emitLog) => {
      try {
        await performUninstall(emitLog)
        await task.update.logs(options.id, '任务执行成功')
        return true
      } catch (error) {
        await task.update.logs(options.id, `任务执行失败: ${(error as Error).message}`)
        return false
      }
    }
  )

  const success = await task.run(id)
  return handleReturn(res, success, '卸载任务已创建，请通过taskId执行任务')
}
