/**
 * button API 单元测试
 */
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { store } from '../src/store'
import { button, CreateButton } from '../src/create/button'

describe('create/button', () => {
  beforeEach(() => {
    store.clear()
  })

  describe('button()', () => {
    it('should create a button plugin with reg and callback', () => {
      const callback = vi.fn()
      const b = button(/^test$/, callback, { name: 'test-button' })

      expect(b).toBeInstanceOf(CreateButton)
      expect(b.name).toBe('test-button')
      expect(b.type).toBe('button')
    })

    it('should auto-register to store', () => {
      button(/^auto$/, vi.fn(), { name: 'auto-button' })

      const all = store.get('button')
      expect(all.length).toBe(1)
      expect(all[0].name).toBe('auto-button')
    })

    it('should support string regex', () => {
      const b = button('^string$', vi.fn(), { name: 'string-button' })

      expect(b.reg).toBeInstanceOf(RegExp)
      expect(b.reg.source).toBe('^string$')
    })
  })

  describe('CreateButton validation', () => {
    it('should throw if name is empty', () => {
      expect(() => button(/test/, vi.fn(), { name: '' })).toThrow()
    })

    it('should throw if name is missing', () => {
      expect(() => button(/test/, vi.fn(), {} as any)).toThrow()
    })
  })

  describe('CreateButton properties', () => {
    it('should have correct default options', () => {
      const b = button(/test/, vi.fn(), { name: 'default-button' })

      expect(b.priority).toBe(10000)
      expect(b.options.log).toBe(true)
    })

    it('should respect custom priority', () => {
      const b = button(/test/, vi.fn(), { name: 'priority-button', priority: 100 })

      expect(b.priority).toBe(100)
    })

    it('should generate unique id', () => {
      const b1 = button(/test1/, vi.fn(), { name: 'button1' })
      const b2 = button(/test2/, vi.fn(), { name: 'button2' })

      expect(b1.id).not.toBe(b2.id)
    })

    it('should return reg pattern', () => {
      const reg = /^pattern$/
      const b = button(reg, vi.fn(), { name: 'reg-button' })

      expect(b.reg).toBe(reg)
    })

    it('should return callback function', () => {
      const cb = vi.fn()
      const b = button(/test/, cb, { name: 'callback-button' })

      expect(b.callback).toBe(cb)
    })
  })

  describe('CreateButton.setters', () => {
    it('should update reg with setReg', () => {
      const b = button(/^old$/, vi.fn(), { name: 'reg-setter' })

      expect(b.reg.source).toBe('^old$')

      b.setReg(/^new$/)
      expect(b.reg.source).toBe('^new$')
    })

    it('should update reg with string', () => {
      const b = button(/^old$/, vi.fn(), { name: 'reg-string-setter' })

      b.setReg('^string$')
      expect(b.reg.source).toBe('^string$')
    })

    it('should update callback with setCallback', () => {
      const cb1 = vi.fn()
      const cb2 = vi.fn()
      const b = button(/test/, cb1, { name: 'callback-setter' })

      expect(b.callback).toBe(cb1)

      b.setCallback(cb2)
      expect(b.callback).toBe(cb2)
    })

    it('should update options with setOptions', () => {
      const b = button(/test/, vi.fn(), { name: 'options-setter', priority: 100 })

      expect(b.priority).toBe(100)

      b.setOptions({ name: 'options-setter', priority: 200 })
      expect(b.priority).toBe(200)
    })
  })

  describe('CreateButton.options parsing', () => {
    it('should parse all options correctly', () => {
      const b = button(/test/, vi.fn(), {
        name: 'full-options',
        priority: 50,
        log: false,
        adapter: [],
        dsbAdapter: [],
      })

      expect(b.name).toBe('full-options')
      expect(b.priority).toBe(50)
      expect(b.options.log).toBe(false)
    })

    it('should fallback rank to priority', () => {
      const b = button(/test/, vi.fn(), {
        name: 'rank-test',
        rank: 200,
      } as any)

      expect(b.priority).toBe(200)
    })
  })

  describe('CreateButton reg matching', () => {
    it('should match button id with reg', () => {
      const b = button(/^btn-\d+$/, vi.fn(), { name: 'reg-match' })

      expect(b.reg.test('btn-123')).toBe(true)
      expect(b.reg.test('btn-abc')).toBe(false)
    })

    it('should support case insensitive flag', () => {
      const b = button(/^TEST$/i, vi.fn(), { name: 'case-insensitive' })

      expect(b.reg.test('TEST')).toBe(true)
      expect(b.reg.test('test')).toBe(true)
    })
  })
})
