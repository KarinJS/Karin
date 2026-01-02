/**
 * command API 单元测试
 */
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { store } from '../src/store'
import { command, CreateCommand } from '../src/create/command'

describe('create/command', () => {
  beforeEach(() => {
    store.clear()
  })

  describe('command()', () => {
    it('should create a command with regex and callback', () => {
      const callback = vi.fn()
      const cmd = command(/^test$/, callback, { name: 'test-cmd' })

      expect(cmd).toBeInstanceOf(CreateCommand)
      expect(cmd.name).toBe('test-cmd')
      expect(cmd.type).toBe('command')
      expect(cmd.reg).toEqual(/^test$/)
    })

    it('should create a command with string pattern', () => {
      const callback = vi.fn()
      const cmd = command('test', callback, { name: 'string-cmd' })

      expect(cmd.reg).toEqual(/test/)
    })

    it('should auto-register to store', () => {
      const callback = vi.fn()
      command(/^auto$/, callback, { name: 'auto-cmd' })

      const all = store.get('command')
      expect(all.length).toBe(1)
      expect(all[0].name).toBe('auto-cmd')
    })

    it('should create command with string reply', () => {
      const cmd = command(/^ping$/, 'pong', { name: 'ping-cmd' })

      expect(cmd.name).toBe('ping-cmd')
      expect(typeof cmd.callback).toBe('function')
    })

    it('should throw if name is empty', () => {
      expect(() => {
        command(/^test$/, vi.fn(), { name: '' })
      }).toThrow('name 是必填项')
    })

    it('should throw if name is missing', () => {
      expect(() => {
        command(/^test$/, vi.fn(), {} as any)
      }).toThrow('name 是必填项')
    })
  })

  describe('CreateCommand', () => {
    it('should have correct default options', () => {
      const cmd = command(/^test$/, vi.fn(), { name: 'defaults' })

      expect(cmd.options.priority).toBe(10000)
      expect(cmd.options.log).toBe(true)
      expect(cmd.options.adapter).toEqual([])
      expect(cmd.options.dsbAdapter).toEqual([])
      expect(cmd.options.authFailMsg).toBe(false)
    })

    it('should respect custom priority', () => {
      const cmd = command(/^test$/, vi.fn(), { name: 'priority', priority: 100 })

      expect(cmd.options.priority).toBe(100)
      expect(cmd.priority).toBe(100)
    })

    it('should support event option', () => {
      const cmd = command(/^test$/, vi.fn(), {
        name: 'event-test',
        event: 'message.group',
      })

      expect(cmd.options.event).toEqual(['message.group'])
      expect(cmd.options.isListenAll).toBe(false)
    })

    it('should support event array option', () => {
      const cmd = command(/^test$/, vi.fn(), {
        name: 'event-array',
        event: ['message.group', 'message.friend'] as const,
      })

      expect(cmd.options.event).toEqual(['message.group', 'message.friend'])
      expect(cmd.options.isListenAll).toBe(false)
    })

    it('should default to listen all messages', () => {
      const cmd = command(/^test$/, vi.fn(), { name: 'listen-all' })

      expect(cmd.options.event).toEqual(['message'])
      expect(cmd.options.isListenAll).toBe(true)
    })

    it('should generate unique id', () => {
      const cmd1 = command(/^a$/, vi.fn(), { name: 'cmd1' })
      const cmd2 = command(/^b$/, vi.fn(), { name: 'cmd2' })

      expect(cmd1.id).toBeTruthy()
      expect(cmd2.id).toBeTruthy()
      expect(cmd1.id).not.toBe(cmd2.id)
    })
  })

  describe('CreateCommand.setters', () => {
    it('should update reg with setReg', () => {
      const cmd = command(/^old$/, vi.fn(), { name: 'setter' })

      cmd.setReg(/^new$/)
      expect(cmd.reg).toEqual(/^new$/)
    })

    it('should update callback with setCallback', () => {
      const original = vi.fn()
      const newCallback = vi.fn()
      const cmd = command(/^test$/, original, { name: 'callback-setter' })

      cmd.setCallback(newCallback)
      expect(typeof cmd.callback).toBe('function')
    })

    it('should update options with setOptions', () => {
      const cmd = command(/^test$/, vi.fn(), { name: 'options-setter', priority: 100 })

      expect(cmd.priority).toBe(100)

      cmd.setOptions({ name: 'options-setter', priority: 200 })
      expect(cmd.priority).toBe(200)
    })

    it('should mark dirty when priority changes', () => {
      const cmd = command(/^test$/, vi.fn(), { name: 'dirty', priority: 100 })

      const markDirtySpy = vi.spyOn(store, 'markDirty')
      cmd.setOptions({ name: 'dirty', priority: 200 })

      expect(markDirtySpy).toHaveBeenCalledWith('command')
      markDirtySpy.mockRestore()
    })
  })

  describe('CreateCommand.options static', () => {
    it('should parse permission option', () => {
      const opts = CreateCommand.options({ name: 'perm', permission: 'master' })
      expect(opts.permission).toBe('master')
    })

    it('should fallback to perm option', () => {
      const opts = CreateCommand.options({ name: 'perm', perm: 'admin' } as any)
      expect(opts.permission).toBe('admin')
    })

    it('should default permission to all', () => {
      const opts = CreateCommand.options({ name: 'perm' })
      expect(opts.permission).toBe('all')
    })

    it('should parse adapter options', () => {
      const opts = CreateCommand.options({
        name: 'adapter',
        adapter: ['icqq'],
        dsbAdapter: ['onebot'],
      })

      expect(opts.adapter).toEqual(['icqq'])
      expect(opts.dsbAdapter).toEqual(['onebot'])
    })
  })
})
