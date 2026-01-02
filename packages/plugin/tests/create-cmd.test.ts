/**
 * cmd 链式命令构建器单元测试
 */
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { store } from '../src/store'
import { cmd, CmdBuilder } from '../src/create/cmd'

describe('create/cmd', () => {
  beforeEach(() => {
    store.clear()
  })

  describe('CmdBuilder', () => {
    it('should create a CmdBuilder instance', () => {
      const builder = new CmdBuilder(/^test$/, vi.fn())

      expect(builder).toBeInstanceOf(CmdBuilder)
    })

    it('should have correct reg property', () => {
      const builder = new CmdBuilder(/^test$/, vi.fn())

      expect(builder.reg.source).toBe('^test$')
    })

    it('should convert string reg to RegExp', () => {
      const builder = new CmdBuilder('^test$', vi.fn())

      expect(builder.reg).toBeInstanceOf(RegExp)
      expect(builder.reg.source).toBe('^test$')
    })

    it('should have type=command', () => {
      const builder = new CmdBuilder(/test/, vi.fn())
      builder.name('test-cmd')

      expect(builder.type).toBe('command')
    })
  })

  describe('CmdBuilder.name()', () => {
    it('should set name and return this', () => {
      const builder = new CmdBuilder(/test/, vi.fn())
      const result = builder.name('cmd-name')

      expect(result).toBe(builder)
      expect(builder.options.name).toBe('cmd-name')
    })
  })

  describe('CmdBuilder.perm()', () => {
    it('should set permission all', () => {
      const builder = new CmdBuilder(/test/, vi.fn())
      builder.name('perm-all').perm('all')

      expect(builder.options.permission).toBe('all')
    })

    it('should set permission master', () => {
      const builder = new CmdBuilder(/test/, vi.fn())
      builder.name('perm-master').perm('master')

      expect(builder.options.permission).toBe('master')
    })

    it('should set permission admin', () => {
      const builder = new CmdBuilder(/test/, vi.fn())
      builder.name('perm-admin').perm('admin')

      expect(builder.options.permission).toBe('admin')
    })

    it('should set permission group.owner', () => {
      const builder = new CmdBuilder(/test/, vi.fn())
      builder.name('perm-owner').perm('group.owner')

      expect(builder.options.permission).toBe('group.owner')
    })

    it('should set permission group.admin', () => {
      const builder = new CmdBuilder(/test/, vi.fn())
      builder.name('perm-group-admin').perm('group.admin')

      expect(builder.options.permission).toBe('group.admin')
    })
  })

  describe('CmdBuilder.priority()', () => {
    it('should set priority', () => {
      const builder = new CmdBuilder(/test/, vi.fn())
      builder.name('priority-test').priority(100)

      expect(builder.options.priority).toBe(100)
    })

    it('should support high priority', () => {
      const builder = new CmdBuilder(/test/, vi.fn())
      builder.name('high-priority').priority(1)

      expect(builder.options.priority).toBe(1)
    })

    it('should support low priority', () => {
      const builder = new CmdBuilder(/test/, vi.fn())
      builder.name('low-priority').priority(99999)

      expect(builder.options.priority).toBe(99999)
    })
  })

  describe('CmdBuilder.on()', () => {
    it('should set event type', () => {
      const builder = new CmdBuilder(/test/, vi.fn())
      builder.name('event-test').on('message.group')

      expect(builder.options.event).toBe('message.group')
    })

    it('should set event message.private', () => {
      const builder = new CmdBuilder(/test/, vi.fn())
      builder.name('event-private').on('message.private')

      expect(builder.options.event).toBe('message.private')
    })
  })

  describe('CmdBuilder.adapter()', () => {
    it('should set adapter whitelist', () => {
      const builder = new CmdBuilder(/test/, vi.fn())
      builder.name('adapter-test').adapter('onebot.11')

      expect(builder.options.adapter).toEqual(['onebot.11'])
    })

    it('should support multiple adapters', () => {
      const builder = new CmdBuilder(/test/, vi.fn())
      builder.name('multi-adapter').adapter('onebot.11', 'onebot.12')

      expect(builder.options.adapter).toEqual(['onebot.11', 'onebot.12'])
    })
  })

  describe('CmdBuilder.dsbAdapter()', () => {
    it('should set adapter blacklist', () => {
      const builder = new CmdBuilder(/test/, vi.fn())
      builder.name('dsb-test').dsbAdapter('onebot.11')

      expect(builder.options.dsbAdapter).toEqual(['onebot.11'])
    })

    it('should support multiple disabled adapters', () => {
      const builder = new CmdBuilder(/test/, vi.fn())
      builder.name('multi-dsb').dsbAdapter('onebot.11', 'onebot.12')

      expect(builder.options.dsbAdapter).toEqual(['onebot.11', 'onebot.12'])
    })
  })

  describe('CmdBuilder.log()', () => {
    it('should enable log', () => {
      const builder = new CmdBuilder(/test/, vi.fn())
      builder.name('log-true').log(true)

      expect(builder.options.log).toBe(true)
    })

    it('should disable log', () => {
      const builder = new CmdBuilder(/test/, vi.fn())
      builder.name('log-false').log(false)

      expect(builder.options.log).toBe(false)
    })
  })

  describe('CmdBuilder.authFailMsg()', () => {
    it('should set authFailMsg to string', () => {
      const builder = new CmdBuilder(/test/, vi.fn())
      builder.name('auth-msg').authFailMsg('权限不足')

      expect(builder.options.authFailMsg).toBe('权限不足')
    })

    it('should set authFailMsg to boolean', () => {
      const builder = new CmdBuilder(/test/, vi.fn())
      builder.name('auth-bool').authFailMsg(false)

      expect(builder.options.authFailMsg).toBe(false)
    })
  })

  describe('CmdBuilder.register()', () => {
    it('should throw if name is not set', () => {
      const builder = new CmdBuilder(/test/, vi.fn())

      expect(() => builder.register()).toThrow('[cmd] name 是必填项')
    })

    it('should throw if name is empty', () => {
      const builder = new CmdBuilder(/test/, vi.fn())
      builder.name('')

      expect(() => builder.register()).toThrow('[cmd] name 是必填项')
    })

    it('should throw if name is whitespace only', () => {
      const builder = new CmdBuilder(/test/, vi.fn())
      builder.name('   ')

      expect(() => builder.register()).toThrow('[cmd] name 是必填项')
    })

    it('should register to store', () => {
      const builder = new CmdBuilder(/test/, vi.fn())
      builder.name('register-test').register()

      const all = store.get('command')
      expect(all.length).toBe(1)
      expect(all[0].name).toBe('register-test')
    })

    it('should return same plugin on multiple calls', () => {
      const builder = new CmdBuilder(/test/, vi.fn())
      builder.name('multi-register')

      const plugin1 = builder.register()
      const plugin2 = builder.register()

      expect(plugin1).toBe(plugin2)
    })
  })

  describe('CmdBuilder.plugin', () => {
    it('should auto-register when accessing plugin', () => {
      const builder = new CmdBuilder(/test/, vi.fn())
      builder.name('auto-register')

      const plugin = builder.plugin

      expect(plugin).toBeDefined()
      expect(store.get('command').length).toBe(1)
    })

    it('should return same plugin on multiple accesses', () => {
      const builder = new CmdBuilder(/test/, vi.fn())
      builder.name('same-plugin')

      const plugin1 = builder.plugin
      const plugin2 = builder.plugin

      expect(plugin1).toBe(plugin2)
    })
  })

  describe('CmdBuilder chain API', () => {
    it('should support full chain', () => {
      const callback = vi.fn()
      const builder = new CmdBuilder(/^admin$/, callback)
        .name('管理命令')
        .perm('master')
        .priority(1)
        .on('message.group')
        .adapter('onebot.11')
        .log(false)

      expect(builder.options.name).toBe('管理命令')
      expect(builder.options.permission).toBe('master')
      expect(builder.options.priority).toBe(1)
      expect(builder.options.event).toBe('message.group')
      expect(builder.options.adapter).toEqual(['onebot.11'])
      expect(builder.options.log).toBe(false)
    })

    it('should allow any order of chain methods', () => {
      const builder = new CmdBuilder(/test/, vi.fn())
        .priority(100)
        .perm('admin')
        .name('any-order')
        .log(true)

      expect(builder.options.priority).toBe(100)
      expect(builder.options.permission).toBe('admin')
      expect(builder.options.name).toBe('any-order')
    })
  })

  describe('CmdBuilder with message segment', () => {
    it('should accept string as callback', () => {
      const builder = new CmdBuilder(/^ping$/, 'pong')
      builder.name('ping-pong')

      expect(builder.options.name).toBe('ping-pong')
    })
  })

  describe('cmd() function', () => {
    it('should return CmdBuilder', () => {
      const builder = cmd(/test/, vi.fn())
      builder.name('cmd-func')

      expect(builder).toBeInstanceOf(CmdBuilder)
    })

    it('should auto-register via queueMicrotask', async () => {
      cmd(/^auto$/, vi.fn()).name('auto-cmd')

      // 等待 microtask 完成
      await new Promise(resolve => queueMicrotask(resolve))

      const all = store.get('command')
      expect(all.length).toBe(1)
      expect(all[0].name).toBe('auto-cmd')
    })

    it('should support chain with cmd()', async () => {
      cmd(/^test$/, 'response')
        .name('cmd-chain')
        .perm('all')
        .priority(10)

      await new Promise(resolve => queueMicrotask(resolve))

      const all = store.get('command')
      expect(all.length).toBe(1)
      expect(all[0].name).toBe('cmd-chain')
    })
  })

  describe('CmdBuilder id property', () => {
    it('should generate unique id', () => {
      const b1 = new CmdBuilder(/test1/, vi.fn())
      b1.name('id-test-1')
      const b2 = new CmdBuilder(/test2/, vi.fn())
      b2.name('id-test-2')

      expect(b1.id).not.toBe(b2.id)
    })
  })

  describe('CmdBuilder callback property', () => {
    it('should return callback from plugin', () => {
      const cb = vi.fn()
      const builder = new CmdBuilder(/test/, cb)
      builder.name('callback-prop')

      // callback 通过 plugin 访问，可能被包装
      expect(typeof builder.callback).toBe('function')
    })
  })
})
