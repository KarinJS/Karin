/**
 * base.ts 和 class.ts 插件基类测试
 */

import { describe, it, expect, vi } from 'vitest'
import { BuilderBase, createPluginId } from '../src/create/base'
import {
  Plugin,
  CreateClassPlugin,
  registerClassPlugin,
  registerModuleClassPlugins,
} from '../src/create/class'
import type { PluginType } from '../src/types'

// 创建 BuilderBase 的具体实现用于测试
class TestBuilder extends BuilderBase {
  get type (): PluginType {
    return 'command'
  }
}

describe('create/base', () => {
  describe('createPluginId', () => {
    it('should create unique plugin id', () => {
      const id1 = createPluginId('pkg', 'command', 'file.ts')
      const id2 = createPluginId('pkg', 'command', 'file.ts')
      expect(id1).not.toBe(id2)
      expect(id1).toContain('pkg:command:file.ts')
    })

    it('should include timestamp', () => {
      const id = createPluginId('pkg', 'accept', 'app.ts')
      const parts = id.split(':')
      expect(parts.length).toBe(5)
    })
  })

  describe('BuilderBase', () => {
    it('should set and get callerPath', () => {
      const builder = new TestBuilder()
      builder.setCallerPath('D:\\project\\src\\plugin.ts')
      expect(builder.callerPath).toBe('D:/project/src/plugin.ts')
    })

    it('should return file info', () => {
      const builder = new TestBuilder()
      builder.setCallerPath('/project/src/plugin.ts')
      const file = builder.file
      expect(file.absPath).toBe('/project/src/plugin.ts')
      expect(file.dirname).toBe('/project/src')
      expect(file.basename).toBe('plugin.ts')
    })

    it('should set and get packageName', () => {
      const builder = new TestBuilder()
      expect(builder.packageName).toBe('unknown')
      builder.setPackageName('my-plugin')
      expect(builder.packageName).toBe('my-plugin')
    })

    it('should generate unique id', () => {
      const builder = new TestBuilder()
      builder.setPackageName('pkg')
      builder.setCallerPath('/src/app.ts')
      const id1 = builder.id
      const id2 = builder.id // 同一实例返回相同 id
      expect(id1).toBe(id2)
    })

    it('should log with default logger', () => {
      const logSpy = vi.spyOn(console, 'log').mockImplementation(() => { })
      const builder = new TestBuilder()
      builder.log('test message')
      expect(logSpy).toHaveBeenCalledWith('test message')
      logSpy.mockRestore()
    })

    it('should enable/disable logging', () => {
      const builder = new TestBuilder()
      builder.setPackageName('pkg')
      builder.setCallerPath('/src/app.ts')

      const logSpy = vi.spyOn(console, 'log').mockImplementation(() => { })

      builder.setLog(true)
      builder.log('enabled')
      expect(logSpy).toHaveBeenCalled()

      logSpy.mockClear()
      builder.setLog(false)
      builder.log('disabled')
      expect(logSpy).not.toHaveBeenCalled()

      logSpy.mockRestore()
    })

    it('should generate defaultAppName from callerPath', () => {
      const builder = new TestBuilder()
      builder.setCallerPath('/src/app.ts')
      const name = builder.defaultAppName
      expect(name).toHaveLength(7)
    })
  })
})

