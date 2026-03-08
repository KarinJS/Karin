import path from 'node:path'
import Database from 'better-sqlite3'
import { store } from '@karin/core-store'

import type BetterSqlite3 from 'better-sqlite3'

/** name 合法字符：中英文、数字、短横线、下划线、点 */
const NAME_PATTERN = /^[\u4e00-\u9fa5a-zA-Z0-9\-_.]+$/

/**
 * 基于 SQLite 的同步 KV 存储
 *
 * 提供类似 Redis 的基础操作接口，所有方法均为同步调用。
 *
 * @example
 * ```ts
 * const kv = new KVStore('my-data')
 * kv.set('name', 'karin')
 * kv.get('name') // 'karin'
 * kv.keys()      // ['name']
 * ```
 */
export class KVStore {
  readonly name: string
  private db: BetterSqlite3.Database

  #stmtGet: BetterSqlite3.Statement
  #stmtSet: BetterSqlite3.Statement
  #stmtDel: BetterSqlite3.Statement
  #stmtHas: BetterSqlite3.Statement
  #stmtKeys: BetterSqlite3.Statement
  #stmtKeysPattern: BetterSqlite3.Statement
  #stmtClear: BetterSqlite3.Statement
  #stmtCount: BetterSqlite3.Statement
  #stmtGetAll: BetterSqlite3.Statement
  #stmtExpire: BetterSqlite3.Statement
  #stmtTtl: BetterSqlite3.Statement
  #stmtCleanExpired: BetterSqlite3.Statement
  #stmtIncr: BetterSqlite3.Statement

