import { createTaskDatabase } from './database'
import { setTaskCallback, getTaskCallback, removeTaskCallback } from './queue'

export * from './database'
export * from './queue'
export * from './types'
export * from './list'

/**
 * 任务系统对象
 */
export let taskSystem: Awaited<ReturnType<typeof createTaskDatabase>>

/**
 * 初始化任务系统
 * @param dbPath - 数据库路径
 * @returns 任务系统实例
 */
export const initTaskSystem = async (dbPath: string) => {
  taskSystem = await createTaskDatabase(dbPath)
  return taskSystem
}

/**
 * 导出任务回调函数管理方法
 */
export { setTaskCallback, getTaskCallback, removeTaskCallback }
