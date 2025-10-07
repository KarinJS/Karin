import lodash from 'lodash'
import moment from 'moment'
import { Key } from './key'
import { EventEmitter } from 'node:events'
import { diffSimpleArray } from '@/utils/common'
import type { SQLiteWrapper } from './sqlite'

/**
 * @description 轻量化的 Redis 客户端 仅支持部分命令
 * @class RedisClient
 */
export class RedisClient extends EventEmitter {
  id: string
  /** 键、类型、过期时间映射 */
  store: Record<string, { type: Key, expire: number }> = {}
  /** 键值对 */
  #str: Record<string, string> = {}
  /** 数字对 */
  #num: Record<string, number> = {}
  /** 哈希表 */
  #hash: Record<string, Record<string, string | Buffer>> = {}
  /** 列表 */
  #list: Record<string, Array<string | Buffer>> = {}
  /** 集合 */
  #set: Record<string, Set<string | Buffer>> = {}
  /** 有序集合 */
  #zset: Record<string, { score: number, member: string | Buffer }[]> = {}
  /** HyperLogLog */
  #pf: Record<string, Set<string | Buffer>> = {}
  /** 位图 */
  #bit: Record<string, Buffer> = {}
  /** sqlite3 */
  #sqlite: SQLiteWrapper

  constructor (sqlite: SQLiteWrapper) {
    super()
    this.id = 'mock'
    this.store = {}
    this.#str = {}
    this.#num = {}
    this.#hash = {}
    this.#list = {}
    this.#set = {}
    this.#zset = {}
    this.#pf = {}
    this.#bit = {}
    this.#sqlite = sqlite
  }

  async init () {
    await this.loadData()

    /** 每30秒检查过期 */
    setInterval(() => {
      const keys = Object.keys(this.store)
      keys.forEach((key) => this.checkExpire(key))
    }, 30000)

    /** 每5分钟存一次sqlite */
    setInterval(() => this.save(), 5 * 60 * 1000)
    return this
  }

  /**
   * @description 加载数据
   */
  private async loadData () {
    const list = await this.#sqlite.getAllData()

    const keyMap = {
      [Key.STR]: (key: string, value: string) => {
        this.#str[key] = value
      },
      [Key.NUM]: (key: string, value: string) => {
        this.#num[key] = Number(value)
      },
      [Key.HASH]: (key: string, value: string) => {
        const hash = JSON.parse(value)
        for (const field in hash) {
          if (typeof hash[field] !== 'string') {
            hash[field] = Buffer.from(hash[field])
          }
        }
        this.#hash[key] = hash
      },
      [Key.LIST]: (key: string, value: string) => {
        this.#list[key] = JSON.parse(value)
      },
      [Key.SET]: (key: string, value: string) => {
        this.#set[key] = new Set(JSON.parse(value))
      },
      [Key.ZSET]: (key: string, value: string) => {
        this.#zset[key] = JSON.parse(value)
      },
      [Key.PF]: (key: string, value: string) => {
        this.#pf[key] = new Set(JSON.parse(value))
      },
      [Key.BIT]: (key: string, value: string) => {
        this.#bit[key] = Buffer.from(value)
      },
    }

    const isKey = (type: string): type is Key => {
      return keyMap[type as Key] !== undefined
    }

    list.forEach((item) => {
      const { key, type, expire, value } = item
      if (isKey(type)) {
        this.store[key] = { type, expire }
        keyMap[type](key, value)
      } else {
        this.#sqlite.del(key)
      }
    })

    logger.debug(`[Redis-mock] 加载数据完成: ${list.length}`)
  }

  /**
   * @description 检查过期
   * @param key 键
   * @param isRemove 是否删除 默认删除
   * @returns 是否过期或值
   */
  private checkExpire (key: string, isRemove: boolean = true): boolean {
    if (!this.store[key]) return false
    if (this.store[key].expire !== -1 && this.store[key].expire < moment().valueOf()) {
      if (!isRemove) return true
      this.#del(key)
      return true
    }
    return false
  }

  /**
   * @description 直接删除键 不检查是否存在
   * @param key 键
   */
  #del (key: string): void {
    const { type } = this.store[key]
    delete this.store[key]
    switch (type) {
      case Key.STR:
        delete this.#str[key]
        break
      case Key.NUM:
        delete this.#num[key]
        break
      case Key.HASH:
        delete this.#hash[key]
        break
      case Key.LIST:
        delete this.#list[key]
        break
      case Key.SET:
        delete this.#set[key]
        break
      case Key.ZSET:
        delete this.#zset[key]
        break
      case Key.PF:
        delete this.#pf[key]
        break
      case Key.BIT:
        delete this.#bit[key]
        break
    }