describe('create/class', () => {
  describe('Plugin', () => {
    it('should initialize with options', () => {
      class TestPlugin extends Plugin {
        constructor () {
          super({
            name: 'test',
            rule: [{ name: 'rule1', reg: /test/, fnc: 'handler' }],
          })
        }

        handler () {
          return 'handled'
        }
      }

      const plugin = new TestPlugin()
      expect(plugin.options.name).toBe('test')
      expect(plugin.options.rule.length).toBe(1)
    })

    it('should have optional init method', async () => {
      class TestPlugin extends Plugin {
        initialized = false

        constructor () {
          super({ name: 'test', rule: [] })
        }

        async init () {
          this.initialized = true
        }
      }

      const plugin = new TestPlugin()
      await plugin.init?.()
      expect(plugin.initialized).toBe(true)
    })

    it('should throw when replyForward is not supported', async () => {
      class TestPlugin extends Plugin {
        constructor () {
          super({ name: 'test', rule: [] })
        }
      }

      const plugin = new TestPlugin()
      plugin.e = {}
      await expect(plugin.replyForward({})).rejects.toThrow('replyForward not supported')
    })

    it('should call bot.sendForwardMsg when available', async () => {
      class TestPlugin extends Plugin {
        constructor () {
          super({ name: 'test', rule: [] })
        }
      }

      const plugin = new TestPlugin()
      const mockSendForward = vi.fn().mockResolvedValue({ messageId: '123' })
      plugin.e = {
        bot: { sendForwardMsg: mockSendForward },
        contact: { id: 'contact1' },
      }

      const result = await plugin.replyForward({ content: 'test' })
      expect(mockSendForward).toHaveBeenCalled()
      expect(result.message_id).toBe('123')
    })
  })

  describe('CreateClassPlugin', () => {
    it('should create class plugin from Plugin class', () => {
      class TestPlugin extends Plugin {
        constructor () {
          super({
            name: 'test',
            rule: [{ name: 'cmd', reg: /^cmd$/, fnc: 'exec' }],
          })
        }

        exec () {
          return 'executed'
        }
      }

      const rule = {
        name: 'cmd',
        event: 'message',
        reg: /^cmd$/,
        fnc: 'exec',
        priority: 100,
        permission: 'all',
        log: true,
      }

      const plugin = new CreateClassPlugin(TestPlugin, rule, 'pkg', '/src/app.ts')

      expect(plugin.type).toBe('command')
      expect(plugin.name).toBe('cmd')
      expect(plugin.priority).toBe(100)
      expect(plugin.reg).toBeInstanceOf(RegExp)
      expect(plugin.callback).toBeInstanceOf(Function)
    })

    it('should set reg and priority', () => {
      class TestPlugin extends Plugin {
        constructor () {
          super({ name: 'test', rule: [{ name: 'r', reg: /a/, fnc: 'f' }] })
        }

        f () { }
      }

      const rule = {
        name: 'r',
        event: 'message',
        reg: /a/,
        fnc: 'f',
        priority: 50,
        permission: 'all',
        log: true,
      }

      const plugin = new CreateClassPlugin(TestPlugin, rule, 'pkg', '/app.ts')
      plugin.setReg(/new/)
      plugin.setPriority(200)

      expect(plugin.reg.source).toBe('new')
      expect(plugin.priority).toBe(200)
    })

    it('should execute callback with context', async () => {
      let received: unknown = null

      class TestPlugin extends Plugin {
        constructor () {
          super({ name: 'test', rule: [{ name: 'r', reg: /t/, fnc: 'handle' }] })
        }

        handle (ctx: unknown) {
          received = ctx
          return 'ok'
        }
      }

      const rule = {
        name: 'r',
        event: 'message',
        reg: /t/,
        fnc: 'handle',
        priority: 100,
        permission: 'all',
        log: true,
      }

      const plugin = new CreateClassPlugin(TestPlugin, rule, 'pkg', '/app.ts')
      const ctx = { msg: 'test', reply: vi.fn() }
      const next = vi.fn()

      const result = await plugin.callback(ctx, next)
      expect(received).toBe(ctx)
      expect(result).toBe('ok')
    })

    it('should handle function fnc', async () => {
      class TestPlugin extends Plugin {
        constructor () {
          super({ name: 'test', rule: [] })
        }
      }

      const fnc = vi.fn().mockReturnValue('direct')
      const rule = {
        name: 'r',
        event: 'message',
        reg: /t/,
        fnc,
        priority: 100,
        permission: 'all',
        log: true,
      }

      const plugin = new CreateClassPlugin(TestPlugin, rule, 'pkg', '/app.ts')
      const result = await plugin.callback({}, () => { })
      expect(fnc).toHaveBeenCalled()
      expect(result).toBe('direct')
    })

    it('should call next when method not found', async () => {
      class TestPlugin extends Plugin {
        constructor () {
          super({ name: 'test', rule: [] })
        }
      }

      const rule = {
        name: 'r',
        event: 'message',
        reg: /t/,
        fnc: 'nonExistent',
        priority: 100,
        permission: 'all',
        log: true,
      }

      const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => { })
      const plugin = new CreateClassPlugin(TestPlugin, rule, 'pkg', '/app.ts')
      const next = vi.fn()

      await plugin.callback({}, next)
      expect(next).toHaveBeenCalled()
      expect(errorSpy).toHaveBeenCalled()
      errorSpy.mockRestore()
    })
  })

  describe('registerClassPlugin', () => {
    it('should register plugin with rules', async () => {
      class TestPlugin extends Plugin {
        constructor () {
          super({
            name: 'test',
            event: 'message',
            priority: 50,
            rule: [
              { name: 'r1', reg: /a/, fnc: 'h1' },
              { name: 'r2', reg: /b/, fnc: 'h2', priority: 100 },
            ],
          })
        }

        h1 () { }
        h2 () { }
      }

      const plugins = await registerClassPlugin(TestPlugin, 'pkg', '/app.ts')
      expect(plugins.length).toBe(2)
      expect(plugins[0].name).toBe('r1')
      expect(plugins[0].priority).toBe(50)
      expect(plugins[1].name).toBe('r2')
      expect(plugins[1].priority).toBe(100)
    })

    it('should return empty array for invalid plugin', async () => {
      class InvalidPlugin extends Plugin {
        constructor () {
          super({ name: '', rule: [] })
        }
      }

      const plugins = await registerClassPlugin(InvalidPlugin, 'pkg', '/app.ts')
      expect(plugins.length).toBe(0)
    })

    it('should call init if defined', async () => {
      let initCalled = false

      class InitPlugin extends Plugin {
        constructor () {
          super({
            name: 'init-plugin',
            rule: [{ name: 'r', reg: /x/, fnc: 'h' }],
          })
        }

        async init () {
          initCalled = true
        }

        h () { }
      }

      await registerClassPlugin(InitPlugin, 'pkg', '/app.ts')
      expect(initCalled).toBe(true)
    })
  })

  describe('registerModuleClassPlugins', () => {
    it('should register all plugin classes from module', async () => {
      class Plugin1 extends Plugin {
        constructor () {
          super({ name: 'p1', rule: [{ name: 'r', reg: /a/, fnc: 'h' }] })
        }

        h () { }
      }

      class Plugin2 extends Plugin {
        constructor () {
          super({ name: 'p2', rule: [{ name: 'r', reg: /b/, fnc: 'h' }] })
        }

        h () { }
      }

      const mod = { Plugin1, Plugin2, default: {} }
      const plugins = await registerModuleClassPlugins(mod, 'pkg', '/app.ts')
      expect(plugins.length).toBe(2)
    })

    it('should skip non-class exports', async () => {
      const mod = {
        config: { key: 'value' },
        helper: () => { },
        default: {},
      }
      const plugins = await registerModuleClassPlugins(mod as any, 'pkg', '/app.ts')
      expect(plugins.length).toBe(0)
    })

    it('should handle registration errors gracefully', async () => {
      class BadPlugin {
        constructor () {
          throw new Error('Constructor error')
        }
      }

      const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => { })
      const mod = { BadPlugin }
      const plugins = await registerModuleClassPlugins(mod as any, 'pkg', '/app.ts')
      expect(plugins.length).toBe(0)
      expect(errorSpy).toHaveBeenCalled()
      errorSpy.mockRestore()
    })
  })
})
