import path from 'node:path'
import sqlite3, { type Database } from 'sqlite3'
import { mkdirSync } from '@/utils/fs/fsSync'
import { logPrefix } from '../redis/mock/sqlite'

/**
 * @description 简单的kv存储
 */
export class SQLiteWrapper {
  dbPath: string
  _db!: Database

  constructor (dbPath: string) {
    this.dbPath = dbPath
  }

  async _init () {
    mkdirSync(path.dirname(this.dbPath))

    await new Promise<void>((resolve, reject) => {
      this._db = new sqlite3.Database(
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
      this._db.exec(
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
      this._db.run(
        `
          CREATE TABLE IF NOT EXISTS redis_data (
            key TEXT PRIMARY KEY,
            value TEXT NOT NULL DEFAULT ''
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

    this._init = () => Promise.resolve(this)
    return this
  }

  /**
   * 设置键值对
   * @param key 键名
   * @param value 值
   * @returns 操作是否成功
   */
  async set<T> (key: string, value: T): Promise<boolean> {
    await this._init()
    return new Promise<boolean>((resolve) => {
      this._db.run(
        'INSERT OR REPLACE INTO redis_data (key, value) VALUES (?, ?)',
        [key, JSON.stringify(value)],
        (err) => {
          if (err) {
            logger.error(logPrefix('设置键值对失败:'))
            logger.error(err)
            resolve(false)
            return
          }
          resolve(true)
        }
      )
    })
  }

  /**
   * 获取所有匹配模式的键
   * @param pattern 匹配模式，支持SQL LIKE语法的通配符
   * @returns 匹配的键列表，失败时返回空数组
   */
  async keys (pattern: string = '*'): Promise<string[]> {
    await this._init()
    // 将Redis风格的通配符转换为SQL LIKE模式
    const sqlPattern = pattern.replace(/\*/g, '%').replace(/\?/g, '_')

    return new Promise<string[]>((resolve) => {
      this._db.all(
        'SELECT key FROM redis_data WHERE key LIKE ?',
        [sqlPattern],
        (err, rows: { key: string }[]) => {
          if (err) {
            logger.error(logPrefix('获取键列表失败:'))
            logger.error(err)
            resolve([])
            return
          }
          resolve(rows.map(row => row.key))
        }
      )
    })
  }

  /**
   * 获取键对应的值
   * @param key 键名
   * @returns 值，如果键不存在或值损坏则返回null
   */
  async get<T> (key: string): Promise<T | null> {
    await this._init()
    return new Promise<T | null>((resolve) => {
      this._db.get(
        'SELECT value FROM redis_data WHERE key = ?',
        [key],
        async (err, row: { value: string } | undefined) => {
          if (err || !row) {
            resolve(null)
            return
          }
          try {
            resolve(JSON.parse(row.value))
          } catch (e) {
            // 如果反序列化失败，删除该key
            await this.del(key)
            resolve(null)
          }
        }
      )
    })
  }

  /**
   * 删除键
   * @param key 要删除的键
   * @returns 是否删除成功
   */
  async del (key: string): Promise<boolean> {
    await this._init()
    return new Promise<boolean>((resolve) => {
      this._db.run(
        'DELETE FROM redis_data WHERE key = ?',
        [key],
        function (err) {
          if (err) {
            logger.error(logPrefix('删除键失败:'))
            logger.error(err)
            resolve(false)
            return
          }
          resolve(this.changes > 0)
        }
      )
    })
  }
}
