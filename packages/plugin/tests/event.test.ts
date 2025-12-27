/**
 * Event API 单元测试
 * @module tests/event.test
 */
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { event } from '../src/api/event'

describe('Event API', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('event instance', () => {
    it('should be an EventEmitter', () => {
      expect(event).toBeDefined()
      expect(typeof event.emit).toBe('function')
      expect(typeof event.on).toBe('function')
      expect(typeof event.off).toBe('function')
    })

    it('should have emit method', () => {
      expect(event.emit).toBeDefined()
    })

    it('should have on method', () => {
      expect(event.on).toBeDefined()
    })

    it('should have off method', () => {
      expect(event.off).toBeDefined()
    })

    it('should have once method', () => {
      expect(event.once).toBeDefined()
    })
  })

  describe('event emission (mocked)', () => {
    it('should call emit with correct arguments', () => {
      event.emit('plugin:load:start', { pkg: 'test-pkg' })

      expect(event.emit).toHaveBeenCalledWith('plugin:load:start', { pkg: 'test-pkg' })
    })

    it('should call emit for plugin:load:done', () => {
      event.emit('plugin:load:done', { pkg: 'test-pkg', results: [], duration: 100 })

      expect(event.emit).toHaveBeenCalledWith('plugin:load:done', expect.objectContaining({
        pkg: 'test-pkg',
      }))
    })

    it('should call emit for plugin:reload', () => {
      event.emit('plugin:reload', { pkg: 'test-pkg', results: [] })

      expect(event.emit).toHaveBeenCalledWith('plugin:reload', expect.objectContaining({
        pkg: 'test-pkg',
      }))
    })
  })
})
