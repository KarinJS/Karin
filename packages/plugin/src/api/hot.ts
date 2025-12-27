/**
 * 热点缓存系统
 * @module api/hot
 */

import type { RegistryItem } from '../types'

/**
 * 热点检测规则
 */
interface HotDetectionRule {
  /** 时间窗口（毫秒） */
  windowMs: number
  /** 在此窗口内的最小触发次数 */
  minCount: number
  /** 推荐的TTL（毫秒） */
  ttl: number
}

/**
 * 命令统计信息
 */
interface CommandStats {
  /** 总使用次数 */
  count: number
  /** 时间戳数组（最近的访问记录） */
  timestamps: number[]
  /** 命令实例 */
  command: RegistryItem
  /** 最后访问时间 */
  lastAccessTime: number
}

/**
 * 热点缓存项
 */
interface HotCacheEntry {
  /** 命令实例 */
  command: RegistryItem
  /** 过期时间戳 */
  expireAt: number
  /** 加入时间 */
  addedAt: number
}

/**
 * 热点缓存统计信息
 */
export interface HotCacheStats {
  /** 热点命令总数 */
  totalHotCommands: number
  /** 追踪的命令总数 */
  totalTrackedCommands: number
  /** 平均过期时间（分钟） */
  averageTTL: number
  /** 热点缓存命中次数 */
  hotHits: number
  /** 普通缓存命中次数 */
  normalHits: number
  /** 命中率（百分比） */
  hitRate: number
}

/**
 * 命令热点缓存系统
 * @description 自动追踪高频使用的命令并将其提升到热点缓存，提高命令匹配性能
 */
export class CommandHotCache {
  /** 热点缓存 Map<消息文本, 缓存项> */
  private readonly hotCache = new Map<string, HotCacheEntry>()

  /** 统计追踪 Map<消息文本, 统计信息> */
  private readonly statsMap = new Map<string, CommandStats>()

  /** 强制热点列表（开发者API添加） */
  private readonly forceHot = new Set<string>()

  /** 强制冷却列表（永不加入热点） */
  private readonly forceCold = new Set<string>()

  /** 自定义TTL Map<消息文本, TTL毫秒> */
  private readonly customTTL = new Map<string, number>()

  /** 是否启用热点缓存系统 */
  private enabled = true

  /** 热点缓存命中次数 */
  private hotHits = 0

  /** 普通缓存命中次数 */
  private normalHits = 0

  /** 清理定时器 */
  private cleanupTimer: NodeJS.Timeout | null = null

  /**
   * 热点检测规则（按优先级排序）
   */
  private readonly rules: HotDetectionRule[] = [
    { windowMs: 10 * 1000, minCount: 20, ttl: 120 * 60 * 1000 }, // 超热点
    { windowMs: 10 * 1000, minCount: 3, ttl: 60 * 60 * 1000 },   // 高频
    { windowMs: 30 * 1000, minCount: 5, ttl: 45 * 60 * 1000 },   // 中频
    { windowMs: 60 * 1000, minCount: 10, ttl: 30 * 60 * 1000 },  // 一般
    { windowMs: 120 * 1000, minCount: 15, ttl: 20 * 60 * 1000 }, // 低频
  ]

  /** 系统常量配置 */
  private readonly config = {
    retentionWindow: 120 * 1000,
    maxEntries: 10000,
    defaultTTL: 30 * 60 * 1000,
    maxTTL: 120 * 60 * 1000,
    cleanupInterval: 60 * 1000,
  }

  constructor () {
    this.startCleanup()
  }

  /**
   * 追踪命令使用并自动管理热点缓存
   */
  async track (msg: string, command: RegistryItem): Promise<void> {
    if (!this.enabled || this.forceCold.has(msg)) {
      return
    }

    if (this.forceHot.has(msg)) {
      this.addToHot(msg, command, this.customTTL.get(msg))
      return
    }

    this.normalHits++

    const now = Date.now()
    let stat = this.statsMap.get(msg)

    if (!stat) {
      if (this.statsMap.size >= this.config.maxEntries) {
        this.evictOldest()
      }
      stat = { count: 0, timestamps: [], command, lastAccessTime: now }
      this.statsMap.set(msg, stat)
    }

    stat.count++
    stat.timestamps.push(now)
    stat.lastAccessTime = now
    stat.command = command

    stat.timestamps = stat.timestamps.filter(
      ts => now - ts <= this.config.retentionWindow
    )

    for (const rule of this.rules) {
      const count = stat.timestamps.filter(ts => now - ts <= rule.windowMs).length
      if (count >= rule.minCount) {
        const ttl = this.customTTL.get(msg) ?? rule.ttl
        this.addToHot(msg, command, ttl)
        return
      }
    }

    if (this.hotCache.has(msg)) {
      const entry = this.hotCache.get(msg)!
      if (now <= entry.expireAt) {
        entry.expireAt = Math.min(
          entry.expireAt + 30 * 60 * 1000,
          entry.addedAt + this.config.maxTTL
        )
      }
    }
  }

