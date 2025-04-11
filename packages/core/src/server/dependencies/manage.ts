import { isWorkspace } from '@/env'
import { taskSystem as task } from '@/service/task'
import { handleReturn, spawnProcess } from '../plugins/admin/tool'

import type { RequestHandler, Response } from 'express'
import type { TaskEntity, TaskType } from '@/types/task'

/** 依赖管理基类 */
interface DependenciesManageBase {
  /** 操作类型：安装、删除、添加 */
  type: 'install' | 'remove' | 'add'
}

/** 安装依赖请求参数 */
interface InstallDependenciesParams extends DependenciesManageBase {
  type: 'install'
  /** 依赖列表 */
  dependencies: Array<{
    /** 依赖名称 */
    name: string
    /** 依赖版本 */
    version?: string
  }>
}

/** 删除依赖请求参数 */
interface RemoveDependenciesParams extends DependenciesManageBase {
  type: 'remove'
  /** 依赖列表 */
  dependencies: string[]
}
/**
 * 依赖管理请求参数接口
 */
export type DependenciesManage = InstallDependenciesParams | RemoveDependenciesParams

/**
 * 依赖管理路由
 *
 * 处理依赖相关的API请求，包括：
 * - 安装依赖：安装指定版本的依赖
 * - 删除依赖：删除指定的依赖
 *
 * @param req - 请求对象，包含操作类型和依赖参数
 * @param res - 响应对象，用于返回操作结果
 * @returns 响应结果
 */
export const manageDependenciesRouter: RequestHandler<null, null, DependenciesManage> = async (req, res) => {
  const { type, dependencies } = req.body

  if (!type || !Array.isArray(dependencies) || dependencies.length === 0) {
    return handleReturn(res, false, '无效请求：缺少必要参数')
  }

  if (type === 'install') {
    /**
     * @description 此处的响应格式符合以下格式
     * @example
     * ```json
     * {
     *   "success": true,
     *   "message": "安装任务已创建",
     *   "taskId": "1234567890"
     * }
     *
     * {
     *   "success": false,
     *   "message": "安装失败"
     * }
     * ```
     */
    return await installDependencies(res, dependencies, req.ip!)
  }

  if (type === 'remove') {
    /**
     * @description 此处的响应格式符合以下格式
     * @example
     * ```json
     * {
     *   "success": true,
     *   "message": "删除任务已创建",
     *   "taskId": "1234567890"
     * }
     *
     * {
     *   "success": false,
     *   "message": "删除失败"
     * }
     * ```
     */
    return await removeDependencies(res, dependencies, req.ip!)
  }

  return handleReturn(res, false, '无效请求：不支持的操作类型')
}

/**
 * 安装依赖
 *
 * @param res - 响应对象
 * @param dependencies - 依赖列表，包含名称和版本
 * @param ip - 操作者IP地址
 * @returns 操作响应
 */
const installDependencies = async (
  res: Response,
  dependencies: InstallDependenciesParams['dependencies'],
  ip: string
) => {
  try {
    const packagesToInstall = dependencies.map(dep => `${dep.name}@${dep.version || 'latest'}`).join(' ')

    const id = await task.add(
      {
        type: 'install-dependencies' as TaskType,
        name: '安装依赖',
        target: packagesToInstall,
        operatorIp: ip,
      },
      async (_: TaskEntity, emitLog: (message: string) => void) => {
        const args = ['install', ...packagesToInstall.split(' ')]
        if (isWorkspace()) args.unshift('-w')

        spawnProcess('pnpm', args, {}, emitLog)
        return true
      }
    )

    return handleReturn(res, true, '安装任务已创建', id)
  } catch (error) {
    logger.error('[installDependencies]', error)
    return handleReturn(res, false, `安装失败: ${error instanceof Error ? error.message : String(error)}`)
  }
}

/**
 * 删除依赖
 *
 * @param res - 响应对象
 * @param dependencies - 依赖列表
 * @param ip - 操作者IP地址
 * @returns 操作响应
 */
const removeDependencies = async (
  res: Response,
  dependencies: RemoveDependenciesParams['dependencies'],
  ip: string
) => {
  try {
    const packagesToRemove = dependencies.join(' ')

    const id = await task.add(
      {
        type: 'remove-dependencies' as TaskType,
        name: '删除依赖',
        target: packagesToRemove,
        operatorIp: ip,
      },
      async (_: TaskEntity, emitLog: (message: string) => void) => {
        const args = ['remove', ...packagesToRemove.split(' ')]
        if (isWorkspace()) args.unshift('-w')

        spawnProcess('pnpm', args, {}, emitLog)
        return true
      }
    )

    return handleReturn(res, true, '删除任务已创建', id)
  } catch (error) {
    logger.error('[removeDependencies]', error)
    return handleReturn(res, false, `删除失败: ${error instanceof Error ? error.message : String(error)}`)
  }
}
