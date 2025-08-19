import fs from 'node:fs'
import path from 'node:path'
import { isWorkspace } from '@karinjs/envs'
import { spawn } from 'child_process'
import { createServerErrorResponse, createSuccessResponse } from '../../utils'

import type { RequestHandler } from 'express'
import type { PluginPackageType } from '@karinjs/plugin'

interface InstallTask {
  id: string
  name: string
  type: PluginPackageType
  status: 'pending' | 'running' | 'completed' | 'failed'
  logs: string[]
  minimized: boolean
  error?: string
}

/** 全局任务队列 */
const taskQueue = new Map<string, InstallTask>()

/**
 * 执行命令并实时获取输出
 * @param command 命令
 * @param args 参数
 * @param task 任务
 */
const spawnCommand = (command: string, args: string[], task: InstallTask): Promise<void> => {
  if (isWorkspace()) args.push('-w')
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      stdio: ['ignore', 'pipe', 'pipe'],
      shell: true,
      cwd: process.cwd(),
    })

    child.stdout.on('data', (data) => {
      const lines = data.toString().split('\n').filter(Boolean)
      lines.forEach((line: string) => {
        task.logs.push(line)
      })
    })

    child.stderr.on('data', (data) => {
      const lines = data.toString().split('\n').filter(Boolean)
      lines.forEach((line: string) => {
        task.logs.push(`[错误] ${line}`)
      })
    })

    child.on('close', (code) => {
      if (code === 0) {
        resolve()
      } else {
        reject(new Error(`命令执行失败，退出码: ${code}`))
      }
    })

    child.on('error', (error) => reject(error))
  })
}

/**
 * 安装 NPM 插件
 * @param task 任务
 */
const installNpmPlugin = async (task: InstallTask) => {
  task.logs.push(`开始安装 NPM 插件: ${task.name}`)
  task.logs.push('正在解析依赖...')

  const command = ['add', task.name, '--save']
  await spawnCommand('pnpm', command, task)
}

/**
 * 安装 Git 插件
 * @param task 任务
 * @param url 下载地址
 */
const installGitPlugin = async (task: InstallTask, url?: string) => {
  if (!url) throw new Error('Git 插件需要提供仓库地址')

  const pluginDir = path.join(process.cwd(), 'plugins', task.name)
  task.logs.push(`开始克隆仓库: ${url}`)
  task.logs.push(`目标目录: ${pluginDir}`)

  await fs.promises.mkdir(pluginDir, { recursive: true })
  /** git clone --depth=1 https://github.com/ikenxuan/karin-plugin-kkk.git ./plugins/karin-plugin-kkk/ */
  await spawnCommand('git', ['clone', '--depth=1', url, `./plugins/${task.name}`], task)

  /** 检查是否有 package.json */
  const pkgPath = path.join(pluginDir, 'package.json')
  if (fs.existsSync(pkgPath)) {
    task.logs.push('检测到 package.json，开始安装依赖...')
    await spawnCommand('pnpm', ['install'], task)
  }
}

/**
 * 安装 App 插件
 * @param task 任务
 * @param url 下载地址
 */
const installAppPlugin = async (task: InstallTask, url?: string) => {
  if (!url) throw new Error('App 插件需要提供下载地址')

  /** 非js、ts不允许下载 */
  if (!url.endsWith('.js') && !url.endsWith('.ts')) {
    throw new Error('非js、ts不允许下载')
  }

  const pluginDir = path.join(process.cwd(), 'plugins', 'karin-plugin-example')
  task.logs.push(`开始下载插件: ${url}`)
  task.logs.push(`目标目录: ${pluginDir}`)

  await fs.promises.mkdir(pluginDir, { recursive: true })

  /** 使用 curl 下载文件，以获取下载进度 */
  await spawnCommand(
    'curl',
    [
      '-L',
      '-o',
      pluginDir,
      url,
    ],
    task
  )
}

/**
 * 执行插件安装任务
 * @param task 任务
 * @param url 下载地址
 */
const installPluginTask = async (task: InstallTask, url?: string) => {
  try {
    task.status = 'running'
    task.logs.push(`开始安装插件: ${task.name}`)
    task.logs.push(`插件类型: ${task.type}`)
    task.logs.push('-------------------')

    switch (task.type) {
      case 'npm':
        await installNpmPlugin(task)
        break
      case 'git':
        await installGitPlugin(task, url)
        break
      case 'apps':
        await installAppPlugin(task, url)
        break
      default:
        throw new Error('不支持的插件类型')
    }

    task.logs.push('-------------------')
    task.logs.push('🎉 安装完成!')
    task.status = 'completed'

    /** 清除插件列表缓存 */
    // TODO
    // await deletePluginListCache()
  } catch (error) {
    task.status = 'failed'
    task.error = (error as Error).message
    task.logs.push('-------------------')
    task.logs.push(`❌ 安装失败: ${(error as Error).message}`)
    throw error
  }
}

/**
 * 安装插件
 */
