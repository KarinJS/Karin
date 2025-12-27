/**
 * 未覆盖分支测试 - 专门测试覆盖率报告中未覆盖的代码路径
 * @module tests/uncovered-branches.test
 */
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { resolve } from 'path'
import { cache } from '../src/api/cache'
import { registry } from '../src/api/registry'
import { loader } from '../src/api/loader'
import { moduleApi } from '../src/api/module'

// 测试模块路径
const primitiveExportsPath = resolve(__dirname, 'fixtures/primitive-exports.ts')
const throwStringPath = resolve(__dirname, 'fixtures/throw-string.ts')

describe('Uncovered Branches', () => {
  beforeEach(() => {
    cache.clearAll()
    moduleApi.clear()
    vi.clearAllMocks()
  })

  /**
   * cache.ts 第160-168行
   * getByPackage 中遍历多个 stores 的分支
   */
  describe('cache.ts: getByPackage with multiple stores (lines 160-168)', () => {
    it('should find items across multiple type stores', () => {
      // 在不同类型的存储中注册同一个包的组件
      registry.register('command', { name: 'cmd1' }, 'shared-pkg', '/file1.ts')
      registry.register('accept', { name: 'acc1' }, 'shared-pkg', '/file2.ts')
      registry.register('handler', { name: 'handler1' }, 'shared-pkg', '/file3.ts')
      registry.register('button', { name: 'btn1' }, 'shared-pkg', '/file4.ts')
      registry.register('task', { name: 'task1' }, 'shared-pkg', '/file5.ts')

      // 另一个包的组件
      registry.register('command', { name: 'other' }, 'other-pkg', '/other.ts')

      // getByPackage 应该遍历所有 stores 并找到 shared-pkg 的所有组件
      const items = cache.instance.getByPackage('shared-pkg')

      expect(items.length).toBe(5)
      // 验证包含所有类型
      const types = items.map(item => item.type)
      expect(types).toContain('command')
      expect(types).toContain('accept')
      expect(types).toContain('handler')
      expect(types).toContain('button')
      expect(types).toContain('task')
    })

    it('should iterate through all stores even when some are empty', () => {
      // 只在 command 和 task 中注册
      registry.register('command', { name: 'cmd1' }, 'sparse-pkg', '/file1.ts')
      registry.register('task', { name: 'task1' }, 'sparse-pkg', '/file2.ts')

      const items = cache.instance.getByPackage('sparse-pkg')

      expect(items.length).toBe(2)
    })

    it('should return empty array when package has no items in any store', () => {
      // 确保有一些其他包的组件
      registry.register('command', { name: 'other' }, 'other-pkg', '/other.ts')

      const items = cache.instance.getByPackage('non-existent-pkg')

      expect(items).toEqual([])
    })
  })

  /**
   * cache.ts 第253行
   * count(type) 返回 0 的分支 (via ?? 0)
   */
  describe('cache.ts: count returns 0 for empty/unknown type (line 253)', () => {
    it('should return 0 for type with no items', () => {
      // 不注册任何 command 组件
      expect(cache.instance.count('command')).toBe(0)
    })

    it('should return correct count after adding and removing items', () => {
      const id1 = registry.register('accept', {}, 'pkg', '/file.ts')
      const id2 = registry.register('accept', {}, 'pkg', '/file.ts')

      expect(cache.instance.count('accept')).toBe(2)

      cache.instance.delete('accept', id1)
      expect(cache.instance.count('accept')).toBe(1)

      cache.instance.delete('accept', id2)
      expect(cache.instance.count('accept')).toBe(0)
    })

    it('should return 0 for all types when store is cleared', () => {
      registry.register('command', {}, 'pkg', '/file.ts')
      registry.register('accept', {}, 'pkg', '/file.ts')
      registry.register('handler', {}, 'pkg', '/file.ts')

      cache.instance.clear()

      expect(cache.instance.count('command')).toBe(0)
      expect(cache.instance.count('accept')).toBe(0)
      expect(cache.instance.count('handler')).toBe(0)
      expect(cache.instance.count('button')).toBe(0)
      expect(cache.instance.count('task')).toBe(0)
    })
  })

  /**
   * cache.ts getByFile 分支覆盖
   */
  describe('cache.ts: getByFile with multiple stores', () => {
    it('should find items across all type stores by file', () => {
      const sharedFile = '/shared/file.ts'

      // 同一个文件在不同类型中注册
      registry.register('command', { name: 'cmd' }, 'pkg', sharedFile)
      registry.register('accept', { name: 'acc' }, 'pkg', sharedFile)
      registry.register('handler', { name: 'hdl' }, 'pkg', sharedFile)

      const items = cache.instance.getByFile(sharedFile)

      expect(items.length).toBe(3)
      const types = items.map(item => item.type)
      expect(types).toContain('command')
      expect(types).toContain('accept')
      expect(types).toContain('handler')
    })
  })

  /**
   * module.ts getImportUrl 在开发模式下使用时间戳的分支
   */
  describe('module.ts: getImportUrl cache busting behavior', () => {
    it('should add query parameter when bustCache is true', () => {
      const url = moduleApi.getImportUrl('/path/to/file.ts', true)
      expect(url).toContain('?')
      expect(url).toMatch(/\?(v|t)=\d+/)
    })

    it('should not add query parameter when bustCache is false', () => {
      const url = moduleApi.getImportUrl('/path/to/file.ts', false)
      expect(url).toBe('/path/to/file.ts')
      expect(url).not.toContain('?')
    })

    it('should not add query parameter when bustCache is undefined', () => {
      const url = moduleApi.getImportUrl('/path/to/file.ts')
      expect(url).toBe('/path/to/file.ts')
    })

    it('should increment version for same file', () => {
      const file = '/version-test/file.ts'

      const url1 = moduleApi.getImportUrl(file, true)
      const url2 = moduleApi.getImportUrl(file, true)
      const url3 = moduleApi.getImportUrl(file, true)

      // 版本应该递增（如果在非开发模式下）
      const extractVersion = (url: string) => {
        const match = url.match(/[?](v|t)=(\d+)/)
        return match ? parseInt(match[2]) : null
      }

      const v1 = extractVersion(url1)
      const v2 = extractVersion(url2)
      const v3 = extractVersion(url3)

      // 确保返回有效的版本号
      expect(v1).not.toBeNull()
      expect(v2).not.toBeNull()
      expect(v3).not.toBeNull()

      // 如果是版本模式 (v=)，应该递增
      if (url1.includes('?v=')) {
        expect(v2).toBe(v1! + 1)
        expect(v3).toBe(v2! + 1)
      }
    })
  })

  /**
   * module.ts 依赖图边缘情况
   */
  describe('module.ts: dependency graph edge cases', () => {
    it('should handle deep dependency chains correctly', () => {
      // A -> B -> C -> D -> E
      moduleApi.addDependency('/a.ts', '/b.ts')
      moduleApi.addDependency('/b.ts', '/c.ts')
      moduleApi.addDependency('/c.ts', '/d.ts')
      moduleApi.addDependency('/d.ts', '/e.ts')

      const depsOfA = moduleApi.findDependencies('/a.ts')
      expect(depsOfA).toContain('/b.ts')
      expect(depsOfA).toContain('/c.ts')
      expect(depsOfA).toContain('/d.ts')
      expect(depsOfA).toContain('/e.ts')
    })

    it('should handle multiple roots depending on same module', () => {
      // A -> C, B -> C
      moduleApi.addDependency('/a.ts', '/c.ts')
      moduleApi.addDependency('/b.ts', '/c.ts')

      const dependentsOfC = moduleApi.findDependents('/c.ts')
      expect(dependentsOfC).toContain('/a.ts')
      expect(dependentsOfC).toContain('/b.ts')
    })

    it('should not duplicate in circular dependencies', () => {
      // A -> B -> C -> A
      moduleApi.addDependency('/a.ts', '/b.ts')
      moduleApi.addDependency('/b.ts', '/c.ts')
      moduleApi.addDependency('/c.ts', '/a.ts')

      // 不应该无限循环，且不应该有重复
      const depsOfA = moduleApi.findDependencies('/a.ts')
      const uniqueDeps = [...new Set(depsOfA)]
      expect(depsOfA.length).toBe(uniqueDeps.length)
    })
  })

  /**
   * registry delete 分支
   */
  describe('registry: delete edge cases', () => {
    it('should return false when deleting non-existent item', () => {
      const result = registry.unregister('command', 'non-existent-id')
      expect(result).toBe(false)
    })

    it('should successfully delete existing item', () => {
      const id = registry.register('command', {}, 'pkg', '/file.ts')

      const result = registry.unregister('command', id)
      expect(result).toBe(true)

      // 确认已删除
      expect(cache.instance.get('command', id)).toBeUndefined()
    })
  })

  /**
   * cache.package 边缘情况
   */
  describe('cache.package: edge cases', () => {
    it('should handle package with many files', () => {
      cache.package.add('many-files-pkg', {
        version: '1.0.0',
        path: '/path',
        source: 'npm',
        status: 'loaded',
        files: new Set(),
      })

      // 添加多个文件
      for (let i = 0; i < 100; i++) {
        cache.package.addFile('many-files-pkg', `/path/file${i}.ts`)
      }

      const files = cache.package.getFiles('many-files-pkg')
      expect(files.length).toBe(100)

      // 通过文件查找包
      expect(cache.package.findByFile('/path/file50.ts')).toBe('many-files-pkg')
    })

    it('should correctly handle status transitions', () => {
      cache.package.add('status-test', {
        version: '1.0.0',
        path: '/path',
        source: 'npm',
        status: 'loaded',
        files: new Set(),
      })

      // 状态转换
      const statuses: Array<'loaded' | 'enabled' | 'disabled' | 'error'> = [
        'loaded', 'enabled', 'disabled', 'error', 'loaded',
      ]

      for (const status of statuses) {
        cache.package.setStatus('status-test', status)
        expect(cache.package.get('status-test')?.status).toBe(status)
      }
    })
  })

  /**
   * registry sort 边缘情况
   */
  describe('registry: sort edge cases', () => {
    it('should maintain order when all items have same priority', () => {
      registry.register('command', { priority: 100 }, 'pkg', '/f1.ts')
      registry.register('command', { priority: 100 }, 'pkg', '/f2.ts')
      registry.register('command', { priority: 100 }, 'pkg', '/f3.ts')

      registry.sort('command')

      const items = registry.getAll('command')
      expect(items.length).toBe(3)
    })

    it('should handle undefined priority', () => {
      registry.register('command', {}, 'pkg', '/f1.ts') // no priority
      registry.register('command', { priority: 50 }, 'pkg', '/f2.ts')
      registry.register('command', {}, 'pkg', '/f3.ts') // no priority

      registry.sort('command')

      const items = registry.getAll('command')
      expect(items.length).toBe(3)
    })

    it('should sort correctly with mixed priorities', () => {
      registry.register('accept', { name: 'high' }, 'pkg', '/f1.ts', { priority: 100 })
      registry.register('accept', { name: 'low' }, 'pkg', '/f2.ts', { priority: 1 })
      registry.register('accept', { name: 'mid' }, 'pkg', '/f3.ts', { priority: 50 })

      registry.sort('accept')

      const items = registry.getAll('accept')
      // 按优先级降序排列（优先级高的在前）
      expect((items[0].instance as any).name).toBe('high')
      expect((items[1].instance as any).name).toBe('mid')
      expect((items[2].instance as any).name).toBe('low')
    })
  })

  /**
   * instance store 多类型操作
   */
  describe('instance store: multi-type operations', () => {
    it('should correctly delete by package across all types', () => {
      registry.register('command', {}, 'target-pkg', '/f1.ts')
      registry.register('accept', {}, 'target-pkg', '/f2.ts')
      registry.register('handler', {}, 'target-pkg', '/f3.ts')
      registry.register('command', {}, 'other-pkg', '/f4.ts')

      const deletedCount = cache.instance.deleteByPackage('target-pkg')

      expect(deletedCount).toBe(3)
      expect(cache.instance.getByPackage('target-pkg').length).toBe(0)
      expect(cache.instance.getByPackage('other-pkg').length).toBe(1)
    })

    it('should correctly delete by file across all types', () => {
      const targetFile = '/target/file.ts'
      registry.register('command', {}, 'pkg', targetFile)
      registry.register('accept', {}, 'pkg', targetFile)
      registry.register('button', {}, 'pkg', targetFile)
      registry.register('command', {}, 'pkg', '/other/file.ts')

      const deletedCount = cache.instance.deleteByFile(targetFile)

      expect(deletedCount).toBe(3)
      expect(cache.instance.getByFile(targetFile).length).toBe(0)
      expect(cache.instance.getByFile('/other/file.ts').length).toBe(1)
    })

    it('should handle clearType for each type', () => {
      const types: Array<'command' | 'accept' | 'handler' | 'button' | 'task'> = [
        'command', 'accept', 'handler', 'button', 'task',
      ]

      // 每种类型注册一个
      for (const type of types) {
        registry.register(type, {}, 'pkg', '/file.ts')
      }

      expect(cache.instance.totalCount).toBe(5)

      // 逐个清除
      for (const type of types) {
        cache.instance.clearType(type)
        expect(cache.instance.count(type)).toBe(0)
      }

      expect(cache.instance.totalCount).toBe(0)
    })
  })

  /**
   * loader.ts 第59行
   * 当抛出非 Error 对象时的错误处理分支
   */
  describe('loader.ts: non-Error exception handling (line 59)', () => {
    it('should convert string error to Error object', async () => {
      const result = await loader.loadFile(throwStringPath, { silent: true })

      expect(result.success).toBe(false)
      expect(result.error).toBeInstanceOf(Error)
      expect(result.error?.message).toContain('This is a string error')
    })

    it('should have error property when loading fails with non-Error', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => { })

      const result = await loader.loadFile(throwStringPath, { silent: false })

      expect(result.success).toBe(false)
      expect(result.error).toBeDefined()
      // 错误信息应该被记录
      expect(consoleSpy).toHaveBeenCalled()

      consoleSpy.mockRestore()
    })
  })

  /**
   * loader.ts 第137行
   * isRegistrable 返回 false 的情况（null, undefined, 基础类型）
   */
  describe('loader.ts: isRegistrable returns false for primitives (line 137)', () => {
    it('should load module with primitive exports', async () => {
      const result = await loader.loadFile(primitiveExportsPath, { silent: true })

      // 模块加载应该成功
      expect(result.success).toBe(true)

      // registered 数量应该只计算函数和对象，不包括基础类型
      // nullValue, undefinedValue, numberValue, stringValue, boolValue 不可注册
      // functionValue, objectValue 可注册
      expect(result.registered).toBe(2)
    })

    it('should successfully import module with mixed exports', async () => {
      const mod = await loader.importModule(primitiveExportsPath) as Record<string, unknown>

      expect(mod.nullValue).toBe(null)
      expect(mod.undefinedValue).toBe(undefined)
      expect(mod.numberValue).toBe(42)
      expect(mod.stringValue).toBe('hello')
      expect(mod.boolValue).toBe(true)
      expect(typeof mod.functionValue).toBe('function')
      expect(typeof mod.objectValue).toBe('object')
    })
  })
})
