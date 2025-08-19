import { createBadRequestResponse, createSuccessResponse } from '@/server/utils/response'
import { spawn } from 'node:child_process'
import type { Response } from 'express'

/**
 * 验证插件请求基本参数
 *
 * 检查插件操作请求的必要参数是否有效：
 * 1. 验证名称和目标不为空
 * 2. 验证插件类型是否在允许的类型列表中
 *
 * @param res - 响应对象，用于返回错误信息
 * @param name - 插件名称
 * @param target - 插件目标
 * @param pluginType - 插件类型 (npm/git/app)
 * @param allowedTypes - 允许的插件类型列表
 * @returns 验证是否通过
 */
export const validatePluginRequest = (
  res: Response,
  name: string,
  target: string,
  pluginType: string,
  allowedTypes: string[]
): boolean => {
  if (!name || !target) {
    createBadRequestResponse(res, '无效请求: 插件名称或任务名称不能为空')
    return false
  }

  if (!allowedTypes.includes(pluginType)) {
    createBadRequestResponse(res, '无效请求: 插件类型错误')
    return false
  }

  return true
}

/**
 * 启动命令子进程
 *
 * 创建一个子进程来执行指定的命令，并通过回调函数处理输出。
 * 处理标准输出、标准错误、进程结束和错误事件。
 *
 * @param command - 要执行的命令（如'npm'、'git'）
 * @param args - 命令参数数组
 * @param options - 进程选项，包括工作目录和环境变量
 * @param emitLog - 日志回调函数，用于处理进程的输出信息
 * @returns 创建的子进程对象
 */
export const spawnProcess = (
  command: string,
  args: string[],
  options: Parameters<typeof spawn>[2] = {},
  emitLog: (message: string) => void,
  /** 兼容ERR_PNPM_PUBLIC_HOIST_PATTERN_DIFF */
  pnpm?: () => void
) => {
  return new Promise((resolve) => {
    const proc = spawn(command, args, {
      shell: true,
      cwd: options.cwd || process.cwd(),
      env: {
        ...process.env,
        ...options.env,
      },
    })

    proc.stdout.on('data', (data) => {
      const message = data.toString()
      logger.debug(message)
      emitLog(message)
    })

    proc.stderr.on('data', (data) => {
      const message = data.toString()
      if (message.includes('ERR_PNPM_PUBLIC_HOIST_PATTERN_DIFF')) {
        pnpm && pnpm()
      }

      logger.debug(message)
      emitLog(message)
    })

    proc.on('close', (code) => {
      proc.kill()
      emitLog(`执行完成，退出码: ${code}`)
      resolve(true)
    })

    proc.on('error', (error) => {
      logger.debug(error)
      emitLog(`执行失败: ${error.message}`)
      logger.error(error)
      resolve(error)
    })

    return proc
  })
}

/**
 * 创建操作结果对象
 *
 * 根据操作成功与否，生成包含适当消息的结果对象。
 * 成功时消息格式为"{操作}成功: {详情}"，失败时为"{操作}失败: {详情}"。
 *
 * @param success - 是否成功
 * @param msg - 操作结果的详细消息
 * @param operation - 操作类型名称（如"安装"、"卸载"、"更新"）
 * @returns 包含操作结果的对象，含success和message字段
 */
export const createOperationResult = (success: boolean, msg: string, operation: string) => ({
  success,
  message: success ? `${operation}成功${msg ? ': ' + msg : ''}` : `${operation}失败: ${msg}`,
})

/**
 * 安全执行文件操作
 *
 * 包装文件操作并处理可能的异常，返回统一格式的操作结果。
 * 无论操作成功还是失败，都会返回一个结构化的结果对象。
 *
 * @param operation - 要执行的文件操作函数
 * @param operationType - 操作类型，用于结果消息（如"卸载"、"更新"）
 * @returns 操作结果对象，包含success和message字段
 */
export const safelyExecuteFileOperation = async (operation: () => Promise<string>, operationType: string) => {
  try {
    const msg = await operation()
    return createOperationResult(true, msg, operationType)
  } catch (error) {
    return createOperationResult(false, error instanceof Error ? error.message : String(error), operationType)
  }
}

/**
 * 处理安装、更新依赖响应
 * @description 安装、更新依赖接口只允许返回200响应
 * @param res - 响应对象
 * @param success - 是否成功
 * @param message - 消息
 * @param taskId - 任务ID
 * @returns 操作响应
 */
export const handleReturn = (
  res: Response,
  success: boolean,
  message: string,
  taskId?: string
) => {
  if (taskId) {
    return createSuccessResponse(res, { success, message, taskId })
  }

  return createSuccessResponse(res, { success, message })
}
