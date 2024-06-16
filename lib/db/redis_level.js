import { Level } from 'level'

export default class RedisLevel {
  #level
  #expireMap
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
      get: function (target, prop, receiver) {
        if (prop === 'get' || prop === 'entries') {
          return function (...args) {
            return Reflect.get(target, prop).apply(target, args)
          }
        }
        return Reflect.get(target, prop, receiver)
      },
      set: function (target, key, value) {
        target.set(key, value)
        // 修改后持久化到数据库
        return Reflect.set(target, key, value)
      },
      deleteProperty: function (target, key) {
        target.delete(key)
        // 删除后持久化到数据库
        return Reflect.deleteProperty(target, key)
      },
    }

    this.#expireMap = new Proxy(this.#expireMap, handler)
  }

  /**
   * get 获取数据
   * @param {string} key 键
   * @returns {Promise<string>|Error} 数据
   */
  async get (key) {
    try {
      /** 先查过期时间 */
      const expire = this.#expireMap.get(key)
      if (expire && expire < Date.now()) {
        await this.#level.del(key)
        this.#expireMap.delete(key)
        return null
      }

      return await this.#level.get(key)
    } catch (error) {
      if (error.notFound) return null
      throw error
    }
  }

  /**
   * set 设置数据
   * @param {string} key 键
   * @param {string} value 值
   * @param {object} [options] 选项
   * @param {number} [options.EX] 过期时间 单位秒
   * @returns {Promise<void>|Error}
   */
  async set (key, value, options) {
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
  async del (key) {
    this.#expireMap.delete(key)
    return await this.#level.del(key)
  }

  /**
   * keys 获取所有键
   * @param {string} [prefix] 前缀
   * @returns {Promise<string[]>|Error} 键列表
   */
  async keys (prefix = '') {
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
  async incr (key) {
    let value = await this.get(key)
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
  async decr (key) {
    let value = await this.get(key)
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
   * @param {number} seconds 过期时间 单位秒
   * @returns {Promise<number>|Error}
   */
  async expire (key, seconds) {
    this.#expireMap.set(key, Date.now() + seconds * 1000)
    return seconds
  }

  /**
   * ttl 获取过期时间
   * @param {string} key 键
   * @returns {Promise<number>|Error}
   */
  async ttl (key) {
    const expire = this.#expireMap.get(key)
    if (expire) {
      return Math.ceil((expire - Date.now()) / 1000)
    }
    return -2
  }

  /**
   * setEx 设置数据并设置过期时间
   * @param {string} key 键
   * @param {number} seconds 过期时间 单位秒
   * @param {string} value 值
   * @returns {Promise<void>|Error}
   */
  async setEx (key, seconds, value) {
    this.#expireMap.set(key, Date.now() + seconds * 1000)
    return await this.#level.put(key, value)
  }

  /**
   * exists 判断键是否存在
   * @param {string} key 键
   * @returns {Promise<number>|Error}
   */
  async exists (key) {
    const value = await this.get(key)
    return value === null ? 0 : 1
  }

  /**
   * zAdd 有序集合添加元素
   * @param {string} key 键
   * @param {object} data 数据
   * @param {number} data.score 分数
   * @param {string} data.value 值
   */
  async zAdd (key, { score, value }) {
    let set = await this.get(key)
    if (set === null) {
      set = []
    } else {
      set = JSON.parse(set)
    }
    set.push({ score, value })
    set.sort((a, b) => a.score - b.score)
    await this.set(key, JSON.stringify(set))
  }

  /**
   * zRem 有序集合删除元素
   * @param {string} key 键
   * @param {string} value 值
   */
  async zRem (key, value) {
    let set = await this.get(key)
    if (set === null) {
      return
    }
    set = JSON.parse(set)
    set = set.filter(item => item.value !== value)
    await this.set(key, JSON.stringify(set))
  }

  /**
   * zIncrBy 有序集合分数递增
   * @param {string} key 键
   * @param {number} increment 递增值
   * @param {string} value 值
   * @returns {Promise<number>|Error}
   */
  async zIncrBy (key, increment, value) {
    let set = await this.get(key)
    if (set === null) {
      throw new Error('Set does not exist')
    }
    set = JSON.parse(set)
    const item = set.find(item => item.value === value)
    if (item) {
      item.score += increment
    }
    set.sort((a, b) => a.score - b.score)
    await this.set(key, JSON.stringify(set))
    return item.score
  }

  /**
   * zRangeByScore 有序集合根据分数范围获取元素
   * @param {string} key 键
   * @param {number} min 最小分数
   * @param {number} max 最大分数
   * @returns {Promise<string[]>|Error}
   */
  async zRangeByScore (key, min, max) {
    let set = await this.get(key)
    if (set === null) {
      return []
    }
    set = JSON.parse(set)
    return set.filter(item => item.score >= min && item.score <= max).map(item => item.value)
  }

  /**
   * zScore 有序集合获取元素分数
   * @param {string} key 键
   * @param {string} value 值
   * @returns {Promise<number>|Error}
   */
  async zScore (key, value) {
    let set = await this.get(key)
    if (set === null) {
      return null
    }
    set = JSON.parse(set)
    const item = set.find(item => item.value === value)
    return item ? item.score : null
  }
}
