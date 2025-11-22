/**
 * 缓存项接口
 * @internal
 */
interface CacheEntry<V> {
  /** 缓存值 */
  value: V
  /** 过期时间戳（0 表示永不过期） */
  expireAt: number
}

/**
 * 带全局 TTL 的 LRU 缓存（懒惰过期，无定时器）
 * @template K - 键的类型
 * @template V - 值的类型
 * @remarks
 * - TTL=0 表示永不过期
 * - get 操作优先返回值，异步更新 LRU 顺序以提升性能
 * - 使用懒惰过期策略，不使用定时器，减少内存开销
 */
export class LRUCache<K, V> {
  private readonly capacity: number
  private readonly defaultTTL: number
  private readonly cache: Map<K, CacheEntry<V>>

  /**
   * 创建 LRU 缓存实例
   * @param capacity - 缓存容量，默认 100
   * @param defaultTTL - 默认过期时间（毫秒），默认 5 分钟，0表示永不过期
   */
  constructor (capacity: number = 100, defaultTTL: number = 5 * 60 * 1000) {
    this.capacity = capacity
    this.defaultTTL = defaultTTL
    this.cache = new Map()
  }

  /**
   * 检查缓存项是否过期
   * @param expireAt - 过期时间戳
   * @param now - 当前时间戳
   * @returns 是否已过期
   * @internal
   */
  private isExpired (expireAt: number, now: number): boolean {
    return expireAt !== 0 && expireAt < now
  }

  /**
   * 异步更新 LRU 顺序
   * @param key - 要更新的键
   * @param entry - 缓存项
   * @internal
   */
  private updateLRUOrder (key: K, entry: CacheEntry<V>): void {
    queueMicrotask(() => {
      if (this.cache.has(key)) {
        this.cache.delete(key)
        this.cache.set(key, entry)
      }
    })
  }

  /**
   * 淘汰最旧的缓存项
   * @internal
   */
  private evictOldest (): void {
    const firstKey = this.cache.keys().next().value
    if (firstKey !== undefined) {
      this.cache.delete(firstKey)
    }
  }

  /**
   * 计算过期时间
   * @param ttl - TTL（毫秒），0 表示永不过期
   * @returns 过期时间戳
   * @internal
   */
  private calculateExpireAt (ttl?: number): number {
    return ttl === 0 ? 0 : Date.now() + (ttl ?? this.defaultTTL)
  }

  /**
   * 获取缓存值（若过期则自动清除）
   * @param key - 缓存键
   * @returns 缓存值，不存在或已过期返回 undefined
   * @remarks 优先返回值，异步更新 LRU 顺序以提升性能
   */
  get (key: K): V | undefined {
    const entry = this.cache.get(key)
    if (!entry) return undefined

    const now = Date.now()
    if (this.isExpired(entry.expireAt, now)) {
      this.cache.delete(key)
      return undefined
    }

    this.updateLRUOrder(key, entry)
    return entry.value
  }

  /**
   * 查看缓存值但不更新 LRU 顺序（若过期则自动清除）
   * @param key - 缓存键
   * @returns 缓存值，不存在或已过期返回 undefined
   * @remarks 用于只读场景，性能更高
   */
  peek (key: K): V | undefined {
    const entry = this.cache.get(key)
    if (!entry) return undefined

    const now = Date.now()
    if (this.isExpired(entry.expireAt, now)) {
      this.cache.delete(key)
      return undefined
    }

    return entry.value
  }

  /**
   * 检查 key 是否存在且未过期
   * @param key - 缓存键
   * @returns 是否存在且未过期
   * @remarks 不会更新 LRU 顺序
   */
  has (key: K): boolean {
    const entry = this.cache.get(key)
    if (!entry) return false

    const now = Date.now()
    if (this.isExpired(entry.expireAt, now)) {
      this.cache.delete(key)
      return false
    }

    return true
  }

  /**
   * 设置缓存值
   * @param key - 缓存键
   * @param value - 缓存值
   * @param ttl - 过期时间（毫秒），0 表示永不过期，undefined 使用默认 TTL
   * @remarks Map.set 会自动更新已存在 key 的位置到末尾，无需先删除
   */
  set (key: K, value: V, ttl?: number): void {
    const existed = this.cache.has(key)

    if (!existed && this.cache.size >= this.capacity) {
      this.evictOldest()
    }

    const expireAt = this.calculateExpireAt(ttl)
    this.cache.set(key, { value, expireAt })
  }

  /**
   * 删除指定 key
   * @param key - 缓存键
   * @returns 是否成功删除
   */
  delete (key: K): boolean {
    return this.cache.delete(key)
  }

  /**
   * 清空所有缓存
   */
  clear (): void {
    this.cache.clear()
  }

  /**
   * 当前有效缓存数量（忽略过期项）
   * @returns 有效缓存数量
   */
  size (): number {
    this.cleanup()
    return this.cache.size
  }

  /**
   * 获取所有有效的 keys
   * @returns 有效的键数组
   */
  keys (): K[] {
    const now = Date.now()
    const result: K[] = []

    for (const [key, entry] of this.cache.entries()) {
      if (!this.isExpired(entry.expireAt, now)) {
        result.push(key)
      }
    }

    return result
  }

  /**
   * 获取所有有效的 values
   * @returns 有效的值数组
   */
  values (): V[] {
    const now = Date.now()
    const result: V[] = []

    for (const entry of this.cache.values()) {
      if (!this.isExpired(entry.expireAt, now)) {
        result.push(entry.value)
      }
    }

    return result
  }

  /**
   * 获取所有有效的键值对
   * @returns 有效的键值对数组
   */
  entries (): Array<[K, V]> {
    const now = Date.now()
    const result: Array<[K, V]> = []

    for (const [key, entry] of this.cache.entries()) {
      if (!this.isExpired(entry.expireAt, now)) {
        result.push([key, entry.value])
      }
    }

    return result
  }

  /**
   * 遍历所有有效的缓存项
   * @param callback - 回调函数
   */
  forEach (callback: (value: V, key: K, cache: this) => void): void {
    const now = Date.now()

    for (const [key, entry] of this.cache.entries()) {
      if (!this.isExpired(entry.expireAt, now)) {
        callback(entry.value, key, this)
      }
    }
  }

  /**
   * 转换为 JSON 对象（仅包含有效的缓存项）
   * @returns JSON 对象
   */
  toJSON (): Record<string, V> {
    const now = Date.now()
    const result: Record<string, V> = {}

    for (const [key, entry] of this.cache.entries()) {
      if (!this.isExpired(entry.expireAt, now)) {
        result[String(key)] = entry.value
      }
    }

    return result
  }

  /**
   * 转换为字符串表示
   * @returns JSON 字符串
   */
  toString (): string {
    return JSON.stringify(this.toJSON(), null, 2)
  }

  /**
   * 懒惰清理过期项
   * @internal
   */
  private cleanup (): void {
    const now = Date.now()
    for (const [key, entry] of this.cache.entries()) {
      if (this.isExpired(entry.expireAt, now)) {
        this.cache.delete(key)
      }
    }
  }
}
