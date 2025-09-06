import fs from 'node:fs'
import path from 'node:path'
import sqlite3 from 'sqlite3'
import { logger } from '@karinjs/logger'

/**
 * @description 日志前缀
 */
export const logPrefix = (message: string) => `[redis-mock] ${message}`

/**
 * @description SQLite3封装类，用于Redis模拟的持久化存储 new之后需要调用init方法
 */
export class SQLiteWrapper {
  db!: sqlite3.Database
  #isClosing: boolean = false
  #inTransaction: boolean = false
  dbPath: string

  /**
   * 构造函数
   * @param dbPath 数据库路径
   */
  constructor (dbPath: string) {
    this.dbPath = dbPath
  }

  /**
   * 初始化数据库连接和表结构
   */
  async init () {
    fs.mkdirSync(path.dirname(this.dbPath), { recursive: true })

    await new Promise<void>((resolve, reject) => {
      this.db = new sqlite3.Database(
        this.dbPath,
        sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
        (err) => {
          if (err) {
            logger.error(logPrefix('SQLite数据库连接失败:'))
            logger.error(err)
            reject(err)
            return
          }
          resolve()
        }
      )
    })

    await new Promise<void>((resolve) => {
      this.db.exec(
        `
          PRAGMA foreign_keys = ON;
          PRAGMA journal_mode = WAL;
          PRAGMA synchronous = NORMAL;
          `,
        (pragmaErr) => {
          if (pragmaErr) {
            logger.warn(logPrefix('设置SQLite PRAGMA失败:'))
            logger.warn(pragmaErr)
          }
          resolve()
        }
      )
    })

    await new Promise<void>((resolve, reject) => {
      this.db.run(
        `
          CREATE TABLE IF NOT EXISTS redis_data (
            key TEXT PRIMARY KEY,
            type TEXT NOT NULL,
            expire INTEGER NOT NULL,
            value TEXT NOT NULL
          )
          `,
        (err) => {
          if (err) {
            logger.error(logPrefix('创建SQLite表失败:'))
            logger.error(err)
            reject(err)
            return
          }
          resolve()
        }
      )
    })

    return this
  }

  /**
   * 获取所有键
   * @returns 返回所有键的数组
   */
  async keys (): Promise<string[]> {
    if (this.#isClosing) {
      throw new Error('数据库正在关闭中')
    }

    return new Promise<string[]>((resolve, reject) => {
      this.db.all(
        'SELECT key FROM redis_data',
        [],
        (err, rows: { key: string }[]) => {
          if (err) {
            logger.error(logPrefix('获取所有键失败:'))
            logger.error(err)
            reject(err)
            return
          }
          resolve(rows ? rows.map((row: { key: string }) => row.key) : [])
        }
      )
    })
  }

  /**
   * 获取指定键的数据
   * @param key 键名
   * @returns 返回键的数据或null
   */
  async get (key: string): Promise<{ type: string, expire: number, value: string } | null> {
    if (!key) {
      return null
    }

    if (this.#isClosing) {
      throw new Error('数据库正在关闭中')
    }

    return await this.query(
      'SELECT type, expire, value FROM redis_data WHERE key = ?',
      [key]
    )
      .then((rows) => rows[0] || null)
      .catch((err) => {
        logger.error(logPrefix(`获取键${key}的值失败:`))
        logger.error(err)
        return null
      })
  }

  /**
   * 设置键值对
   * @param key 键名
   * @param type 类型
   * @param expire 过期时间
   * @param value 值
   * @returns 成功返回true
   */
  async set (key: string, value: string, type: string, expire: number = -1): Promise<boolean> {
    if (!key) {
      throw new Error('键名不能为空')
    }

    if (this.#isClosing) {
      throw new Error('数据库正在关闭中')
    }

    return await this.run(
      'INSERT OR REPLACE INTO redis_data (key, type, expire, value) VALUES (?, ?, ?, ?)',
      [key, type, expire, value])
      .then((changes) => changes > 0)
      .catch((err) => {
        logger.error(logPrefix(`设置键${key}的值失败:`))
        logger.error(err)
        return false
      })
  }

  /**
   * 删除键
   * @param key 键名
   * @returns 成功返回true
   */
  async del (key: string): Promise<boolean> {
    if (!key) {
      return false
    }

    if (this.#isClosing) {
      throw new Error('数据库正在关闭中')
    }

    return await this.run(
      'DELETE FROM redis_data WHERE key = ?',
      [key]
    )
      .then((changes) => changes > 0)
      .catch((err) => {
        logger.error(logPrefix(`删除键${key}失败:`))
        logger.error(err)
        return false
      })
  }

