import type { CreateCommand } from '../create'

/**
 * 热点检测规则
 * @description 定义命令何时应该被提升为热点缓存
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
 * @description 用于追踪每个命令的使用频率
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
 * @description 存储在热点缓存中的命令信息
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
 * @description 用于监控和调试热点缓存系统的性能
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
 *
 * 工作原理：
 * 1. 命令执行时自动调用 track() 记录使用统计
 * 2. 根据预设规则判断是否满足热点条件（如：10秒内3次、30秒内5次等）
 * 3. 满足条件则将命令提升到热点缓存（Map快速查询）
 * 4. 下次相同消息直接命中热点缓存（O(1)查询）
 * 5. 定期清理过期缓存和统计数据
 *
 * @example
 * ```ts
 * // 自动追踪（无需手动调用）
 * // 当命令执行时，系统自动调用 track(ctx.msg, command)
 *
 * // 开发者API
 * pluginCache.hotCache.add('help', 60 * 60 * 1000) // 强制添加1小时
 * pluginCache.hotCache.remove('test')              // 强制移除
 * pluginCache.hotCache.has('help')                 // 检查是否存在
 *
 * // 监控统计
 * const stats = pluginCache.hotCache.getStats()
 * console.log(`命中率: ${stats.hitRate}%`)
 * ```
 */
export class CommandHotCache {
  /** 热点缓存 Map<消息文本, 缓存项> */
  private readonly hotCache = new Map<string, HotCacheEntry>()

  /** 统计追踪 Map<消息文本, 统计信息> */
  private readonly stats = new Map<string, CommandStats>()

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
   * @description 命令满足任意一条规则即可提升为热点
   * - 超热点：10秒内20次 → 缓存120分钟
   * - 高频：10秒内3次 → 缓存60分钟
   * - 中频：30秒内5次 → 缓存45分钟
   * - 一般：1分钟内10次 → 缓存30分钟
   * - 低频：2分钟内15次 → 缓存20分钟
   */
  private readonly rules: HotDetectionRule[] = [
    { windowMs: 10 * 1000, minCount: 20, ttl: 120 * 60 * 1000 }, // 超热点：10s/20次 → 120分钟
    { windowMs: 10 * 1000, minCount: 3, ttl: 60 * 60 * 1000 },   // 高频：10s/3次 → 60分钟
    { windowMs: 30 * 1000, minCount: 5, ttl: 45 * 60 * 1000 },   // 中频：30s/5次 → 45分钟
    { windowMs: 60 * 1000, minCount: 10, ttl: 30 * 60 * 1000 },  // 一般：1min/10次 → 30分钟
    { windowMs: 120 * 1000, minCount: 15, ttl: 20 * 60 * 1000 }, // 低频：2min/15次 → 20分钟
  ]

  /**
   * 系统常量配置
   */
  private readonly config = {
    /** 时间戳保留窗口：只保留最近2分钟的时间戳 */
    retentionWindow: 120 * 1000,
    /** 最大追踪条目数：超过后使用LRU淘汰 */
    maxEntries: 10000,
    /** 默认TTL：30分钟 */
    defaultTTL: 30 * 60 * 1000,
    /** 最大TTL：120分钟 */
    maxTTL: 120 * 60 * 1000,
    /** 清理间隔：每1分钟清理一次过期数据 */
    cleanupInterval: 60 * 1000,
  }

  constructor () {
    this.startCleanup()
  }

