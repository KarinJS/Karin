import { Level } from 'level'

export default class RedisLevel {
  #level
  #expireMap
  id: string
  constructor () {
    const path = process.cwd() + '/data/db/RedisLevel'
    this.#level = new Level(path, { valueEncoding: 'json' })
    /**
     * @type {'RedisLevel'} 唯一标识符 用于区分不同的数据库
     */
    this.id = 'RedisLevel'
    /**
     * 过期时间映射表
     * @type {Map<string, number>} 键: 值 (过期时间)
     */
    this.#expireMap = new Map()

    /**
     * 开启过期时间处理
     */
    this.#expireHandle()
  }

  /**
   * 过期时间处理 每分钟检查一次
   */
  async #expireHandle () {
    setInterval(async () => {
      const now = Date.now()
      // 获取代理对象的键值对数组
      const entries = Array.from(this.#expireMap.entries())
      for (const [key, expire] of entries) {
        if (expire < now) {
          await this.#level.del(key)
          this.#expireMap.delete(key) // 通过代理的方式删除键值对
        }
      }
    }, 60000)

    /**
     * 对expireMap进行代理 实现持久化 每次触发都保存到数据库
     */
    const handler = {
      get: function (target: any, prop: string, receiver: unknown) {
        if (prop === 'get' || prop === 'entries') {
          return function (...args: any) {
            const reflect = Reflect.get(target, prop).apply(target, args)
            return typeof reflect === 'function' ? reflect.bind(target) : reflect
          }
        }
        const reflect = Reflect.get(target, prop, receiver)
        return typeof reflect === 'function' ? reflect.bind(target) : reflect
      },
      set: function (target: { set: (arg0: any, arg1: any) => void }, key: any, value: any) {
        target.set(key, value)
        // 修改后持久化到数据库
        const reflect = Reflect.set(target, key, value) as any
        return typeof reflect === 'function' ? reflect.bind(target) : reflect
      },
      deleteProperty: function (target: object, key: PropertyKey) {
        Reflect.deleteProperty(target, key)
        // 删除后持久化到数据库
        const reflect = Reflect.deleteProperty(target, key) as any
        return typeof reflect === 'function' ? reflect.bind(target) : reflect
      },
    }

    this.#expireMap = new Proxy(this.#expireMap, handler)
  }

  /**
   * get 获取数据
   * @param {string} key 键
   * @returns {Promise<string>|Error} 数据
   */
  async get (key: string): Promise<string | null> {
    try {
      /** 先查过期时间 */
      const expire = this.#expireMap.get(key)
      if (expire && expire < Date.now()) {
        await this.#level.del(key)
        this.#expireMap.delete(key)
        return null
      }

      return await this.#level.get(key)
    } catch (error: any) {
      if (error.notFound) return null
      throw error
    }
  }

  /**
   * set 设置数据
   * @param {string} key 键
   * @param {string} value 值
   * @param {object} [options] 选项
   * @param [options.EX] 过期时间 单位秒
   * @returns {Promise<void>|Error}
   */
  async set (key: string, value: string, options?: { EX: number } | undefined) {
    if (options && options.EX) {
      this.#expireMap.set(key, Date.now() + options.EX * 1000)
    }

    return await this.#level.put(key, value)
  }

  /**
   * del 删除数据
   * @param {string} key 键
   * @returns {Promise<void>|Error}
   */
  async del (key: string) {
    this.#expireMap.delete(key)
    return await this.#level.del(key)
  }

  /**
   * keys 获取所有键
   * @param {string} [prefix] 前缀
   * @returns {Promise<string[]>|Error} 键列表
   */
  async keys (prefix = ''): Promise<string[]> {
    const keys = []
    for await (const key of this.#level.keys({ gte: prefix, lt: prefix + '\xFF' })) {
      // Check if the key has expired
      const expire = this.#expireMap.get(key)
      if (expire && expire < Date.now()) {
        await this.#level.del(key)
        this.#expireMap.delete(key)
      } else {
        keys.push(key)
      }
    }
    return keys
  }

  /**
   * incr 递增数据
   * @param {string} key 键
   * @returns {Promise<number>|Error}
   */
  async incr (key: string): Promise<number> {
    let value = Number(await this.get(key))
    if (value === null) {
      value = 0
    } else {
      value = Number(value)
      if (isNaN(value)) throw new Error('Value is not a number')
    }
    value += 1
    await this.set(key, value.toString())
    return value
  }

