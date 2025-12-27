/**
 * 集成测试 - 验证 API 层协同工作
 * @module tests/integration.test
 */
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { cache, registry, loader, lifecycle, event } from '../src/api'
import { command, accept, handler, button, task, setContext, clearContext } from '../src/create'

describe('Integration Tests', () => {
  beforeEach(() => {
    cache.clearAll()
    clearContext()
    vi.clearAllMocks()
  })

  describe('Cache + Registry', () => {
    it('should register and store plugin instances', () => {
      // 模拟加载环境
      setContext('test-plugin', '/path/to/test.ts')

      // 创建组件 - command 返回 id 字符串
      const cmdId = command(/^test$/, () => { })

      // 验证注册 - 使用 getByFile 获取实例
      const instances = cache.instance.getByFile('/path/to/test.ts')
      expect(instances.length).toBeGreaterThan(0)
      expect(instances.some(r => r.id === cmdId)).toBe(true)
    })

    it('should unregister and clean up cache', () => {
      setContext('test-plugin', '/path/to/test.ts')

      // command 返回 id，已自动注册
      command(/^test$/, () => { })

      // 卸载
      registry.unregisterByFile('/path/to/test.ts')

      // 验证清理
      const instances = cache.instance.getByFile('/path/to/test.ts')
      expect(instances.length).toBe(0)
    })
  })

  describe('Loader + Cache', () => {
    it('should add package and track files', () => {
      loader.addPackage('test-pkg', '/path/to/pkg', 'npm', '1.0.0')
      loader.addFileToPackage('test-pkg', '/path/to/pkg/file1.ts')
      loader.addFileToPackage('test-pkg', '/path/to/pkg/file2.ts')

      const pkg = cache.package.get('test-pkg')
      expect(pkg).toBeDefined()
      const files = Array.from(pkg?.files ?? [])
      expect(files).toContain('/path/to/pkg/file1.ts')
      expect(files).toContain('/path/to/pkg/file2.ts')
    })
  })

  describe('Lifecycle + Registry', () => {
    it('should disable and re-enable plugins', async () => {
      // 先添加包
      loader.addPackage('test-pkg', '/path', 'npm')

      setContext('test-pkg', '/path/to/test.ts')

      // 创建组件，自动注册
      command(/^test$/, () => { })

      // 禁用
      await lifecycle.disable('test-pkg')

      // 获取状态
      const status = lifecycle.getStatus('test-pkg')
      expect(status).toBe('disabled')

      // 重新启用
      await lifecycle.enable('test-pkg')

      const newStatus = lifecycle.getStatus('test-pkg')
      expect(newStatus).toBe('enabled')
    })
  })

  describe('DSL + Registry 完整流程', () => {
    it('should create command and register correctly', () => {
      setContext('test-pkg', '/path/to/test.ts')

      const cmdId = command(/^hello (\w+)$/, () => { }, {
        priority: 100,
        desc: 'Hello command',
      })

      const items = registry.getAll('command')
      const found = items.find(i => i.id === cmdId)

      expect(found).toBeDefined()
      expect(found?.type).toBe('command')
      expect(found?.priority).toBe(100)
    })

    it('should create multiple component types', () => {
      setContext('test-pkg', '/path/to/test.ts')

      // accept 接受字符串事件类型
      command(/^cmd$/, () => { })
      accept('message.receive', () => { })
      handler('test.handler', () => { })
      button('test-btn', () => { })
      // task 接受 cron 字符串
      task('* * * * *', () => { })

      expect(registry.getAll('command').length).toBe(1)
      expect(registry.getAll('accept').length).toBe(1)
      expect(registry.getAll('handler').length).toBe(1)
      expect(registry.getAll('button').length).toBe(1)
      expect(registry.getAll('task').length).toBe(1)
    })
  })

  describe('Event 集成', () => {
    it('should emit events during load', async () => {
      loader.addPackage('test-pkg', '/path', 'npm')

      await loader.loadPackage('test-pkg')

      expect(event.emit).toHaveBeenCalledWith('plugin:load:start', { pkg: 'test-pkg' })
      expect(event.emit).toHaveBeenCalledWith('plugin:load:done', expect.objectContaining({
        pkg: 'test-pkg',
      }))
    })
  })

  describe('排序功能', () => {
    it('should sort plugins by priority', () => {
      setContext('test-pkg', '/path/to/test.ts')

      const id1 = command(/^a$/, () => { }, { priority: 10 })
      const id2 = command(/^b$/, () => { }, { priority: 100 })
      const id3 = command(/^c$/, () => { }, { priority: 50 })

      registry.sort('command')

      const sorted = registry.getAll('command')
      // 按优先级降序排序
      const ids = sorted.map(s => s.id)
      expect(ids[0]).toBe(id2) // priority 100
      expect(ids[1]).toBe(id3) // priority 50
      expect(ids[2]).toBe(id1) // priority 10
    })
  })

  describe('数据存储', () => {
    it('should store and retrieve plugin data', () => {
      // cache.data.set 只有两个参数：key 和 value
      cache.data.set('config', { key: 'value' })

      const data = cache.data.get('config')
      expect(data).toEqual({ key: 'value' })
    })
  })
})