    this.#sqlite.del(key)
    logger.trace(`[Redis-mock] 删除键 ${key}`)
  }

  /**
   * @description 获取键的类型
   * @param key 键
   * @returns 键的类型
   */
  type (key: string): `${Key}` | undefined {
    return this.store[key]?.type
  }

  /**
   * @description 存储键值对
   * @param key 键
   * @param value 值
   * @param options 其他参数
   */
  async set (key: string, value: string | Buffer, options: any = {}): Promise<string | null> {
    /*
    | **参数**       | **对应 Redis 原生选项** | **作用**                            | **说明**                                 |
    |----------------|-------------------------|-------------------------------------|------------------------------------------|
    | `EX`           | `EX`                   | 设置相对过期时间（秒）               | 10 表示键将在 10 秒后过期                |
    | `PX`           | `PX`                   | 设置相对过期时间（毫秒）             | 10000 表示键将在 10000 毫秒后过期        |
    | `EXAT`         | `EXAT`                 | 设置绝对过期时间（秒级时间戳）       | 如 `1700000000` 表示某个 Unix 时间戳     |
    | `PXAT`         | `PXAT`                 | 设置绝对过期时间（毫秒级时间戳）     | 如 `1700000000000` 表示某个时间戳（毫秒）|
    | `NX`           | `NX`                   | 仅当键不存在时设置                   | 防止覆盖已有数据                         |
    | `XX`           | `XX`                   | 仅当键存在时设置                     | 只更新已存在的键                         |
    | `GET`          | `GET`                  | 返回旧值并设置新值                   | 替换时保留旧值，方便后续使用             |
    | `KEEPTTL`      | `KEEPTTL`              | 保持原有过期时间                    | 不更新过期时间
    */

    let expire = -1
    if (!Buffer.isBuffer(value) && typeof value !== 'string') {
      value = String(value)
    } else if (Buffer.isBuffer(value)) {
      value = value.toString()
    }

    /** 参数3如果为空直接保存即可 */
    if (lodash.isEmpty(options)) {
      this.store[key] = { type: Key.STR, expire }
      this.#str[key] = value

      this.#sqlite.set(key, value, Key.STR, expire)
      return 'OK'
    }

    /** EX */
    if (options?.EX !== undefined) {
      const EX = Number(options.EX)
      if (!isNaN(EX)) expire = moment().add(EX, 'seconds').valueOf()
      this.store[key] = { type: Key.STR, expire }
      this.#str[key] = value
      /** PX */
    } else if (options?.PX !== undefined) {
      const PX = Number(options.PX)
      if (!isNaN(PX)) expire = moment().add(PX, 'milliseconds').valueOf()
      this.store[key] = { type: Key.STR, expire }
      this.#str[key] = value
      /** EXAT */
    } else if (options?.EXAT !== undefined) {
      const EXAT = Number(options.EXAT)
      if (!isNaN(EXAT)) expire = EXAT
      this.store[key] = { type: Key.STR, expire }
      this.#str[key] = value
      /** PXAT */
    } else if (options?.PXAT !== undefined) {
      const PXAT = Number(options.PXAT)
      if (!isNaN(PXAT)) expire = PXAT
      this.store[key] = { type: Key.STR, expire }
      this.#str[key] = value
      /** KEEPTTL */
    } else if (options?.KEEPTTL) {
      if (this.#str[key] && this.store[key]) {
        this.#str[key] = value
        expire = this.store[key].expire
      } else {
        this.store[key] = { type: Key.STR, expire: -1 }
        this.#str[key] = value
        expire = -1
      }
      /** NX */
    } else if (options?.NX) {
      if (!this.#str[key]) {
        this.store[key] = { type: Key.STR, expire: -1 }
        this.#str[key] = value
        this.#sqlite.set(key, value, Key.STR, expire)
      }
      return 'OK'
      /** XX */
    } else if (options?.XX) {
      if (this.#str[key] && this.store[key]) {
        this.#str[key] = value
        const currentExpire = this.store[key].expire
        this.#sqlite.set(key, value, Key.STR, currentExpire)
        return 'OK'
      } else {
        return null
      }
      /** GET */
    } else if (options?.GET) {
      this.store[key] = { type: Key.STR, expire: -1 }
      if (this.#str[key]) {
        const oldValue = this.#str[key]
        this.#str[key] = value
        this.#sqlite.set(key, value, Key.STR, expire)
        return oldValue
      }

      this.#str[key] = value
      this.#sqlite.set(key, value, Key.STR, expire)
      return null
      /** 默认 */
    } else {
      this.store[key] = { type: Key.STR, expire: -1 }
      this.#str[key] = value
    }

    this.#sqlite.set(key, value, Key.STR, expire)
    return 'OK'
  }

  /**
   * @description 获取键值
   * @param key 键
   */
  async get (key: string): Promise<string | null> {
    if (!this.store[key]) return null
    /** 检查过期 */
    if (this.checkExpire(key)) return null

    const { type } = this.store[key]
    if (type === Key.NUM) {
      return String(this.#num[key])
    } else {
      return this.#str[key].toString()
    }
  }

  /**
   * @description 设置键值对并指定过期时间（秒）
   * @param key 键
   * @param seconds 过期时间（秒）
   * @param value 值
   */
  async setEx (key: string, seconds: number, value: string | Buffer): Promise<string | null> {
    return await this.set(key, value, { EX: seconds })
  }

  /**
   * @description 设置键值对并指定过期时间（毫秒）
   * @param key 键
   * @param milliseconds 过期时间（毫秒）
   * @param value 值
   */
  async pSetEx (key: string, milliseconds: number, value: string | Buffer): Promise<string | null> {
    return await this.set(key, value, { PX: milliseconds })
  }

  /**
   * @description 仅当键不存在时设置键值对
   * @param key 键
   * @param value 值
   */
  async setNX (key: string, value: string | Buffer): Promise<boolean> {
    if (this.store[key] && !this.checkExpire(key)) {
      return false
    }
    await this.set(key, value, { NX: true })
    return true
  }

  /**
   * @description 获取键值并设置过期时间
   * @param key 键
   * @param options 过期时间选项（EX: 秒, PX: 毫秒, EXAT: 秒级时间戳, PXAT: 毫秒级时间戳）
   */
  async getEx (key: string, options?: { EX?: number, PX?: number, EXAT?: number, PXAT?: number, PERSIST?: boolean }): Promise<string | null> {
    const value = await this.get(key)
    if (value === null) return null

    if (options?.PERSIST) {
      // 移除过期时间
      if (this.store[key]) {
        this.store[key].expire = -1
        const { type } = this.store[key]
        const currentValue = this.getValueStringByKey(key)
        this.#sqlite.set(key, currentValue, type, -1)
      }
    } else if (options?.EX !== undefined) {
      await this.expire(key, options.EX)
    } else if (options?.PX !== undefined) {
      const expire = moment().add(options.PX, 'milliseconds').valueOf()
      this.store[key].expire = expire
      const { type } = this.store[key]
      const currentValue = this.getValueStringByKey(key)
      this.#sqlite.set(key, currentValue, type, expire)
    } else if (options?.EXAT !== undefined) {
      this.store[key].expire = options.EXAT * 1000
      const { type } = this.store[key]
      const currentValue = this.getValueStringByKey(key)
      this.#sqlite.set(key, currentValue, type, options.EXAT * 1000)
    } else if (options?.PXAT !== undefined) {
      this.store[key].expire = options.PXAT
      const { type } = this.store[key]
      const currentValue = this.getValueStringByKey(key)
      this.#sqlite.set(key, currentValue, type, options.PXAT)
    }

    return value
  }

  /**
   * @description 获取键值并删除键
   * @param key 键
   */
  async getDel (key: string): Promise<string | null> {
    const value = await this.get(key)
    if (value !== null) {
      await this.del(key)
    }
    return value
  }

  /**
   * @description 删除键
   * @param key 键
   */
  async del (key: string): Promise<number> {
    if (!this.store[key]) return 0
    this.#del(key)
    return 1
  }

  /**
   * @description 检查键是否存在
   * @param key 键
   */
  async exists (key: string): Promise<number> {
    if (!this.store[key]) return 0
    if (this.checkExpire(key)) return 0
    return 1
  }

  /**
   * @description 设置键的过期时间
   * @param key 键
   * @param seconds 过期时间（秒）
   */
  async expire (key: string, seconds: number): Promise<number> {
    if (!this.store[key]) return 0
    const expire = moment().add(seconds, 'seconds').valueOf()
    this.store[key].expire = expire
    this.#sqlite.expire(key, expire)
    return 1
  }

  /**
   * @description 设置键的过期时间戳（秒）
   * @param key 键
   * @param timestamp 过期时间戳（秒）
   */
  async expireAt (key: string, timestamp: number): Promise<number> {
    if (!this.store[key]) return 0
    this.store[key].expire = timestamp * 1000
    this.#sqlite.expire(key, timestamp * 1000)
    return 1
  }

  /**
   * @description 设置键的过期时间（毫秒）
   * @param key 键
   * @param milliseconds 过期时间（毫秒）
   */
  async pExpire (key: string, milliseconds: number): Promise<number> {
    if (!this.store[key]) return 0
    const expire = moment().add(milliseconds, 'milliseconds').valueOf()
    this.store[key].expire = expire
    this.#sqlite.expire(key, expire)
    return 1
  }

  /**
   * @description 设置键的过期时间戳（毫秒）
   * @param key 键
   * @param timestamp 过期时间戳（毫秒）
   */
  async pExpireAt (key: string, timestamp: number): Promise<number> {
    if (!this.store[key]) return 0
    this.store[key].expire = timestamp
    this.#sqlite.expire(key, timestamp)
    return 1
  }

  /**
   * @description 移除键的过期时间
   * @param key 键
   */
  async persist (key: string): Promise<number> {
    if (!this.store[key]) return 0
    if (this.store[key].expire === -1) return 0
    this.store[key].expire = -1
    const { type } = this.store[key]
    const currentValue = this.getValueStringByKey(key)
    this.#sqlite.set(key, currentValue, type, -1)
    return 1
  }

  /**
   * @description 获取键的过期时间
   * @param key 键
   */
  async ttl (key: string): Promise<number> {
    if (!this.store[key]) return -2
    if (this.store[key].expire === -1) return -1
    if (this.checkExpire(key)) return -2
    return moment(this.store[key].expire).diff(moment(), 'seconds')
  }

  /**
   * @description 获取键的过期时间（毫秒）
   * @param key 键
   */
  async pTTL (key: string): Promise<number> {
    if (!this.store[key]) return -2
    if (this.store[key].expire === -1) return -1
    if (this.checkExpire(key)) return -2
    return moment(this.store[key].expire).diff(moment(), 'milliseconds')
  }

  /**
   * @description 获取字符串长度
   * @param key 键
   */
  async strLen (key: string): Promise<number> {
    if (!this.store[key]) return 0
    if (this.checkExpire(key)) return 0
    const { type } = this.store[key]
    if (type === Key.STR) {
      return this.#str[key].length
    }
    return 0
  }

  /**
   * @description 重命名键
   * @param key 原键名
   * @param newKey 新键名
   */
  async rename (key: string, newKey: string): Promise<string> {
    if (!this.store[key]) throw new Error('no such key')
    
    // 获取原键的数据
    const { type, expire } = this.store[key]
    const value = this.getValueStringByKey(key)
    
    // 删除旧键
    this.#del(key)
    
    // 创建新键
    this.store[newKey] = { type, expire }
    
    // 根据类型设置值
    switch (type) {
      case Key.STR:
        this.#str[newKey] = value
        break
      case Key.NUM:
        this.#num[newKey] = Number(value)
        break
      case Key.HASH:
        this.#hash[newKey] = JSON.parse(value)
        break
      case Key.LIST:
        this.#list[newKey] = JSON.parse(value)
        break
      case Key.SET:
        this.#set[newKey] = new Set(JSON.parse(value))
        break
      case Key.ZSET:
        this.#zset[newKey] = JSON.parse(value)
        break
      case Key.PF:
        this.#pf[newKey] = new Set(JSON.parse(value))
        break
      case Key.BIT:
        this.#bit[newKey] = Buffer.from(value, 'base64')
        break
    }
    
    this.#sqlite.set(newKey, value, type, expire)
    return 'OK'
  }

  /**
   * @description 仅当新键不存在时重命名键
   * @param key 原键名
   * @param newKey 新键名
   */
  async renameNX (key: string, newKey: string): Promise<number> {
    if (!this.store[key]) return 0
    if (this.store[newKey] && !this.checkExpire(newKey)) return 0
    
    await this.rename(key, newKey)
    return 1
  }

  /**
   * @description 返回数据库中键的数量
   */
  async dbSize (): Promise<number> {
    // 清理过期键
    const keys = Object.keys(this.store)
    keys.forEach((key) => this.checkExpire(key))
    return Object.keys(this.store).length
  }

  /**
   * @description 从数据库中随机返回一个键
   */
  async randomKey (): Promise<string | null> {
    const keys = Object.keys(this.store)
    if (keys.length === 0) return null
    
    // 清理过期键
    keys.forEach((key) => this.checkExpire(key))
    
    const validKeys = Object.keys(this.store)
    if (validKeys.length === 0) return null
    
    const randomIndex = Math.floor(Math.random() * validKeys.length)
    return validKeys[randomIndex]
  }

  /**
   * @description 获取所有键
   * @param pattern 匹配规则
   */
  async keys (pattern: string): Promise<string[]> {
    const reg = new RegExp(pattern.replace(/\*/g, '.*'))

    const keys = Object.keys(this.store)
    const result: string[] = []
    await Promise.all(keys.map(async (key) => {
      if (this.checkExpire(key)) return

      if (reg.test(key)) {
        result.push(key)
      }
    }))

    return result
  }

  /**
   * @description 清空所有键
   */
  async flushAll (): Promise<string> {
    this.#str = {}
    this.#num = {}
    this.#hash = {}
    this.#list = {}
    this.#set = {}
    this.#zset = {}
    this.#pf = {}
    this.#bit = {}
    this.store = {}
    return 'OK'
  }

  /**
   * @description 自增
   * @param key 键
   */
  async incr (key: string): Promise<number> {
    if (!this.#num[key]) {
      this.#num[key] = 0
      this.store[key] = { type: Key.NUM, expire: -1 }
    } else if (this.checkExpire(key, false)) {
      this.store[key].expire = -1
      this.#num[key] = 0
    }

    this.#num[key] += 1
    this.#sqlite.set(key, String(this.#num[key]), Key.NUM, this.store[key].expire)
    return this.#num[key]
  }

  /**
   * @description 自增指定值
   * @param key 键
   * @param increment 增量
   */
  async incrBy (key: string, increment: number): Promise<number> {
    if (!this.#num[key]) {
      this.#num[key] = 0
      this.store[key] = { type: Key.NUM, expire: -1 }
    } else if (this.checkExpire(key, false)) {
      this.store[key].expire = -1
      this.#num[key] = 0
    }

    this.#num[key] += increment
    this.#sqlite.set(key, String(this.#num[key]), Key.NUM, this.store[key].expire)
    return this.#num[key]
  }

  /**
   * @description 自增指定浮点值
   * @param key 键
   * @param increment 增量（浮点数）
   */
  async incrByFloat (key: string, increment: number): Promise<number> {
    if (!this.#num[key]) {
      this.#num[key] = 0
      this.store[key] = { type: Key.NUM, expire: -1 }
    } else if (this.checkExpire(key, false)) {
      this.store[key].expire = -1
      this.#num[key] = 0
    }

    this.#num[key] += increment
    this.#sqlite.set(key, String(this.#num[key]), Key.NUM, this.store[key].expire)
    return this.#num[key]
  }

  /**
   * @description 自减
   * @param key 键
   */
  async decr (key: string): Promise<number> {
    if (!this.#num[key]) {
      this.#num[key] = 0
      this.store[key] = { type: Key.NUM, expire: -1 }
    } else if (this.checkExpire(key, false)) {
      this.store[key].expire = -1
      this.#num[key] = 0
    }

    this.#num[key] -= 1
    this.#sqlite.set(key, String(this.#num[key]), Key.NUM, this.store[key].expire)
    return this.#num[key]
  }

  /**
   * @description 自减指定值
   * @param key 键
   * @param decrement 减量
   */
  async decrBy (key: string, decrement: number): Promise<number> {
    if (!this.#num[key]) {
      this.#num[key] = 0
      this.store[key] = { type: Key.NUM, expire: -1 }
    } else if (this.checkExpire(key, false)) {
      this.store[key].expire = -1
      this.#num[key] = 0
    }

    this.#num[key] -= decrement
    this.#sqlite.set(key, String(this.#num[key]), Key.NUM, this.store[key].expire)
    return this.#num[key]
  }

  /**
   * @description 追加字符串
   * @param key 键
   * @param value 值
   */
  async append (key: string, value: string | Buffer): Promise<number> {
    if (!this.#str[key]) {
      this.#str[key] = ''
      this.store[key] = { type: Key.STR, expire: -1 }
    } else if (this.checkExpire(key, false)) {
      this.store[key].expire = -1
      this.#str[key] = ''
    }

    if (Buffer.isBuffer(value)) {
      this.#str[key] += Buffer.concat([Buffer.from(this.#str[key]), value]).toString()
    } else {
      this.#str[key] += value
    }

    this.#sqlite.set(key, this.#str[key], Key.STR, this.store[key].expire)
    return this.#str[key].length
  }

  /**
  * @description
  * @param key
  * @param field
  * @param value
  * @returns
  */
  /**
   * 将字段和值设置到指定键的哈希表中
   * 如果键不存在，则创建一个新的哈希表
   * @param key 哈希表的键
   * @param field 哈希表中的字段
   * @param value 要设置的值，可以是字符串或缓冲区
   * @returns 返回 1 表示设置成功，0 表示设置失败
   */
  async hSet (key: string, field: string, value: string | Buffer): Promise<number> {
    if (!this.#hash[key]) {
      this.store[key] = { type: Key.HASH, expire: -1 }
      this.#hash[key] = {}
    } else if (this.checkExpire(key, false)) {
      this.store[key].expire = -1
      this.#hash[key] = {}
    }

    this.#hash[key][field] = value
    this.#sqlite.set(key, JSON.stringify(this.#hash[key]), Key.HASH, this.store[key].expire)
    return 1
  }

  /**
   * 获取哈希表字段的值
   * @param key 哈希表的键
   * @param field 哈希表中的字段
   * @returns 返回字段的值，如果字段不存在则返回 null
   */
  async hGet (key: string, field: string): Promise<string | null> {
    if (!this.#hash[key] || !this.#hash[key][field]) return null
    if (this.checkExpire(key)) return null
    return this.#hash[key][field].toString()
  }

  /**
   * 删除哈希表中的一个或多个字段
   * @param key 哈希表的键
   * @param field 要删除的字段
   * @returns 返回成功删除的字段数量
   */
  async hDel (key: string, field: string): Promise<number> {
    if (!this.#hash[key] || !this.#hash[key][field]) return 0
    if (this.checkExpire(key)) return 0
    delete this.#hash[key][field]
    this.#sqlite.set(key, JSON.stringify(this.#hash[key]), Key.HASH, this.store[key].expire)
    return 1
  }

  /**
   * 获取哈希表中所有字段的值
   * @param key 哈希表的键
   * @returns 返回所有字段的值
   */
  async hGetAll (key: string): Promise<Record<string, string>> {
    if (!this.#hash[key]) return {}
    if (this.checkExpire(key)) return {}
    return lodash.mapValues(this.#hash[key], (value) => value.toString())
  }

  /**
   * 将一个或多个值插入到列表的头部
   * @param key 列表的键
   * @param values 要插入的值
   */
  async lPush (key: string, ...values: (string | Buffer)[]): Promise<number> {
    if (!this.#list[key]) {
      this.store[key] = { type: Key.LIST, expire: -1 }
      this.#list[key] = []
    } else if (this.checkExpire(key, false)) {
      this.store[key].expire = -1
      this.#list[key] = []
    }

    this.#list[key].unshift(...values)
    this.#sqlite.set(key, JSON.stringify(this.#list[key]), Key.LIST, this.store[key].expire)
    return this.#list[key].length
  }

  /**
   * 将一个或多个值插入到列表的尾部
   * @param key 列表的键
   * @param values 要插入的值
   */
  async rPush (key: string, ...values: (string | Buffer)[]): Promise<number> {
    if (!this.#list[key]) {
      this.store[key] = { type: Key.LIST, expire: -1 }
      this.#list[key] = []
    } else if (this.checkExpire(key, false)) {
      this.store[key].expire = -1
      this.#list[key] = []
    }

    this.#list[key].push(...values)
    this.#sqlite.set(key, JSON.stringify(this.#list[key]), Key.LIST, this.store[key].expire)
    return this.#list[key].length
  }

  /**
   * 移除并返回列表的第一个元素
   * @param key 列表的键
   * @returns 返回列表的第一个元素，如果列表为空则返回 null
   */
  async lPop (key: string): Promise<string | null> {
    if (!this.#list[key] || this.#list[key].length === 0) return null
    if (this.checkExpire(key)) return null
    const value = this.#list[key].shift()
    this.#sqlite.set(key, JSON.stringify(this.#list[key]), Key.LIST, this.store[key].expire)
    return value ? value.toString() : null
  }

  /**
   * 移除并返回列表的最后一个元素
   * @param key 列表的键
   * @returns 返回列表的最后一个元素，如果列表为空则返回 null
   */
  async rPop (key: string): Promise<string | null> {
    if (!this.#list[key] || this.#list[key].length === 0) return null
    if (this.checkExpire(key)) return null
    const value = this.#list[key].pop()
    this.#sqlite.set(key, JSON.stringify(this.#list[key]), Key.LIST, this.store[key].expire)
    return value ? value.toString() : null
  }

  /**
   * 返回列表指定范围内的元素
   * @param key 列表的键
   * @returns 返回列表指定范围内的元素
   */
  async lRange (key: string, start: number, stop: number): Promise<string[]> {
    if (!this.#list[key]) return []
    if (this.checkExpire(key)) return []
    const value = this.#list[key].slice(start, stop + 1).map((value) => value.toString())
    this.#sqlite.set(key, JSON.stringify(this.#list[key]), Key.LIST, this.store[key].expire)
    return value
  }

  /**
   * 向集合添加一个或多个成员
   * @param key 集合的键
   * @param members 要添加的成员
   * @returns 返回成功添加的成员数量
   */
  async sAdd (key: string, ...members: (string | Buffer)[]): Promise<number> {
    if (!this.#set[key]) {
      this.store[key] = { type: Key.SET, expire: -1 }
      this.#set[key] = new Set()
    } else if (this.checkExpire(key, false)) {
      this.store[key].expire = -1
      this.#set[key] = new Set()
    }

    let added = 0
    for (const member of members) {
      if (!this.#set[key].has(member.toString())) {
        this.#set[key].add(member.toString())
        added++
      }
    }
    this.#sqlite.set(key, JSON.stringify(this.#set[key]), Key.SET, this.store[key].expire)
    return added
  }

  /**
   * 从集合中移除一个或多个成员
   * @param key 集合的键
   * @param members 要移除的成员
   * @returns 返回成功移除的成员数量
   */
  async sRem (key: string, ...members: (string | Buffer)[]): Promise<number> {
    if (!this.#set[key]) return 0
    if (this.checkExpire(key)) return 0

    let removed = 0
    for (const member of members) {
      if (this.#set[key].has(member.toString())) {
        this.#set[key].delete(member.toString())
        removed++
      }
    }
    this.#sqlite.set(key, JSON.stringify(this.#set[key]), Key.SET, this.store[key].expire)
    return removed
  }

  /**
   * 返回集合的所有成员
   * @param key 集合的键
   * @returns 返回集合的所有成员
   */
  async sMembers (key: string): Promise<string[]> {
    if (!this.#set[key]) return []
    if (this.checkExpire(key)) return []

    const members = Array.from(this.#set[key])
    return members.map((member) => member.toString())
  }

  /**
   * 检查成员是否是集合的成员
   * @param key 集合的键
   * @param member 要检查的成员
   * @returns 返回 1 表示是集合的成员，0 表示不是集合的成员
   */
  async sismember (key: string, member: string | Buffer): Promise<number> {
    if (!this.#set[key]) return 0
    if (this.checkExpire(key)) return 0
    return this.#set[key].has(member.toString()) ? 1 : 0
  }

  /**
   * 向有序集合添加一个或多个成员
   * @param key 有序集合的键
   * @param score 分数
   * @param member 成员
   * @returns 返回成功添加的成员数量
   */
  async zAdd (key: string, score: number, member: string | Buffer): Promise<number> {
    if (!this.#zset[key]) {
      this.store[key] = { type: Key.ZSET, expire: -1 }
      this.#zset[key] = []
    } else if (this.checkExpire(key, false)) {
      this.store[key].expire = -1
      this.#zset[key] = []
    }

    const index = this.#zset[key].findIndex((entry) => entry.member === member.toString())
    if (index === -1) {
      this.#zset[key].push({ score, member })
    } else {
      this.#zset[key][index] = { score, member }
    }
    this.#sqlite.set(key, JSON.stringify(this.#zset[key]), Key.ZSET, this.store[key].expire)
    return 1
  }

  /**
   * 返回有序集合的成员数量
   * @param key 有序集合的键
   * @returns 返回有序集合的成员数量
   */
  async zcard (key: string): Promise<number> {
    if (!this.#list[key]) return 0
    if (this.checkExpire(key)) return 0
    return this.#list[key].length
  }

  /**
   * 返回有序集合中指定成员的排名
   * @param key 有序集合的键
   * @param member 成员
   * @returns 返回成员的排名，如果成员不存在则返回 null
   */
  async zRank (key: string, member: string | Buffer): Promise<number | null> {
    if (!this.#list[key]) return null
    if (this.checkExpire(key)) return null

    const index = this.#list[key].findIndex((entry) => entry === member.toString())
    return index !== -1 ? index : null
  }

  /**
   * 返回有序集合中指定成员的分数
   * @param key 有序集合的键
   * @param member 成员
   * @returns 返回成员的分数，如果成员不存在则返回 null
   */
  async zScore (key: string, member: string | Buffer): Promise<number | null> {
    if (!this.#list[key]) return null
    if (this.checkExpire(key)) return null

    const entry = this.#list[key].find((entry) => entry === member.toString())
    return entry ? entry.length : null
  }

  /**
   * 从 HyperLogLog 中添加一个或多个元素
   * @param key HyperLogLog 的键
   * @param elements 要添加的元素
   * @returns 返回 1 表示添加成功，0 表示添加失败
   */
  async pfAdd (key: string, ...elements: (string | Buffer)[]): Promise<boolean> {
    if (!this.#pf[key]) {
      this.store[key] = { type: Key.PF, expire: -1 }
      this.#pf[key] = new Set()
    } else if (this.checkExpire(key, false)) {
      this.store[key].expire = -1
      this.#pf[key] = new Set()
    }

    let added = 0
    for (const element of elements) {
      if (!this.#pf[key].has(element.toString())) {
        this.#pf[key].add(element.toString())
        added++
      }
    }
    this.#sqlite.set(key, JSON.stringify(this.#pf[key]), Key.PF, this.store[key].expire)
    return added > 0
  }

  /**
   * 返回 HyperLogLog 的基数估算值
   * @param key HyperLogLog 的键
   * @returns 返回基数估算值
   */
  async pfCount (key: string): Promise<number> {
    if (!this.#pf[key]) return 0
    if (this.checkExpire(key)) return 0
    return this.#pf[key].size
  }

  /**
   * @description 发布消息到频道
   * @param channel 频道
   * @param message 消息
   * @returns 返回订阅者数量
   */
  async publish (channel: string, message: string | Buffer): Promise<number> {
    this.emit(channel, message.toString())
    return this.listenerCount(channel)
  }

  /**
   * @description 订阅一个或多个频道
   * @param channels 频道
   * @param listener 监听器
   * @returns 返回订阅的频道数量
   */
  async subscribe (channels: string[], listener: (message: string) => void): Promise<number> {
    channels.forEach(channel => this.on(channel, listener))
    return channels.length
  }

  /**
   * @description 取消订阅一个或多个频道
   * @param channels 频道
   * @param listener 监听器
   * @returns 返回取消订阅的频道数量
   */
  async unsubscribe (channels: string[], listener: (message: string) => void): Promise<number> {
    channels.forEach(channel => this.off(channel, listener))
    return channels.length
  }

  /**
   * @description 设置位图指定偏移量的值
   * @param key 键
   * @param offset 偏移量
   * @param value 值
   * @returns 返回设置前的位
   */
  async setBit (key: string, offset: number, value: number): Promise<number> {
    if (!this.#bit[key]) {
      this.store[key] = { type: Key.BIT, expire: -1 }
      this.#bit[key] = Buffer.alloc(0)
    } else if (this.checkExpire(key, false)) {
      this.store[key].expire = -1
      this.#bit[key] = Buffer.alloc(0)
    }

    const byteOffset = Math.floor(offset / 8)
    const bitOffset = offset % 8
    const oldValue = this.#bit[key].readUInt8(byteOffset)
    const newValue = value ? oldValue | (1 << bitOffset) : oldValue & ~(1 << bitOffset)
    this.#bit[key].writeUInt8(newValue, byteOffset)
    this.#sqlite.set(key, this.#bit[key].toString('base64'), Key.BIT, this.store[key].expire)
    return oldValue
  }

  /**
   * @description 获取位图指定偏移量的值
   * @param key 键
   * @param offset 偏移量
   * @returns 返回位
   */
  async getBit (key: string, offset: number): Promise<number> {
    if (!this.#bit[key]) return 0
    if (this.checkExpire(key)) return 0

    const byteOffset = Math.floor(offset / 8)
    const bitOffset = offset % 8
    const value = this.#bit[key].readUInt8(byteOffset)
    return (value & (1 << bitOffset)) ? 1 : 0
  }

  /**
   * @description 获取位图的指定范围内的位
   * @param key 键
   * @param start 起始偏移量
   * @param end 结束偏移量
   * @returns 返回位数组
   */
  async getRange (key: string, start: number, end: number): Promise<number[]> {
    if (!this.#bit[key]) return []
    if (this.checkExpire(key)) return []

    const result: number[] = []
    for (let i = start; i <= end; i++) {
      result.push(await this.getBit(key, i))
    }
    return result
  }

  /**
   * 获取哈希表中字段是否存在
   * @param key 哈希表的键
   * @param field 哈希表中的字段
   * @returns 返回1表示字段存在，0表示字段不存在
   */
  async hExists (key: string, field: string): Promise<number> {
    if (!this.#hash[key]) return 0
    if (this.checkExpire(key)) return 0
    return this.#hash[key][field] !== undefined ? 1 : 0
  }

  /**
   * 获取哈希表中所有字段名
   * @param key 哈希表的键
   * @returns 返回所有字段名数组
   */
  async hKeys (key: string): Promise<string[]> {
    if (!this.#hash[key]) return []
    if (this.checkExpire(key)) return []
    return Object.keys(this.#hash[key])
  }

  /**
   * 获取哈希表中所有值
   * @param key 哈希表的键
   * @returns 返回所有值数组
   */
  async hVals (key: string): Promise<string[]> {
    if (!this.#hash[key]) return []
    if (this.checkExpire(key)) return []
    return Object.values(this.#hash[key]).map(value => value.toString())
  }

  /**
   * 获取哈希表中字段数量
   * @param key 哈希表的键
   * @returns 返回字段数量
   */
  async hLen (key: string): Promise<number> {
    if (!this.#hash[key]) return 0
    if (this.checkExpire(key)) return 0
    return Object.keys(this.#hash[key]).length
  }

  /**
   * 批量获取哈希表中字段的值
   * @param key 哈希表的键
   * @param fields 要获取的字段数组
   * @returns 返回字段值数组，不存在的字段返回null
   */
  async hMGet (key: string, ...fields: string[]): Promise<Array<string | null>> {
    if (!this.#hash[key]) return fields.map(() => null)
    if (this.checkExpire(key)) return fields.map(() => null)

    return fields.map(field => {
      const value = this.#hash[key][field]
      return value !== undefined ? value.toString() : null
    })
  }

  /**
   * 批量设置哈希表中字段的值
   * @param key 哈希表的键
   * @param fieldValues 字段和值的数组，格式为[field1, value1, field2, value2, ...]
   * @returns 返回"OK"
   */
  async hMSet (key: string, ...fieldValues: (string | Buffer)[]): Promise<string> {
    if (!this.#hash[key]) {
      this.store[key] = { type: Key.HASH, expire: -1 }
      this.#hash[key] = {}
    } else if (this.checkExpire(key, false)) {
      this.store[key].expire = -1
      this.#hash[key] = {}
    }

    for (let i = 0; i < fieldValues.length; i += 2) {
      if (i + 1 < fieldValues.length) {
        const field = fieldValues[i].toString()
        const value = fieldValues[i + 1]
        this.#hash[key][field] = value
      }
    }

    this.#sqlite.set(key, JSON.stringify(this.#hash[key]), Key.HASH, this.store[key].expire)
    return 'OK'
  }

  /**
   * 获取列表长度
   * @param key 列表的键
   * @returns 返回列表长度
   */
  async lLen (key: string): Promise<number> {
    if (!this.#list[key]) return 0
    if (this.checkExpire(key)) return 0
    return this.#list[key].length
  }

  /**
   * 获取列表指定索引的元素
   * @param key 列表的键
   * @param index 索引，0表示第一个元素，-1表示最后一个元素
   * @returns 返回元素值，索引超出范围返回null
   */
  async lIndex (key: string, index: number): Promise<string | null> {
    if (!this.#list[key]) return null
    if (this.checkExpire(key)) return null

    const list = this.#list[key]
    if (index < 0) {
      index = list.length + index
    }

    if (index < 0 || index >= list.length) {
      return null
    }

    return list[index].toString()
  }

  /**
   * 设置列表指定索引的元素值
   * @param key 列表的键
   * @param index 索引
   * @param value 值
   * @returns 成功返回"OK"，失败返回错误
   */
  async lSet (key: string, index: number, value: string | Buffer): Promise<string | null> {
    if (!this.#list[key]) return null
    if (this.checkExpire(key)) return null

    const list = this.#list[key]
    if (index < 0) {
      index = list.length + index
    }

    if (index < 0 || index >= list.length) {
      return null
    }

    list[index] = value
    this.#sqlite.set(key, JSON.stringify(list), Key.LIST, this.store[key].expire)
    return 'OK'
  }

  /**
   * 移除列表中与指定值相等的元素
   * @param key 列表的键
   * @param count 移除的数量，0表示移除所有匹配的元素，正数表示从头部开始移除，负数表示从尾部开始移除
   * @param value 要移除的值
   * @returns 返回移除的元素数量
   */
  async lRem (key: string, count: number, value: string | Buffer): Promise<number> {
    if (!this.#list[key]) return 0
    if (this.checkExpire(key)) return 0

    const list = this.#list[key]
    const strValue = value.toString()
    let removed = 0

    if (count === 0) {
      // 移除所有匹配的元素
      const newList = list.filter(item => item.toString() !== strValue)
      removed = list.length - newList.length
      this.#list[key] = newList
    } else if (count > 0) {
      // 从头部开始移除
      for (let i = 0; i < list.length && removed < count; i++) {
        if (list[i].toString() === strValue) {
          list.splice(i, 1)
          removed++
          i--
        }
      }
    } else {
      // 从尾部开始移除
      count = Math.abs(count)
      for (let i = list.length - 1; i >= 0 && removed < count; i--) {
        if (list[i].toString() === strValue) {
          list.splice(i, 1)
          removed++
        }
      }
    }

    this.#sqlite.set(key, JSON.stringify(list), Key.LIST, this.store[key].expire)
    return removed
  }

  /**
   * 获取集合中元素数量
   * @param key 集合的键
   * @returns 返回集合中元素数量
   */
  async sCard (key: string): Promise<number> {
    if (!this.#set[key]) return 0
    if (this.checkExpire(key)) return 0
    return this.#set[key].size
  }

  /**
   * 计算集合的差集
   * @param keys 集合的键数组
   * @returns 返回差集数组
   */
  async sDiff (...keys: string[]): Promise<string[]> {
    if (keys.length === 0) return []

    const firstKey = keys[0]
    if (!this.#set[firstKey]) return []
    if (this.checkExpire(firstKey)) return []

    const result = new Set<string>()
    for (const item of this.#set[firstKey]) {
      result.add(item.toString())
    }

    for (let i = 1; i < keys.length; i++) {
      const key = keys[i]
      if (!this.#set[key] || this.checkExpire(key)) continue

      for (const item of this.#set[key]) {
        result.delete(item.toString())
      }
    }

    return Array.from(result)
  }

  /**
   * 计算集合的交集
   * @param keys 集合的键数组
   * @returns 返回交集数组
   */
  async sInter (...keys: string[]): Promise<string[]> {
    if (keys.length === 0) return []

    const validKeys = keys.filter(key => this.#set[key] && !this.checkExpire(key))
    if (validKeys.length === 0) return []

    const result = new Set<string>()
    const firstKey = validKeys[0]

    for (const item of this.#set[firstKey]) {
      let inAllSets = true

      for (let i = 1; i < validKeys.length; i++) {
        const key = validKeys[i]
        if (!this.#set[key].has(item.toString())) {
          inAllSets = false
          break
        }
      }

      if (inAllSets) {
        result.add(item.toString())
      }
    }

    return Array.from(result)
  }

  /**
   * 计算集合的并集
   * @param keys 集合的键数组
   * @returns 返回并集数组
   */
  async sUnion (...keys: string[]): Promise<string[]> {
    const result = new Set<string>()

    for (const key of keys) {
      if (!this.#set[key] || this.checkExpire(key)) continue

      for (const item of this.#set[key]) {
        result.add(item.toString())
      }
    }

    return Array.from(result)
  }

  /**
   * 将多个键的值同时获取
   * @param keys 要获取的键数组
   * @returns 返回值数组，不存在的键返回null
   */
  async mGet (...keys: string[]): Promise<Array<string | null>> {
    return Promise.all(keys.map(key => this.get(key)))
  }

  /**
   * 同时设置多个键值对
   * @param keyValues 键值对数组，格式为[key1, value1, key2, value2, ...]
   * @returns 返回"OK"
   */
  async mSet (...keyValues: (string | Buffer)[]): Promise<string> {
    for (let i = 0; i < keyValues.length; i += 2) {
      if (i + 1 < keyValues.length) {
        const key = keyValues[i].toString()
        const value = keyValues[i + 1]
        await this.set(key, value)
      }
    }
    return 'OK'
  }

  /**
   * 设置键的新值并返回旧值
   * @param key 键
   * @param value 新值
   * @returns 返回旧值，如果键不存在则返回null
   */
  async getSet (key: string, value: string | Buffer): Promise<string | null> {
    const oldValue = await this.get(key)
    await this.set(key, value)
    return oldValue
  }

  /**
   * 修复zRange方法，使用正确的zset数据结构
   * 返回有序集合的成员数量
   * @param key 有序集合的键
   * @returns 返回有序集合的成员数量
   */
  async zRange (key: string, start: number, stop: number): Promise<string[]> {
    if (!this.#zset[key]) return []
    if (this.checkExpire(key)) return []

    // 先按分数排序
    const sortedEntries = [...this.#zset[key]].sort((a, b) => a.score - b.score)
    return sortedEntries.slice(start, stop + 1).map(entry => entry.member.toString())
  }

  /**
   * 按分数范围返回有序集合的成员
   * @param key 有序集合的键
   * @param min 最小分数
   * @param max 最大分数
   * @returns 返回指定分数范围的成员数组
   */
  async zRangeByScore (key: string, min: number, max: number): Promise<string[]> {
    if (!this.#zset[key]) return []
    if (this.checkExpire(key)) return []

    return this.#zset[key]
      .filter(entry => entry.score >= min && entry.score <= max)
      .sort((a, b) => a.score - b.score)
      .map(entry => entry.member.toString())
  }

  /**
   * 按分数降序返回有序集合的成员
   * @param key 有序集合的键
   * @param start 起始索引
   * @param stop 结束索引
   * @returns 返回指定范围的成员数组（按分数降序）
   */
  async zRevRange (key: string, start: number, stop: number): Promise<string[]> {
    if (!this.#zset[key]) return []
    if (this.checkExpire(key)) return []

    // 按分数降序排序
    const sortedEntries = [...this.#zset[key]].sort((a, b) => b.score - a.score)
    return sortedEntries.slice(start, stop + 1).map(entry => entry.member.toString())
  }

  /**
   * 获取有序集合中指定成员的排名（按分数降序）
   * @param key 有序集合的键
   * @param member 成员
   * @returns 返回成员的排名，不存在返回null
   */
  async zRevRank (key: string, member: string | Buffer): Promise<number | null> {
    if (!this.#zset[key]) return null
    if (this.checkExpire(key)) return null

    const strMember = member.toString()
    const sortedEntries = [...this.#zset[key]].sort((a, b) => b.score - a.score)

    for (let i = 0; i < sortedEntries.length; i++) {
      if (sortedEntries[i].member.toString() === strMember) {
        return i
      }
    }

    return null
  }

  /**
   * 从有序集合中移除一个或多个成员
   * @param key 有序集合的键
   * @param member 要移除的成员
   * @returns 返回成功移除的成员数量
   */
  async zRem (key: string, member: string | Buffer): Promise<number> {
    if (!this.#zset[key]) return 0
    if (this.checkExpire(key)) return 0

    const strMember = member.toString()
    const index = this.#zset[key].findIndex((entry) => entry.member.toString() === strMember)
    if (index !== -1) {
      this.#zset[key].splice(index, 1)
      this.#sqlite.set(key, JSON.stringify(this.#zset[key]), Key.ZSET, this.store[key].expire)
      return 1
    }
    return 0
  }

  /**
   * 根据键类型获取值的字符串表示
   * @param key 键名
   * @returns 值的字符串表示
   */
  private getValueStringByKey (key: string): string {
    const { type } = this.store[key]
    switch (type) {
      case Key.STR:
        return this.#str[key]
      case Key.NUM:
        return String(this.#num[key])
      case Key.HASH:
        return JSON.stringify(this.#hash[key])
      case Key.LIST:
        return JSON.stringify(this.#list[key])
      case Key.SET:
        return JSON.stringify(Array.from(this.#set[key]))
      case Key.ZSET:
        return JSON.stringify(this.#zset[key])
      case Key.PF:
        return JSON.stringify(Array.from(this.#pf[key]))
      case Key.BIT:
        return this.#bit[key].toString('base64')
      default:
        return ''
    }
  }

  async save (): Promise<string> {
    const keys = await this.#sqlite.keys()

    const { removed, added, common } = diffSimpleArray(keys, Object.keys(this.store))

    removed.forEach((key) => {
      this.#sqlite.del(key)
    })

    added.forEach((key) => {
      const { type, expire } = this.store[key]
      const value = this.getValueStringByKey(key)
      this.#sqlite.set(key, value, type, expire)
    })

    await Promise.all(common.map(async (key) => {
      const data = this.store[key]
      if (!data) return
      const { type, expire } = data
      const currentValue = this.getValueStringByKey(key)

      const sql = await this.#sqlite.get(key)
      if (sql?.expire !== expire || sql?.value !== currentValue) {
        this.#sqlite.set(key, currentValue, type, expire)
      }
    }))

    return 'OK'
  }
}