  /**
   * decr 递减数据
   * @param {string} key 键
   * @returns {Promise<number>|Error}
   */
  async decr (key: string): Promise<number> {
    let value = Number(await this.get(key))
    if (value === null) {
      value = 0
    } else {
      value = Number(value)
      if (isNaN(value)) throw new Error('Value is not a number')
    }
    value -= 1
    await this.set(key, value.toString())
    return value
  }

  /**
   * expire 设置过期时间
   * @param {string} key 键
   * @param seconds 过期时间 单位秒
   * @returns {Promise<number>|Error}
   */
  async expire (key: string, seconds: number): Promise<number> {
    this.#expireMap.set(key, Date.now() + seconds * 1000)
    return seconds
  }

  /**
   * ttl 获取过期时间
   * @param {string} key 键
   * @returns {Promise<number>|Error}
   */
  async ttl (key: string): Promise<number> {
    const expire = this.#expireMap.get(key)
    if (expire) {
      return Math.ceil((expire - Date.now()) / 1000)
    }
    return -2
  }

  /**
   * setEx 设置数据并设置过期时间
   * @param {string} key 键
   * @param seconds 过期时间 单位秒
   * @param {string} value 值
   * @returns {Promise<void>|Error}
   */
  async setEx (key: string, seconds: number, value: string) {
    this.#expireMap.set(key, Date.now() + seconds * 1000)
    return await this.#level.put(key, value)
  }

  /**
   * exists 判断键是否存在
   * @param {string} key 键
   * @returns {Promise<number>|Error}
   */
  async exists (key: string): Promise<number> {
    const value = await this.get(key)
    return value === null ? 0 : 1
  }

  /**
   * zAdd 有序集合添加元素
   * @param {string} key 键
   * @param {object} data 数据
   * @param data.score 分数
   * @param {string} data.value 值
   */
  async zAdd (key: string, { score, value }: { score: number; value: string }) {
    const set = await this.get(key)
    const arr = (set ? JSON.parse(set) : []) as any[]

    arr.push({ score, value })
    arr.sort((a: { score: number }, b: { score: number }) => a.score - b.score)
    await this.set(key, JSON.stringify(arr))
  }

  /**
   * zRem 有序集合删除元素
   * @param {string} key 键
   * @param {string} value 值
   */
  async zRem (key: string, value: string) {
    const set = await this.get(key)
    if (set === null) return
    let arr = JSON.parse(set) as any[]
    arr = arr.filter((item: { value: string }) => item.value !== value)
    await this.set(key, JSON.stringify(arr))
  }

  /**
   * zIncrBy 有序集合分数递增
   * @param {string} key 键
   * @param increment 递增值
   * @param {string} value 值
   * @returns {Promise<number>|Error}
   */
  async zIncrBy (key: string, increment: number, value: string): Promise<number> {
    const set = await this.get(key)
    if (set === null) throw new Error('Set does not exist')
    const arr = JSON.parse(set) as any[]
    const item = arr.find((item: { value: any }) => item.value === value)
    if (item) item.score += increment
    arr.sort((a: { score: number }, b: { score: number }) => a.score - b.score)
    await this.set(key, JSON.stringify(arr))
    return item.score
  }

  /**
   * zRangeByScore 有序集合根据分数范围获取元素
   * @param {string} key 键
   * @param min 最小分数
   * @param max 最大分数
   * @returns {Promise<string[]>|Error}
   */
  async zRangeByScore (key: string, min: number, max: number) {
    const set = await this.get(key)
    if (set === null) return []
    const arr = JSON.parse(set) as any[]
    return arr.filter((item: { score: number }) => item.score >= min && item.score <= max).map((item: { value: any }) => item.value)
  }

  /**
   * zScore 有序集合获取元素分数
   * @param {string} key 键
   * @param {string} value 值
   * @returns {Promise<number>|Error}
   */
  async zScore (key: string, value: string): Promise<number | null> {
    const set = await this.get(key)
    if (set === null) return null
    const arr = JSON.parse(set)
    const item = arr.find((item: { value: any }) => item.value === value)
    return item ? item.score : null
  }
}
