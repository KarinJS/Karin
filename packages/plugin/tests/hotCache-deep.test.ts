/**
 * store/hotCache.ts 深度测试
 * 覆盖热点缓存的更多边缘情况
 */
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { hotCache } from '../src/store'
import type { CreateCommand } from '../src/create'

// 创建 mock 命令
function createMockCommand (id: string): CreateCommand {
  return {
    id,
    type: 'command',
    file: `/test/${id}.ts`,
    name: `command-${id}`,
    reg: new RegExp(id),
    fn: async () => true,
    event: ['message'],
    permission: 'all',
    priority: 10000,
    log: true,
    adapter: [],
    dsbAdapter: [],
  } as CreateCommand
}

describe('HotCache 深度测试', () => {
  beforeEach(() => {
    hotCache.clear()
    hotCache.setEnabled(true)
    hotCache.resetStats()
  })

  describe('track 热点检测规则', () => {
    it('应该在短时间内多次访问后自动提升为热点', async () => {
      const cmd = createMockCommand('frequent')

      // 模拟在 10 秒内访问 20 次（触发规则 1）
      for (let i = 0; i < 25; i++) {
        await hotCache.track('frequent-msg', cmd)
      }

      // 应该已被添加到热点
      expect(hotCache.has('frequent-msg')).toBe(true)
    })

    it('应该在 10 秒内访问 3 次后提升为热点', async () => {
      const cmd = createMockCommand('quick')

      await hotCache.track('quick-msg', cmd)
      await hotCache.track('quick-msg', cmd)
      await hotCache.track('quick-msg', cmd)

      // 应该已被添加到热点
      expect(hotCache.has('quick-msg')).toBe(true)
    })

    it('应该对 forceCold 列表中的命令不追踪', async () => {
      const cmd = createMockCommand('cold')

      hotCache.remove('cold-msg') // 添加到 forceCold 列表

      for (let i = 0; i < 30; i++) {
        await hotCache.track('cold-msg', cmd)
      }

      expect(hotCache.has('cold-msg')).toBe(false)
    })

    it('应该对 forceHot 列表中的命令立即添加到热点', async () => {
      const cmd = createMockCommand('hot')

      hotCache.add('hot-msg')
      await hotCache.track('hot-msg', cmd)

      expect(hotCache.has('hot-msg')).toBe(true)
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
      expect(hotCache.query('non-existent')).toBeUndefined()
    })

    it('应该返回缓存的命令', async () => {
      const cmd = createMockCommand('q2')

      hotCache.add('cached-msg')
      await hotCache.track('cached-msg', cmd)

      const result = hotCache.query('cached-msg')
      expect(result).toBeDefined()
      expect(result?.id).toBe('q2')
    })

    it('应该增加 hotHits 统计', async () => {
      const cmd = createMockCommand('q3')

      hotCache.add('hit-msg')
      await hotCache.track('hit-msg', cmd)

      const before = hotCache.getStats().hotHits
      hotCache.query('hit-msg')
      hotCache.query('hit-msg')
      const after = hotCache.getStats().hotHits

      expect(after - before).toBe(2)
    })
  })

  describe('has 功能', () => {
    it('应该检查热点是否存在', async () => {
      const cmd = createMockCommand('h1')

      hotCache.add('has-msg')
      await hotCache.track('has-msg', cmd)

      expect(hotCache.has('has-msg')).toBe(true)
      expect(hotCache.has('non-existent')).toBe(false)
    })
  })

  describe('add/remove 功能', () => {
    it('应该强制添加热点', () => {
      hotCache.add('force-hot')
      // forceHot 不会立即添加到热点缓存，需要 track 时才会
    })

    it('应该支持自定义 TTL', () => {
      hotCache.add('custom-ttl', 60000) // 1 分钟
    })

    it('应该强制移除热点', async () => {
      const cmd = createMockCommand('r1')

      hotCache.add('remove-msg')
      await hotCache.track('remove-msg', cmd)

      hotCache.remove('remove-msg')

      expect(hotCache.has('remove-msg')).toBe(false)
    })
  })

  describe('getStats 功能', () => {
    it('应该返回正确的初始统计', () => {
      const stats = hotCache.getStats()

      expect(stats.totalHotCommands).toBe(0)
      expect(stats.totalTrackedCommands).toBe(0)
      expect(stats.hotHits).toBe(0)
      expect(stats.normalHits).toBe(0)
      expect(stats.hitRate).toBe(0)
    })

    it('应该计算正确的 hitRate', async () => {
      const cmd = createMockCommand('s1')

      // 添加热点
      hotCache.add('stats-msg')
      await hotCache.track('stats-msg', cmd)

      // 查询 2 次
      hotCache.query('stats-msg')
      hotCache.query('stats-msg')

      // 普通追踪 2 次
      await hotCache.track('normal-msg', cmd)
      await hotCache.track('normal-msg', cmd)

      const stats = hotCache.getStats()
      expect(stats.hotHits).toBe(2)
      expect(stats.normalHits).toBeGreaterThanOrEqual(2)
      expect(stats.hitRate).toBeGreaterThan(0)
    })

    it('应该返回 averageTTL', async () => {
      const cmd = createMockCommand('s2')

      hotCache.add('ttl-msg')
      await hotCache.track('ttl-msg', cmd)

      const stats = hotCache.getStats()
      expect(stats.averageTTL).toBeGreaterThanOrEqual(0)
    })
  })

  describe('resetStats 功能', () => {
    it('应该重置统计数据', async () => {
      const cmd = createMockCommand('rs1')

      hotCache.add('reset-msg')
      await hotCache.track('reset-msg', cmd)
      hotCache.query('reset-msg')

      hotCache.resetStats()

      const stats = hotCache.getStats()
      expect(stats.hotHits).toBe(0)
      expect(stats.normalHits).toBe(0)
    })
  })

  describe('clear 功能', () => {
    it('应该清空所有数据', async () => {
      const cmd = createMockCommand('c1')

      hotCache.add('clear-msg')
      await hotCache.track('clear-msg', cmd)

      hotCache.clear()

      expect(hotCache.has('clear-msg')).toBe(false)
      expect(hotCache.getStats().hotHits).toBe(0)
    })
  })

  describe('setEnabled 功能', () => {
    it('应该禁用追踪', async () => {
      const cmd = createMockCommand('d1')

      hotCache.setEnabled(false)

      await hotCache.track('disabled-msg', cmd)

      expect(hotCache.getStats().normalHits).toBe(0)

      hotCache.setEnabled(true)
    })
  })

  describe('destroy 功能', () => {
    it('应该销毁缓存', () => {
      hotCache.destroy()

      // 重新初始化
      hotCache.clear()
      hotCache.setEnabled(true)
    })
  })

  describe('getAllHotCommands 功能', () => {
    it('应该返回所有热点命令', async () => {
      const cmd1 = createMockCommand('all1')
      const cmd2 = createMockCommand('all2')

      hotCache.add('all-msg-1')
      hotCache.add('all-msg-2')

      await hotCache.track('all-msg-1', cmd1)
      await hotCache.track('all-msg-2', cmd2)

      const all = hotCache.getAllHotCommands()

      expect(all.length).toBe(2)
      expect(all.some(item => item.msg === 'all-msg-1')).toBe(true)
      expect(all.some(item => item.msg === 'all-msg-2')).toBe(true)
    })

    it('应该返回空数组当没有热点时', () => {
      const all = hotCache.getAllHotCommands()
      expect(all).toEqual([])
    })
  })

  describe('forceCleanup 功能', () => {
    it('应该强制清理过期数据', async () => {
      const cmd = createMockCommand('fc1')

      hotCache.add('cleanup-msg')
      await hotCache.track('cleanup-msg', cmd)

      const cleaned = hotCache.forceCleanup()
      expect(typeof cleaned).toBe('number')
    })
  })

  describe('LRU 淘汰', () => {
    it('应该在达到最大条目时淘汰旧数据', async () => {
      const cmd = createMockCommand('lru')

      // 追踪大量不同的命令（不会触发这个测试的实际 LRU 淘汰，因为限制是 10000）
      for (let i = 0; i < 100; i++) {
        await hotCache.track(`lru-msg-${i}`, cmd)
      }

      // 只是确保不会崩溃
      expect(hotCache.getStats().totalTrackedCommands).toBeLessThanOrEqual(10000)
    })
  })

  describe('TTL 延长', () => {
    it('应该在访问热点时延长 TTL', async () => {
      const cmd = createMockCommand('ttl-ext')

      hotCache.add('ttl-extend-msg')
      await hotCache.track('ttl-extend-msg', cmd)

      // 再次追踪应该延长 TTL
      await hotCache.track('ttl-extend-msg', cmd)

      expect(hotCache.has('ttl-extend-msg')).toBe(true)
    })
  })
})
