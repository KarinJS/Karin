import fs from 'node:fs'
import sqlite3 from 'sqlite3'
import { randomUUID } from 'node:crypto'

import type { Database } from 'sqlite3'

/** ================ 类型定义 ================ */

/**
 * 任务类型枚举
 * - install: 安装插件
 * - uninstall: 卸载插件
 * - update: 更新插件
 * - disable: 禁用插件
 * - enable: 启用插件
 */
export type TaskType = 'install' | 'uninstall' | 'update' | 'disable' | 'enable'

/**
 * 任务状态枚举
 * - pending: 待执行
 * - running: 执行中
 * - success: 成功
 * - failed: 失败
 * - cancelled: 已取消
 * - timeout: 超时
 */
export type TaskStatus = 'pending' | 'running' | 'success' | 'failed' | 'cancelled' | 'timeout'

/**
 * 任务实体接口
 */
export interface TaskEntity {
  /** 任务唯一标识 */
  id: string
  /** 任务类型 */
  type: TaskType
  /** 任务名称 */
  name: string
  /** 目标(插件名/包名/路径) */
  target: string
  /** 任务状态 */
  status: TaskStatus
  /** 完整执行日志 */
  logs: string
  /** 操作者IP */
  operatorIp: string
  /** 创建时间戳 */
  createTime: number
  /** 更新时间戳 */
  updateTime: number
  /** 结束时间戳(可选) */
  endTime?: number | null
}

/**
 * 创建任务参数接口
 */
export interface CreateTaskParams {
  /** 任务类型 */
  type: TaskType
  /** 任务名称 */
  name: string
  /** 目标(插件名/包名/路径) */
  target: string
  /** 操作者IP */
  operatorIp: string
  /** 创建时间戳 可选，不指定则自动获取 */
  createTime?: number
}

/**
 * 任务查询过滤器接口
 */
export interface TaskFilter {
  /** 任务类型过滤 */
  type?: TaskType
  /** 任务状态过滤 */
  status?: TaskStatus | TaskStatus[]
  /** 任务名称过滤 */
  name?: string
  /** 操作者IP过滤 */
  operatorIp?: string
  /** 限制获取数量，返回最新的N条记录 */
  limit?: number
}

/**
 * 任务执行器类型
 * @param task - 任务实体
 * @param log - 日志记录函数
 * @returns Promise<boolean> - 执行成功返回true，失败返回false
 */
export type TaskExecutor = (task: TaskEntity, log: (message: string) => void) => Promise<boolean>

/** ================ 内部工具函数 ================ */

/** ================ TaskDatabase 类 ================ */

/**
 * 任务数据库管理类
 * 集成了任务的数据库操作和执行队列管理
 */
export class TaskDatabase {
  private db: Database
  private dbPath: string
  /** 任务回调函数存储 */
  private taskCallbacks = new Map<string, TaskExecutor>()
  /** 单例实例 */
  private static instance: TaskDatabase | null = null

  private constructor (db: Database, dbPath: string) {
    this.db = db
    this.dbPath = dbPath
  }

