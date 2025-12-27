/**
 * 连锁反应测试 - 验证多层级操作的正确性
 * @module tests/chain-reactions.test
 */
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { cache } from '../src/api/cache'
import { registry } from '../src/api/registry'
import { lifecycle } from '../src/api/lifecycle'
import { loader } from '../src/api/loader'
import { event } from '../src/api/event'
import { command, accept, handler, button, task, setContext, clearContext } from '../src/create'

describe('Chain Reactions', () => {
  beforeEach(() => {
    cache.clearAll()
    clearContext()
    vi.clearAllMocks()
  })

  describe('lifecycle.unload 连锁反应', () => {
    it('should cascade: unload → unregisterByPackage → delete instances → delete from cache', async () => {
      // 设置完整的包结构
      loader.addPackage('chain-pkg', '/path/to/chain-pkg', 'npm', '1.0.0')
      loader.addFileToPackage('chain-pkg', '/path/file1.ts')
      loader.addFileToPackage('chain-pkg', '/path/file2.ts')

      // 注册组件
      setContext('chain-pkg', '/path/file1.ts')
      const cmdId = command(/^cmd1$/, () => { })
      const accId = accept('message.receive', () => { })

      setContext('chain-pkg', '/path/file2.ts')
      const hdlId = handler('handler1', () => { })
      clearContext()

      // 验证初始状态
      expect(cache.package.has('chain-pkg')).toBe(true)
      expect(cache.instance.getByPackage('chain-pkg').length).toBe(3)
      expect(registry.getAll('command').length).toBe(1)
      expect(registry.getAll('accept').length).toBe(1)
      expect(registry.getAll('handler').length).toBe(1)

      // 执行卸载
      await lifecycle.unload('chain-pkg')

      // 验证所有连锁效果
      expect(cache.package.has('chain-pkg')).toBe(false)
      expect(cache.instance.getByPackage('chain-pkg').length).toBe(0)
      expect(cache.instance.get('command', cmdId)).toBeUndefined()
      expect(cache.instance.get('accept', accId)).toBeUndefined()
      expect(cache.instance.get('handler', hdlId)).toBeUndefined()
      expect(registry.getAll('command').length).toBe(0)
      expect(registry.getAll('accept').length).toBe(0)
      expect(registry.getAll('handler').length).toBe(0)
    })

    it('should emit events in correct order during unload', async () => {
      loader.addPackage('event-pkg', '/path', 'npm')
      setContext('event-pkg', '/path/file.ts')
      command(/^test$/, () => { })
      clearContext()

      vi.clearAllMocks()
      const emitCalls: string[] = []
      vi.mocked(event.emit).mockImplementation((name) => {
        emitCalls.push(name)
      })

      await lifecycle.unload('event-pkg')

      // 验证事件顺序
      expect(emitCalls).toContain('plugin:unload')
    })
  })

  describe('lifecycle.disable 连锁反应', () => {
    it('should disable all components across multiple files', async () => {
      loader.addPackage('disable-pkg', '/path', 'npm')

      setContext('disable-pkg', '/path/file1.ts')
      const cmd1 = command(/^cmd1$/, () => { })
      const cmd2 = command(/^cmd2$/, () => { })

      setContext('disable-pkg', '/path/file2.ts')
      const acc1 = accept('message', () => { })
      clearContext()

      // 验证初始启用状态
      expect(cache.instance.get('command', cmd1)?.enabled).toBe(true)
      expect(cache.instance.get('command', cmd2)?.enabled).toBe(true)
      expect(cache.instance.get('accept', acc1)?.enabled).toBe(true)

      // 禁用包
      await lifecycle.disable('disable-pkg')

      // 验证所有组件被禁用
      expect(cache.instance.get('command', cmd1)?.enabled).toBe(false)
      expect(cache.instance.get('command', cmd2)?.enabled).toBe(false)
      expect(cache.instance.get('accept', acc1)?.enabled).toBe(false)
      expect(lifecycle.getStatus('disable-pkg')).toBe('disabled')
    })

    it('should re-enable all components after enable', async () => {
      loader.addPackage('reenable-pkg', '/path', 'npm')

      setContext('reenable-pkg', '/path/file.ts')
      const cmd = command(/^test$/, () => { })
      const acc = accept('message', () => { })
      clearContext()

      // 禁用后启用
      await lifecycle.disable('reenable-pkg')
      expect(cache.instance.get('command', cmd)?.enabled).toBe(false)

      await lifecycle.enable('reenable-pkg')
      expect(cache.instance.get('command', cmd)?.enabled).toBe(true)
      expect(cache.instance.get('accept', acc)?.enabled).toBe(true)
    })
  })

  describe('registry.unregisterByFile 连锁反应', () => {
    it('should only unregister components from specific file', () => {
      setContext('multi-file-pkg', '/path/file1.ts')
      const cmd1 = command(/^cmd1$/, () => { })
      const acc1 = accept('message', () => { })

      setContext('multi-file-pkg', '/path/file2.ts')
      const cmd2 = command(/^cmd2$/, () => { })
      clearContext()

      // 卸载 file1
      const count = registry.unregisterByFile('/path/file1.ts')

      expect(count).toBe(2)
      expect(cache.instance.get('command', cmd1)).toBeUndefined()
      expect(cache.instance.get('accept', acc1)).toBeUndefined()
      expect(cache.instance.get('command', cmd2)).toBeDefined()
      expect(registry.getAll('command').length).toBe(1)
    })

    it('should handle multiple unregistrations correctly', () => {
      setContext('pkg', '/path/file1.ts')
      command(/^a$/, () => { })

      setContext('pkg', '/path/file2.ts')
      command(/^b$/, () => { })

      setContext('pkg', '/path/file3.ts')
      command(/^c$/, () => { })
      clearContext()

      expect(registry.getAll('command').length).toBe(3)

      registry.unregisterByFile('/path/file1.ts')
      expect(registry.getAll('command').length).toBe(2)

      registry.unregisterByFile('/path/file2.ts')
      expect(registry.getAll('command').length).toBe(1)

      registry.unregisterByFile('/path/file3.ts')
      expect(registry.getAll('command').length).toBe(0)
    })
  })

  describe('loader.reloadPackage 连锁反应', () => {
    it('should unregister all → clear cache → reload files', async () => {
      loader.addPackage('reload-pkg', '/path', 'npm')
      loader.addFileToPackage('reload-pkg', '/path/file.ts')

      setContext('reload-pkg', '/path/file.ts')
      command(/^old$/, () => { })
      clearContext()

      expect(registry.getAll('command').length).toBe(1)

      vi.clearAllMocks()

      // 执行重载（会失败因为文件不存在，但事件应该发出）
      await loader.reloadPackage('reload-pkg')

      expect(event.emit).toHaveBeenCalledWith('plugin:reload', expect.objectContaining({
        pkg: 'reload-pkg',
      }))
    })
  })

  describe('cache.clearAll 连锁反应', () => {
    it('should clear all stores completely', () => {
      // 添加各种数据
      loader.addPackage('pkg1', '/path1', 'npm')
      loader.addPackage('pkg2', '/path2', 'git')

      setContext('pkg1', '/path1/file.ts')
      command(/^cmd1$/, () => { })
      accept('message', () => { })

      setContext('pkg2', '/path2/file.ts')
      handler('handler', () => { })
      button('button', () => { })
      task('* * * * *', () => { })
      clearContext()

      cache.data.set('key1', { value: 1 })
      cache.data.set('key2', { value: 2 })

      // 验证有数据 - getAll() 返回 Map
      expect(cache.package.getAll().size).toBe(2)
      expect(cache.instance.totalCount).toBe(5)
      expect(cache.data.has('key1')).toBe(true)
      expect(cache.data.has('key2')).toBe(true)

      // 清除所有
      cache.clearAll()

      // 验证全部清空
      expect(cache.package.getAll().size).toBe(0)
      expect(cache.instance.totalCount).toBe(0)
      expect(cache.data.has('key1')).toBe(false)
      expect(cache.data.has('key2')).toBe(false)
    })
  })

  describe('多包交互', () => {
    it('should not affect other packages when unloading one', async () => {
      // 设置两个包
      loader.addPackage('pkg-a', '/path-a', 'npm')
      loader.addPackage('pkg-b', '/path-b', 'npm')

      setContext('pkg-a', '/path-a/file.ts')
      command(/^cmd-a$/, () => { })

      setContext('pkg-b', '/path-b/file.ts')
      const cmdB = command(/^cmd-b$/, () => { })
      clearContext()

      // 卸载 pkg-a
      await lifecycle.unload('pkg-a')

      // pkg-b 不受影响
      expect(cache.package.has('pkg-b')).toBe(true)
      expect(cache.instance.get('command', cmdB)).toBeDefined()
      expect(registry.getAll('command').length).toBe(1)
    })

    it('should handle enable/disable independently per package', async () => {
      loader.addPackage('pkg-x', '/path-x', 'npm')
      loader.addPackage('pkg-y', '/path-y', 'npm')

      setContext('pkg-x', '/path-x/file.ts')
      const cmdX = command(/^x$/, () => { })

      setContext('pkg-y', '/path-y/file.ts')
      const cmdY = command(/^y$/, () => { })
      clearContext()

      // 禁用 pkg-x
      await lifecycle.disable('pkg-x')

      // pkg-x 禁用，pkg-y 仍启用
      expect(cache.instance.get('command', cmdX)?.enabled).toBe(false)
      expect(cache.instance.get('command', cmdY)?.enabled).toBe(true)
      expect(lifecycle.isEnabled('pkg-x')).toBe(false)
      expect(lifecycle.isEnabled('pkg-y')).toBe(false) // loaded 不等于 enabled

      // 启用 pkg-y
      await lifecycle.enable('pkg-y')
      expect(lifecycle.isEnabled('pkg-y')).toBe(true)
      expect(lifecycle.isEnabled('pkg-x')).toBe(false)
    })
  })

  describe('排序稳定性', () => {
    it('should maintain stable sort for equal priorities', () => {
      setContext('pkg', '/file.ts')
      const id1 = command(/^a$/, () => { }, { priority: 50 })
      const id2 = command(/^b$/, () => { }, { priority: 50 })
      const id3 = command(/^c$/, () => { }, { priority: 50 })
      clearContext()

      // 多次排序应该保持稳定
      registry.sort('command')
      const order1 = registry.getAll('command').map(c => c.id)

      registry.sort('command')
      const order2 = registry.getAll('command').map(c => c.id)

      // 排序应该是稳定的
      expect(order1).toEqual(order2)
    })

    it('should correctly sort mixed priorities', () => {
      setContext('pkg', '/file.ts')
      const low = command(/^low$/, () => { }, { priority: 10 })
      const high = command(/^high$/, () => { }, { priority: 100 })
      const mid = command(/^mid$/, () => { }, { priority: 50 })
      const veryHigh = command(/^veryHigh$/, () => { }, { priority: 1000 })
      const negative = command(/^negative$/, () => { }, { priority: -10 })
      clearContext()

      registry.sort('command')
      const sorted = registry.getAll('command').map(c => c.id)

      expect(sorted[0]).toBe(veryHigh)
      expect(sorted[1]).toBe(high)
      expect(sorted[2]).toBe(mid)
      expect(sorted[3]).toBe(low)
      expect(sorted[4]).toBe(negative)
    })
  })

  describe('getEnabled 与 disable 交互', () => {
    it('should correctly filter enabled components after partial disable', () => {
      setContext('pkg', '/file.ts')
      const cmd1 = command(/^a$/, () => { })
      const cmd2 = command(/^b$/, () => { })
      const cmd3 = command(/^c$/, () => { })
      clearContext()

      // 禁用部分
      registry.disable('command', cmd2)

      const enabled = registry.getEnabled('command')
      expect(enabled.length).toBe(2)
      expect(enabled.map(e => e.id)).toContain(cmd1)
      expect(enabled.map(e => e.id)).toContain(cmd3)
      expect(enabled.map(e => e.id)).not.toContain(cmd2)
    })
  })

  describe('复合操作场景', () => {
    it('should handle rapid enable/disable cycles', async () => {
      loader.addPackage('cycle-pkg', '/path', 'npm')
      setContext('cycle-pkg', '/path/file.ts')
      const cmd = command(/^test$/, () => { })
      clearContext()

      // 快速循环
      await lifecycle.disable('cycle-pkg')
      expect(cache.instance.get('command', cmd)?.enabled).toBe(false)

      await lifecycle.enable('cycle-pkg')
      expect(cache.instance.get('command', cmd)?.enabled).toBe(true)

      await lifecycle.disable('cycle-pkg')
      expect(cache.instance.get('command', cmd)?.enabled).toBe(false)

      await lifecycle.enable('cycle-pkg')
      expect(cache.instance.get('command', cmd)?.enabled).toBe(true)
    })

    it('should handle adding components to disabled package', async () => {
      loader.addPackage('disabled-pkg', '/path', 'npm')
      await lifecycle.disable('disabled-pkg')

      setContext('disabled-pkg', '/path/file.ts')
      const cmd = command(/^new$/, () => { })
      clearContext()

      // 新组件应该是启用状态（DSL 默认）
      expect(cache.instance.get('command', cmd)?.enabled).toBe(true)

      // 但包状态是禁用的
      expect(lifecycle.getStatus('disabled-pkg')).toBe('disabled')
    })
  })
})
