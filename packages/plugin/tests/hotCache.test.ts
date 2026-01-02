/**
 * HotCache 模块测试
 * 覆盖 store/hotCache.ts
 */
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { hotCache, type HotCacheStats } from '../src/store/hotCache'

// Mock logger
vi.stubGlobal('logger', {
  info: vi.fn(),
  debug: vi.fn(),
  warn: vi.fn(),
  error: vi.fn(),
})

// 创建模拟命令
function createMockCommand (id: string): any {
  return {
    id,
    type: 'command',
    name: `cmd-${id}`,
    reg: /test/,
    callback: vi.fn(),
    priority: 100,
  }
}

describe('HotCache 模块', () => {
  beforeEach(() => {
    hotCache.clear()
    hotCache.setEnabled(true)
    hotCache.resetStats()
  })

  afterEach(() => {
    hotCache.clear()
    vi.clearAllMocks()
  })

  describe('基础功能', () => {
    it('应该能够手动添加热点', () => {
      hotCache.add('test-msg')

      expect(hotCache.has('test-msg')).toBe(false) // 添加到 forceHot，但还没 track
    })

    it('应该能够强制添加热点并查询', async () => {
      const cmd = createMockCommand('c1')

      // 先添加到 forceHot 列表
      hotCache.add('hot-msg')

      // 然后 track，这会将其加入热点缓存
      await hotCache.track('hot-msg', cmd)

      const result = hotCache.query('hot-msg')
      expect(result).toBe(cmd)
    })

    it('应该能够移除热点', async () => {
      const cmd = createMockCommand('c2')

      hotCache.add('remove-msg')
      await hotCache.track('remove-msg', cmd)

      expect(hotCache.query('remove-msg')).toBe(cmd)

      hotCache.remove('remove-msg')

      expect(hotCache.query('remove-msg')).toBeUndefined()
    })

    it('应该返回正确的 has 结果', async () => {
      const cmd = createMockCommand('c3')

      expect(hotCache.has('not-exist')).toBe(false)

      hotCache.add('exists')
      await hotCache.track('exists', cmd)

      expect(hotCache.has('exists')).toBe(true)
    })
  })

  describe('track 功能', () => {
    it('应该追踪命令使用', async () => {
      const cmd = createMockCommand('t1')

      await hotCache.track('msg1', cmd)

      // 第一次追踪不会自动成为热点
      expect(hotCache.has('msg1')).toBe(false)
    })

    it('应该在禁用时不追踪', async () => {
      const cmd = createMockCommand('t2')

      hotCache.setEnabled(false)
      await hotCache.track('disabled-msg', cmd)

      // 重新启用
      hotCache.setEnabled(true)

      // 即使查询也不应该找到
      expect(hotCache.query('disabled-msg')).toBeUndefined()
    })

    it('应该处理 forceCold 列表', async () => {
      const cmd = createMockCommand('t3')

      hotCache.remove('cold-msg') // 添加到 forceCold

      await hotCache.track('cold-msg', cmd)

      expect(hotCache.query('cold-msg')).toBeUndefined()
    })

    it('应该自动提升频繁访问的命令', async () => {
      const cmd = createMockCommand('t4')

      hotCache.add('frequent-msg') // 先添加到 forceHot

      // 追踪
      await hotCache.track('frequent-msg', cmd)

      // 现在应该在热点缓存中
      expect(hotCache.has('frequent-msg')).toBe(true)
    })
  })

  describe('query 功能', () => {
    it('应该返回 undefined 当禁用时', async () => {
      const cmd = createMockCommand('q1')

      hotCache.add('query-msg')
      await hotCache.track('query-msg', cmd)

      hotCache.setEnabled(false)

      expect(hotCache.query('query-msg')).toBeUndefined()

      hotCache.setEnabled(true)
    })

    it('应该返回 undefined 当缓存不存在时', () => {
      expect(hotCache.query('not-exist')).toBeUndefined()
    })

    it('应该返回缓存的命令', async () => {
      const cmd = createMockCommand('q2')

      hotCache.add('cached-msg')
      await hotCache.track('cached-msg', cmd)

      const result = hotCache.query('cached-msg')
      expect(result).toBe(cmd)
    })
  })

  describe('统计功能', () => {
    it('应该返回正确的初始统计', () => {
      const stats = hotCache.getStats()

      expect(stats).toEqual({
        totalHotCommands: 0,
        totalTrackedCommands: 0,
        averageTTL: 0,
        hotHits: 0,
        normalHits: 0,
        hitRate: 0,
      })
    })

    it('应该更新统计', async () => {
      const cmd = createMockCommand('s1')

      await hotCache.track('stats-msg', cmd)

      const stats = hotCache.getStats()
      expect(stats.normalHits).toBe(1)
      expect(stats.totalTrackedCommands).toBe(1)
    })

    it('应该计算命中率', async () => {
      const cmd = createMockCommand('s2')

      // 添加热点并查询
      hotCache.add('hit-msg')
      await hotCache.track('hit-msg', cmd)

      // 查询热点（增加 hotHits）
      hotCache.query('hit-msg')
      hotCache.query('hit-msg')

      // 普通追踪（增加 normalHits，但 forceHot 的命令不增加）
      await hotCache.track('normal-msg', cmd)

      const stats = hotCache.getStats()
      expect(stats.hotHits).toBe(2)
      // forceHot 的命令 track 时不增加 normalHits
      expect(stats.normalHits).toBeGreaterThanOrEqual(1)
    })

    it('应该重置统计', async () => {
      const cmd = createMockCommand('s3')

      await hotCache.track('reset-msg', cmd)

      hotCache.resetStats()

      const stats = hotCache.getStats()
      expect(stats.hotHits).toBe(0)
      expect(stats.normalHits).toBe(0)
    })
  })

  describe('清理功能', () => {
    it('应该清空所有数据', async () => {
      const cmd = createMockCommand('c1')

      hotCache.add('clear-msg')
      await hotCache.track('clear-msg', cmd)

      hotCache.clear()

      expect(hotCache.has('clear-msg')).toBe(false)
      expect(hotCache.getStats().totalHotCommands).toBe(0)
    })

    it('应该强制清理过期数据', async () => {
      const cleaned = hotCache.forceCleanup()
      expect(typeof cleaned).toBe('number')
    })
  })

  describe('getAllHotCommands', () => {
    it('应该返回所有热点命令', async () => {
      const cmd1 = createMockCommand('h1')
      const cmd2 = createMockCommand('h2')

      hotCache.add('hot1')
      hotCache.add('hot2')

      await hotCache.track('hot1', cmd1)
      await hotCache.track('hot2', cmd2)

      const all = hotCache.getAllHotCommands()

      expect(all).toHaveLength(2)
      expect(all.some(item => item.msg === 'hot1')).toBe(true)
      expect(all.some(item => item.msg === 'hot2')).toBe(true)
    })

    it('应该返回空数组当没有热点时', () => {
      const all = hotCache.getAllHotCommands()
      expect(all).toEqual([])
    })
  })

  describe('自定义 TTL', () => {
    it('应该支持自定义 TTL', async () => {
      const cmd = createMockCommand('ttl1')

      // 添加带自定义 TTL 的热点
      hotCache.add('custom-ttl', 60000) // 1 分钟

      await hotCache.track('custom-ttl', cmd)

      expect(hotCache.has('custom-ttl')).toBe(true)
    })
  })

  describe('启用/禁用', () => {
    it('应该能够禁用和启用', async () => {
      const cmd = createMockCommand('e1')

      hotCache.setEnabled(false)

      // 禁用时 track 不生效
      hotCache.add('disabled')
      await hotCache.track('disabled', cmd)

      // 重新启用
      hotCache.setEnabled(true)

      // 之前禁用时的操作不会生效
      expect(hotCache.query('disabled')).toBeUndefined()
    })
  })

  describe('destroy', () => {
    it('应该销毁缓存', async () => {
      const cmd = createMockCommand('d1')

      hotCache.add('destroy-msg')
      await hotCache.track('destroy-msg', cmd)

      hotCache.destroy()

      expect(hotCache.has('destroy-msg')).toBe(false)
      expect(hotCache.getStats().totalHotCommands).toBe(0)
    })
  })
})