  /**
   * 创建任务数据库实例（单例模式）
   * @param dbPath - 数据库文件路径
   * @returns TaskDatabase实例
   */
  static async create (dbPath: string): Promise<TaskDatabase> {
    /** 如果已存在实例且路径相同，直接返回 */
    if (TaskDatabase.instance && TaskDatabase.instance.dbPath === dbPath) {
      return TaskDatabase.instance
    }

    /** 如果存在实例但路径不同，先关闭旧实例 */
    if (TaskDatabase.instance) {
      throw new Error('已存在任务数据库实例，请先关闭旧实例')
      // await WebUiTaskDatabase.instance.close()
    }

    const filename = `${dbPath}/task.db`

    /** dbPath如果存在并且是文件 重命名为filename.bak */
    if (fs.existsSync(dbPath) && fs.statSync(dbPath).isFile()) {
      fs.renameSync(dbPath, `${dbPath}.bak`)
    }

    fs.mkdirSync(dbPath, { recursive: true })

    const db = await new Promise<Database>((resolve, reject) => {
      const instance = new sqlite3.Database(filename, async (err) => {
        if (err) {
          reject(err)
          return
        }

        try {
          // 创建表
          await new Promise<void>((resolve, reject) => {
            instance.exec(`
              CREATE TABLE IF NOT EXISTS tasks (
                id TEXT PRIMARY KEY,
                type TEXT NOT NULL,
                name TEXT NOT NULL,
                target TEXT NOT NULL,
                status TEXT NOT NULL,
                logs TEXT DEFAULT '',
                operatorIp TEXT NOT NULL,
                createTime INTEGER NOT NULL,
                updateTime INTEGER NOT NULL,
                endTime INTEGER
              )
            `, (err) => {
              if (err) {
                reject(err)
                return
              }
              resolve()
            })
          })

          // 检查并处理上次关闭时正在执行的任务
          await TaskDatabase.handleUnfinishedTasks(instance)

          resolve(instance)
        } catch (error) {
          reject(error)
        }
      })
    })

    TaskDatabase.instance = new TaskDatabase(db, dbPath)
    return TaskDatabase.instance
  }

  /**
   * 获取当前实例（如果存在）
   * @returns 当前实例或null
   */
  static getInstance (): TaskDatabase | null {
    return TaskDatabase.instance
  }

  /** ================ 队列管理方法 ================ */

  /** ================ 工具方法 ================ */

  /**
   * 处理未完成的任务，将所有running状态的任务标记为timeout
   * @param db - 数据库连接实例
   * @returns - 处理是否成功
   */
  private static async handleUnfinishedTasks (db: Database): Promise<void> {
    const now = Date.now()

    return new Promise((resolve, reject) => {
      // 查询所有running状态的任务
      db.all(
        'SELECT id FROM tasks WHERE status = \'running\'',
        [],
        async (err, rows: any[]) => {
          if (err) {
            reject(err)
            return
          }

          if (rows.length === 0) {
            resolve()
            return
          }

          try {
            // 批量更新为timeout状态
            await new Promise<void>((resolve, reject) => {
              const taskIds = rows.map(row => row.id)
              const placeholders = taskIds.map(() => '?').join(',')

              db.run(
                `UPDATE tasks SET
                  status = 'timeout',
                  updateTime = ?,
                  endTime = ?,
                  logs = logs || '\n系统重启，任务被标记为超时已取消'
                WHERE id IN (${placeholders})`,
                [now, now, ...taskIds],
                function (updateErr) {
                  if (updateErr) {
                    reject(updateErr)
                    return
                  }

                  console.log(`已将 ${this.changes} 个未完成任务标记为超时已取消`)
                  resolve()
                }
              )
            })

            resolve()
          } catch (updateError) {
            reject(updateError)
          }
        }
      )
    })
  }

  /**
   * 包装数据库查询为 Promise
   */
  private dbGet<T = any> (sql: string, params: any[] = []): Promise<T | null> {
    return new Promise((resolve, reject) => {
      this.db.get(sql, params, (err, row: T) => {
        if (err) {
          reject(err)
          return
        }
        resolve(row || null)
      })
    })
  }

  /**
   * 包装数据库查询多行为 Promise
   */
  private dbAll<T = any> (sql: string, params: any[] = []): Promise<T[]> {
    return new Promise((resolve, reject) => {
      this.db.all(sql, params, (err, rows: T[]) => {
        if (err) {
          reject(err)
          return
        }
        resolve(rows || [])
      })
    })
  }

  /**
   * 包装数据库执行为 Promise
   */
  private dbRun (sql: string, params: any[] = []): Promise<{ changes: number; lastID: number }> {
    return new Promise((resolve, reject) => {
      this.db.run(sql, params, function (err) {
        if (err) {
          reject(err)
          return
        }
        resolve({ changes: this.changes, lastID: this.lastID })
      })
    })
  }

