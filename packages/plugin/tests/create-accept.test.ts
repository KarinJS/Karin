/**
 * accept API 单元测试
 */
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { store } from '../src/store'
import { accept, CreateAccept } from '../src/create/accept'

describe('create/accept', () => {
  beforeEach(() => {
    store.clear()
  })

  describe('accept()', () => {
    it('should create an accept plugin with event and callback', () => {
      const callback = vi.fn()
      const a = accept('notice', callback, { name: 'test-accept' })

      expect(a).toBeInstanceOf(CreateAccept)
      expect(a.name).toBe('test-accept')
      expect(a.type).toBe('accept')
      expect(a.event).toBe('notice')
    })

    it('should auto-register to store', () => {
      accept('notice', vi.fn(), { name: 'auto-accept' })

      const all = store.get('accept')
      expect(all.length).toBe(1)
      expect(all[0].name).toBe('auto-accept')
    })

    it('should support request event', () => {
      const a = accept('request', vi.fn(), { name: 'request-accept' })

      expect(a.event).toBe('request')
    })
  })

  describe('CreateAccept validation', () => {
    it('should throw if name is empty', () => {
      expect(() => accept('notice', vi.fn(), { name: '' })).toThrow()
    })

    it('should throw if name is missing', () => {
      expect(() => accept('notice', vi.fn(), {} as any)).toThrow()
    })
  })

  describe('CreateAccept properties', () => {
    it('should have correct default options', () => {
      const a = accept('notice', vi.fn(), { name: 'default-accept' })

      expect(a.priority).toBe(10000)
      expect(a.options.log).toBe(true)
    })

    it('should respect custom priority', () => {
      const a = accept('notice', vi.fn(), { name: 'priority-accept', priority: 100 })

      expect(a.priority).toBe(100)
    })

    it('should generate unique id', () => {
      const a1 = accept('notice', vi.fn(), { name: 'accept1' })
      const a2 = accept('notice', vi.fn(), { name: 'accept2' })

      expect(a1.id).not.toBe(a2.id)
    })

    it('should return callback function', () => {
      const cb = vi.fn()
      const a = accept('notice', cb, { name: 'callback-accept' })

      expect(a.callback).toBe(cb)
    })
  })

  describe('CreateAccept.setters', () => {
    it('should update event with setEvent', () => {
      const a = accept('notice', vi.fn(), { name: 'event-setter' })

      expect(a.event).toBe('notice')

      a.setEvent('request')
      expect(a.event).toBe('request')
    })

    it('should update callback with setCallback', () => {
      const cb1 = vi.fn()
      const cb2 = vi.fn()
      const a = accept('notice', cb1, { name: 'callback-setter' })

      expect(a.callback).toBe(cb1)

      a.setCallback(cb2)
      expect(a.callback).toBe(cb2)
    })

    it('should update options with setOptions', () => {
      const a = accept('notice', vi.fn(), { name: 'options-setter', priority: 100 })

      expect(a.priority).toBe(100)

      a.setOptions({ name: 'options-setter', priority: 200 })
      expect(a.priority).toBe(200)
    })
  })

  describe('CreateAccept.options parsing', () => {
    it('should parse all options correctly', () => {
      const a = accept('notice', vi.fn(), {
        name: 'full-options',
        priority: 50,
        log: false,
        adapter: [],
        dsbAdapter: [],
      })

      expect(a.name).toBe('full-options')
      expect(a.priority).toBe(50)
      expect(a.options.log).toBe(false)
    })

    it('should fallback rank to priority', () => {
      const a = accept('notice', vi.fn(), {
        name: 'rank-test',
        rank: 200,
      } as any)

      expect(a.priority).toBe(200)
    })
  })
})
