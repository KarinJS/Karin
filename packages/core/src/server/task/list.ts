import { taskSystem as taskDB } from '@/service/task'
import { createServerErrorResponse, createSuccessResponse } from '../utils/response'

import type { RequestHandler } from 'express'
import type { TaskStatus } from '@/types/task/task'

const taskStatusMap = {
  pending: '待执行(pending)',
  running: '执行中(running)',
  success: '成功(success)',
  failed: '失败(failed)',
  canceled: '已取消(canceled)',
  timeout: '超时(timeout)',
}

/**
 * 获取任务列表
 */
export const taskListRouter: RequestHandler = async (_req, res) => {
  const list = await taskDB.list()
  createSuccessResponse(res, list)
}

// TODO: 这个api暂时不开放给前端使用
// /**
//  * 新增任务
//  */
// const taskAddRouter: RequestHandler<null, null, CreateTask> = async (req, res) => {
//   const { type, name, target } = req.body
//   if (type !== 'install' && type !== 'uninstall' && type !== 'update') {
//     return createServerErrorResponse(res, 'type 错误')
//   }

//   if (typeof name !== 'string' || name.length === 0) {
//     return createServerErrorResponse(res, 'name 为空')
//   }

//   if (typeof target !== 'string' || target.length === 0) {
//     return createServerErrorResponse(res, 'target 为空')
//   }

//   let spawn: CreateTaskParams['spawn']

//   if (type === 'install') {
//     spawn = await taskPluginInstallSpawn(req.body)
//   }

//   try {
//     const taskId = await taskDB.add({
//       type,
//       name,
//       target,
//       operatorIp: req.ip + '',
//       spawn,
//       createTime: Date.now(),
//     })

//     createSuccessResponse(res, taskId)
//   } catch (error) {
//     createServerErrorResponse(res, error instanceof Error ? error.message : String(error))
//   }
// }

/**
 * 执行任务
 * 返回SSE长连接，实时推送任务执行日志和状态
 */
export const taskRunRouter: RequestHandler<null, null, { id: string }> = async (req, res) => {
  const { id } = req.query
  if (typeof id !== 'string' || id.length === 0) {
    return createServerErrorResponse(res, 'id 为空')
  }

  const task = await taskDB.get(id)
  if (!task) {
    return createServerErrorResponse(res, '任务不存在')
  }

  /** 检查任务是否存在 */
  if (await taskDB.exists(task.type, task.target, ['running'])) {
    return createServerErrorResponse(res, '已有相同任务正在执行，请勿重复创建任务...')
  }

  /** sse是否处于运行状态 */
  let sseOpen = true

  req.on('close', () => {
    sseOpen = false
    logger.debug(`[task][${id}] 客户端断开连接，任务继续在后台执行`)
  })

  try {
    /** 设置SSE响应头 */
    res.setHeader('Content-Type', 'text/event-stream')
    /** 设置缓存为不缓存 */
    res.setHeader('Cache-Control', 'no-cache')
    /** 设置连接为长连接 */
    res.setHeader('Connection', 'keep-alive')
    /** 立即发送响应头 */
    res.flushHeaders()

    res.write('data: 任务创建成功: 开始执行...\n\n')
    taskDB.run(
      id,
      (log: string) => sseOpen && res.write(`data: ${log}\n\n`),
      (status: TaskStatus) => {
        const tips = taskStatusMap[status]
        logger.debug(`[task][${id}] 状态变更: ${tips}`)
        if (!sseOpen) {
          logger.debug(`[task][${id}] sse已关闭 停止发送日志`)
          return
        }

        res.write(`data: 任务状态变更: ${tips}\n\n`)
        if (status !== 'running' && status !== 'pending') {
          res.write('data: 任务执行完成，结束连接\n\n')
          res.end()
        }
      }
    )
  } catch (error) {
    if (res.headersSent) {
      res.write(`data: ${error instanceof Error ? error.message : String(error)} \n\n`)
      return res.end()
    }

    createServerErrorResponse(res, error instanceof Error ? error.message : String(error))
  }
}

/**
 * 获取任务日志
 * 根据任务状态提供不同的响应:
 * - 任务运行中: 返回SSE长连接实时获取日志
 * - 任务已完成: 直接返回完整日志
 */
export const taskLogsRouter: RequestHandler<{ id: string }> = async (req, res) => {
  const { id } = req.params

  if (!id || typeof id !== 'string' || id.length === 0) {
    return createServerErrorResponse(res, '任务ID不能为空')
  }

  try {
    const task = await taskDB.get(id)
    if (!task) {
      return createServerErrorResponse(res, '任务不存在')
    }

    /** 任务非运行中或非待执行，直接返回日志 */
    if (task.status === 'running' || task.status === 'pending') {
      const logs = await taskDB.logs(id)
      return createSuccessResponse(res, { logs: logs || '' })
    }

    /** 设置SSE响应头 */
    res.setHeader('Content-Type', 'text/event-stream')
    res.setHeader('Cache-Control', 'no-cache')
    res.setHeader('Connection', 'keep-alive')
    res.flushHeaders()

    /** sse是否处于运行状态 */
    let sseOpen = true
    let timer: NodeJS.Timeout | null = null

    req.on('close', () => {
      sseOpen = false
      timer && clearInterval(timer)
      logger.debug(`[task][${id}] sse已关闭 停止发送日志`)
    })

    res.write(`data: ${[
      `当前状态: ${taskStatusMap[task.status]}`,
      `ID: ${task.id}`,
      `名称: ${task.name}`,
      `类型: ${task.type}`,
      `目标: ${task.target}`,
      `创建时间: ${task.createTime}`,
      `更新时间: ${task.updateTime}`,
    ].join('\n')} \n\n`)

    timer = setInterval(async () => {
      try {
        const info = await taskDB.get(id)

        if (!info) {
          timer && clearInterval(timer)
          sseOpen && res.write('data: 任务不存在，无法获取任务详情 \n\n')
          return res.end()
        }

        /** 如果状态发生变化 则说明任务已结束 */
        if (info.status !== task.status) {
          const logs = info.logs.split('\n')
          logs.forEach(log => res.write(`data: ${log} \n\n`))
          timer && clearInterval(timer)
          return res.end()
        }

        sseOpen && res.write('data: 任务执行中，请耐心等待... \n\n')
      } catch (error) {
        logger.error(new Error('sse获取日志失败', { cause: error }))
        timer && clearInterval(timer)
        sseOpen && res.write('data: 获取日志失败 \n\n')
        return res.end()
      }
    }, 1000)
  } catch (error) {
    logger.error(new Error('sse获取日志失败', { cause: error }))
    createServerErrorResponse(res, error instanceof Error ? error.message : String(error))
  }
}

/**
 * 删除任务记录
 */
export const taskDeleteRouter: RequestHandler<{ id: string }> = async (req, res) => {
  const { id } = req.params
  if (!id || typeof id !== 'string' || id.length === 0) {
    return createServerErrorResponse(res, '任务ID不能为空')
  }

  try {
    await taskDB.delete(id)
    createSuccessResponse(res, '任务记录删除成功')
  } catch (error) {
    createServerErrorResponse(res, error instanceof Error ? error.message : String(error))
  }
}
