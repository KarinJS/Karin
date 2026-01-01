/**
 * 热点缓存模块
 * @description 从旧的 cache 模块迁移过来，作为 store 的一部分
 */

import type { CreateCommand } from '../create'

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
  command: CreateCommand
  /** 最后访问时间 */
  lastAccessTime: number
}

/**
 * 热点缓存项
 */
interface HotCacheEntry {
  /** 命令实例 */
  command: CreateCommand
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
 * 创建热点缓存系统
 */
function createHotCache () {
  /** 热点缓存 Map<消息文本, 缓存项> */
  const hotCache = new Map<string, HotCacheEntry>()

  /** 统计追踪 Map<消息文本, 统计信息> */
  const stats = new Map<string, CommandStats>()

  /** 强制热点列表 */
  const forceHot = new Set<string>()

  /** 强制冷却列表 */
  const forceCold = new Set<string>()

  /** 自定义TTL */
  const customTTL = new Map<string, number>()

  /** 是否启用 */
  let enabled = true

  /** 统计计数 */
  let hotHits = 0
  let normalHits = 0

  /** 清理定时器 */
  let cleanupTimer: ReturnType<typeof setInterval> | null = null

  /** 热点检测规则 */
  const rules: HotDetectionRule[] = [
    { windowMs: 10 * 1000, minCount: 20, ttl: 120 * 60 * 1000 },
    { windowMs: 10 * 1000, minCount: 3, ttl: 60 * 60 * 1000 },
    { windowMs: 30 * 1000, minCount: 5, ttl: 45 * 60 * 1000 },
    { windowMs: 60 * 1000, minCount: 10, ttl: 30 * 60 * 1000 },
    { windowMs: 120 * 1000, minCount: 15, ttl: 20 * 60 * 1000 },
  ]

  /** 配置常量 */
  const config = {
    retentionWindow: 120 * 1000,
    maxEntries: 10000,
    defaultTTL: 30 * 60 * 1000,
    maxTTL: 120 * 60 * 1000,
    cleanupInterval: 60 * 1000,
  }

  /** 添加到热点缓存 */
  function addToHot (msg: string, command: CreateCommand, ttl?: number): void {
    const now = Date.now()
    const expireAt = now + (ttl ?? config.defaultTTL)
    hotCache.set(msg, {
      command,
      expireAt: Math.min(expireAt, now + config.maxTTL),
      addedAt: now,
    })
  }

  /** LRU 淘汰 */
  function evictOldest (): void {
    let oldestMsg: string | null = null
    let oldestTime = Infinity

    for (const [msg, stat] of stats.entries()) {
      if (stat.lastAccessTime < oldestTime) {
        oldestTime = stat.lastAccessTime
        oldestMsg = msg
      }
    }

    if (oldestMsg) {
      stats.delete(oldestMsg)
    }
  }

  /** 清理过期数据 */
  function cleanup (): number {
    const now = Date.now()
    let cleaned = 0

    for (const [msg, entry] of hotCache.entries()) {
      if (now > entry.expireAt) {
        hotCache.delete(msg)
        cleaned++
      }
    }

    for (const [msg, stat] of stats.entries()) {
      stat.timestamps = stat.timestamps.filter(
        ts => now - ts <= config.retentionWindow
      )

      if (
        now - stat.lastAccessTime > config.retentionWindow &&
        stat.timestamps.length === 0
      ) {
        stats.delete(msg)
      }
    }

    return cleaned
  }

  /** 启动清理定时器 */
  function startCleanup (): void {
    if (cleanupTimer) return

    cleanupTimer = setInterval(() => {
      cleanup()
    }, config.cleanupInterval)

    if (cleanupTimer.unref) {
      cleanupTimer.unref()
    }
  }

  // 启动清理
  startCleanup()

  return {
    /**
     * 追踪命令使用
     */
    async track (msg: string, command: CreateCommand): Promise<void> {
      if (!enabled || forceCold.has(msg)) return

      if (forceHot.has(msg)) {
        addToHot(msg, command, customTTL.get(msg))
        return
      }

      normalHits++

      const now = Date.now()
      let stat = stats.get(msg)

      if (!stat) {
        if (stats.size >= config.maxEntries) {
          evictOldest()
        }
        stat = { count: 0, timestamps: [], command, lastAccessTime: now }
        stats.set(msg, stat)
      }

      stat.count++
      stat.timestamps.push(now)
      stat.lastAccessTime = now
      stat.command = command

      stat.timestamps = stat.timestamps.filter(
        ts => now - ts <= config.retentionWindow
      )

      for (const rule of rules) {
        const count = stat.timestamps.filter(ts => now - ts <= rule.windowMs).length
        if (count >= rule.minCount) {
          const ttl = customTTL.get(msg) ?? rule.ttl
          addToHot(msg, command, ttl)
          return
        }
      }

      if (hotCache.has(msg)) {
        const entry = hotCache.get(msg)!
        if (now <= entry.expireAt) {
          entry.expireAt = Math.min(
            entry.expireAt + 30 * 60 * 1000,
            entry.addedAt + config.maxTTL
          )
        }
      }
    },

    /**
     * 查询热点缓存
     */
    query (msg: string): CreateCommand | undefined {
      if (!enabled) return undefined

      const entry = hotCache.get(msg)
      if (!entry) return undefined

      if (Date.now() > entry.expireAt) {
        hotCache.delete(msg)
        return undefined
      }

      hotHits++
      return entry.command
    },

    /**
     * 检查是否在热点缓存中
     */
    has (msg: string): boolean {
      const entry = hotCache.get(msg)
      if (!entry) return false

      if (Date.now() > entry.expireAt) {
        hotCache.delete(msg)
        return false
      }

      return true
    },

    /**
     * 强制添加热点
     */
    add (msg: string, ttl?: number): void {
      forceHot.add(msg)
      if (ttl) customTTL.set(msg, ttl)
    },

    /**
     * 强制移除热点
     */
    remove (msg: string): void {
      forceCold.add(msg)
      forceHot.delete(msg)
      customTTL.delete(msg)
      hotCache.delete(msg)
      stats.delete(msg)
    },

    /**
     * 获取统计信息
     */
    getStats (): HotCacheStats {
      const totalHits = hotHits + normalHits
      const hitRate = totalHits > 0 ? (hotHits / totalHits) * 100 : 0

      let totalTTL = 0
      const now = Date.now()
      for (const entry of hotCache.values()) {
        totalTTL += Math.max(0, entry.expireAt - now)
      }

      return {
        totalHotCommands: hotCache.size,
        totalTrackedCommands: stats.size,
        averageTTL: hotCache.size > 0 ? totalTTL / hotCache.size / 60000 : 0,
        hotHits,
        normalHits,
        hitRate: Math.round(hitRate * 100) / 100,
      }
    },

    /**
     * 重置统计
     */
    resetStats (): void {
      hotHits = 0
      normalHits = 0
    },

    /**
     * 清空所有
     */
    clear (): void {
      hotCache.clear()
      stats.clear()
      hotHits = 0
      normalHits = 0
    },

    /**
     * 启用/禁用
     */
    setEnabled (value: boolean): void {
      enabled = value
    },

    /**
     * 销毁
     */
    destroy (): void {
      if (cleanupTimer) {
        clearInterval(cleanupTimer)
        cleanupTimer = null
      }
      hotCache.clear()
      stats.clear()
    },

    /**
     * 获取所有热点命令
     */
    getAllHotCommands (): Array<{ msg: string, command: CreateCommand }> {
      const result: Array<{ msg: string, command: CreateCommand }> = []
      const now = Date.now()

      for (const [msg, entry] of hotCache.entries()) {
        if (now <= entry.expireAt) {
          result.push({ msg, command: entry.command })
        }
      }

      return result
    },

    /**
     * 手动触发清理
     */
    forceCleanup (): number {
      return cleanup()
    },
  }
}

/** 热点缓存单例 */
export const hotCache = createHotCache()
