/**
 * dev 开发工具模块单元测试
 */
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { store } from '../src/store'
import { pkgRegistry } from '../src/pkg'
import {
  dev,
  snapshot,
  printReport,
  listPlugins,
  listByFile,
  listByPackage,
  findPlugin,
  monitorStore,
  createTimer,
} from '../src/dev'
import type { StoreSnapshot, PluginDiagnostic } from '../src/dev'

describe('dev tools', () => {
  beforeEach(() => {
    store.clear()
    pkgRegistry.clear()
    vi.restoreAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('snapshot()', () => {
    it('should return StoreSnapshot with timestamp', () => {
      const before = Date.now()
      const snap = snapshot()
      const after = Date.now()

      expect(snap.timestamp).toBeGreaterThanOrEqual(before)
      expect(snap.timestamp).toBeLessThanOrEqual(after)
    })

    it('should include stats', () => {
      const snap = snapshot()

      expect(snap.stats).toBeDefined()
      expect(snap.stats.command).toBeDefined()
      expect(snap.stats.accept).toBeDefined()
      expect(snap.stats.handler).toBeDefined()
      expect(snap.stats.button).toBeDefined()
      expect(snap.stats.task).toBeDefined()
    })

    it('should include empty plugins initially', () => {
      const snap = snapshot()

      expect(snap.plugins.command).toEqual([])
      expect(snap.plugins.accept).toEqual([])
      expect(snap.plugins.handler).toEqual([])
      expect(snap.plugins.button).toEqual([])
      expect(snap.plugins.task).toEqual([])
    })

    it('should include registered packages', () => {
      pkgRegistry.register({
        name: 'test-pkg',
        abs: '/test',
        pkgPath: '/test/package.json',
        type: 'apps',
      })

      const snap = snapshot()

      expect(snap.packages).toContain('test-pkg')
    })

    it('should include lifecycle stats', () => {
      const snap = snapshot()

      expect(snap.lifecycle).toBeDefined()
      expect(typeof snap.lifecycle.load).toBe('number')
      expect(typeof snap.lifecycle.unload).toBe('number')
      expect(typeof snap.lifecycle.reload).toBe('number')
    })
  })

  describe('printReport()', () => {
    it('should print report without errors', () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

      expect(() => printReport()).not.toThrow()

      expect(consoleSpy).toHaveBeenCalled()
      expect(consoleSpy.mock.calls.some(call =>
        typeof call[0] === 'string' && call[0].includes('Plugin Status Report')
      )).toBe(true)

      consoleSpy.mockRestore()
    })

    it('should print plugin counts', () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

      printReport()

      const output = consoleSpy.mock.calls.map(c => c[0]).join('\n')
      expect(output).toContain('Command:')
      expect(output).toContain('Accept:')
      expect(output).toContain('Handler:')
      expect(output).toContain('Button:')
      expect(output).toContain('Task:')

      consoleSpy.mockRestore()
    })

    it('should print registry stats', () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

      printReport()

      const output = consoleSpy.mock.calls.map(c => c[0]).join('\n')
      expect(output).toContain('Packages:')
      expect(output).toContain('Files:')

      consoleSpy.mockRestore()
    })

    it('should print lifecycle hook stats', () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

      printReport()

      const output = consoleSpy.mock.calls.map(c => c[0]).join('\n')
      expect(output).toContain('onLoad:')
      expect(output).toContain('onUnload:')
      expect(output).toContain('onReload:')

      consoleSpy.mockRestore()
    })
  })

  describe('listPlugins()', () => {
    it('should return empty array when no plugins', () => {
      const result = listPlugins()

      expect(result).toEqual([])
    })

    it('should list all plugins without type filter', () => {
      // 添加一些测试插件
      store.add('command', {
        id: 'cmd-1',
        type: 'command',
        name: 'test-cmd',
        priority: 100,
      } as any)

      const result = listPlugins()

      expect(result.length).toBe(1)
      expect(result[0].id).toBe('cmd-1')
    })

    it('should filter by type', () => {
      store.add('command', {
        id: 'cmd-1',
        type: 'command',
        name: 'cmd',
        priority: 100,
      } as any)
      store.add('accept', {
        id: 'accept-1',
        type: 'accept',
        name: 'accept',
        priority: 100,
      } as any)

      const cmdResult = listPlugins('command')
      const acceptResult = listPlugins('accept')

      expect(cmdResult.length).toBe(1)
      expect(cmdResult[0].id).toBe('cmd-1')
      expect(acceptResult.length).toBe(1)
      expect(acceptResult[0].id).toBe('accept-1')
    })

    it('should return PluginDiagnostic format', () => {
      store.add('command', {
        id: 'diag-test',
        type: 'command',
        name: 'diagnostic',
        priority: 50,
        file: { absPath: '/test/file.ts' },
        packageName: 'test-pkg',
      } as any)

      const result = listPlugins()

      expect(result[0]).toMatchObject({
        id: 'diag-test',
        type: 'command',
        name: 'diagnostic',
        priority: 50,
        file: '/test/file.ts',
        pkg: 'test-pkg',
      })
    })
  })

  describe('listByFile()', () => {
    it('should return empty array when no plugins match', () => {
      const result = listByFile('/nonexistent/file.ts')

      expect(result).toEqual([])
    })

    it('should list plugins by file', () => {
      store.add('command', {
        id: 'file-cmd',
        type: 'command',
        name: 'file-test',
        priority: 100,
        file: { absPath: '/test/specific.ts' },
      } as any)

      const result = listByFile('/test/specific.ts')

      expect(result.length).toBe(1)
      expect(result[0].id).toBe('file-cmd')
    })
  })

  describe('listByPackage()', () => {
    it('should return empty array when no plugins match', () => {
      const result = listByPackage('nonexistent-pkg')

      expect(result).toEqual([])
    })

    it('should list plugins by package', () => {
      // 先注册包
      store.registerPackage({
        name: 'my-package',
        type: 'apps',
        abs: '/test',
        pkgPath: '/test/package.json',
      })

      store.add('command', {
        id: 'pkg-cmd',
        type: 'command',
        name: 'pkg-test',
        priority: 100,
        packageName: 'my-package',
      } as any)

      const result = listByPackage('my-package')

      expect(result.length).toBe(1)
      expect(result[0].id).toBe('pkg-cmd')
    })
  })

  describe('findPlugin()', () => {
    beforeEach(() => {
      store.add('command', {
        id: 'find-1',
        type: 'command',
        name: 'find-test',
        priority: 100,
        file: { absPath: '/test/find.ts' },
        packageName: 'find-pkg',
      } as any)
      store.add('accept', {
        id: 'find-2',
        type: 'accept',
        name: 'other',
        priority: 200,
        file: { absPath: '/test/other.ts' },
        packageName: 'other-pkg',
      } as any)
    })

    it('should find by id', () => {
      const result = findPlugin({ id: 'find-1' })

      expect(result.length).toBe(1)
      expect(result[0].id).toBe('find-1')
    })

    it('should find by partial id', () => {
      const result = findPlugin({ id: 'find' })

      expect(result.length).toBe(2)
    })

    it('should find by name', () => {
      const result = findPlugin({ name: 'find-test' })

      expect(result.length).toBe(1)
      expect(result[0].name).toBe('find-test')
    })

    it('should find by file', () => {
      const result = findPlugin({ file: '/test/find.ts' })

      expect(result.length).toBe(1)
      expect(result[0].file).toBe('/test/find.ts')
    })

    it('should find by package', () => {
      const result = findPlugin({ pkg: 'find-pkg' })

      expect(result.length).toBe(1)
      expect(result[0].pkg).toBe('find-pkg')
    })

    it('should combine query conditions', () => {
      const result = findPlugin({ id: 'find', name: 'test' })

      expect(result.length).toBe(1)
      expect(result[0].id).toBe('find-1')
    })

    it('should return empty when no match', () => {
      const result = findPlugin({ id: 'nonexistent' })

      expect(result).toEqual([])
    })
  })

  describe('monitorStore()', () => {
    it('should return stop function', () => {
      const stop = monitorStore()

      expect(typeof stop).toBe('function')
      stop()
    })

    it('should log add events by default', () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

      try {
        const stop = monitorStore()

        store.add('command', {
          id: 'monitor-cmd',
          type: 'command',
          name: 'monitor',
          priority: 100,
        } as any)

        expect(consoleSpy.mock.calls.some(call =>
          typeof call[0] === 'string' && call[0].includes('[store:add]')
        )).toBe(true)

        stop()
      } finally {
        consoleSpy.mockRestore()
      }
    })

    it('should log del events by default', () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

      try {
        store.add('command', {
          id: 'del-test',
          type: 'command',
          name: 'del',
          priority: 100,
        } as any)

        // 清除 add 日志
        consoleSpy.mockClear()

        const stop = monitorStore()

        store.del('del-test')

        expect(consoleSpy.mock.calls.some(call =>
          typeof call[0] === 'string' && call[0].includes('[store:del]')
        )).toBe(true)

        stop()
      } finally {
        consoleSpy.mockRestore()
      }
    })

    it('should stop monitoring when stop is called', () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

      try {
        const stop = monitorStore()

        stop()

        // 清除之前的日志
        consoleSpy.mockClear()

        store.add('command', {
          id: 'after-stop',
          type: 'command',
          name: 'after',
          priority: 100,
        } as any)

        const addCalls = consoleSpy.mock.calls.filter(call =>
          typeof call[0] === 'string' && call[0].includes('[store:add]')
        )
        expect(addCalls.length).toBe(0)
      } finally {
        consoleSpy.mockRestore()
      }
    })

    it('should respect add option', () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

      try {
        const stop = monitorStore({ add: false })

        store.add('command', {
          id: 'no-add',
          type: 'command',
          name: 'no-add',
          priority: 100,
        } as any)

        expect(consoleSpy.mock.calls.some(call =>
          typeof call[0] === 'string' && call[0].includes('[store:add]')
        )).toBe(false)

        stop()
      } finally {
        consoleSpy.mockRestore()
      }
    })

    it('should respect del option', () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

      try {
        store.add('command', {
          id: 'no-del',
          type: 'command',
          name: 'no-del',
          priority: 100,
        } as any)

        // 清除 add 日志
        consoleSpy.mockClear()

        const stop = monitorStore({ del: false })

        store.del('no-del')

        expect(consoleSpy.mock.calls.some(call =>
          typeof call[0] === 'string' && call[0].includes('[store:del]')
        )).toBe(false)

        stop()
      } finally {
        consoleSpy.mockRestore()
      }
    })
  })

  describe('createTimer()', () => {
    it('should return timer object', () => {
      const timer = createTimer('test')

      expect(timer).toBeDefined()
      expect(typeof timer.lap).toBe('function')
      expect(typeof timer.end).toBe('function')
    })

    it('should log lap time', () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
      const timer = createTimer('lap-test')

      timer.lap('checkpoint')

      expect(consoleSpy.mock.calls.some(call =>
        typeof call[0] === 'string' &&
        call[0].includes('[timer:lap-test]') &&
        call[0].includes('checkpoint')
      )).toBe(true)

      consoleSpy.mockRestore()
    })

    it('should log end time', () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
      const timer = createTimer('end-test')

      timer.end()

      expect(consoleSpy.mock.calls.some(call =>
        typeof call[0] === 'string' &&
        call[0].includes('[timer:end-test]') &&
        call[0].includes('done')
      )).toBe(true)

      consoleSpy.mockRestore()
    })

    it('should return elapsed time from lap', () => {
      vi.spyOn(console, 'log').mockImplementation(() => {})
      const timer = createTimer('elapsed-test')

      const elapsed = timer.lap()

      expect(typeof elapsed).toBe('number')
      expect(elapsed).toBeGreaterThanOrEqual(0)
    })

    it('should return elapsed time from end', () => {
      vi.spyOn(console, 'log').mockImplementation(() => {})
      const timer = createTimer('end-elapsed')

      const elapsed = timer.end()

      expect(typeof elapsed).toBe('number')
      expect(elapsed).toBeGreaterThanOrEqual(0)
    })

    it('should use default lap label if not provided', () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
      const timer = createTimer('default-lap')

      timer.lap()

      expect(consoleSpy.mock.calls.some(call =>
        typeof call[0] === 'string' && call[0].includes('lap:')
      )).toBe(true)

      consoleSpy.mockRestore()
    })
  })

  describe('dev object', () => {
    it('should export all functions', () => {
      expect(dev.snapshot).toBe(snapshot)
      expect(dev.printReport).toBe(printReport)
      expect(dev.listPlugins).toBe(listPlugins)
      expect(dev.listByFile).toBe(listByFile)
      expect(dev.listByPackage).toBe(listByPackage)
      expect(dev.findPlugin).toBe(findPlugin)
      expect(dev.monitorStore).toBe(monitorStore)
      expect(dev.createTimer).toBe(createTimer)
    })
  })

  describe('PluginDiagnostic defaults', () => {
    it('should handle plugin without id (store skips it)', () => {
      // store.add 会跳过没有 id 的插件
      store.add('command', {
        type: 'command',
      } as any)

      const result = listPlugins()

      // 因为没有 id，store 会跳过这个插件
      expect(result.length).toBe(0)
    })

    it('should fallback to options.name', () => {
      store.add('command', {
        id: 'opt-name',
        type: 'command',
        options: { name: 'from-options' },
      } as any)

      const result = listPlugins()

      expect(result[0].name).toBe('from-options')
    })

    it('should fallback to options.priority', () => {
      store.add('command', {
        id: 'opt-priority',
        type: 'command',
        options: { priority: 500 },
      } as any)

      const result = listPlugins()

      expect(result[0].priority).toBe(500)
    })

    it('should use callerPath as fallback for file', () => {
      store.add('command', {
        id: 'caller-path',
        type: 'command',
        callerPath: '/fallback/caller.ts',
      } as any)

      const result = listPlugins()

      expect(result[0].file).toBe('/fallback/caller.ts')
    })
  })
})
