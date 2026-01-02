/**
 * handler API 单元测试
 */
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { store } from '../src/store'
import { handler, CreateHandler } from '../src/create/handler'

describe('create/handler', () => {
  beforeEach(() => {
    store.clear()
  })

  describe('handler()', () => {
    it('should create a handler with key and callback', () => {
      const callback = vi.fn()
      const h = handler('test.key', callback, { name: 'test-handler' })

      expect(h).toBeInstanceOf(CreateHandler)
      expect(h.name).toBe('test-handler')
      expect(h.type).toBe('handler')
      expect(h.key).toBe('test.key')
    })

    it('should auto-register to store', () => {
      const callback = vi.fn()
      handler('auto.key', callback, { name: 'auto-handler' })

      const all = store.get('handler')
      expect(all.length).toBe(1)
      expect(all[0].name).toBe('auto-handler')
    })

    it('should throw if key is empty', () => {
      expect(() => {
        handler('', vi.fn(), { name: 'no-key' })
      }).toThrow('缺少参数[key]')
    })

    it('should throw if callback is missing', () => {
      expect(() => {
        handler('some.key', undefined as any, { name: 'no-callback' })
      }).toThrow('缺少参数[fnc]')
    })

    it('should throw if name is empty', () => {
      expect(() => {
        handler('test.key', vi.fn(), { name: '' })
      }).toThrow('name 是必填项')
    })
  })

  describe('CreateHandler', () => {
    it('should have correct default options', () => {
      const h = handler('test', vi.fn(), { name: 'defaults' })

      expect(h.options.priority).toBe(10000)
      expect(h.options.log).toBe(true)
      expect(h.options.adapter).toEqual([])
      expect(h.options.dsbAdapter).toEqual([])
    })

    it('should respect custom priority', () => {
      const h = handler('test', vi.fn(), { name: 'priority', priority: 50 })

      expect(h.options.priority).toBe(50)
      expect(h.priority).toBe(50)
    })

    it('should generate unique id', () => {
      const h1 = handler('key1', vi.fn(), { name: 'h1' })
      const h2 = handler('key2', vi.fn(), { name: 'h2' })

      expect(h1.id).toBeTruthy()
      expect(h2.id).toBeTruthy()
      expect(h1.id).not.toBe(h2.id)
    })

    it('should return callback function', () => {
      const callback = vi.fn()
      const h = handler('test', callback, { name: 'cb' })

      expect(h.callback).toBe(callback)
    })
  })

  describe('CreateHandler.setters', () => {
    it('should update key with setKey', () => {
      const h = handler('old.key', vi.fn(), { name: 'setter' })

      h.setKey('new.key')
      expect(h.key).toBe('new.key')
    })

    it('should update callback with setCallback', () => {
      const original = vi.fn()
      const newCallback = vi.fn()
      const h = handler('test', original, { name: 'callback-setter' })

      h.setCallback(newCallback)
      expect(h.callback).toBe(newCallback)
    })

    it('should update options with setOptions', () => {
      const h = handler('test', vi.fn(), { name: 'options-setter', priority: 100 })

      expect(h.priority).toBe(100)

      h.setOptions({ name: 'options-setter', priority: 200 })
      expect(h.priority).toBe(200)
    })

    it('should mark dirty when priority changes', () => {
      const h = handler('test', vi.fn(), { name: 'dirty', priority: 100 })

      const markDirtySpy = vi.spyOn(store, 'markDirty')
      h.setOptions({ name: 'dirty', priority: 200 })

      expect(markDirtySpy).toHaveBeenCalledWith('handler')
      markDirtySpy.mockRestore()
    })
  })

  describe('CreateHandler.options static', () => {
    it('should parse all options correctly', () => {
      const opts = CreateHandler.options({
        name: 'full-opts',
        priority: 500,
        log: false,
        adapter: ['icqq'],
        dsbAdapter: ['onebot'],
      })

      expect(opts.name).toBe('full-opts')
      expect(opts.priority).toBe(500)
      expect(opts.log).toBe(false)
      expect(opts.adapter).toEqual(['icqq'])
      expect(opts.dsbAdapter).toEqual(['onebot'])
    })

    it('should fallback rank to priority', () => {
      const opts = CreateHandler.options({ name: 'rank', rank: 300 } as any)
      expect(opts.priority).toBe(300)
    })

    it('should fallback notAdapter to dsbAdapter', () => {
      const opts = CreateHandler.options({ name: 'not', notAdapter: ['test'] } as any)
      expect(opts.dsbAdapter).toEqual(['test'])
    })
  })
})
