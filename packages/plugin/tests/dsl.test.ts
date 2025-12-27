/**
 * DSL 单元测试（command, accept, handler, button, task）
 * @module tests/dsl.test
 */
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { command } from '../src/create/command'
import { accept } from '../src/create/accept'
import { handler } from '../src/create/handler'
import { button } from '../src/create/button'
import { task } from '../src/create/task'
import { setContext, clearContext } from '../src/create/context'
import { cache } from '../src/api/cache'

describe('DSL', () => {
  beforeEach(() => {
    cache.clearAll()
    clearContext()
    setContext('test-pkg', '/test/file.ts')
  })

  describe('command', () => {
    it('should create a command and return id', () => {
      const callback = vi.fn()
      const id = command('^test$', callback)

      expect(id).toBeDefined()
      expect(typeof id).toBe('string')
      expect(id).toContain('command')
    })

    it('should accept string rule', () => {
      const id = command('test', vi.fn())
      const item = cache.instance.get('command', id)

      expect(item).toBeDefined()
    })

    it('should accept RegExp rule', () => {
      const id = command(/^test$/i, vi.fn())
      const item = cache.instance.get('command', id)

      expect(item).toBeDefined()
    })

    it('should store callback in instance', () => {
      const callback = vi.fn()
      const id = command('test', callback)
      const item = cache.instance.get('command', id)

      expect((item?.instance as any).callback).toBe(callback)
    })

    it('should set priority', () => {
      const id = command('test', vi.fn(), { priority: 100 })
      const item = cache.instance.get('command', id)

      expect(item?.priority).toBe(100)
    })

    it('should set description', () => {
      const id = command('test', vi.fn(), { desc: 'Test command' })
      const item = cache.instance.get('command', id)

      expect(item?.metadata?.desc).toBe('Test command')
    })

    it('should use context pkg and file', () => {
      const id = command('test', vi.fn())
      const item = cache.instance.get('command', id)

      expect(item?.pkg).toBe('test-pkg')
      expect(item?.file).toBe('/test/file.ts')
    })

    describe('command.create', () => {
      it('should create command with options', () => {
        const createCmd = command.create({ rule: '^test$', priority: 50 })
        const callback = vi.fn()
        const id = createCmd(callback)

        const item = cache.instance.get('command', id)
        expect(item).toBeDefined()
        expect(item?.priority).toBe(50)
      })
    })
  })

  describe('accept', () => {
    it('should create an accept and return id', () => {
      const callback = vi.fn()
      const id = accept('message', callback)

      expect(id).toBeDefined()
      expect(typeof id).toBe('string')
      expect(id).toContain('accept')
    })

    it('should store event type', () => {
      const id = accept('notice', vi.fn())
      const item = cache.instance.get('accept', id)

      expect((item?.instance as any).event).toBe('notice')
    })

    it('should set priority', () => {
      const id = accept('message', vi.fn(), { priority: 100 })
      const item = cache.instance.get('accept', id)

      expect(item?.priority).toBe(100)
    })

    describe('accept.create', () => {
      it('should create accept with options', () => {
        const createAcc = accept.create({ event: 'request', priority: 50 })
        const callback = vi.fn()
        const id = createAcc(callback)

        const item = cache.instance.get('accept', id)
        expect(item).toBeDefined()
        expect((item?.instance as any).event).toBe('request')
      })
    })
  })

  describe('handler', () => {
    it('should create a handler and return id', () => {
      const callback = vi.fn()
      const id = handler('render', callback)

      expect(id).toBeDefined()
      expect(typeof id).toBe('string')
      expect(id).toContain('handler')
    })

    it('should store handler key', () => {
      const id = handler('custom-handler', vi.fn())
      const item = cache.instance.get('handler', id)

      expect((item?.instance as any).key).toBe('custom-handler')
    })

    it('should set priority', () => {
      const id = handler('render', vi.fn(), { priority: 100 })
      const item = cache.instance.get('handler', id)

      expect(item?.priority).toBe(100)
    })

    describe('handler.create', () => {
      it('should create handler with options', () => {
        const createHandler = handler.create({ key: 'my-handler', priority: 50 })
        const callback = vi.fn()
        const id = createHandler(callback)

        const item = cache.instance.get('handler', id)
        expect(item).toBeDefined()
        expect((item?.instance as any).key).toBe('my-handler')
      })
    })
  })

  describe('button', () => {
    it('should create a button and return id', () => {
      const callback = vi.fn()
      const id = button('btn-1', callback)

      expect(id).toBeDefined()
      expect(typeof id).toBe('string')
      expect(id).toContain('button')
    })

    it('should store button id', () => {
      const id = button('my-button', vi.fn())
      const item = cache.instance.get('button', id)

      expect((item?.instance as any).id).toBe('my-button')
    })

    it('should set priority', () => {
      const id = button('btn-1', vi.fn(), { priority: 100 })
      const item = cache.instance.get('button', id)

      expect(item?.priority).toBe(100)
    })

    describe('button.create', () => {
      it('should create button with options', () => {
        const createBtn = button.create({ id: 'created-btn', priority: 50 })
        const callback = vi.fn()
        const id = createBtn(callback)

        const item = cache.instance.get('button', id)
        expect(item).toBeDefined()
        expect((item?.instance as any).id).toBe('created-btn')
      })
    })
  })

  describe('task', () => {
    it('should create a task and return id', () => {
      const callback = vi.fn()
      const id = task('0 * * * *', callback)

      expect(id).toBeDefined()
      expect(typeof id).toBe('string')
      expect(id).toContain('task')
    })

    it('should store cron expression', () => {
      const id = task('*/5 * * * *', vi.fn())
      const item = cache.instance.get('task', id)

      expect((item?.instance as any).cron).toBe('*/5 * * * *')
    })

    it('should set task name', () => {
      const id = task('0 * * * *', vi.fn(), { name: 'My Task' })
      const item = cache.instance.get('task', id)

      expect(item?.metadata?.name).toBe('My Task')
    })

    it('should set immediate option', () => {
      const id = task('0 * * * *', vi.fn(), { immediate: true })
      const item = cache.instance.get('task', id)

      expect((item?.instance as any).options.immediate).toBe(true)
    })

    it('should default immediate to false', () => {
      const id = task('0 * * * *', vi.fn())
      const item = cache.instance.get('task', id)

      expect((item?.instance as any).options.immediate).toBe(false)
    })

    describe('task.create', () => {
      it('should create task with options', () => {
        const createTask = task.create({ cron: '0 0 * * *', name: 'Daily Task' })
        const callback = vi.fn()
        const id = createTask(callback)

        const item = cache.instance.get('task', id)
        expect(item).toBeDefined()
        expect((item?.instance as any).cron).toBe('0 0 * * *')
      })
    })
  })
})
