/**
 * Context 模块测试
 * 覆盖 create/context.ts
 */
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { contextMap, checkContext, ctx } from '../src/create/context'

// Mock @karinjs/events
vi.mock('@karinjs/events', () => ({
  emitter: {
    emit: vi.fn(),
    once: vi.fn(),
    removeAllListeners: vi.fn(),
  },
}))

import { emitter } from '@karinjs/events'

describe('Context 模块', () => {
  beforeEach(() => {
    contextMap.clear()
    vi.clearAllMocks()
  })

  afterEach(() => {
    contextMap.clear()
    vi.clearAllMocks()
  })

  describe('contextMap', () => {
    it('应该是一个 Map 实例', () => {
      expect(contextMap).toBeInstanceOf(Map)
    })

    it('应该支持设置和获取', () => {
      const event = { contact: { peer: '123' }, userId: '456' } as any
      contextMap.set('test-key', event)

      expect(contextMap.has('test-key')).toBe(true)
      expect(contextMap.get('test-key')).toBe(event)
    })
  })

  describe('checkContext', () => {
    it('应该返回 false 当上下文不存在时', () => {
      const event = {
        contact: { peer: '123' },
        userId: '456',
      } as any

      const result = checkContext(event)
      expect(result).toBe(false)
    })

    it('应该返回 true 当上下文存在时（无 subPeer）', () => {
      const key = '123:456'
      const event = {
        contact: { peer: '123' },
        userId: '456',
      } as any

      contextMap.set(key, event)

      const result = checkContext(event)

      expect(result).toBe(true)
      expect(emitter.emit).toHaveBeenCalledWith(`ctx:${key}`, event)
      expect(contextMap.has(key)).toBe(false) // 上下文被删除
    })

    it('应该返回 true 当上下文存在时（有 subPeer）', () => {
      const key = '123:789:456'
      const event = {
        contact: { peer: '123', subPeer: '789' },
        userId: '456',
      } as any

      contextMap.set(key, event)

      const result = checkContext(event)

      expect(result).toBe(true)
      expect(emitter.emit).toHaveBeenCalledWith(`ctx:${key}`, event)
      expect(contextMap.has(key)).toBe(false)
    })

    it('应该正确构建 key（有 subPeer）', () => {
      const event = {
        contact: { peer: 'group_123', subPeer: 'channel_456' },
        userId: 'user_789',
      } as any

      contextMap.set('group_123:channel_456:user_789', { test: true } as any)

      const result = checkContext(event)
      expect(result).toBe(true)
    })

    it('应该正确构建 key（无 subPeer）', () => {
      const event = {
        contact: { peer: 'friend_123' },
        userId: 'user_456',
      } as any

      contextMap.set('friend_123:user_456', { test: true } as any)

      const result = checkContext(event)
      expect(result).toBe(true)
    })
  })

  describe('ctx 函数', () => {
    beforeEach(() => {
      vi.useFakeTimers()
    })

    afterEach(() => {
      vi.useRealTimers()
    })

    it('应该设置上下文并返回 Promise', async () => {
      const event = {
        contact: { peer: '123' },
        userId: '456',
        eventId: 'evt-1',
        reply: vi.fn(),
      } as any

      // 模拟 emitter.once 立即触发
      vi.mocked(emitter.once).mockImplementation((eventName, callback) => {
        setTimeout(() => callback({ message: 'response' } as any), 10)
        return emitter as any
      })

      const promise = ctx(event)

      // 检查上下文已设置
      expect(contextMap.has('123:456')).toBe(true)

      // 快进定时器
      await vi.advanceTimersByTimeAsync(20)

      const result = await promise
      expect(result).toEqual({ message: 'response' })
    })

    it('应该使用自定义 userId', async () => {
      const event = {
        contact: { peer: '123' },
        userId: '456',
        eventId: 'evt-2',
        reply: vi.fn(),
      } as any

      vi.mocked(emitter.once).mockImplementation((eventName, callback) => {
        setTimeout(() => callback({ message: 'custom' } as any), 10)
        return emitter as any
      })

      const promise = ctx(event, { userId: 'custom-user' })

      expect(contextMap.has('123:custom-user')).toBe(true)

      await vi.advanceTimersByTimeAsync(20)
      await promise
    })

    it('应该支持 subPeer 的 key 构建', async () => {
      const event = {
        contact: { peer: 'group', subPeer: 'channel' },
        userId: 'user',
        eventId: 'evt-3',
        reply: vi.fn(),
      } as any

      vi.mocked(emitter.once).mockImplementation((eventName, callback) => {
        setTimeout(() => callback({} as any), 10)
        return emitter as any
      })

      const promise = ctx(event)

      expect(contextMap.has('group:channel:user')).toBe(true)

      await vi.advanceTimersByTimeAsync(20)
      await promise
    })

    it('应该在超时后 reject', async () => {
      const event = {
        contact: { peer: '123' },
        userId: '456',
        eventId: 'evt-4',
        reply: vi.fn(),
      } as any

      // 不触发回调，让它超时
      vi.mocked(emitter.once).mockImplementation(() => emitter as any)

      const promise = ctx(event, { time: 1 }) // 1 秒超时

      // 快进超过超时时间并立即 catch rejection
      vi.advanceTimersByTime(1100)
      await expect(promise).rejects.toThrow('接收下文事件超时')
    })

    it('应该在超时时回复消息（如果启用）', async () => {
      const event = {
        contact: { peer: '123' },
        userId: '456',
        eventId: 'evt-5',
        reply: vi.fn(),
      } as any

      vi.mocked(emitter.once).mockImplementation(() => emitter as any)

      const promise = ctx(event, { time: 1, reply: true })

      vi.advanceTimersByTime(1100)

      await expect(promise).rejects.toThrow('接收下文事件超时')
      expect(event.reply).toHaveBeenCalledWith('操作超时已取消')
    })

    it('应该在超时时使用自定义回复消息', async () => {
      const event = {
        contact: { peer: '123' },
        userId: '456',
        eventId: 'evt-6',
        reply: vi.fn(),
      } as any

      vi.mocked(emitter.once).mockImplementation(() => emitter as any)

      const promise = ctx(event, { time: 1, reply: true, replyMsg: '自定义超时消息' })

      vi.advanceTimersByTime(1100)

      await expect(promise).rejects.toThrow('接收下文事件超时')
      expect(event.reply).toHaveBeenCalledWith('自定义超时消息')
    })

    it('应该在超时后移除监听器', async () => {
      const event = {
        contact: { peer: '123' },
        userId: '456',
        eventId: 'evt-7',
        reply: vi.fn(),
      } as any

      vi.mocked(emitter.once).mockImplementation(() => emitter as any)

      const promise = ctx(event, { time: 1 })

      vi.advanceTimersByTime(1100)

      await expect(promise).rejects.toThrow('接收下文事件超时')
      expect(emitter.removeAllListeners).toHaveBeenCalledWith('ctx:123:456')
    })

    it('应该使用默认超时时间（120秒）', async () => {
      const event = {
        contact: { peer: '123' },
        userId: '456',
        eventId: 'evt-8',
        reply: vi.fn(),
      } as any

      // 在 50 秒后触发
      vi.mocked(emitter.once).mockImplementation((eventName, callback) => {
        setTimeout(() => callback({ msg: 'ok' } as any), 50000)
        return emitter as any
      })

      const promise = ctx(event)

      // 50 秒内应该还在等待
      await vi.advanceTimersByTimeAsync(50100)

      const result = await promise
      expect(result).toEqual({ msg: 'ok' })
    })

    it('应该支持 user_id 作为 fallback', async () => {
      const event = {
        contact: { peer: '123' },
        user_id: 'legacy-user', // 旧格式
        eventId: 'evt-9',
        reply: vi.fn(),
      } as any

      vi.mocked(emitter.once).mockImplementation((eventName, callback) => {
        setTimeout(() => callback({} as any), 10)
        return emitter as any
      })

      const promise = ctx(event)

      expect(contextMap.has('123:legacy-user')).toBe(true)

      await vi.advanceTimersByTimeAsync(20)
      await promise
    })
  })
})