  /**
   * 查询热点缓存
   */
  query (msg: string): RegistryItem | undefined {
    if (!this.enabled) return undefined

    const entry = this.hotCache.get(msg)
    if (!entry) return undefined

    if (Date.now() > entry.expireAt) {
      this.hotCache.delete(msg)
      return undefined
    }

    this.hotHits++
    return entry.command
  }

  /**
   * 检查消息是否在热点缓存中
   */
  has (msg: string): boolean {
    const entry = this.hotCache.get(msg)
    if (!entry) return false

    if (Date.now() > entry.expireAt) {
      this.hotCache.delete(msg)
      return false
    }

    return true
  }

  /**
   * 强制添加热点命令
   */
  add (msg: string, ttl?: number): void {
    this.forceHot.add(msg)
    if (ttl) this.customTTL.set(msg, ttl)
  }

  /**
   * 强制移除热点命令
   */
  remove (msg: string): void {
    this.forceCold.add(msg)
    this.forceHot.delete(msg)
    this.customTTL.delete(msg)
    this.hotCache.delete(msg)
    this.statsMap.delete(msg)
  }

  /**
   * 获取热点缓存统计信息
   */
  getStats (): HotCacheStats {
    const totalHits = this.hotHits + this.normalHits
    const hitRate = totalHits > 0 ? (this.hotHits / totalHits) * 100 : 0

    let totalTTL = 0
    const now = Date.now()
    for (const entry of this.hotCache.values()) {
      totalTTL += Math.max(0, entry.expireAt - now)
    }

    return {
      totalHotCommands: this.hotCache.size,
      totalTrackedCommands: this.statsMap.size,
      averageTTL: this.hotCache.size > 0 ? totalTTL / this.hotCache.size / 60000 : 0,
      hotHits: this.hotHits,
      normalHits: this.normalHits,
      hitRate: Math.round(hitRate * 100) / 100,
    }
  }

  /** 重置统计数据 */
  resetStats (): void {
    this.hotHits = 0
    this.normalHits = 0
  }

  /** 清空所有缓存和统计 */
  clear (): void {
    this.hotCache.clear()
    this.statsMap.clear()
    this.resetStats()
  }

  /** 启用或禁用热点缓存系统 */
  setEnabled (enabled: boolean): void {
    this.enabled = enabled
  }

  /** 销毁热点缓存系统 */
  destroy (): void {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer)
      this.cleanupTimer = null
    }
    this.clear()
  }

  /** 获取所有热点命令 */
  getAllHotCommands (): Array<{ msg: string, command: RegistryItem }> {
    const result: Array<{ msg: string, command: RegistryItem }> = []
    const now = Date.now()

    for (const [msg, entry] of this.hotCache.entries()) {
      if (now <= entry.expireAt) {
        result.push({ msg, command: entry.command })
      }
    }

    return result
  }

  /** 手动触发清理任务 */
  forceCleanup (): number {
    return this.cleanup()
  }

  private addToHot (msg: string, command: RegistryItem, ttl?: number): void {
    const now = Date.now()
    const expireAt = now + (ttl ?? this.config.defaultTTL)

    this.hotCache.set(msg, {
      command,
      expireAt: Math.min(expireAt, now + this.config.maxTTL),
      addedAt: now,
    })
  }

  private evictOldest (): void {
    let oldestMsg: string | null = null
    let oldestTime = Infinity

    for (const [msg, stat] of this.statsMap.entries()) {
      if (stat.lastAccessTime < oldestTime) {
        oldestTime = stat.lastAccessTime
        oldestMsg = msg
      }
    }

    if (oldestMsg) {
      this.statsMap.delete(oldestMsg)
    }
  }

  private startCleanup (): void {
    if (this.cleanupTimer) return

    this.cleanupTimer = setInterval(() => {
      this.cleanup()
    }, this.config.cleanupInterval)

    if (this.cleanupTimer.unref) {
      this.cleanupTimer.unref()
    }
  }

  private cleanup (): number {
    const now = Date.now()
    let cleaned = 0

    for (const [msg, entry] of this.hotCache.entries()) {
      if (now > entry.expireAt) {
        this.hotCache.delete(msg)
        cleaned++
      }
    }

    for (const [msg, stat] of this.statsMap.entries()) {
      stat.timestamps = stat.timestamps.filter(
        ts => now - ts <= this.config.retentionWindow
      )

      if (
        now - stat.lastAccessTime > this.config.retentionWindow &&
        stat.timestamps.length === 0
      ) {
        this.statsMap.delete(msg)
      }
    }

    return cleaned
  }
}

export type { HotDetectionRule, CommandStats, HotCacheEntry }
