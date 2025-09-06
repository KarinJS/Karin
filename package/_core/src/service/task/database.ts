import fs from 'node:fs'
import { randomUUID } from 'node:crypto'
import sqlite3, { type Database } from 'sqlite3'
import type { TaskEntity, TaskStatus, TaskType, TaskFilter, CreateTaskParams, TaskExecutor } from '../../types/task/task'

type TaskDB = {
  db: Database
}

/**
 * 解析返回值
 */
const parseRow = (row: any): TaskEntity => {
  return {
    ...row,
  }
}

/**
 * 处理未完成的任务，将所有running状态的任务标记为timeout
 * @param db - 数据库连接实例
 * @returns - 处理是否成功
 */
const handleUnfinishedTasks = async (db: Database): Promise<void> => {
  const now = Date.now()

  return new Promise((resolve, reject) => {
    // 1. 查询所有running状态的任务
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
          // 2. 批量更新为timeout状态
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
 * 初始化任务数据库
 * @param dbPath - 数据库文件路径
 * @returns - 数据库连接对象
 */
const initDatabase = async (dbPath: string): Promise<TaskDB> => {
  const filename = `${dbPath}/task.db`
  /** dbPath如果存在并且是文件 重命名为filename.bak */
  if (fs.existsSync(dbPath) && fs.statSync(dbPath).isFile()) {
    fs.renameSync(dbPath, `${dbPath}.bak`)
  }

  fs.mkdirSync(dbPath, { recursive: true })

  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database(filename, async (err) => {
      if (err) {
        reject(err)
        return
      }

      try {
        // 创建表
        await new Promise<void>((resolve, reject) => {
          db.exec(`
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
        await handleUnfinishedTasks(db)

        resolve({ db })
      } catch (error) {
        reject(error)
      }
    })
  })
}

/**
 * 创建新任务
 * @param taskDB - 数据库连接对象
 * @param taskParams - 任务参数
 * @returns - 返回任务ID
 */
export const taskAdd = async (taskDB: TaskDB, taskParams: CreateTaskParams): Promise<string> => {
  const taskId = randomUUID()
  const now = Date.now()

  /** 所有可能的字段 */
  const allPossibleFields = [
    'id', 'type', 'name', 'target', 'status', 'logs', 'operatorIp',
    'createTime', 'updateTime',
  ]

  /** 插入字段 */
  const fields: string[] = [
    'id', 'type', 'name', 'target', 'status', 'logs', 'operatorIp', 'createTime', 'updateTime',
  ]

  /** 插入值 */
  const values = [
    taskId,
    taskParams.type,
    taskParams.name,
    taskParams.target,
    'pending',
    '',
    taskParams.operatorIp,
    taskParams.createTime || now,
    now,
  ]

  /** 检查所有字段是否都在预定义的安全字段列表中 */
  if (!fields.every(field => allPossibleFields.includes(field))) {
    return Promise.reject(new Error('包含无效的数据库字段'))
  }

  /** 生成占位符 */
  const placeholders = values.map(() => '?').join(', ')

  return new Promise((resolve, reject) => {
    taskDB.db.run(
      `INSERT INTO tasks (${fields.join(', ')}) VALUES (${placeholders})`,
      values,
      function (err) {
        if (err) {
          reject(err)
          return
        }
        resolve(taskId)
      }
    )
  })
}

/**
 * 更新任务状态
 * @param taskDB - 数据库连接对象
 * @param taskId - 任务ID
 * @param status - 新状态
 * @returns - 操作是否成功
 */
export const taskUpdateStatus = async (
  taskDB: TaskDB,
  taskId: string,
  status: TaskStatus
): Promise<boolean> => {
  const now = Date.now()
  const endTime = status !== 'pending' && status !== 'running' ? now : null

  return new Promise((resolve, reject) => {
    taskDB.db.run(
      'UPDATE tasks SET status = ?, updateTime = ?, endTime = ? WHERE id = ?',
      [status, now, endTime, taskId],
      function (err) {
        if (err) {
          reject(err)
          return
        }
        resolve(this.changes > 0)
      }
    )
  })
}

/**
 * 更新任务日志
 * @param taskDB - 数据库连接对象
 * @param taskId - 任务ID
 * @param logs - 完整日志内容
 * @returns - 操作是否成功
 */
export const taskUpdateLogs = async (
  taskDB: TaskDB,
  taskId: string,
  logs: string
): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    taskDB.db.run(
      'UPDATE tasks SET logs = ? WHERE id = ?',
      [logs, taskId],
      function (err) {
        if (err) {
          reject(err)
          return
        }
        resolve(this.changes > 0)
      }
    )
  })
}

/**
 * 获取单个任务详情
 * @param taskDB - 数据库连接对象
 * @param taskId - 任务ID
 * @returns - 任务详情或null
 */
export const taskGet = async (
  taskDB: TaskDB,
  taskId: string
): Promise<TaskEntity | null> => {
  return new Promise((resolve, reject) => {
    taskDB.db.get(
      'SELECT * FROM tasks WHERE id = ?',
      [taskId],
      (err, row: any) => {
        if (err) {
          reject(err)
          return
        }

        if (!row) {
          resolve(null)
          return
        }

        resolve(parseRow(row))
      }
    )
  })
}

/**
 * 获取任务列表
 * @param taskDB - 数据库连接对象
 * @param filter - 任务过滤条件
 * @returns - 任务列表
 */
export const taskList = async (
  taskDB: TaskDB,
  filter?: TaskFilter
): Promise<TaskEntity[]> => {
  let query = 'SELECT * FROM tasks'
  const params: any[] = []
  const conditions: string[] = []

  // 预定义安全的条件字段映射
  const safeConditionFields: Record<string, string> = {
    type: 'type = ?',
    name: 'name LIKE ?',
    operatorIp: 'operatorIp = ?',
    status: 'status = ?',
  }

  if (filter) {
    if (filter.type) {
      conditions.push(safeConditionFields.type)
      params.push(filter.type)
    }

    if (filter.name) {
      conditions.push(safeConditionFields.name)
      params.push(`%${filter.name}%`)
    }

    if (filter.operatorIp) {
      conditions.push(safeConditionFields.operatorIp)
      params.push(filter.operatorIp)
    }

    if (filter.status) {
      if (Array.isArray(filter.status)) {
        const statusPlaceholders = filter.status.map(() => '?').join(',')
        conditions.push(`status IN (${statusPlaceholders})`)
        params.push(...filter.status)
      } else {
        conditions.push(safeConditionFields.status)
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

  return new Promise((resolve, reject) => {
    taskDB.db.all(query, params, (err, rows: any[]) => {
      if (err) {
        reject(err)
        return
      }

      resolve(rows.map(parseRow))
    })
  })
}

/**
 * 检查是否存在相同类型和目标的任务
 * @param taskDB - 数据库连接对象
 * @param type - 任务类型
 * @param target - 目标
 * @param statuses - 状态列表
 * @returns - 是否存在
 */
export const taskExists = async (
  taskDB: TaskDB,
  type: TaskType,
  target: string,
  statuses: TaskStatus[]
): Promise<boolean> => {
  const placeholders = statuses.map(() => '?').join(',')

  return new Promise((resolve, reject) => {
    taskDB.db.get(
      `SELECT COUNT(*) as count FROM tasks WHERE type = ? AND target = ? AND status IN (${placeholders})`,
      [type, target, ...statuses],
      (err, row: any) => {
        if (err) {
          reject(err)
          return
        }
        resolve(row.count > 0)
      }
    )
  })
}

let _taskDB: TaskDB | null = null

/**
 * 设置全局任务数据库实例
 * @param db - 任务数据库实例
 */
export const setTaskDatabase = (db: TaskDB): void => {
  _taskDB = db
}

/**
 * 获取全局任务数据库实例
 * @returns TaskDB | null - 任务数据库实例或null
 */
export const getTaskDatabase = (): TaskDB | null => {
  return _taskDB
}

/**
 * 更新任务状态
 * @param taskId - 任务ID
 * @param status - 新状态
 * @returns - 操作是否成功
 */
export const updateTaskStatus = async (
  taskId: string,
  status: TaskStatus
): Promise<boolean> => {
  if (!_taskDB) {
    throw new Error('任务数据库未初始化')
  }
  return taskUpdateStatus(_taskDB, taskId, status)
}

/**
 * 更新任务日志
 * @param taskId - 任务ID
 * @param logs - 完整日志内容
 * @returns - 操作是否成功
 */
export const updateTaskLogs = async (
  taskId: string,
  logs: string
): Promise<boolean> => {
  if (!_taskDB) {
    throw new Error('任务数据库未初始化')
  }
  return taskUpdateLogs(_taskDB, taskId, logs)
}

/**
 * 扩展后的创建任务数据库函数
 */
export const createTaskDatabase = async (dbPath: string) => {
  const taskDB = await initDatabase(dbPath)

  return {
    /**
     * 添加任务
     * @param params - 任务参数
     * @param executor - 任务执行回调函数
     * @returns 任务ID
     */
    add: async (params: CreateTaskParams, executor?: TaskExecutor): Promise<string> => {
      const taskId = await taskAdd(taskDB, params)

      // 如果提供了执行器，则存储它
      if (executor) {
        const { setTaskCallback } = await import('./queue')
        setTaskCallback(taskId, executor)
      }

      return taskId
    },
    /**
     * 获取任务详情
     * @param taskId - 任务ID
     * @returns 任务详情
     */
    get: (taskId: string) => taskGet(taskDB, taskId),
    /**
     * 获取任务列表
     * @param filter - 过滤条件
     * @returns 任务列表
     */
    list: (filter?: TaskFilter) => taskList(taskDB, filter),
    /**
     * 获取所有任务列表
     * @returns 所有任务列表
     */
    all: () => taskList(taskDB),
    /**
     * 获取任务日志
     * @param taskId - 任务ID
     * @returns 任务日志内容
     */
    logs: async (taskId: string): Promise<string | null> => {
      const task = await taskGet(taskDB, taskId)
      return task?.logs || null
    },
    /**
     * 取消任务
     * @param taskId - 任务ID
     * @returns 是否成功
     */
    cancel: async (taskId: string): Promise<boolean> => {
      return new Promise((resolve, reject) => {
        const now = Date.now()
        taskDB.db.run(
          'UPDATE tasks SET status = ?, updateTime = ?, endTime = ?, logs = logs || ? WHERE id = ? AND (status = ? OR status = ?)',
          ['cancelled', now, now, '\n任务已被手动取消', taskId, 'pending', 'running'],
          function (err) {
            if (err) {
              reject(err)
              return
            }

            // 移除任务回调
            import('./queue').then(({ removeTaskCallback }) => {
              removeTaskCallback(taskId)
            })

            resolve(this.changes > 0)
          }
        )
      })
    },
    /**
     * 删除任务
     * @param taskId - 任务ID
     * @returns 是否成功
     */
    delete: async (taskId: string): Promise<boolean> => {
      return new Promise((resolve, reject) => {
        taskDB.db.run(
          'DELETE FROM tasks WHERE id = ?',
          [taskId],
          function (err) {
            if (err) {
              reject(err)
              return
            }

            // 移除任务回调
            import('./queue').then(({ removeTaskCallback }) => {
              removeTaskCallback(taskId)
            })

            resolve(this.changes > 0)
          }
        )
      })
    },
    /**
     * 检查是否存在相同类型和目标的任务
     * @param type - 任务类型
     * @param target - 目标
     * @param statuses - 状态列表
     * @returns 是否存在
     */
    exists: (type: TaskType, target: string, statuses: TaskStatus[]) => {
      return taskExists(taskDB, type, target, statuses)
    },
    /**
     * 更新任务状态
     * @param taskId - 任务ID
     * @param status - 新状态
     * @returns 是否成功
     */
    update: {
      status: (taskId: string, status: TaskStatus) => {
        return taskUpdateStatus(taskDB, taskId, status)
      },
      /**
       * 更新任务日志
       * @param taskId - 任务ID
       * @param logs - 完整日志内容
       * @returns 是否成功
       */
      logs: (taskId: string, logs: string) => {
        return taskUpdateLogs(taskDB, taskId, logs)
      },
    },
    /**
     * 运行任务
     * @param taskId - 任务ID
     * @param onLog - 日志回调函数
     * @param onStatusChange - 状态变更回调函数
     * @returns 是否成功
     */
    run: async (
      taskId: string,
      onLog: (log: string) => void = () => { },
      onStatusChange: (status: TaskStatus) => void = () => { }
    ): Promise<boolean> => {
      const task = await taskGet(taskDB, taskId)
      if (!task) {
        onLog(`任务 ${taskId} 不存在`)
        onStatusChange('failed')
        return false
      }

      /** 获取任务执行器 */
      const { executeTask, getTaskCallback } = await import('./queue')

      /** 检查是否存在回调函数 */
      if (!getTaskCallback(taskId)) {
        onLog(`任务 ${taskId} 没有关联的执行回调函数`)
        onStatusChange('failed')
        return false
      }

      /** 先将任务状态更新为running */
      await taskUpdateStatus(taskDB, taskId, 'running')

      /** 创建日志收集器 */
      const logCollector = (log: string) => onLog(log)

      /** 创建状态监听器 */
      const statusListener = async (status: TaskStatus) => {
        /** 更新数据库中的状态 */
        await taskUpdateStatus(taskDB, taskId, status)

        /** 转发状态到外部回调 */
        onStatusChange(status)

        /** 移除回调 清理缓存 */
        if (status !== 'pending' && status !== 'running') {
          const { removeTaskCallback } = await import('./queue')
          removeTaskCallback(taskId)
        }
      }

      /** 执行任务 */
      return executeTask(task, logCollector, statusListener)
    },
  }
}
