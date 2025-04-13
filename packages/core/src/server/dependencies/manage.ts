import { isWorkspace } from '@/env'
import { taskSystem as task } from '@/service/task'
import { handleReturn, spawnProcess } from '../plugins/admin/tool'

import type { RequestHandler, Response } from 'express'
import type { TaskEntity, TaskType, DependenciesManage, UpgradeDependenciesParams, RemoveDependenciesParams, AddDependenciesParams } from '@/types'
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
  const { type, data } = req.body

  if (type === 'add') {
    /**
     * @description 此处的响应格式符合以下格式
     * @example
     * ```json
     * {
     *   "success": true,
     *   "message": "添加任务已创建",
     *   "taskId": "1234567890"
     * }
     *
     * {
     *   "success": false,
     *   "message": "添加失败"
     * }
     * ```
     */
    return await addDependencies(res, data, req.ip!)
  }

  if (type === 'upgrade') {
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
    return await installDependencies(res, data, req.ip!)
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
    return await removeDependencies(res, data, req.ip!)
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
  dependencies: UpgradeDependenciesParams['data'],
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

        await spawnProcess('pnpm', args, {}, emitLog)
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
  dependencies: RemoveDependenciesParams['data'],
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

        await spawnProcess('pnpm', args, {}, emitLog)
        return true
      }
    )

    return handleReturn(res, true, '删除任务已创建', id)
  } catch (error) {
    logger.error('[removeDependencies]', error)
    return handleReturn(res, false, `删除失败: ${error instanceof Error ? error.message : String(error)}`)
  }
}

/**
 * 添加依赖
 *
 * @param res - 响应对象
 * @param dependencies - 依赖列表
 * @param ip - 操作者IP地址
 */
const addDependencies = async (
  res: Response,
  dependencies: AddDependenciesParams['data'],
  ip: string
) => {
  try {
    if (!dependencies.name || !dependencies.location) {
      return handleReturn(res, false, '无效请求：缺少必要参数')
    }

    const version = `${dependencies.name}@${dependencies.version || 'latest'}`

    const id = await task.add(
      {
        type: 'add-dependencies' as TaskType,
        name: '依赖新增',
        target: version,
        operatorIp: ip,
      },
      async (_: TaskEntity, emitLog: (message: string) => void) => {
        const args = ['add', version]
        if (dependencies.location === 'devDependencies') {
          args.push('-D')
        } else if (dependencies.location === 'optionalDependencies') {
          args.push('-O')
        }

        if (isWorkspace()) args.unshift('-w')

        await spawnProcess('pnpm', args, {}, emitLog)
        return true
      }
    )

    return handleReturn(res, true, '添加任务已创建', id)
  } catch (error) {
    logger.error('[addDependencies]', error)
    return handleReturn(res, false, `添加失败: ${error instanceof Error ? error.message : String(error)}`)
  }
}
