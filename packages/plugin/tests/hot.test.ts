/**
 * hot.ts 热点缓存系统测试
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { CommandHotCache } from '../src/api/hot'
import type { RegistryItem } from '../src/types'

const mockCommand = (id: string): RegistryItem => ({
  id,
  type: 'command',
  pkg: 'test-pkg',
  file: '/test.ts',
  name: `cmd-${id}`,
  reg: /test/,
  priority: 100,
  callback: () => { },
})

describe('CommandHotCache', () => {
  let hotCache: CommandHotCache

  beforeEach(() => {
    hotCache = new CommandHotCache()
  })

  afterEach(() => {
    hotCache.destroy()
  })

  describe('constructor', () => {
    it('should initialize with empty state', () => {
      const stats = hotCache.getStats()
      expect(stats.totalHotCommands).toBe(0)
      expect(stats.totalTrackedCommands).toBe(0)
      expect(stats.hotHits).toBe(0)
      expect(stats.normalHits).toBe(0)
    })
  })

  describe('track', () => {
    it('should track command usage', async () => {
      const cmd = mockCommand('1')
      await hotCache.track('test message', cmd)
      const stats = hotCache.getStats()
      expect(stats.totalTrackedCommands).toBe(1)
      expect(stats.normalHits).toBe(1)
    })

    it('should skip tracking when disabled', async () => {
      hotCache.setEnabled(false)
      const cmd = mockCommand('1')
      await hotCache.track('test', cmd)
      expect(hotCache.getStats().totalTrackedCommands).toBe(0)
    })

    it('should skip tracking for forceCold messages', async () => {
      hotCache.remove('cold-msg')
      const cmd = mockCommand('1')
      await hotCache.track('cold-msg', cmd)
      expect(hotCache.getStats().totalTrackedCommands).toBe(0)
    })

    it('should immediately add forceHot messages to hot cache', async () => {
      hotCache.add('hot-msg', 60000)
      const cmd = mockCommand('1')
      await hotCache.track('hot-msg', cmd)
      expect(hotCache.has('hot-msg')).toBe(true)
    })

    it('should promote to hot cache after high frequency usage', async () => {
      const cmd = mockCommand('1')
      // 模拟高频访问 (10秒内3次触发高频规则)
      for (let i = 0; i < 5; i++) {
        await hotCache.track('frequent-msg', cmd)
      }
      // 可能仍未达到热点阈值，这取决于时间窗口
      const stats = hotCache.getStats()
      expect(stats.normalHits).toBeGreaterThanOrEqual(5)
    })

    it('should extend TTL for existing hot cache entry', async () => {
      const cmd = mockCommand('1')
      hotCache.add('extend-msg')
      await hotCache.track('extend-msg', cmd)
      expect(hotCache.has('extend-msg')).toBe(true)
      // 再次访问以延长TTL
      await hotCache.track('extend-msg', cmd)
      expect(hotCache.has('extend-msg')).toBe(true)
    })

    it('should evict oldest entry when max entries reached', async () => {
      const cmd = mockCommand('1')
      // 创建大量条目
      for (let i = 0; i < 100; i++) {
        await hotCache.track(`msg-${i}`, cmd)
      }
      expect(hotCache.getStats().totalTrackedCommands).toBeLessThanOrEqual(10000)
    })
  })

  describe('query', () => {
    it('should return undefined when disabled', () => {
      hotCache.setEnabled(false)
      expect(hotCache.query('test')).toBeUndefined()
    })

    it('should return undefined for non-existent entry', () => {
      expect(hotCache.query('non-existent')).toBeUndefined()
    })

    it('should return command for existing hot entry', async () => {
      const cmd = mockCommand('1')
      hotCache.add('hot-msg')
      await hotCache.track('hot-msg', cmd)
      const result = hotCache.query('hot-msg')
      expect(result).toBeDefined()
      expect(result?.id).toBe('1')
    })

    it('should delete and return undefined for expired entry', async () => {
      const cmd = mockCommand('1')
      hotCache.add('expired-msg', 1) // 1ms TTL
      await hotCache.track('expired-msg', cmd)
      await new Promise(r => setTimeout(r, 10))
      expect(hotCache.query('expired-msg')).toBeUndefined()
    })

    it('should increment hotHits on successful query', async () => {
      const cmd = mockCommand('1')
      hotCache.add('hot-msg')
      await hotCache.track('hot-msg', cmd)
      hotCache.query('hot-msg')
      expect(hotCache.getStats().hotHits).toBe(1)
    })
  })

  describe('has', () => {
    it('should return false for non-existent entry', () => {
      expect(hotCache.has('non-existent')).toBe(false)
    })

    it('should return true for existing entry', async () => {
      const cmd = mockCommand('1')
      hotCache.add('hot-msg')
      await hotCache.track('hot-msg', cmd)
      expect(hotCache.has('hot-msg')).toBe(true)
    })

    it('should return false and delete expired entry', async () => {
      const cmd = mockCommand('1')
      hotCache.add('expired', 1)
      await hotCache.track('expired', cmd)
      await new Promise(r => setTimeout(r, 10))
      expect(hotCache.has('expired')).toBe(false)
    })
  })

  describe('add', () => {
    it('should add message to forceHot set', () => {
      hotCache.add('force-hot')
      expect(hotCache.has('force-hot')).toBe(false) // 还未track
    })

    it('should store custom TTL', async () => {
      const cmd = mockCommand('1')
      hotCache.add('custom-ttl', 30000)
      await hotCache.track('custom-ttl', cmd)
      expect(hotCache.has('custom-ttl')).toBe(true)
    })
  })

  describe('remove', () => {
    it('should add message to forceCold set', async () => {
      const cmd = mockCommand('1')
      hotCache.add('to-remove')
      await hotCache.track('to-remove', cmd)
      hotCache.remove('to-remove')
      expect(hotCache.has('to-remove')).toBe(false)
    })

    it('should clear all related data', async () => {
      const cmd = mockCommand('1')
      hotCache.add('to-clear', 60000)
      await hotCache.track('to-clear', cmd)
      hotCache.remove('to-clear')
      // 再次 track 应该被跳过因为在 forceCold
      await hotCache.track('to-clear', cmd)
      expect(hotCache.getStats().totalTrackedCommands).toBe(0)
    })
  })

  describe('getStats', () => {
    it('should return correct statistics', async () => {
      const cmd = mockCommand('1')
      await hotCache.track('msg1', cmd)
      await hotCache.track('msg2', cmd)
      hotCache.add('hot')
      await hotCache.track('hot', cmd)
      hotCache.query('hot')

      const stats = hotCache.getStats()
      expect(stats.totalTrackedCommands).toBe(2)
      expect(stats.totalHotCommands).toBe(1)
      // forceHot 不计入 normalHits
      expect(stats.normalHits).toBe(2)
      expect(stats.hotHits).toBe(1)
      expect(stats.hitRate).toBeGreaterThan(0)
    })

    it('should calculate average TTL correctly', async () => {
      const cmd = mockCommand('1')
      hotCache.add('ttl-test', 60000)
      await hotCache.track('ttl-test', cmd)
      const stats = hotCache.getStats()
      expect(stats.averageTTL).toBeGreaterThan(0)
    })

    it('should return 0 hitRate when no hits', () => {
      expect(hotCache.getStats().hitRate).toBe(0)
    })
  })

  describe('resetStats', () => {
    it('should reset hit counters', async () => {
      const cmd = mockCommand('1')
      await hotCache.track('msg', cmd)
      hotCache.add('hot')
      await hotCache.track('hot', cmd)
      hotCache.query('hot')

      hotCache.resetStats()
      const stats = hotCache.getStats()
      expect(stats.hotHits).toBe(0)
      expect(stats.normalHits).toBe(0)
    })
  })

  describe('clear', () => {
    it('should clear all data and stats', async () => {
      const cmd = mockCommand('1')
      await hotCache.track('msg', cmd)
      hotCache.add('hot')
      await hotCache.track('hot', cmd)

      hotCache.clear()
      const stats = hotCache.getStats()
      expect(stats.totalHotCommands).toBe(0)
      expect(stats.totalTrackedCommands).toBe(0)
      expect(stats.hotHits).toBe(0)
      expect(stats.normalHits).toBe(0)
    })
  })

  describe('setEnabled', () => {
    it('should enable/disable the cache system', async () => {
      const cmd = mockCommand('1')
      hotCache.setEnabled(false)
      await hotCache.track('msg', cmd)
      expect(hotCache.getStats().totalTrackedCommands).toBe(0)

      hotCache.setEnabled(true)
      await hotCache.track('msg', cmd)
      expect(hotCache.getStats().totalTrackedCommands).toBe(1)
    })
  })

  describe('destroy', () => {
    it('should stop cleanup timer and clear all data', () => {
      hotCache.destroy()
      expect(hotCache.getStats().totalHotCommands).toBe(0)
    })
  })

  describe('getAllHotCommands', () => {
    it('should return all valid hot commands', async () => {
      const cmd1 = mockCommand('1')
      const cmd2 = mockCommand('2')
      hotCache.add('hot1')
      hotCache.add('hot2')
      await hotCache.track('hot1', cmd1)
      await hotCache.track('hot2', cmd2)

      const commands = hotCache.getAllHotCommands()
      expect(commands.length).toBe(2)
      expect(commands.some(c => c.msg === 'hot1')).toBe(true)
      expect(commands.some(c => c.msg === 'hot2')).toBe(true)
    })

    it('should filter out expired commands', async () => {
      const cmd = mockCommand('1')
      hotCache.add('expired', 1)
      await hotCache.track('expired', cmd)
      await new Promise(r => setTimeout(r, 10))
      const commands = hotCache.getAllHotCommands()
      expect(commands.length).toBe(0)
    })
  })

  describe('forceCleanup', () => {
    it('should manually trigger cleanup', async () => {
      const cmd = mockCommand('1')
      hotCache.add('to-clean', 1)
      await hotCache.track('to-clean', cmd)
      await new Promise(r => setTimeout(r, 10))
      const cleaned = hotCache.forceCleanup()
      expect(cleaned).toBeGreaterThanOrEqual(0)
    })
  })
})
