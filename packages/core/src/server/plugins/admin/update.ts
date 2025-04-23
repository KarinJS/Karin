import path from 'node:path'
import { isWorkspace } from '@/env'
import { getPlugins } from '@/plugin/system/list'
import { karinPathPlugins } from '@/root'
import { taskSystem as task } from '@/service/task'
import { gitPull } from '@/utils/git/pull'
import { spawnProcess, handleReturn } from './tool'

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
  if (!Array.isArray(data.target) || (data.target.length < 1 && !data.isAll)) {
    return handleReturn(res, false, '无效请求: 插件目标错误')
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
      async (options, emitLog) => {
        await updateAll(options, emitLog, data.isAll)
        await task.update.logs(options.id, '任务执行成功')
        return true
      }
    )

    return handleReturn(res, true, '更新任务已创建，请通过taskId执行任务', id)
  }

  const performUpdate = async (_: TaskEntity, log: (message: string) => void) => {
    const npm: { name: string, version: string }[] = []
    const git: { name: string, version: string, force: boolean }[] = []
    /** 记录不存在的插件 */
    const notExist: string[] = []

    const list = await getPlugins('all', false, true)

    for (const item of data.target) {
      if (item.type === 'npm') {
        list.includes(item.name)
          ? npm.push({ name: item.name, version: item.version || 'latest' })
          : notExist.push(item.name)
        continue
      }

      if (item.type === 'git') {
        const force = typeof item.force === 'boolean' ? item.force : false
        list.includes(item.name)
          ? git.push({ name: item.name, version: item.version || 'latest', force })
          : notExist.push(item.name)
        continue
      }

      notExist.push(item.name)
    }

    if (npm.length > 0) {
      const args = npm.map(item => `${item.name}@${item.version}`)
      await spawnProcess('pnpm', ['update', ...args, '--save'], { timeout: 60 * 1000 }, log)
    }

    for (const item of git) {
      const { name, force } = item
      const cwd = path.join(karinPathPlugins, name)
      const result = await gitPull(cwd, { force, timeout: 60 * 1000 })

      if (result.status) {
        log(`更新 ${name}(git) 插件成功: ${result.hash.before} -> ${result.hash.after}`)
      } else {
        log(`更新 ${name}(git) 插件失败: ${result.data}`)
      }
    }

    return true
  }

  const id = await task.add(
    {
      type: 'update',
      name: data.name,
      target: data.target.map(item => `${item.type}:${item.name}`).join(','),
      operatorIp: ip,
    },
    async (options, emitLog) => {
      try {
        await performUpdate(options, emitLog)
        await task.update.logs(options.id, '任务执行成功')
        return true
      } catch (error) {
        await task.update.logs(options.id, `任务执行失败: ${(error as Error).message}`)
        return false
      }
    }
  )

  return handleReturn(res, true, '更新任务已创建，请通过taskId执行任务', id)
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
 * @param _ - 任务参数，包含任务ID和相关信息
 * @param log - 日志函数，用于记录更新进度和结果
 * @returns 操作是否成功
 */
const updateAll = async (
  _: TaskEntity,
  log: (message: string) => void,
  options: PluginAdminUpdate['isAll']
) => {
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
    if (isWorkspace()) args.push('-w')

    await spawnProcess('pnpm', args, {}, log)
  }

  /**
   * 更新单个Git插件
   * @param pluginName - 插件名称
   * @returns 更新结果的日志消息
   */
  const updateGitPlugin = async (pluginName: string): Promise<string> => {
    const cwd = path.join(karinPathPlugins, pluginName)
    const result = await gitPull(cwd, { force: options?.force, timeout: 60 * 1000 })

    if (result.status) {
      return `更新 ${pluginName}(git) 插件成功: ${result.hash.before} -> ${result.hash.after}`
    }

    return `更新 ${pluginName}(git) 插件失败: ${result.data}`
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

  // /** 模拟任务 */
  // log('* 模拟任务执行...')

  // await new Promise(resolve => setTimeout(resolve, 2000))
  // log('* 模拟任务执行完成')
  // await task.update.logs(_, '模拟任务执行完成')

  // 主流程执行
  const { npm, git } = await categorizePlugins()
  try {
    await updateNpmPlugins(npm)
    await updateGitPlugins(git)
  } catch (error) {
    log(`* 发生错误: ${error instanceof Error ? error.message : String(error)}`)
  }

  return true
}
