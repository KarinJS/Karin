import { TaskEntity, TaskStatus, TaskExecutor } from '../../types/task/task'

/**
 * 任务回调函数存储
 */
const taskCallbacks = new Map<string, TaskExecutor>()

/**
 * 设置任务回调函数
 * @param taskId - 任务ID
 * @param executor - 任务执行函数
 */
export const setTaskCallback = (taskId: string, executor: TaskExecutor): void => {
  taskCallbacks.set(taskId, executor)
}

/**
 * 获取任务回调函数
 * @param taskId - 任务ID
 * @returns 对应任务的执行函数，如果未找到返回undefined
 */
export const getTaskCallback = (taskId: string): TaskExecutor | undefined => {
  return taskCallbacks.get(taskId)
}

/**
 * 删除任务回调函数
 * @param taskId - 任务ID
 * @returns 是否成功删除
 */
export const removeTaskCallback = (taskId: string): boolean => {
  return taskCallbacks.delete(taskId)
}

/**
 * 执行任务
 * @param task - 任务实体
 * @param emitLog - 日志回调
 * @param emitStatus - 状态回调
 * @returns 执行是否成功的Promise
 */
export const executeTask = async (
  task: TaskEntity,
  emitLog: (log: string) => void,
  emitStatus: (status: TaskStatus) => void
): Promise<boolean> => {
  /** 通知状态为运行中 */
  emitStatus('running')

  try {
    const callback = taskCallbacks.get(task.id)

    if (!callback) {
      emitLog(`未找到任务 ${task.id} 的回调函数`)
      emitStatus('failed')
      return false
    }

    /** 记录开始信息 */
    const startMessage = `开始执行任务: ${task.name} (目标: ${task.target})\n`
    emitLog(startMessage)

    /** 执行任务回调 */
    const result = await callback(task, emitLog)

    /** 根据结果设置状态 */
    emitStatus(result ? 'success' : 'failed')

    if (typeof result === 'boolean') {
      return result
    }

    throw new Error('任务执行器返回值类型错误')
  } catch (error) {
    /** 处理错误 */
    const errorMessage = `执行任务出错: ${error instanceof Error ? error.message : String(error)}\n`
    emitLog(errorMessage)
    emitStatus('failed')
    return false
  }
}