  /**
   * 追踪命令使用并自动管理热点缓存
   * @param msg 消息文本（ctx.msg）
   * @param command 命令实例
   * @internal 此方法由 CreateCommand.callback 内部自动调用，开发者无需手动调用
   *
   * @description
   * 工作流程：
   * 1. 检查是否启用、是否强制冷却
   * 2. 如果是强制热点，直接加入缓存
   * 3. 否则更新使用统计（时间戳数组）
   * 4. 根据规则检查是否满足热点条件
   * 5. 满足则加入热点缓存，不满足则继续追踪
   * 6. 如果已在热点中，刷新过期时间（最多累加到120分钟）
   *
   * @example
   * ```ts
   * // 在 CreateCommand.callback 中自动调用
   * pluginCache.hotCache.track(ctx.msg, command).catch(() => {})
   * ```
   */
  async track (msg: string, command: CreateCommand): Promise<void> {
    // 快速检查：如果未启用或在冷却列表，直接返回
    if (!this.enabled || this.forceCold.has(msg)) return

    // 强制热点：直接加入缓存
    if (this.forceHot.has(msg)) {
      this.addToHot(msg, command, this.customTTL.get(msg))
      return
    }

    // 记录普通命中次数（用于统计命中率）
    this.normalHits++

    // 更新统计信息
    const now = Date.now()
    let stat = this.stats.get(msg)

    if (!stat) {
      // 首次记录：检查是否超过最大条目数
      if (this.stats.size >= this.config.maxEntries) {
        this.evictOldest() // LRU淘汰最旧的条目
      }
      stat = { count: 0, timestamps: [], command, lastAccessTime: now }
      this.stats.set(msg, stat)
    }

    // 更新统计数据
    stat.count++
    stat.timestamps.push(now)
    stat.lastAccessTime = now
    stat.command = command

    // 清理过期时间戳（只保留最近2分钟内的）
    stat.timestamps = stat.timestamps.filter(
      ts => now - ts <= this.config.retentionWindow
    )

    // 检查是否满足热点条件（按优先级检查所有规则）
    for (const rule of this.rules) {
      const count = stat.timestamps.filter(ts => now - ts <= rule.windowMs).length
      if (count >= rule.minCount) {
        // 满足条件：加入热点缓存（使用自定义TTL或规则推荐的TTL）
        const ttl = this.customTTL.get(msg) ?? rule.ttl
        this.addToHot(msg, command, ttl)
        return
      }
    }

    // 未满足热点条件但已在缓存中：刷新过期时间
    if (this.hotCache.has(msg)) {
      const entry = this.hotCache.get(msg)!
      if (now <= entry.expireAt) {
        // 累加30分钟，但不超过120分钟上限
        entry.expireAt = Math.min(
          entry.expireAt + 30 * 60 * 1000,
          entry.addedAt + this.config.maxTTL
        )
      }
    }
  }

  /**
   * 查询热点缓存
   * @param msg 消息文本
   * @returns 命令实例，未命中返回 undefined
   * @description
   * O(1) 查询，直接从 Map 中获取
   * 如果存在但已过期，会自动删除并返回 undefined
   * 每次查询命中会增加 hotHits 统计
   *
   * @example
   * ```ts
   * const command = hotCache.query(ctx.msg)
   * if (command) {
   *   // 命中热点缓存，直接执行
   *   await command.callback(ctx, next)
   * }
   * ```
   */
  query (msg: string): CreateCommand | undefined {
    if (!this.enabled) return undefined

    const entry = this.hotCache.get(msg)
    if (!entry) return undefined

    // 检查是否过期
    if (Date.now() > entry.expireAt) {
      this.hotCache.delete(msg)
      return undefined
    }

    // 命中：增加统计
    this.hotHits++
    return entry.command
  }

  /**
   * 检查消息是否在热点缓存中
   * @param msg 消息文本
   * @returns 是否在热点缓存中且未过期
   */
  has (msg: string): boolean {
    const entry = this.hotCache.get(msg)
    if (!entry) return false

    // 检查是否过期
    if (Date.now() > entry.expireAt) {
      this.hotCache.delete(msg)
      return false
    }

    return true
  }

  /**
   * 强制添加热点命令（开发者API）
   * @param msg 消息文本
   * @param ttl 可选的过期时间（毫秒），默认30分钟
   * @description
   * 将指定消息标记为强制热点
   * 第一次匹配时会自动将命令实例加入热点缓存
   *
   * @example
   * ```ts
   * // 添加热点，使用默认30分钟
   * pluginCache.hotCache.add('help')
   *
   * // 添加热点，自定义1小时
   * pluginCache.hotCache.add('菜单', 60 * 60 * 1000)
   * ```
   */
  add (msg: string, ttl?: number): void {
    this.forceHot.add(msg)
    if (ttl) this.customTTL.set(msg, ttl)
  }

  /**
   * 强制移除热点命令（开发者API）
   * @param msg 消息文本
   * @description
   * 将指定消息标记为强制冷却，永不加入热点
   * 同时清除相关的所有缓存和统计数据
   *
   * @example
   * ```ts
   * pluginCache.hotCache.remove('test')
   * ```
   */
  remove (msg: string): void {
    this.forceCold.add(msg)
    this.forceHot.delete(msg)
    this.customTTL.delete(msg)
    this.hotCache.delete(msg)
    this.stats.delete(msg)
  }