  /**
   * @param name 存储名称，用作数据库文件名，仅允许中英文、数字、短横线、下划线和点
   */
  constructor (name: string) {
    if (!name || !NAME_PATTERN.test(name)) {
      throw new Error(`无效的存储名称 "${name}"，仅允许中英文、数字、短横线(-)、下划线(_)和点(.)`)
    }

    this.name = name
    const dir = path.join(store.dir.data, 'db', 'kv')
    store.ensure(dir)

    const dbPath = path.join(dir, `${name}.db`)
    this.db = new Database(dbPath)

    this.db.pragma('journal_mode = WAL')
    this.db.pragma('synchronous = NORMAL')

    this.db.exec(`
      CREATE TABLE IF NOT EXISTS kv (
        key   TEXT PRIMARY KEY,
        value TEXT NOT NULL,
        expire INTEGER NOT NULL DEFAULT 0
      )
    `)

    // 预编译常用语句
    this.#stmtGet = this.db.prepare('SELECT value FROM kv WHERE key = ?')
    this.#stmtSet = this.db.prepare('INSERT OR REPLACE INTO kv (key, value, expire) VALUES (?, ?, ?)')
    this.#stmtDel = this.db.prepare('DELETE FROM kv WHERE key = ?')
    this.#stmtHas = this.db.prepare('SELECT 1 FROM kv WHERE key = ?')
    this.#stmtKeys = this.db.prepare('SELECT key FROM kv')
    this.#stmtKeysPattern = this.db.prepare('SELECT key FROM kv WHERE key LIKE ?')
    this.#stmtClear = this.db.prepare('DELETE FROM kv')
    this.#stmtCount = this.db.prepare('SELECT COUNT(*) AS count FROM kv')
    this.#stmtGetAll = this.db.prepare('SELECT key, value FROM kv')
    this.#stmtExpire = this.db.prepare('UPDATE kv SET expire = ? WHERE key = ?')
    this.#stmtTtl = this.db.prepare('SELECT expire FROM kv WHERE key = ?')
    this.#stmtCleanExpired = this.db.prepare('DELETE FROM kv WHERE expire > 0 AND expire <= ?')
    this.#stmtIncr = this.db.prepare(`
      INSERT INTO kv (key, value, expire) VALUES (?, ?, 0)
      ON CONFLICT(key) DO UPDATE SET value = CAST(CAST(value AS INTEGER) + ? AS TEXT)
    `)
  }

  /** 清理已过期的键 */
  private cleanExpired (): void {
    this.#stmtCleanExpired.run(Date.now())
  }

  /**
   * 检查单个键是否已过期，如果过期则删除
   * @param key 键名
   */
  private isExpired (key: string): boolean {
    const row = this.#stmtTtl.get(key) as { expire: number } | undefined
    if (!row) return true
    if (row.expire > 0 && row.expire <= Date.now()) {
      this.#stmtDel.run(key)
      return true
    }
    return false
  }

  /**
   * 设置键值对
   * @param key 键名
   * @param value 值（会序列化为 JSON 字符串）
   * @param ttl 过期时间（秒），不传或 0 表示永不过期
   */
  set (key: string, value: unknown, ttl?: number): void {
    const expire = ttl && ttl > 0 ? Date.now() + ttl * 1000 : 0
    this.#stmtSet.run(key, JSON.stringify(value), expire)
  }

  /**
   * 获取键对应的值
   * @param key 键名
   * @returns 反序列化后的值，不存在或已过期返回 `undefined`
   */
  get<T = unknown> (key: string): T | undefined {
    if (this.isExpired(key)) return undefined
    const row = this.#stmtGet.get(key) as { value: string } | undefined
    if (!row) return undefined
    return JSON.parse(row.value) as T
  }

  /**
   * 获取所有键
   * @param pattern 可选的通配符匹配模式，支持 `*` 和 `?`
   * @returns 键名数组
   */
  keys (pattern?: string): string[] {
    this.cleanExpired()
    if (!pattern) {
      return (this.#stmtKeys.all() as { key: string }[]).map(r => r.key)
    }
    // 将通配符模式转换为 SQL LIKE 模式
    const like = pattern.replaceAll('*', '%').replaceAll('?', '_')
    return (this.#stmtKeysPattern.all(like) as { key: string }[]).map(r => r.key)
  }

  /**
   * 删除指定键
   * @param key 键名
   * @returns 是否实际删除了数据
   */
  del (key: string): boolean {
    return this.#stmtDel.run(key).changes > 0
  }

  /**
   * 判断键是否存在（且未过期）
   * @param key 键名
   */
  has (key: string): boolean {
    if (this.isExpired(key)) return false
    return this.#stmtHas.get(key) !== undefined
  }

  /**
   * 为已存在的键设置过期时间
   * @param key 键名
   * @param seconds 过期秒数，0 表示取消过期
   * @returns 是否成功（键不存在返回 false）
   */
  expire (key: string, seconds: number): boolean {
    if (this.isExpired(key)) return false
    const expire = seconds > 0 ? Date.now() + seconds * 1000 : 0
    return this.#stmtExpire.run(expire, key).changes > 0
  }

  /**
   * 获取键的剩余存活时间
   * @param key 键名
   * @returns 剩余秒数；永不过期返回 -1；键不存在返回 -2
   */
  ttl (key: string): number {
    if (this.isExpired(key)) return -2
    const row = this.#stmtTtl.get(key) as { expire: number } | undefined
    if (!row) return -2
    if (row.expire === 0) return -1
    return Math.max(0, Math.ceil((row.expire - Date.now()) / 1000))
  }

  /**
   * 将键对应的值递增
   * @param key 键名
   * @param amount 递增量，默认 1
   * @returns 递增后的值
   */
  incr (key: string, amount = 1): number {
    this.#stmtIncr.run(key, String(amount), amount)
    const row = this.#stmtGet.get(key) as { value: string }
    return Number(row.value)
  }

  /**
   * 将键对应的值递减
   * @param key 键名
   * @param amount 递减量，默认 1
   * @returns 递减后的值
   */
  decr (key: string, amount = 1): number {
    return this.incr(key, -amount)
  }

  /**
   * 获取所有键值对
   * @returns `Map<string, unknown>`
   */
  entries (): Map<string, unknown> {
    this.cleanExpired()
    const rows = this.#stmtGetAll.all() as { key: string, value: string }[]
    const map = new Map<string, unknown>()
    for (const row of rows) {
      map.set(row.key, JSON.parse(row.value))
    }
    return map
  }

  /**
   * 获取当前存储的键数量（排除已过期）
   */
  size (): number {
    this.cleanExpired()
    return (this.#stmtCount.get() as { count: number }).count
  }

  /**
   * 清空所有数据
   */
  clear (): void {
    this.#stmtClear.run()
  }

  /**
   * 关闭数据库连接
   */
  close (): void {
    this.db.close()
  }
}