export const pluginInstall: RequestHandler = async (req, res) => {
  try {
    const { name, type, url } = req.body
    const taskId = `${type}-${name}-${Date.now()}`

    /** 检查是否已在安装队列中 */
    const existingTask = Array.from(taskQueue.values()).find(
      task => task.name === name && task.status === 'running'
    )
    if (existingTask) {
      return createServerErrorResponse(res, '该插件正在安装中')
    }

    /** 创建新任务 */
    const task: InstallTask = {
      id: taskId,
      name,
      type,
      status: 'pending',
      logs: [],
      minimized: false,
    }
    taskQueue.set(taskId, task)

    /** 异步执行安装 */
    installPluginTask(task, url).catch(error => {
      task.status = 'failed'
      task.error = error.message
      task.logs.push(`安装失败: ${error.message}`)
    })

    createSuccessResponse(res, { taskId })
  } catch (error) {
    createServerErrorResponse(res, (error as Error).message)
    logger.error(error)
  }
}

/**
 * 卸载 NPM 插件
 */
const uninstallNpmPlugin = async (task: InstallTask) => {
  task.logs.push(`开始卸载 NPM 插件: ${task.name}`)
  await spawnCommand('pnpm', ['rm', task.name], task)
}

/**
 * 卸载 Git 插件
 * @param task 任务
 */
const uninstallGitPlugin = async (task: InstallTask) => {
  const pluginDir = path.join(process.cwd(), 'plugins', task.name)
  task.logs.push(`开始删除插件目录: ${pluginDir}`)

  /** 删除插件目录 */
  await fs.promises.rm(pluginDir, { recursive: true, force: true })
  task.logs.push('插件目录已删除')

  /** 清理依赖缓存 */
  task.logs.push('正在清理依赖缓存...')
  await spawnCommand('pnpm', ['install', '-P'], task)
}

/**
 * 执行插件卸载任务
 * @param task 任务
 */
const uninstallPluginTask = async (task: InstallTask) => {
  try {
    task.status = 'running'
    task.logs.push(`开始卸载插件: ${task.name}`)
    task.logs.push(`插件类型: ${task.type}`)
    task.logs.push('-------------------')

    switch (task.type) {
      case 'npm':
        await uninstallNpmPlugin(task)
        break
      case 'git':
        await uninstallGitPlugin(task)
        break
      default:
        throw new Error('不支持卸载该类型的插件')
    }

    task.logs.push('-------------------')
    task.logs.push('🎉 卸载完成!')
    task.logs.push('⚠️ 建议重启 Bot 以使更改生效')
    task.status = 'completed'

    /** 清除插件列表缓存 */
    // TODO
    // await deletePluginListCache()
  } catch (error) {
    task.status = 'failed'
    task.error = (error as Error).message
    task.logs.push('-------------------')
    task.logs.push(`❌ 卸载失败: ${(error as Error).message}`)
    throw error
  }
}

/**
 * 卸载插件
 */
export const pluginUninstall: RequestHandler = async (req, res) => {
  try {
    const { name, type } = req.body
    const taskId = `uninstall-${type}-${name}-${Date.now()}`

    /** 检查是否已在卸载队列中 */
    const existingTask = Array.from(taskQueue.values()).find(
      task => task.name === name && task.status === 'running'
    )
    if (existingTask) {
      return createServerErrorResponse(res, '该插件正在卸载中')
    }

    /** 创建新任务 */
    const task: InstallTask = {
      id: taskId,
      name,
      type,
      status: 'pending',
      logs: [],
      minimized: false,
    }
    taskQueue.set(taskId, task)

    /** 异步执行卸载 */
    uninstallPluginTask(task).catch(error => {
      task.status = 'failed'
      task.error = error.message
      task.logs.push(`卸载失败: ${error.message}`)
    })

    createSuccessResponse(res, { taskId })
  } catch (error) {
    createServerErrorResponse(res, (error as Error).message)
    logger.error(error)
  }
}

/**
 * 获取任务状态
 */
export const pluginGetTaskStatus: RequestHandler = (req, res) => {
  try {
    const { taskId } = req.body
    const task = taskQueue.get(taskId)

    if (!task) {
      return createServerErrorResponse(res, '任务不存在')
    }

    createSuccessResponse(res, task)
  } catch (error) {
    createServerErrorResponse(res, (error as Error).message)
    logger.error(error)
  }
}

/** 清理已完成的任务（保留作为备用清理机制） */
const cleanupTasks = () => {
  const THIRTY_MINUTES = 30 * 60 * 1000 /** 30分钟 */
  for (const [taskId, task] of taskQueue.entries()) {
    if (
      (task.status === 'completed' || task.status === 'failed') &&
      Date.now() - parseInt(taskId.split('-').pop() || '0') > THIRTY_MINUTES
    ) {
      taskQueue.delete(taskId)
    }
  }
}

/**
 * 获取任务列表
 */
export const pluginGetTaskList: RequestHandler = (_req, res) => {
  /** 清理过期任务 */
  cleanupTasks()
  const tasks = Array.from(taskQueue.values())
  createSuccessResponse(res, tasks)
}

/**
 * 更新任务状态（最小化/恢复）
 */
export const pluginUpdateTaskStatus: RequestHandler = (req, res) => {
  try {
    const { taskId, minimized } = req.body
    const task = taskQueue.get(taskId)
    if (!task) {
      return createServerErrorResponse(res, '任务不存在')
    }

    task.minimized = minimized
    createSuccessResponse(res, task)
  } catch (error) {
    createServerErrorResponse(res, (error as Error).message)
    logger.error(error)
  }
}
