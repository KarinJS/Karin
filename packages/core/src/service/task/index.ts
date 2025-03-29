import { createTaskDatabase } from './database'

export * from './database'
export * from './queue'

/**
 * 任务系统对象
 */
export let taskSystem: Awaited<ReturnType<typeof createTaskDatabase>> | null = null

/**
 * 初始化任务系统
 * @param dbPath - 数据库路径
 * @returns 任务系统实例
 */
export const initTaskSystem = async (dbPath: string) => {
  taskSystem = await createTaskDatabase(dbPath)
  return taskSystem
}
