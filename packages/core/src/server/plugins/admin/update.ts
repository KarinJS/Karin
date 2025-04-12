import path from 'node:path'
import { isWorkspace } from '@/env'
import { exec } from '@/utils/system/exec'
import { getPlugins } from '@/plugin/list'
import { karinPathPlugins } from '@/root'
import { taskSystem as task } from '@/service/task'
import { validatePluginRequest, spawnProcess, handleReturn } from './tool'

import type { Response } from 'express'
import type { PluginAdminUpdate, TaskEntity } from '@/types/task'

/**
 * 更新插件
 *
 * 负责处理插件更新请求，支持两种更新模式：
 * 1. 更新所有插件 (isAll=true)
 * 2. 更新单个指定插件
 *
 * 更新过程：
 * 1. 验证请求参数
 * 2. 处理全部更新或单个更新逻辑
 * 3. 创建并启动更新任务
 * 4. 返回任务ID和操作结果
 *
 * @param res - 响应对象
 * @param data - 更新数据，包含插件名称、目标、类型等
 * @param ip - 操作者IP地址
 * @returns 操作响应
 */
export const update = async (
  res: Response,
  data: PluginAdminUpdate,
  ip: string = '0.0.0.0'
) => {
  if (!validatePluginRequest(res, data.name, data.target, data.pluginType, ['npm', 'git'])) {
    return
  }

  /** 更新全部插件 */
  if (data.isAll) {
    const id = await task.add(
      {
        type: 'update',
        name: data.name,
        target: 'all',
        operatorIp: ip,
      },
      updateAll
    )

    return handleReturn(res, true, '更新任务已创建，请通过taskId执行任务', id)
  }

  /** 检查插件是否存在 */
  const list = await getPlugins(data.pluginType)
  if (!list.some(v => v === data.target)) {
    return handleReturn(res, false, '无效请求: 插件不存在')
  }

  /**
   * 创建更新任务并返回响应
   *
   * 封装了创建任务和返回响应的通用逻辑，避免代码重复
   *
   * @param taskHandler - 任务处理函数，执行实际的更新操作
   * @returns 包含任务ID的响应
   */
  const createUpdateTask = async (taskHandler: (options: TaskEntity, emitLog: (message: string) => void) => Promise<boolean>) => {
    const id = await task.add(
      {
        type: 'update',
        name: data.name,
        target: data.target,
        operatorIp: ip,
      },
      taskHandler
    )

    return handleReturn(res, true, '更新任务已创建，请通过taskId执行任务', id)
  }

  /**
   * 处理不同类型插件的更新
   */
  if (data.pluginType === 'npm') {
    return createUpdateTask(async (options, emitLog) => {
      await spawnProcess('pnpm', ['update', data.target, '@latest', '--save'], {}, emitLog)
      return true
    })
  }

  if (data.pluginType === 'git') {
    return createUpdateTask(async (options, emitLog) => {
      await spawnProcess('git', ['pull'], { cwd: path.join(karinPathPlugins, data.target) }, emitLog)
      return true
    })
  }

  return handleReturn(res, false, '无效请求: 插件类型错误')
}

/**
 * 更新全部插件
 *
 * 同时更新所有npm和git类型的插件：
 * 1. 获取所有插件列表并按类型分类
 * 2. 对npm插件执行批量更新
 * 3. 对git插件逐个执行更新
 * 4. 记录更新过程的日志
 *
 * @param options - 任务参数，包含任务ID和相关信息
 * @param log - 日志函数，用于记录更新进度和结果
 * @returns 操作是否成功
 */
const updateAll = async (options: TaskEntity, log: (message: string) => void) => {
  /**
   * 将插件列表按类型分类
   * @returns 分类后的插件列表 {npm: string[], git: string[]}
   */
  const categorizePlugins = async () => {
    const list = await getPlugins('all', true, true)
    const git: string[] = []
    const npm: string[] = ['node-karin']

    for (const item of list) {
      if (item.type === 'npm') {
        npm.push(item.name)
      } else if (item.type === 'git') {
        git.push(item.name)
      }
    }

    return { npm, git }
  }

  /**
   * 更新所有NPM插件
   * @param npmPlugins - NPM插件列表
   */
  const updateNpmPlugins = async (npmPlugins: string[]) => {
    if (npmPlugins.length === 0) return

    log(`* 开始更新NPM插件，共${npmPlugins.length}个`)
    const args = ['update', npmPlugins.join('@latest '), '--save']
    if (isWorkspace()) args.unshift('-w')

    await spawnProcess('pnpm', args, {}, (msg) => {
      log(msg)
    })
  }

  /**
   * 更新单个Git插件
   * @param pluginName - 插件名称
   * @returns 更新结果的日志消息
   */
  const updateGitPlugin = async (pluginName: string): Promise<string> => {
    try {
      const { error, stdout, stderr } = await exec('git pull', {
        cwd: path.join(karinPathPlugins, pluginName),
        timeout: 60 * 1000,
      })

      if (error || stderr) {
        return `[${pluginName}] 更新失败: ${error?.stack || error?.message || stderr}`
      }

      return `[${pluginName}] 更新完成: ${stdout}`
    } catch (error) {
      logger.error(error)
      return `[${pluginName}] 更新失败: ${error instanceof Error ? error.message : String(error)}`
    }
  }

  /**
   * 更新所有Git插件
   * @param gitPlugins - Git插件列表
   */
  const updateGitPlugins = async (gitPlugins: string[]) => {
    if (gitPlugins.length === 0) return

    log(`* 开始更新Git插件，共${gitPlugins.length}个`)

    for (const item of gitPlugins) {
      const resultMessage = await updateGitPlugin(item)
      log(resultMessage)
    }

    log('全部git插件更新完成')
  }

  // 主流程执行
  const { npm, git } = await categorizePlugins()
  await Promise.all([
    updateNpmPlugins(npm),
    updateGitPlugins(git),
  ])

  return true
}
