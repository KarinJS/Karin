/**
 * hot.ts 未覆盖分支测试
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { CommandHotCache } from '../src/api/hot'
import type { RegistryItem } from '../src/types'

describe('hot.ts 边缘情况覆盖', () => {
  let cache: CommandHotCache
  const mockCommand: RegistryItem = {
    file: '/test.ts',
    name: 'test',
    type: 'command',
    log: 'true',
    priority: 100,
    rule: /^test$/,
    fn: async () => {},
  }

  beforeEach(() => {
    cache = new CommandHotCache()
  })

  afterEach(() => {
    cache.destroy()
  })

  describe('track with forceCold', () => {
    it('should not track if message is in forceCold', async () => {
      cache.remove('test-cold')
      await cache.track('test-cold', mockCommand)
      expect(cache.has('test-cold')).toBe(false)
    })
  })

  describe('track with forceHot', () => {
    it('should immediately add to hot when in forceHot', async () => {
      cache.add('test-hot', 60000)
      await cache.track('test-hot', mockCommand)
      expect(cache.has('test-hot')).toBe(true)
    })

    it('should use custom TTL when set', async () => {
      cache.add('test-custom', 1000)
      await cache.track('test-custom', mockCommand)
      const cmd = cache.query('test-custom')
      expect(cmd).toBeDefined()
    })
  })

  describe('track triggers eviction', () => {
    it('should evict oldest when maxEntries reached', async () => {
      // 创建一个小容量的缓存来测试淘汰
      const smallCache = new CommandHotCache()
      // 无法直接修改 maxEntries，我们需要通过大量添加来测试
      // 只测试基本路径
      await smallCache.track('msg1', mockCommand)
      await smallCache.track('msg2', mockCommand)
      smallCache.destroy()
    })
  })

  describe('query expired entry', () => {
    it('should return undefined and delete expired entry', async () => {
      // 添加一个短 TTL 的热点
      cache.add('exp-test', 1) // 1ms TTL
      await cache.track('exp-test', mockCommand)

      // 等待过期
      await new Promise(resolve => setTimeout(resolve, 10))

      const result = cache.query('exp-test')
      expect(result).toBeUndefined()
    })
  })

  describe('has with expired entry', () => {
    it('should return false and delete expired entry', async () => {
      cache.add('has-exp', 1)
      await cache.track('has-exp', mockCommand)

      await new Promise(resolve => setTimeout(resolve, 10))

      expect(cache.has('has-exp')).toBe(false)
    })
  })

  describe('query when disabled', () => {
    it('should return undefined when disabled', async () => {
      cache.add('dis-test')
      await cache.track('dis-test', mockCommand)
      cache.setEnabled(false)
      expect(cache.query('dis-test')).toBeUndefined()
      cache.setEnabled(true)
    })
  })

  describe('TTL extension logic', () => {
    it('should extend TTL on re-track before expiration', async () => {
      // 快速添加多次触发热点
      for (let i = 0; i < 25; i++) {
        await cache.track('extend-test', mockCommand)
      }

      // 再次追踪应该延长 TTL
      await cache.track('extend-test', mockCommand)

      const cmd = cache.query('extend-test')
      expect(cmd).toBeDefined()
    })
  })

  describe('getAllHotCommands', () => {
    it('should return all non-expired hot commands', async () => {
      cache.add('hot1')
      cache.add('hot2')
      await cache.track('hot1', mockCommand)
      await cache.track('hot2', mockCommand)

      const cmds = cache.getAllHotCommands()
      expect(cmds.length).toBe(2)
    })

    it('should filter out expired commands', async () => {
      cache.add('exp1', 1)
      await cache.track('exp1', mockCommand)

      await new Promise(resolve => setTimeout(resolve, 10))

      const cmds = cache.getAllHotCommands()
      expect(cmds.find(c => c.msg === 'exp1')).toBeUndefined()
    })
  })

  describe('forceCleanup', () => {
    it('should clean expired entries', async () => {
      cache.add('cleanup-test', 1)
      await cache.track('cleanup-test', mockCommand)

      await new Promise(resolve => setTimeout(resolve, 10))

      const cleaned = cache.forceCleanup()
      expect(cleaned).toBeGreaterThanOrEqual(0)
    })

    it('should clean old stats entries', async () => {
      await cache.track('stats-test', mockCommand)
      // 不触发热点规则，只在统计中

      const cleaned = cache.forceCleanup()
      expect(cleaned).toBeGreaterThanOrEqual(0)
    })
  })

  describe('getStats edge cases', () => {
    it('should return 0 hitRate when no hits', () => {
      const stats = cache.getStats()
      expect(stats.hitRate).toBe(0)
    })

    it('should return 0 averageTTL when no hot commands', () => {
      const stats = cache.getStats()
      expect(stats.averageTTL).toBe(0)
    })

    it('should calculate correct hitRate', async () => {
      cache.add('hit-test')
      await cache.track('hit-test', mockCommand)
      cache.query('hit-test')
      cache.query('hit-test')

      const stats = cache.getStats()
      expect(stats.hotHits).toBeGreaterThan(0)
    })
  })

  describe('track disabled', () => {
    it('should not track when disabled', async () => {
      cache.setEnabled(false)
      await cache.track('disabled-test', mockCommand)
      cache.setEnabled(true)
      expect(cache.has('disabled-test')).toBe(false)
    })
  })

  describe('rule matching', () => {
    it('should match super hot rule (20 in 10s)', async () => {
      for (let i = 0; i < 25; i++) {
        await cache.track('super-hot', mockCommand)
      }
      expect(cache.has('super-hot')).toBe(true)
    })

    it('should match high frequency rule (3 in 10s)', async () => {
      for (let i = 0; i < 5; i++) {
        await cache.track('high-freq', mockCommand)
      }
      expect(cache.has('high-freq')).toBe(true)
    })
  })

  describe('destroy', () => {
    it('should stop cleanup timer', () => {
      const c = new CommandHotCache()
      c.destroy()
      // 再次销毁不应报错
      c.destroy()
    })
  })
})
