/**
 * @class LRUCDManager
 * @description 高性能异步 LRU + TTL CD 管理器
 * 内部使用毫秒级时间（Date.now()）计算 CD
 * 支持容量限制，超出容量的 key 异步清理，避免阻塞主线程
 */
class LRUCDManager {
  /** LRU 容量上限 */
  private capacity: number

  /** 内部缓存，存储 key -> expireAt(毫秒) */
  private cache: Map<string, number> = new Map()

  /**
   * @constructor
   * @param capacity LRU 容量上限，默认 3000
   */
  constructor (capacity: number = 3000) {
    this.capacity = capacity
  }

  /**
   * 获取当前时间
   * @private
   */
  private now (): number {
    return Date.now()
  }

  /**
   * 设置 CD
   * @param key 要设置的唯一标识
   * @param cd CD 时间，单位毫秒
   */
  public set (key: string, cd: number): void {
    const expireAt = this.now() + cd

    // 刷新 LRU 顺序
    if (this.cache.has(key)) this.cache.delete(key)
    this.cache.set(key, expireAt)

    // 超出容量，异步删除最旧的 key
    if (this.cache.size > this.capacity) {
      const firstKey = this.cache.keys().next().value
      if (!firstKey) return
      queueMicrotask(() => this.cache.delete(firstKey))
    }
  }

  /**
   * 检查指定 key 是否在 CD 中
   * @param key 要检查的唯一标识
   * @returns {boolean} true 表示仍在 CD 中，false 已过期或不存在
   */
  public has (key: string): boolean {
    const expireAt = this.cache.get(key)
    if (!expireAt) return false
    if (this.now() >= expireAt) {
      this.cache.delete(key)
      return false
    }
    return true
  }

  /**
   * 获取指定 key 的过期时间（毫秒）
   * @param key 要获取的唯一标识
   * @returns {number | undefined} 返回毫秒级过期时间戳，已过期返回 undefined
   */
  public get (key: string): number | undefined {
    if (!this.has(key)) return undefined
    return this.cache.get(key)!
  }

  /**
   * 删除指定 key
   * @param key 要删除的唯一标识
   */
  public del (key: string): void {
    this.cache.delete(key)
  }

  /**
   * 清理所有 key
   */
  public clean (): void {
    this.cache.clear()
  }
}

export const lru = new LRUCDManager()