  /**
   * 关闭数据库连接
   */
  async close (): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.close((err) => {
        if (err) {
          reject(err)
          return
        }
        // 重置单例实例
        TaskDatabase.instance = null
        resolve()
      })
    })
  }

  /**
   * 解析数据库行为任务实体
   */
  private parseRow (row: any): TaskEntity {
    return {
      ...row,
      endTime: row.endTime || null,
    }
  }

  /**
   * 设置任务回调函数
   * @param taskId - 任务ID
   * @param executor - 任务执行函数
   */
  private setTaskCallback (taskId: string, executor: TaskExecutor): void {
    this.taskCallbacks.set(taskId, executor)
  }

  /**
   * 获取任务回调函数
   * @param taskId - 任务ID
   * @returns 对应任务的执行函数，如果未找到返回undefined
   */
  private getTaskCallback (taskId: string): TaskExecutor | undefined {
    return this.taskCallbacks.get(taskId)
  }

  /**
   * 删除任务回调函数
   * @param taskId - 任务ID
   * @returns 是否成功删除
   */
  private removeTaskCallback (taskId: string): boolean {
    return this.taskCallbacks.delete(taskId)
  }

  /**
   * 执行任务
   * @param task - 任务实体
   * @param emitLog - 日志回调
   * @param emitStatus - 状态回调
   * @returns 执行是否成功的Promise
   */
  private async executeTask (
    task: TaskEntity,
    emitLog: (log: string) => void,
    emitStatus: (status: TaskStatus) => void
  ): Promise<boolean> {
    /** 通知状态为运行中 */
    emitStatus('running')

    try {
      const callback = this.taskCallbacks.get(task.id)

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

  /** ================ 数据库操作方法 ================ */

  /**
   * 添加任务
   * @param params - 任务参数
   * @param executor - 任务执行回调函数（可选）
   * @returns 任务ID
   */
  async add (params: CreateTaskParams, executor?: TaskExecutor): Promise<string> {
    const taskId = randomUUID()
    const now = Date.now()

    const sql = `
      INSERT INTO tasks (id, type, name, target, status, logs, operatorIp, createTime, updateTime)
      VALUES (?, ?, ?, ?, 'pending', '', ?, ?, ?)
    `

    const values = [
      taskId,
      params.type,
      params.name,
      params.target,
      params.operatorIp,
      params.createTime || now,
      now,
    ]

    await this.dbRun(sql, values)

    // 如果提供了执行器，则存储它
    if (executor) {
      this.setTaskCallback(taskId, executor)
    }

    return taskId
  }

  /**
   * 获取任务详情
   * @param taskId - 任务ID
   * @returns 任务详情
   */
  async get (taskId: string): Promise<TaskEntity | null> {
    const row = await this.dbGet('SELECT * FROM tasks WHERE id = ?', [taskId])
    return row ? this.parseRow(row) : null
  }

  /**
   * 获取任务列表
   * @param filter - 任务过滤条件
   * @returns 任务列表
   */
  async list (filter?: TaskFilter): Promise<TaskEntity[]> {
    let query = 'SELECT * FROM tasks'
    const params: any[] = []
    const conditions: string[] = []

    if (filter) {
      if (filter.type) {
        conditions.push('type = ?')
        params.push(filter.type)
      }

      if (filter.name) {
        conditions.push('name LIKE ?')
        params.push(`%${filter.name}%`)
      }

      if (filter.operatorIp) {
        conditions.push('operatorIp = ?')
        params.push(filter.operatorIp)
      }

      if (filter.status) {
        if (Array.isArray(filter.status)) {
          const statusPlaceholders = filter.status.map(() => '?').join(',')
          conditions.push(`status IN (${statusPlaceholders})`)
          params.push(...filter.status)
        } else {
          conditions.push('status = ?')
          params.push(filter.status)
        }
      }
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ')
    }

    query += ' ORDER BY createTime DESC'

    // 添加LIMIT子句，限制返回的记录数
    if (filter?.limit && filter.limit > 0) {
      query += ' LIMIT ?'
      params.push(filter.limit)
    }

    const rows = await this.dbAll(query, params)
    return rows.map(row => this.parseRow(row))
  }

  /**
   * 获取所有任务列表
   * @returns 所有任务列表
   */
  all (): Promise<TaskEntity[]> {
    return this.list()
  }

  /**
   * 获取任务日志
   * @param taskId - 任务ID
   * @returns 任务日志内容
   */
  async logs (taskId: string): Promise<string | null> {
    const task = await this.get(taskId)
    return task?.logs || null
  }

  /**
   * 取消任务
   * @param taskId - 任务ID
   * @returns 是否成功
   */
  async cancel (taskId: string): Promise<boolean> {
    const now = Date.now()
    const sql = `
      UPDATE tasks
      SET status = ?, updateTime = ?, endTime = ?, logs = logs || ?
      WHERE id = ? AND (status = ? OR status = ?)
    `
    const params = ['cancelled', now, now, '\n任务已被手动取消', taskId, 'pending', 'running']

    const result = await this.dbRun(sql, params)

    // 移除任务回调
    this.removeTaskCallback(taskId)

    return result.changes > 0
  }

  /**
   * 删除任务
   * @param taskId - 任务ID
   * @returns 是否成功
   */
  async delete (taskId: string): Promise<boolean> {
    const result = await this.dbRun('DELETE FROM tasks WHERE id = ?', [taskId])

    // 移除任务回调
    this.removeTaskCallback(taskId)

    return result.changes > 0
  }

  /**
   * 检查是否存在相同类型和目标的任务
   * @param type - 任务类型
   * @param target - 目标
   * @param statuses - 状态列表
   * @returns 是否存在
   */
  async exists (type: TaskType, target: string, statuses: TaskStatus[]): Promise<boolean> {
    const placeholders = statuses.map(() => '?').join(',')
    const sql = `SELECT COUNT(*) as count FROM tasks WHERE type = ? AND target = ? AND status IN (${placeholders})`
    const params = [type, target, ...statuses]

    const row = await this.dbGet<{ count: number }>(sql, params)
    return (row?.count || 0) > 0
  }

  /**
   * 更新任务状态
   * @param taskId - 任务ID
   * @param status - 新状态
   * @returns 操作是否成功
   */
  private async updateStatus (taskId: string, status: TaskStatus): Promise<boolean> {
    const now = Date.now()
    const endTime = status !== 'pending' && status !== 'running' ? now : null

    const sql = 'UPDATE tasks SET status = ?, updateTime = ?, endTime = ? WHERE id = ?'
    const params = [status, now, endTime, taskId]

    const result = await this.dbRun(sql, params)
    return result.changes > 0
  }

  /**
   * 更新任务日志
   * @param taskId - 任务ID
   * @param logs - 完整日志内容
   * @returns 操作是否成功
   */
  private async updateLogs (taskId: string, logs: string): Promise<boolean> {
    const result = await this.dbRun('UPDATE tasks SET logs = ? WHERE id = ?', [logs, taskId])
    return result.changes > 0
  }

  /**
   * 更新操作的统一接口（访问器）
   */
  get update () {
    return {
      /**
       * 更新任务状态
       * @param taskId - 任务ID
       * @param status - 新状态
       * @returns 是否成功
       */
      status: (taskId: string, status: TaskStatus) => {
        return this.updateStatus(taskId, status)
      },
      /**
       * 更新任务日志
       * @param taskId - 任务ID
       * @param logs - 完整日志内容
       * @returns 是否成功
       */
      logs: (taskId: string, logs: string) => {
        return this.updateLogs(taskId, logs)
      },
    }
  }

  /**
   * 运行任务
   * @param taskId - 任务ID
   * @param onLog - 日志回调函数
   * @param onStatusChange - 状态变更回调函数
   * @returns 是否成功
   */
  async run (
    taskId: string,
    onLog: (log: string) => void = () => { },
    onStatusChange: (status: TaskStatus) => void = () => { }
  ): Promise<boolean> {
    const task = await this.get(taskId)
    if (!task) {
      onLog(`任务 ${taskId} 不存在`)
      onStatusChange('failed')
      return false
    }

    /** 检查是否存在回调函数 */
    if (!this.getTaskCallback(taskId)) {
      onLog(`任务 ${taskId} 没有关联的执行回调函数`)
      onStatusChange('failed')
      return false
    }

    /** 先将任务状态更新为running */
    await this.updateStatus(taskId, 'running')

    /** 创建日志收集器 */
    const logCollector = (log: string) => onLog(log)

    /** 创建状态监听器 */
    const statusListener = async (status: TaskStatus) => {
      /** 更新数据库中的状态 */
      await this.updateStatus(taskId, status)

      /** 转发状态到外部回调 */
      onStatusChange(status)

      /** 移除回调 清理缓存 */
      if (status !== 'pending' && status !== 'running') {
        this.removeTaskCallback(taskId)
      }
    }

    /** 执行任务 */
    return this.executeTask(task, logCollector, statusListener)
  }

  /**
   * 删除指定天数之前的所有记录
   * @param days - 天数，删除多少天之前的记录
   * @returns 删除的记录数量
   */
  async deleteOldRecords (days: number): Promise<number> {
    if (days <= 0) {
      throw new Error('天数必须大于0')
    }

    const cutoffTime = Date.now() - (days * 24 * 60 * 60 * 1000)
    const sql = 'DELETE FROM tasks WHERE createTime < ?'

    const result = await this.dbRun(sql, [cutoffTime])

    // 清理对应的回调函数
    const deletedTaskIds = await this.dbAll<{ id: string }>(
      'SELECT id FROM tasks WHERE createTime < ?',
      [cutoffTime]
    )

    deletedTaskIds.forEach(task => {
      this.removeTaskCallback(task.id)
    })

    return result.changes
  }

  /**
   * 获取数据库文件大小（KB）
   * @returns 文件大小（KB），如果文件不存在返回0
   */
  async getDatabaseSize (): Promise<number> {
    const filename = `${this.dbPath}/task.db`

    try {
      const stats = await fs.promises.stat(filename)
      return Math.round(stats.size / 1024 * 100) / 100 // 保留两位小数
    } catch (error) {
      // 文件不存在或其他错误
      return 0
    }
  }

  /**
   * 清空所有任务记录
   * @returns 删除的记录数量
   */
  async clearAllTasks (): Promise<number> {
    const result = await this.dbRun('DELETE FROM tasks')

    // 清理所有回调函数
    this.taskCallbacks.clear()

    return result.changes
  }

  /**
   * 获取数据库统计信息
   * @returns 统计信息对象
   */
  async getStatistics (): Promise<{
    totalTasks: number
    tasksByStatus: Record<TaskStatus, number>
    tasksByType: Record<TaskType, number>
    databaseSizeKB: number
  }> {
    /** 获取总数 */
    const totalResult = await this.dbGet<{ count: number }>('SELECT COUNT(*) as count FROM tasks')
    const totalTasks = totalResult?.count || 0

    /** 按状态统计 */
    const statusStats = await this.dbAll<{ status: TaskStatus; count: number }>(
      'SELECT status, COUNT(*) as count FROM tasks GROUP BY status'
    )
    const tasksByStatus = {} as Record<TaskStatus, number>
    statusStats.forEach(stat => {
      tasksByStatus[stat.status] = stat.count
    })

    /** 按类型统计 */
    const typeStats = await this.dbAll<{ type: TaskType; count: number }>(
      'SELECT type, COUNT(*) as count FROM tasks GROUP BY type'
    )
    const tasksByType = {} as Record<TaskType, number>
    typeStats.forEach(stat => {
      tasksByType[stat.type] = stat.count
    })

    /** 获取文件大小 */
    const databaseSizeKB = await this.getDatabaseSize()

    return {
      totalTasks,
      tasksByStatus,
      tasksByType,
      databaseSizeKB,
    }
  }
}