  /**
   * 获取热点缓存统计信息
   * @returns 统计信息对象
   * @description
   * 包含以下信息：
   * - totalHotCommands: 当前热点命令数量
   * - totalTrackedCommands: 正在追踪的命令数量
   * - averageTTL: 平均剩余过期时间（分钟）
   * - hotHits: 热点缓存命中次数
   * - normalHits: 普通缓存命中次数
   * - hitRate: 命中率（百分比）
   *
   * @example
   * ```ts
   * const stats = pluginCache.hotCache.getStats()
   * console.log(`命中率: ${stats.hitRate}%`)
   * console.log(`热点命令: ${stats.totalHotCommands}`)
   * ```
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
      totalTrackedCommands: this.stats.size,
      averageTTL: this.hotCache.size > 0 ? totalTTL / this.hotCache.size / 60000 : 0,
      hotHits: this.hotHits,
      normalHits: this.normalHits,
      hitRate: Math.round(hitRate * 100) / 100,
    }
  }

  /**
   * 重置统计数据
   * @description 清空命中次数统计，但保留热点缓存和追踪数据
   */
  resetStats (): void {
    this.hotHits = 0
    this.normalHits = 0
  }

  /**
   * 清空所有缓存和统计
   * @description 清空热点缓存、追踪数据和统计信息，但保留强制热点/冷却配置
   */
  clear (): void {
    this.hotCache.clear()
    this.stats.clear()
    this.resetStats()
  }

  /**
   * 启用或禁用热点缓存系统
   * @param enabled 是否启用
   * @description 禁用后 track() 和 query() 将不再工作
   */
  setEnabled (enabled: boolean): void {
    this.enabled = enabled
  }

  /**
   * 销毁热点缓存系统
   * @description 停止定时器并清空所有数据
   */
  destroy (): void {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer)
      this.cleanupTimer = null
    }
    this.clear()
  }

  /**
   * 获取所有热点命令
   * @returns 热点命令数组
   * @description 只返回未过期的热点命令
   */
  getAllHotCommands (): Array<{ msg: string, command: CreateCommand }> {
    const result: Array<{ msg: string, command: CreateCommand }> = []
    const now = Date.now()

    for (const [msg, entry] of this.hotCache.entries()) {
      if (now <= entry.expireAt) {
        result.push({ msg, command: entry.command })
      }
    }

    return result
  }

  /**
   * 手动触发清理任务
   * @returns 清理的条目数
   * @description 立即清理过期的热点缓存和统计数据
   */
  forceCleanup (): number {
    return this.cleanup()
  }

  // ==================== 内部方法 ====================

  /**
   * 将命令添加到热点缓存
   * @param msg 消息文本
   * @param command 命令实例
   * @param ttl 可选的TTL（毫秒）
   * @internal
   */
  private addToHot (msg: string, command: CreateCommand, ttl?: number): void {
    const now = Date.now()
    const expireAt = now + (ttl ?? this.config.defaultTTL)

    this.hotCache.set(msg, {
      command,
      expireAt: Math.min(expireAt, now + this.config.maxTTL),
      addedAt: now,
    })
  }

  /**
   * 淘汰最旧的追踪条目（LRU策略）
   * @internal
   * @description 当追踪条目数超过上限时，删除最久未访问的条目
   */
  private evictOldest (): void {
    let oldestMsg: string | null = null
    let oldestTime = Infinity

    for (const [msg, stat] of this.stats.entries()) {
      if (stat.lastAccessTime < oldestTime) {
        oldestTime = stat.lastAccessTime
        oldestMsg = msg
      }
    }

    if (oldestMsg) this.stats.delete(oldestMsg)
  }

  /**
   * 启动定期清理任务
   * @internal
   * @description 每分钟自动清理过期的热点缓存和统计数据
   */
  private startCleanup (): void {
    if (this.cleanupTimer) return

    this.cleanupTimer = setInterval(() => {
      this.cleanup()
    }, this.config.cleanupInterval)

    // 防止定时器阻止进程退出
    if (this.cleanupTimer.unref) {
      this.cleanupTimer.unref()
    }
  }

  /**
   * 清理过期数据
   * @returns 清理的条目数
   * @internal
   * @description
   * 1. 清理过期的热点缓存
   * 2. 清理过期的时间戳
   * 3. 删除没有有效时间戳且长时间未访问的统计数据
   */
  private cleanup (): number {
    const now = Date.now()
    let cleaned = 0

    // 清理过期热点缓存
    for (const [msg, entry] of this.hotCache.entries()) {
      if (now > entry.expireAt) {
        this.hotCache.delete(msg)
        cleaned++
      }
    }

    // 清理过期统计数据
    for (const [msg, stat] of this.stats.entries()) {
      // 清理过期时间戳（只保留2分钟内的）
      stat.timestamps = stat.timestamps.filter(
        ts => now - ts <= this.config.retentionWindow
      )

      // 如果最后访问时间超过保留窗口且没有有效时间戳，删除该条目
      if (
        now - stat.lastAccessTime > this.config.retentionWindow &&
        stat.timestamps.length === 0
      ) {
        this.stats.delete(msg)
      }
    }

    return cleaned
  }
}
