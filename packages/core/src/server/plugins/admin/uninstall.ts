import fs from 'node:fs'
import path from 'node:path'
import { exec } from '@/utils/system/exec'
import { getPlugins } from '@/plugin/list'
import { karinPathPlugins } from '@/root'
import { taskSystem as task } from '@/service/task'
import { validatePluginRequest, createOperationResult, safelyExecuteFileOperation, handleReturn } from './tool'

import type { PluginAdminParams } from '@/types/task'
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
  target: string,
  pluginType: PluginAdminParams['pluginType'],
  operatorIp: string = '0.0.0.0'
) => {
  if (!validatePluginRequest(res, name, target, pluginType, ['npm', 'git', 'app'])) {
    return
  }

  /** 检查插件是否存在 */
  const list = await getPlugins(pluginType)
  if (!list.some(v => v === name)) {
    return handleReturn(res, false, '无效请求: 插件不存在')
  }

  let message = ''

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
  const performUninstall = async () => {
    if (pluginType === 'npm') {
      const { error, stdout, stderr } = await exec(`pnpm remove ${name}`, { timeout: 60 * 1000 })

      return error || stderr
        ? createOperationResult(false, error?.stack || error?.message || stderr, '卸载')
        : createOperationResult(true, stdout, '卸载')
    }

    if (pluginType === 'git') {
      return safelyExecuteFileOperation(async () => {
        await fs.promises.rm(path.join(karinPathPlugins, name), { recursive: true, force: true })
        return ''
      }, '卸载')
    }

    if (target.includes('..')) {
      return createOperationResult(false, '无效请求: 路径穿越', '卸载')
    }

    return safelyExecuteFileOperation(async () => {
      const [pkg, file] = target.split(':')
      await fs.promises.rm(path.join(karinPathPlugins, pkg, file), { recursive: true, force: true })
      return ''
    }, '卸载')
  }

  /**
   * 创建并执行卸载任务
   */
  const id = await task.add(
    {
      type: 'uninstall',
      name,
      target,
      operatorIp,
    },
    async (options) => {
      const result = await performUninstall()
      message = result.message
      await task.update.logs(options.id, result.message)
      return result.success
    }
  )

  const success = await task.run(id)
  return handleReturn(res, success, message)
}
