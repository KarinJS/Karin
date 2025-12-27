/**
 * 边界情况测试 - 覆盖未测试的代码路径
 * @module tests/edge-cases.test
 */
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { cache } from '../src/api/cache'
import { registry } from '../src/api/registry'
import { loader } from '../src/api/loader'
import { moduleApi } from '../src/api/module'
import { setContext, clearContext, getContext } from '../src/create'
import type { PluginType } from '../src/types'

describe('Edge Cases', () => {
  beforeEach(() => {
    cache.clearAll()
    clearContext()
    vi.clearAllMocks()
  })

  describe('Cache edge cases', () => {
    describe('PackageStore', () => {
      it('should return false for has() on non-existent package', () => {
        expect(cache.package.has('non-existent')).toBe(false)
      })

      it('should handle delete on non-existent package', () => {
        const result = cache.package.delete('non-existent')
        expect(result).toBe(false)
      })

      it('should handle addFile on non-existent package', () => {
        // 不应该抛出错误
        cache.package.addFile('non-existent', '/file.ts')
        expect(cache.package.has('non-existent')).toBe(false)
      })

      it('should handle removeFile on non-existent package gracefully', () => {
        // removeFile 对于不存在的包不返回值，只是静默处理
        cache.package.removeFile('non-existent', '/file.ts')
        // 不应该抛出错误
        expect(cache.package.has('non-existent')).toBe(false)
      })

      it('should handle getFiles on non-existent package', () => {
        const files = cache.package.getFiles('non-existent')
        expect(files).toEqual([])
      })

      it('should correctly track file operations with findByFile', () => {
        cache.package.add('test-pkg', {
          version: '1.0.0',
          path: '/path',
          source: 'npm',
          status: 'loaded',
          files: new Set(),
        })

        // 初始没有文件
        expect(cache.package.findByFile('/file.ts')).toBe(null)

        cache.package.addFile('test-pkg', '/file.ts')
        expect(cache.package.findByFile('/file.ts')).toBe('test-pkg')

        cache.package.removeFile('test-pkg', '/file.ts')
        expect(cache.package.findByFile('/file.ts')).toBe(null)
      })

      it('should return null for findByFile on non-existent file', () => {
        const pkgName = cache.package.findByFile('/non/existent')
        expect(pkgName).toBe(null)
      })

      it('should correctly return package size', () => {
        expect(cache.package.size).toBe(0)

        cache.package.add('pkg1', {
          version: '1.0.0',
          path: '/path1',
          source: 'npm',
          status: 'loaded',
          files: new Set(),
        })

        expect(cache.package.size).toBe(1)
      })

      it('should correctly return package names', () => {
        cache.package.add('pkg-a', {
          version: '1.0.0',
          path: '/a',
          source: 'npm',
          status: 'loaded',
          files: new Set(),
        })
        cache.package.add('pkg-b', {
          version: '1.0.0',
          path: '/b',
          source: 'npm',
          status: 'loaded',
          files: new Set(),
        })

        const names = cache.package.names()
        expect(names).toContain('pkg-a')
        expect(names).toContain('pkg-b')
      })

      it('should correctly set package status', () => {
        cache.package.add('status-pkg', {
          version: '1.0.0',
          path: '/path',
          source: 'npm',
          status: 'loaded',
          files: new Set(),
        })

        cache.package.setStatus('status-pkg', 'enabled')
        expect(cache.package.get('status-pkg')?.status).toBe('enabled')

        cache.package.setStatus('status-pkg', 'disabled')
        expect(cache.package.get('status-pkg')?.status).toBe('disabled')
      })

      it('should handle setStatus on non-existent package', () => {
        // 不应该抛出错误
        cache.package.setStatus('non-existent', 'enabled')
        expect(cache.package.has('non-existent')).toBe(false)
      })
    })

    describe('InstanceStore', () => {
      it('should handle get on non-existent type', () => {
        const result = cache.instance.get('command', 'non-existent')
        expect(result).toBeUndefined()
      })

      it('should handle delete on non-existent item', () => {
        const result = cache.instance.delete('command', 'non-existent')
        expect(result).toBe(false)
      })

      it('should return empty array for getAll on empty type', () => {
        const items = cache.instance.getAll('command')
        expect(items).toEqual([])
      })

      it('should return empty array for getByPackage on non-existent package', () => {
        const items = cache.instance.getByPackage('non-existent')
        expect(items).toEqual([])
      })

      it('should return empty array for getByFile on non-existent file', () => {
        const items = cache.instance.getByFile('/non/existent.ts')
        expect(items).toEqual([])
      })

      it('should return 0 for count on empty type', () => {
        expect(cache.instance.count('command')).toBe(0)
      })

      it('should correctly count items per type', () => {
        registry.register('command', {}, 'pkg', '/file.ts')
        registry.register('command', {}, 'pkg', '/file.ts')
        registry.register('accept', {}, 'pkg', '/file.ts')

        expect(cache.instance.count('command')).toBe(2)
        expect(cache.instance.count('accept')).toBe(1)
        expect(cache.instance.count('handler')).toBe(0)
      })

      it('should correctly calculate totalCount', () => {
        registry.register('command', {}, 'pkg', '/file.ts')
        registry.register('accept', {}, 'pkg', '/file.ts')
        registry.register('handler', {}, 'pkg', '/file.ts')

        expect(cache.instance.totalCount).toBe(3)
      })

      it('should clear all stores correctly', () => {
        registry.register('command', {}, 'pkg', '/file.ts')
        registry.register('accept', {}, 'pkg', '/file.ts')

        expect(cache.instance.totalCount).toBe(2)

        cache.instance.clear()

        expect(cache.instance.totalCount).toBe(0)
        expect(cache.instance.getAll('command')).toEqual([])
        expect(cache.instance.getAll('accept')).toEqual([])
      })

      it('should handle deleteByPackage on non-existent package', () => {
        const count = cache.instance.deleteByPackage('non-existent')
        expect(count).toBe(0)
      })

      it('should handle deleteByFile on non-existent file', () => {
        const count = cache.instance.deleteByFile('/non/existent.ts')
        expect(count).toBe(0)
      })

      it('should correctly delete by package', () => {
        registry.register('command', {}, 'pkg1', '/file1.ts')
        registry.register('command', {}, 'pkg1', '/file2.ts')
        registry.register('command', {}, 'pkg2', '/file3.ts')

        const count = cache.instance.deleteByPackage('pkg1')

        expect(count).toBe(2)
        expect(cache.instance.getByPackage('pkg1').length).toBe(0)
        expect(cache.instance.getByPackage('pkg2').length).toBe(1)
      })

      it('should correctly delete by file', () => {
        registry.register('command', {}, 'pkg', '/file1.ts')
        registry.register('accept', {}, 'pkg', '/file1.ts')
        registry.register('command', {}, 'pkg', '/file2.ts')

        const count = cache.instance.deleteByFile('/file1.ts')

        expect(count).toBe(2)
        expect(cache.instance.getByFile('/file1.ts').length).toBe(0)
        expect(cache.instance.getByFile('/file2.ts').length).toBe(1)
      })

      it('should get store for type', () => {
        registry.register('command', {}, 'pkg', '/file.ts')

        const store = cache.instance.getStore('command')
        expect(store.size).toBe(1)
      })

      it('should clear specific type', () => {
        registry.register('command', {}, 'pkg', '/file.ts')
        registry.register('accept', {}, 'pkg', '/file.ts')

        cache.instance.clearType('command')

        expect(cache.instance.count('command')).toBe(0)
        expect(cache.instance.count('accept')).toBe(1)
      })
    })

    describe('DataStore', () => {
      it('should handle get on non-existent key', () => {
        expect(cache.data.get('non-existent')).toBeUndefined()
      })

      it('should handle has on non-existent key', () => {
        expect(cache.data.has('non-existent')).toBe(false)
      })

      it('should handle delete on non-existent key', () => {
        const result = cache.data.delete('non-existent')
        expect(result).toBe(false)
      })

      it('should correctly store and retrieve data', () => {
        cache.data.set('test-key', { value: 42 })
        expect(cache.data.has('test-key')).toBe(true)
        expect(cache.data.get('test-key')).toEqual({ value: 42 })
      })

      it('should clear all data', () => {
        cache.data.set('key1', 'value1')
        cache.data.set('key2', 'value2')

        cache.data.clear()

        expect(cache.data.get('key1')).toBeUndefined()
        expect(cache.data.get('key2')).toBeUndefined()
      })

      it('should handle different data types', () => {
        cache.data.set('string', 'hello')
        cache.data.set('number', 42)
        cache.data.set('array', [1, 2, 3])
        cache.data.set('object', { a: 1 })
        cache.data.set('null', null)

        expect(cache.data.get('string')).toBe('hello')
        expect(cache.data.get('number')).toBe(42)
        expect(cache.data.get('array')).toEqual([1, 2, 3])
        expect(cache.data.get('object')).toEqual({ a: 1 })
        expect(cache.data.get('null')).toBe(null)
      })

      it('should overwrite existing data', () => {
        cache.data.set('key', 'value1')
        cache.data.set('key', 'value2')

        expect(cache.data.get('key')).toBe('value2')
      })
    })
  })

  describe('Module edge cases', () => {
    it('should handle getPackageByFile for unknown file', () => {
      const pkg = moduleApi.getPackageByFile('/unknown/file.ts')
      expect(pkg).toBeNull()
    })

    it('should return correct package for registered file', () => {
      loader.addPackage('my-pkg', '/my/path', 'npm')
      loader.addFileToPackage('my-pkg', '/my/path/file.ts')

      const pkg = moduleApi.getPackageByFile('/my/path/file.ts')
      expect(pkg).toBe('my-pkg')
    })

    it('should handle getFilesByPackage for unknown package', () => {
      const files = moduleApi.getFilesByPackage('unknown-pkg')
      expect(files).toEqual([])
    })

    it('should return correct files for package', () => {
      loader.addPackage('files-pkg', '/path', 'npm')
      loader.addFileToPackage('files-pkg', '/path/a.ts')
      loader.addFileToPackage('files-pkg', '/path/b.ts')

      const files = moduleApi.getFilesByPackage('files-pkg')
      expect(files).toContain('/path/a.ts')
      expect(files).toContain('/path/b.ts')
    })

    it('should generate import URL with cache busting', () => {
      const url = moduleApi.getImportUrl('/path/file.ts', true)
      expect(url).toContain('/path/file.ts')
      // 包含版本或时间戳参数
      expect(url).toMatch(/\?(v|t)=/)
    })

    it('should return path without busting when bustCache is false', () => {
      const url = moduleApi.getImportUrl('/path/file.ts', false)
      expect(url).toBe('/path/file.ts')
    })

    it('should reset version correctly', () => {
      // 先生成一个版本
      moduleApi.getImportUrl('/versioned/file.ts', true)

      // 重置
      moduleApi.resetVersion('/versioned/file.ts')

      // 没有错误即可
    })

    it('should add and get dependencies correctly', () => {
      moduleApi.addDependency('/parent.ts', '/child.ts')

      const deps = moduleApi.findDependencies('/parent.ts')
      expect(deps).toContain('/child.ts')
    })

    it('should handle clearDependencies', () => {
      moduleApi.addDependency('/a.ts', '/b.ts')

      moduleApi.clearDependencies('/a.ts')

      const deps = moduleApi.findDependencies('/a.ts')
      expect(deps).toEqual([])
    })

    it('should set exclude paths', () => {
      // 不应该抛出错误
      moduleApi.setExclude(['/node_modules'])
    })
  })

  describe('Loader edge cases', () => {
    it('should handle loadFile with silent option', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => { })

      await loader.loadFile('/non/existent/file.ts', { silent: true })

      expect(consoleSpy).not.toHaveBeenCalled()
      consoleSpy.mockRestore()
    })

    it('should log error when silent is false', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => { })

      await loader.loadFile('/non/existent/file.ts', { silent: false })

      expect(consoleSpy).toHaveBeenCalled()
      consoleSpy.mockRestore()
    })

    it('should handle loadPackage with no files', async () => {
      loader.addPackage('empty-pkg', '/path', 'npm')

      const results = await loader.loadPackage('empty-pkg')

      expect(results).toEqual([])
    })

    it('should accumulate registered count across files', async () => {
      // 由于文件不存在，这主要测试逻辑流程
      loader.addPackage('multi-file-pkg', '/path', 'npm')
      loader.addFileToPackage('multi-file-pkg', '/path/file1.ts')
      loader.addFileToPackage('multi-file-pkg', '/path/file2.ts')

      const results = await loader.loadPackage('multi-file-pkg')

      expect(results.length).toBe(2)
    })
  })

  describe('Context edge cases', () => {
    it('should return default context when not set', () => {
      // clearContext 已在 beforeEach 中调用
      // getContext 在没有上下文时返回默认值 { pkg: 'unknown', file: 'unknown' }
      const ctx = getContext()
      expect(ctx.pkg).toBe('unknown')
      expect(ctx.file).toBe('unknown')
    })

    it('should correctly set and get context', () => {
      setContext('ctx-pkg', '/ctx/file.ts')

      const ctx = getContext()
      expect(ctx.pkg).toBe('ctx-pkg')
      expect(ctx.file).toBe('/ctx/file.ts')
    })

    it('should reset to default after clearContext', () => {
      setContext('ctx-pkg', '/ctx/file.ts')
      clearContext()

      const ctx = getContext()
      expect(ctx.pkg).toBe('unknown')
      expect(ctx.file).toBe('unknown')
    })

    it('should overwrite context when set again', () => {
      setContext('pkg1', '/file1.ts')
      setContext('pkg2', '/file2.ts')

      const ctx = getContext()
      expect(ctx.pkg).toBe('pkg2')
      expect(ctx.file).toBe('/file2.ts')
    })
  })

  describe('Registry edge cases', () => {
    it('should return true when enabling already enabled component', () => {
      const id = registry.register('command', {}, 'pkg', '/file.ts')
      // 默认是启用的

      const result = registry.enable('command', id)
      expect(result).toBe(true)
    })

    it('should return true when disabling already disabled component', () => {
      const id = registry.register('command', {}, 'pkg', '/file.ts')
      registry.disable('command', id)

      const result = registry.disable('command', id)
      expect(result).toBe(true)
    })

    it('should handle sort with empty store', () => {
      // 不应该抛出错误
      registry.sort('command')
      expect(registry.getAll('command')).toEqual([])
    })

    it('should handle sort with single item', () => {
      registry.register('command', { name: 'only' }, 'pkg', '/file.ts')

      registry.sort('command')

      const items = registry.getAll('command')
      expect(items.length).toBe(1)
      expect((items[0].instance as any).name).toBe('only')
    })

    it('should handle unregisterByPackage with no components', () => {
      const count = registry.unregisterByPackage('empty-pkg')
      expect(count).toBe(0)
    })

    it('should handle unregisterByFile with no components', () => {
      const count = registry.unregisterByFile('/empty/file.ts')
      expect(count).toBe(0)
    })
  })

  describe('Type safety edge cases', () => {
    it('should handle all plugin types', () => {
      const types: PluginType[] = ['command', 'accept', 'handler', 'button', 'task']

      for (const type of types) {
        const id = registry.register(type, { type }, 'pkg', '/file.ts')
        expect(cache.instance.get(type, id)).toBeDefined()
      }

      expect(cache.instance.totalCount).toBe(5)
    })

    it('should maintain type consistency across operations', () => {
      const id = registry.register('handler', { fn: () => { } }, 'pkg', '/file.ts')

      const item = cache.instance.get('handler', id)
      expect(item?.type).toBe('handler')

      const byFile = cache.instance.getByFile('/file.ts')
      expect(byFile[0]?.type).toBe('handler')

      const byPkg = cache.instance.getByPackage('pkg')
      expect(byPkg[0]?.type).toBe('handler')
    })
  })
})
