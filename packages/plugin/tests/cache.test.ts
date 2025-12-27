/**
 * Cache API 单元测试
 * @module tests/cache.test
 */
import { describe, it, expect, beforeEach } from 'vitest'
import { cache } from '../src/api/cache'
import type { PluginType, RegistryItem } from '../src/types'

describe('Cache API', () => {
  beforeEach(() => {
    cache.clearAll()
  })

  describe('PackageStore', () => {
    const mockPkg = {
      version: '1.0.0',
      path: '/path/to/pkg',
      source: 'npm' as const,
      status: 'loaded' as const,
      files: new Set<string>(),
    }

    describe('add / get / has', () => {
      it('should add and get a package', () => {
        cache.package.add('test-pkg', mockPkg)
        const pkg = cache.package.get('test-pkg')

        expect(pkg).toBeDefined()
        expect(pkg?.name).toBe('test-pkg')
        expect(pkg?.version).toBe('1.0.0')
      })

      it('should return undefined for non-existent package', () => {
        expect(cache.package.get('non-existent')).toBeUndefined()
      })

      it('should check if package exists', () => {
        expect(cache.package.has('test-pkg')).toBe(false)
        cache.package.add('test-pkg', mockPkg)
        expect(cache.package.has('test-pkg')).toBe(true)
      })
    })

    describe('delete', () => {
      it('should delete a package', () => {
        cache.package.add('test-pkg', mockPkg)
        expect(cache.package.has('test-pkg')).toBe(true)

        const result = cache.package.delete('test-pkg')
        expect(result).toBe(true)
        expect(cache.package.has('test-pkg')).toBe(false)
      })

      it('should return false when deleting non-existent package', () => {
        expect(cache.package.delete('non-existent')).toBe(false)
      })
    })

    describe('getAll / names', () => {
      it('should get all packages', () => {
        cache.package.add('pkg1', mockPkg)
        cache.package.add('pkg2', { ...mockPkg, version: '2.0.0' })

        const all = cache.package.getAll()
        expect(all.size).toBe(2)
        expect(all.get('pkg1')?.version).toBe('1.0.0')
        expect(all.get('pkg2')?.version).toBe('2.0.0')
      })

      it('should return a copy of packages map', () => {
        cache.package.add('pkg1', mockPkg)
        const all = cache.package.getAll()
        all.delete('pkg1')
        expect(cache.package.has('pkg1')).toBe(true)
      })

      it('should get all package names', () => {
        cache.package.add('pkg1', mockPkg)
        cache.package.add('pkg2', mockPkg)

        const names = cache.package.names()
        expect(names).toContain('pkg1')
        expect(names).toContain('pkg2')
        expect(names.length).toBe(2)
      })
    })

    describe('setStatus', () => {
      it('should update package status', () => {
        cache.package.add('test-pkg', mockPkg)
        cache.package.setStatus('test-pkg', 'enabled')

        const pkg = cache.package.get('test-pkg')
        expect(pkg?.status).toBe('enabled')
      })

      it('should do nothing for non-existent package', () => {
        cache.package.setStatus('non-existent', 'enabled')
        // No error should be thrown
      })
    })

    describe('file operations', () => {
      it('should add file to package', () => {
        cache.package.add('test-pkg', mockPkg)
        cache.package.addFile('test-pkg', '/path/to/file.ts')

        const files = cache.package.getFiles('test-pkg')
        expect(files).toContain('/path/to/file.ts')
      })

      it('should remove file from package', () => {
        cache.package.add('test-pkg', mockPkg)
        cache.package.addFile('test-pkg', '/path/to/file.ts')
        cache.package.removeFile('test-pkg', '/path/to/file.ts')

        const files = cache.package.getFiles('test-pkg')
        expect(files).not.toContain('/path/to/file.ts')
      })

      it('should return empty array for non-existent package files', () => {
        expect(cache.package.getFiles('non-existent')).toEqual([])
      })

      it('should do nothing when adding file to non-existent package', () => {
        cache.package.addFile('non-existent', '/path/to/file.ts')
        // No error should be thrown
      })

      it('should do nothing when removing file from non-existent package', () => {
        cache.package.removeFile('non-existent', '/path/to/file.ts')
        // No error should be thrown
      })
    })

    describe('findByFile', () => {
      it('should find package by file path', () => {
        cache.package.add('test-pkg', mockPkg)
        cache.package.addFile('test-pkg', '/path/to/file.ts')

        expect(cache.package.findByFile('/path/to/file.ts')).toBe('test-pkg')
      })

      it('should return null for non-existent file', () => {
        expect(cache.package.findByFile('/non/existent/file.ts')).toBeNull()
      })

      it('should find correct package when multiple packages exist', () => {
        // 使用独立的 files Set 避免共享状态
        cache.package.add('pkg1', {
          ...mockPkg,
          files: new Set<string>(),
        })
        cache.package.add('pkg2', {
          ...mockPkg,
          files: new Set<string>(),
        })
        cache.package.addFile('pkg1', '/path/to/file1.ts')
        cache.package.addFile('pkg2', '/path/to/file2.ts')

        expect(cache.package.findByFile('/path/to/file1.ts')).toBe('pkg1')
        expect(cache.package.findByFile('/path/to/file2.ts')).toBe('pkg2')
      })
    })

    describe('clear / size', () => {
      it('should clear all packages', () => {
        cache.package.add('pkg1', mockPkg)
        cache.package.add('pkg2', mockPkg)
        cache.package.clear()

        expect(cache.package.size).toBe(0)
      })

      it('should return correct size', () => {
        expect(cache.package.size).toBe(0)
        cache.package.add('pkg1', mockPkg)
        expect(cache.package.size).toBe(1)
        cache.package.add('pkg2', mockPkg)
        expect(cache.package.size).toBe(2)
      })
    })
  })

  describe('InstanceStore', () => {
    const mockItem = (id: string, pkg = 'test-pkg', file = '/path/to/file.ts'): RegistryItem => ({
      id,
      type: 'command',
      pkg,
      file,
      priority: 0,
      enabled: true,
      instance: {},
    })

    describe('add / get / delete', () => {
      it('should add and get an instance', () => {
        const item = mockItem('cmd-1')
        cache.instance.add('command', 'cmd-1', item)

        const retrieved = cache.instance.get('command', 'cmd-1')
        expect(retrieved).toBeDefined()
        expect(retrieved?.id).toBe('cmd-1')
      })

      it('should return undefined for non-existent instance', () => {
        expect(cache.instance.get('command', 'non-existent')).toBeUndefined()
      })

      it('should delete an instance', () => {
        cache.instance.add('command', 'cmd-1', mockItem('cmd-1'))
        expect(cache.instance.delete('command', 'cmd-1')).toBe(true)
        expect(cache.instance.get('command', 'cmd-1')).toBeUndefined()
      })

      it('should return false when deleting non-existent instance', () => {
        expect(cache.instance.delete('command', 'non-existent')).toBe(false)
      })
    })

    describe('getStore / getAll', () => {
      it('should get store for a type', () => {
        cache.instance.add('command', 'cmd-1', mockItem('cmd-1'))
        const store = cache.instance.getStore('command')

        expect(store).toBeInstanceOf(Map)
        expect(store.size).toBe(1)
      })

      it('should return empty map for unknown type', () => {
        const store = cache.instance.getStore('unknown' as PluginType)
        expect(store).toBeInstanceOf(Map)
        expect(store.size).toBe(0)
      })

      it('should get all instances of a type', () => {
        cache.instance.add('command', 'cmd-1', mockItem('cmd-1'))
        cache.instance.add('command', 'cmd-2', mockItem('cmd-2'))

        const all = cache.instance.getAll('command')
        expect(all.length).toBe(2)
      })
    })

    describe('getByPackage / getByFile', () => {
      it('should get instances by package', () => {
        cache.instance.add('command', 'cmd-1', mockItem('cmd-1', 'pkg1'))
        cache.instance.add('accept', 'acc-1', mockItem('acc-1', 'pkg1'))
        cache.instance.add('command', 'cmd-2', mockItem('cmd-2', 'pkg2'))

        const items = cache.instance.getByPackage('pkg1')
        expect(items.length).toBe(2)
        expect(items.every(i => i.pkg === 'pkg1')).toBe(true)
      })

      it('should get instances by file', () => {
        cache.instance.add('command', 'cmd-1', mockItem('cmd-1', 'pkg1', '/file1.ts'))
        cache.instance.add('accept', 'acc-1', mockItem('acc-1', 'pkg1', '/file1.ts'))
        cache.instance.add('command', 'cmd-2', mockItem('cmd-2', 'pkg1', '/file2.ts'))

        const items = cache.instance.getByFile('/file1.ts')
        expect(items.length).toBe(2)
        expect(items.every(i => i.file === '/file1.ts')).toBe(true)
      })
    })

    describe('deleteByPackage / deleteByFile', () => {
      it('should delete instances by package', () => {
        cache.instance.add('command', 'cmd-1', mockItem('cmd-1', 'pkg1'))
        cache.instance.add('accept', 'acc-1', mockItem('acc-1', 'pkg1'))
        cache.instance.add('command', 'cmd-2', mockItem('cmd-2', 'pkg2'))

        const count = cache.instance.deleteByPackage('pkg1')
        expect(count).toBe(2)
        expect(cache.instance.getByPackage('pkg1').length).toBe(0)
        expect(cache.instance.getByPackage('pkg2').length).toBe(1)
      })

      it('should delete instances by file', () => {
        cache.instance.add('command', 'cmd-1', mockItem('cmd-1', 'pkg1', '/file1.ts'))
        cache.instance.add('accept', 'acc-1', mockItem('acc-1', 'pkg1', '/file1.ts'))
        cache.instance.add('command', 'cmd-2', mockItem('cmd-2', 'pkg1', '/file2.ts'))

        const count = cache.instance.deleteByFile('/file1.ts')
        expect(count).toBe(2)
        expect(cache.instance.getByFile('/file1.ts').length).toBe(0)
        expect(cache.instance.getByFile('/file2.ts').length).toBe(1)
      })
    })

    describe('clearType / clear', () => {
      it('should clear specific type', () => {
        cache.instance.add('command', 'cmd-1', mockItem('cmd-1'))
        cache.instance.add('accept', 'acc-1', mockItem('acc-1'))

        cache.instance.clearType('command')
        expect(cache.instance.count('command')).toBe(0)
        expect(cache.instance.count('accept')).toBe(1)
      })

      it('should clear all instances', () => {
        cache.instance.add('command', 'cmd-1', mockItem('cmd-1'))
        cache.instance.add('accept', 'acc-1', mockItem('acc-1'))

        cache.instance.clear()
        expect(cache.instance.totalCount).toBe(0)
      })
    })

    describe('count / totalCount', () => {
      it('should count instances by type', () => {
        cache.instance.add('command', 'cmd-1', mockItem('cmd-1'))
        cache.instance.add('command', 'cmd-2', mockItem('cmd-2'))
        cache.instance.add('accept', 'acc-1', mockItem('acc-1'))

        expect(cache.instance.count('command')).toBe(2)
        expect(cache.instance.count('accept')).toBe(1)
      })

      it('should return 0 for empty type', () => {
        expect(cache.instance.count('command')).toBe(0)
      })

      it('should return total count', () => {
        cache.instance.add('command', 'cmd-1', mockItem('cmd-1'))
        cache.instance.add('accept', 'acc-1', mockItem('acc-1'))
        cache.instance.add('handler', 'h-1', mockItem('h-1'))

        expect(cache.instance.totalCount).toBe(3)
      })
    })
  })

  describe('DataStore', () => {
    describe('set / get / has / delete', () => {
      it('should set and get data', () => {
        cache.data.set('key1', { value: 123 })
        expect(cache.data.get<{ value: number }>('key1')).toEqual({ value: 123 })
      })

      it('should return undefined for non-existent key', () => {
        expect(cache.data.get('non-existent')).toBeUndefined()
      })

      it('should check if key exists', () => {
        expect(cache.data.has('key1')).toBe(false)
        cache.data.set('key1', 'value')
        expect(cache.data.has('key1')).toBe(true)
      })

      it('should delete data', () => {
        cache.data.set('key1', 'value')
        expect(cache.data.delete('key1')).toBe(true)
        expect(cache.data.has('key1')).toBe(false)
      })

      it('should return false when deleting non-existent key', () => {
        expect(cache.data.delete('non-existent')).toBe(false)
      })
    })

    describe('clear', () => {
      it('should clear all data', () => {
        cache.data.set('key1', 'value1')
        cache.data.set('key2', 'value2')
        cache.data.clear()

        expect(cache.data.has('key1')).toBe(false)
        expect(cache.data.has('key2')).toBe(false)
      })
    })
  })

  describe('clearAll', () => {
    it('should clear all caches', () => {
      // Add some data to each store
      cache.package.add('pkg1', {
        version: '1.0.0',
        path: '/path',
        source: 'npm',
        status: 'loaded',
        files: new Set(),
      })
      cache.instance.add('command', 'cmd-1', {
        id: 'cmd-1',
        type: 'command',
        pkg: 'pkg1',
        file: '/file.ts',
        priority: 0,
        enabled: true,
        instance: {},
      })
      cache.data.set('key1', 'value')

      cache.clearAll()

      expect(cache.package.size).toBe(0)
      expect(cache.instance.totalCount).toBe(0)
      expect(cache.data.has('key1')).toBe(false)
    })
  })
})
