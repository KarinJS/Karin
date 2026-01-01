/**
 * Store 单元测试
 */
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { store } from '../src/store'
import type { PluginType } from '../src/store'

// Mock 一个简单的 plugin 对象
function createMockPlugin (
  type: PluginType,
  id: string,
  opts: { file?: string; pkg?: string; priority?: number; key?: string } = {}
) {
  const plugin = {
    id,
    type,
    packageName: opts.pkg ?? 'test-package',
    priority: opts.priority ?? 10000,
    file: {
      absPath: opts.file ?? '/test/plugin.ts',
    },
    callerPath: opts.file ?? '/test/plugin.ts',
    key: opts.key, // for handler
    options: {
      priority: opts.priority ?? 10000,
    },
  }
  return plugin as any
}

describe('Store', () => {
  beforeEach(() => {
    // 清空 store
    store.clear()
  })

  describe('add / del / get', () => {
    it('should add a plugin', () => {
      const plugin = createMockPlugin('command', 'test:command:1')
      store.add('command', plugin)

      expect(store.has('test:command:1')).toBe(true)
      expect(store.getById('test:command:1')).toBe(plugin)
    })

    it('should delete a plugin', () => {
      const plugin = createMockPlugin('command', 'test:command:2')
      store.add('command', plugin)

      const deleted = store.del('test:command:2')
      expect(deleted).toBe(true)
      expect(store.has('test:command:2')).toBe(false)
    })

    it('should return false when deleting non-existent plugin', () => {
      const deleted = store.del('non-existent')
      expect(deleted).toBe(false)
    })

    it('should get plugins by type', () => {
      const p1 = createMockPlugin('command', 'test:command:3', { priority: 100 })
      const p2 = createMockPlugin('command', 'test:command:4', { priority: 200 })
      store.add('command', p1)
      store.add('command', p2)

      const commands = store.get('command')
      expect(commands).toHaveLength(2)
      // 高优先级在前
      expect(commands[0].id).toBe('test:command:4')
      expect(commands[1].id).toBe('test:command:3')
    })
  })

  describe('file index', () => {
    it('should index plugins by file', () => {
      const file = '/path/to/plugin.ts'
      const p1 = createMockPlugin('command', 'test:1', { file })
      const p2 = createMockPlugin('accept', 'test:2', { file })
      store.add('command', p1)
      store.add('accept', p2)

      const pluginsInFile = store.getByFile(file)
      expect(pluginsInFile).toHaveLength(2)
    })

    it('should delete all plugins by file', () => {
      const file = '/path/to/plugin.ts'
      const p1 = createMockPlugin('command', 'test:1', { file })
      const p2 = createMockPlugin('accept', 'test:2', { file })
      store.add('command', p1)
      store.add('accept', p2)

      const count = store.delByFile(file)
      expect(count).toBe(2)
      expect(store.has('test:1')).toBe(false)
      expect(store.has('test:2')).toBe(false)
    })
  })

  describe('package index', () => {
    it('should index plugins by package', () => {
      const pkg = 'my-plugin-package'
      store.registerPackage({ name: pkg, abs: '/path/to/pkg', pkgPath: '/path/to/pkg/package.json', type: 'npm' })

      const p1 = createMockPlugin('command', 'test:1', { pkg })
      const p2 = createMockPlugin('task', 'test:2', { pkg })
      store.add('command', p1)
      store.add('task', p2)

      const pluginsInPkg = store.getByPkg(pkg)
      expect(pluginsInPkg).toHaveLength(2)
    })

    it('should delete all plugins by package', () => {
      const pkg = 'my-plugin-package'
      store.registerPackage({ name: pkg, abs: '/path/to/pkg', pkgPath: '/path/to/pkg/package.json', type: 'npm' })

      const p1 = createMockPlugin('command', 'test:1', { pkg })
      const p2 = createMockPlugin('task', 'test:2', { pkg })
      store.add('command', p1)
      store.add('task', p2)

      const count = store.delByPkg(pkg)
      expect(count).toBe(2)
      expect(store.has('test:1')).toBe(false)
      expect(store.has('test:2')).toBe(false)
    })
  })

  describe('handler key index', () => {
    it('should index handlers by key', () => {
      const h1 = createMockPlugin('handler', 'h:1', { key: 'render' })
      const h2 = createMockPlugin('handler', 'h:2', { key: 'render' })
      const h3 = createMockPlugin('handler', 'h:3', { key: 'puppeteer' })

      store.add('handler', h1)
      store.add('handler', h2)
      store.add('handler', h3)

      const renderHandlers = store.getHandler('render')
      expect(renderHandlers).toHaveLength(2)

      const puppeteerHandlers = store.getHandler('puppeteer')
      expect(puppeteerHandlers).toHaveLength(1)
    })
  })

  describe('events', () => {
    it('should emit add event', () => {
      const listener = vi.fn()
      store.on('add', listener)

      const plugin = createMockPlugin('command', 'test:1')
      store.add('command', plugin)

      expect(listener).toHaveBeenCalledWith('command', plugin)
    })

    it('should emit del event', () => {
      const listener = vi.fn()
      store.on('del', listener)

      const plugin = createMockPlugin('command', 'test:1')
      store.add('command', plugin)
      store.del('test:1')

      expect(listener).toHaveBeenCalledWith('command', 'test:1', plugin)
    })

    it('should emit sort event on first get', () => {
      const listener = vi.fn()
      store.on('sort', listener)

      const plugin = createMockPlugin('command', 'test:1')
      store.add('command', plugin)
      store.get('command')

      expect(listener).toHaveBeenCalledWith('command')
    })
  })

  describe('stats', () => {
    it('should return correct stats', () => {
      store.add('command', createMockPlugin('command', 'c:1'))
      store.add('command', createMockPlugin('command', 'c:2'))
      store.add('accept', createMockPlugin('accept', 'a:1'))

      const stats = store.stats()
      expect(stats.command.total).toBe(2)
      expect(stats.accept.total).toBe(1)
    })
  })
})
