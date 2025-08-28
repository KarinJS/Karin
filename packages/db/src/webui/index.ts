import { TaskDatabase } from './sqlite3'

export * from './sqlite3'

/**
 * webui 插件管理日志数据库
 * @public
 */
export let webuiDB: Awaited<ReturnType<typeof TaskDatabase.create>>

/**
 * 创建 webui 插件管理日志数据库
 * @param dir 日志保存目录
 */
export const createTaskDB = async (dir: string) => {
  webuiDB = await TaskDatabase.create(dir)
  return webuiDB
}