  /**
   * 设置键的过期时间
   * @param key 键名
   * @param expire 过期时间
   * @returns 成功返回true
   */
  async expire (key: string, expire: number): Promise<boolean> {
    if (!key) {
      return false
    }

    return await this.run('UPDATE redis_data SET expire = ? WHERE key = ?', [expire, key])
      .then((changes) => changes > 0)
      .catch((err) => {
        logger.error(logPrefix(`设置键${key}的过期时间失败:`))
        logger.error(err)
        return false
      })
  }

  /**
   * 获取所有数据
   * @returns 返回所有数据的数组
   */
  async getAllData (): Promise<Array<{ key: string, type: string, expire: number, value: string }>> {
    if (this.#isClosing) {
      throw new Error('数据库正在关闭中')
    }

    return new Promise((resolve, reject) => {
      this.db.all(
        'SELECT key, type, expire, value FROM redis_data',
        [],
        (err, rows: Array<{ key: string, type: string, expire: number, value: string }>) => {
          if (err) {
            logger.error(logPrefix('获取所有数据失败:'))
            logger.error(err)
            reject(err)
            return
          }
          resolve(rows || [])
        })
    })
  }

  /**
   * 关闭数据库连接
   */
  async close (): Promise<void> {
    if (this.#isClosing) {
      return
    }

    this.#isClosing = true

    return new Promise<void>((resolve, reject) => {
      this.db.close((err) => {
        if (err) {
          logger.error(logPrefix('关闭SQLite数据库失败:'))
          logger.error(err)
          this.#isClosing = false
          reject(err)
          return
        }
        resolve()
      })
    })
  }

  /**
   * 开始事务
   */
  async beginTransaction (): Promise<void> {
    if (this.#isClosing) {
      throw new Error('数据库正在关闭中')
    }

    if (this.#inTransaction) {
      logger.warn(logPrefix('已在事务中，跳过开始新事务'))
      return
    }

    return new Promise<void>((resolve, reject) => {
      this.db.run('BEGIN TRANSACTION', (err) => {
        if (err) {
          logger.error(logPrefix('开始事务失败:'))
          logger.error(err)
          reject(err)
          return
        }
        this.#inTransaction = true
        resolve()
      })
    })
  }

  /**
   * 提交事务
   */
  async commitTransaction (): Promise<void> {
    if (this.#isClosing) {
      throw new Error('数据库正在关闭中')
    }

    if (!this.#inTransaction) {
      logger.warn(logPrefix('没有活动事务，跳过提交'))
      return
    }

    return new Promise<void>((resolve, reject) => {
      this.db.run('COMMIT', (err) => {
        if (err) {
          logger.error(logPrefix('提交事务失败:'))
          logger.error(err)
          reject(err)
          return
        }
        this.#inTransaction = false
        resolve()
      })
    })
  }

  /**
   * 回滚事务
   */
  async rollbackTransaction (): Promise<void> {
    if (this.#isClosing) {
      throw new Error('数据库正在关闭中')
    }

    if (!this.#inTransaction) {
      logger.warn(logPrefix('没有活动事务，跳过回滚'))
      return
    }

    return new Promise<void>((resolve, reject) => {
      this.db.run('ROLLBACK', (err) => {
        if (err) {
          logger.error(logPrefix('回滚事务失败:'))
          logger.error(err)
          reject(err)
          return
        }
        this.#inTransaction = false
        resolve()
      })
    })
  }

  /**
   * 执行SQL查询并返回结果
   * @param sql SQL语句
   * @param params 参数
   * @returns 查询结果
   */
  async query (sql: string, params: any[] = []): Promise<any[]> {
    if (!this.db) throw new Error('数据库未初始化')

    return new Promise((resolve, reject) => {
      this.db!.all(sql, params, (err, rows) => {
        if (err) {
          logger.error(logPrefix(`查询失败: ${sql}`))
          logger.error(err)
          reject(err)
          return
        }
        resolve(rows)
      })
    })
  }

  /**
   * 清理过期键
   */
  async cleanupExpiredKeys (): Promise<number> {
    const now = Date.now()
    const expiredKeys = await this.query(
      'SELECT key FROM redis_data WHERE expire != -1 AND expire < ? LIMIT 500',
      [now]
    )

    return expiredKeys.length
  }

  /**
   * 将db.run方法封装为Promise
   * @param sql SQL语句
   * @param params 参数数组
   * @returns 返回受影响的行数
   */
  async run<T>(sql: string, params: T): Promise<number> {
    if (this.#isClosing) {
      throw new Error('数据库正在关闭中...')
    }

    return new Promise<number>((resolve, reject) => {
      this.db.run(sql, params, function (err) {
        if (err) {
          reject(err)
          return
        }
        resolve(this.changes)
      })
    })
  }
}
