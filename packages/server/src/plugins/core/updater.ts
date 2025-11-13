import path from 'node:path'
import { webuiDB } from '@karinjs/db'
// import { gitPull } from '@karinjs/git'
import { isWorkspace } from '@karinjs/envs'
// import { getPlugins } from '@karinjs/plugin'
import { karinPathPlugins } from '@karinjs/store'
import { handleReturn, spawnProcess } from './utils'

import type { Response } from 'express'
import type { TaskEntity } from '@karinjs/db'
import type { PluginAdminUpdate } from './types'

/**
 * 插件更新管理类
 * 负责处理插件的更新操作
 */
export class PluginUpdater {
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
  public static async update (
    res: Response,
    data: PluginAdminUpdate,
    ip: string = '0.0.0.0'
  ) {
    if (!Array.isArray(data.target) || (data.target.length < 1 && !data.isAll)) {
      return handleReturn(res, false, '无效请求: 插件目标错误')
    }

    /** 更新全部插件 */
    if (data.isAll) {
      const id = await webuiDB.add(
        {
          type: 'update',
          name: data.name,
          target: 'all',
          operatorIp: ip,
        },
        async (options, emitLog) => {
          await this.updateAll(options, emitLog, data.isAll)
          await webuiDB.update.logs(options.id, '任务执行成功')
          return true
        }
      )

      return handleReturn(res, true, '更新任务已创建，请通过taskId执行任务', id)
    }

    const id = await webuiDB.add(
      {
        type: 'update',
        name: data.name,
        target: data.target.map(item => `${item.type}:${item.name}`).join(','),
        operatorIp: ip,
      },
      async (options, emitLog) => {
        try {
          await this.performUpdate(options, emitLog, data)
          await webuiDB.update.logs(options.id, '任务执行成功')
          return true
        } catch (error) {
          await webuiDB.update.logs(options.id, `任务执行失败: ${(error as Error).message}`)
          return false
        }
      }
    )

    return handleReturn(res, true, '更新任务已创建，请通过taskId执行任务', id)
  }

  /**
   * 执行更新操作
   *
   * @param _ - 任务参数
   * @param log - 日志回调函数
   * @param data - 更新数据
   */
  private static async performUpdate (
    _: TaskEntity,
    log: (message: string) => void,
    data: PluginAdminUpdate
  ) {
    const npm: { name: string, version: string }[] = []
    const git: { name: string, version: string, force: boolean }[] = []
    /** 记录不存在的插件 */
    const notExist: string[] = []

    const list = await getPlugins('all', false, true)

    for (const item of data.target) {
      if (item.type === 'npm') {
        list.includes(`${item.type}:${item.name}`)
          ? npm.push({ name: item.name, version: item.version || 'latest' })
          : notExist.push(item.name)
        continue
      }

      if (item.type === 'git') {
        const force = typeof item.force === 'boolean' ? item.force : false
        list.includes(`${item.type}:${item.name}`)
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

    if (notExist.length) {
      notExist.unshift('以下插件不存在:')
      log(notExist.join('\n') + '\n\n')
    }

    return true
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
   * @param options - 更新选项
   * @returns 操作是否成功
   */
  private static async updateAll (
    _: TaskEntity,
    log: (message: string) => void,
    options: PluginAdminUpdate['isAll']
  ) {
    /**
     * 将插件列表按类型分类
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
    try {
      await updateNpmPlugins(npm)
      await updateGitPlugins(git)
    } catch (error) {
      log(`* 发生错误: ${error instanceof Error ? error.message : String(error)}`)
    }

    return true
  }
}
