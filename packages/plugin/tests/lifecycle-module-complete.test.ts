/**
 * api/lifecycle.ts 和 api/module.ts 完整覆盖测试
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { lifecycle } from '../src/api/lifecycle'
import { moduleApi } from '../src/api/module'
import { cache } from '../src/api/cache'
import { registry } from '../src/api/registry'

describe('lifecycle 完整覆盖', () => {
  beforeEach(() => {
    cache.clearAll()
  })

  describe('enable', () => {
    it('should throw for empty string', async () => {
      await expect(lifecycle.enable('')).rejects.toThrow('Package name must be a non-empty string')
    })

    it('should throw for whitespace only', async () => {
      await expect(lifecycle.enable('   ')).rejects.toThrow('Package name must be a non-empty string')
    })

    it('should throw for non-existent package', async () => {
      await expect(lifecycle.enable('non-existent')).rejects.toThrow('Package not found')
    })

    it('should enable all components in package', async () => {
      cache.package.add('test-pkg', {
        path: '/test/path',
        source: 'npm',
        files: new Set(['/test/file.ts']),
        status: 'disabled',
        version: '1.0.0',
      })

      // 注册一个组件
      const id = registry.register('command', { test: true }, 'test-pkg', '/test/file.ts')
      registry.disable('command', id)

      await lifecycle.enable('test-pkg')

      expect(cache.package.get('test-pkg')?.status).toBe('enabled')
      expect(registry.get('command', id)?.enabled).toBe(true)
    })
  })

  describe('disable', () => {
    it('should throw for empty string', async () => {
      await expect(lifecycle.disable('')).rejects.toThrow('Package name must be a non-empty string')
    })

    it('should throw for non-existent package', async () => {
      await expect(lifecycle.disable('non-existent')).rejects.toThrow('Package not found')
    })

    it('should disable all components in package', async () => {
      cache.package.add('test-pkg2', {
        path: '/test/path2',
        source: 'npm',
        files: new Set(['/test/file2.ts']),
        status: 'enabled',
        version: '1.0.0',
      })

      const id = registry.register('command', { test: true }, 'test-pkg2', '/test/file2.ts')

      await lifecycle.disable('test-pkg2')

      expect(cache.package.get('test-pkg2')?.status).toBe('disabled')
      expect(registry.get('command', id)?.enabled).toBe(false)
    })
  })

  describe('unload', () => {
    it('should throw for empty string', async () => {
      await expect(lifecycle.unload('')).rejects.toThrow('Package name must be a non-empty string')
    })

    it('should throw for non-existent package', async () => {
      await expect(lifecycle.unload('non-existent')).rejects.toThrow('Package not found')
    })

    it('should unload package and clear all data', async () => {
      cache.package.add('test-pkg3', {
        path: '/test/path3',
        source: 'npm',
        files: new Set(['/test/file3.ts']),
        status: 'enabled',
        version: '1.0.0',
      })

      registry.register('command', { test: true }, 'test-pkg3', '/test/file3.ts')

      await lifecycle.unload('test-pkg3')

      expect(cache.package.has('test-pkg3')).toBe(false)
      expect(registry.getByPackage('test-pkg3').length).toBe(0)
    })
  })

  describe('getStatus', () => {
    it('should return unloaded for empty string', () => {
      expect(lifecycle.getStatus('')).toBe('unloaded')
    })

    it('should return unloaded for non-existent package', () => {
      expect(lifecycle.getStatus('non-existent')).toBe('unloaded')
    })

    it('should return package status', () => {
      cache.package.add('status-pkg', {
        path: '/status/path',
        source: 'npm',
        files: new Set(),
        status: 'enabled',
        version: '1.0.0',
      })

      expect(lifecycle.getStatus('status-pkg')).toBe('enabled')
    })
  })

  describe('getLoadedPackages', () => {
    it('should return all loaded packages with component count', () => {
      cache.package.add('loaded-pkg', {
        path: '/loaded/path',
        source: 'npm',
        files: new Set(['/loaded/file.ts']),
        status: 'enabled',
        version: '2.0.0',
      })

      registry.register('command', {}, 'loaded-pkg', '/loaded/file.ts')
      registry.register('handler', {}, 'loaded-pkg', '/loaded/file.ts')

      const packages = lifecycle.getLoadedPackages()
      const pkg = packages.find(p => p.name === 'loaded-pkg')

      expect(pkg).toBeDefined()
      expect(pkg?.components).toBe(2)
      expect(pkg?.version).toBe('2.0.0')
    })
  })

  describe('isLoaded', () => {
    it('should return false for empty string', () => {
      expect(lifecycle.isLoaded('')).toBe(false)
    })

    it('should return false for non-existent package', () => {
      expect(lifecycle.isLoaded('non-existent')).toBe(false)
    })

    it('should return true for loaded package', () => {
      cache.package.add('loaded-check', {
        path: '/check',
        source: 'npm',
        files: new Set(),
        status: 'enabled',
        version: '1.0.0',
      })

      expect(lifecycle.isLoaded('loaded-check')).toBe(true)
    })
  })

  describe('isEnabled', () => {
    it('should return false for empty string', () => {
      expect(lifecycle.isEnabled('')).toBe(false)
    })

    it('should return false for non-existent package', () => {
      expect(lifecycle.isEnabled('non-existent')).toBe(false)
    })

    it('should return true for enabled package', () => {
      cache.package.add('enabled-check', {
        path: '/enabled',
        source: 'npm',
        files: new Set(),
        status: 'enabled',
        version: '1.0.0',
      })

      expect(lifecycle.isEnabled('enabled-check')).toBe(true)
    })

    it('should return false for disabled package', () => {
      cache.package.add('disabled-check', {
        path: '/disabled',
        source: 'npm',
        files: new Set(),
        status: 'disabled',
        version: '1.0.0',
      })

      expect(lifecycle.isEnabled('disabled-check')).toBe(false)
    })
  })
})

describe('moduleApi 完整覆盖', () => {
  beforeEach(() => {
    cache.clearAll()
    moduleApi.clear()
  })

  describe('isDev', () => {
    it('should return boolean', () => {
      expect(typeof moduleApi.isDev).toBe('boolean')
    })
  })

  describe('setExclude', () => {
    it('should set exclude paths', () => {
      expect(() => moduleApi.setExclude(['/path/one', '/path/two'])).not.toThrow()
    })

    it('should filter empty paths', () => {
      expect(() => moduleApi.setExclude(['', '   ', '/valid/path'])).not.toThrow()
    })
  })

  describe('getImportUrl', () => {
    it('should return path as-is when bust is false', () => {
      const result = moduleApi.getImportUrl('/some/path.ts', false)
      expect(result).toBe('/some/path.ts')
    })

    it('should add version suffix when bust is true', () => {
      const result = moduleApi.getImportUrl('/some/versioned.ts', true)
      expect(result).toMatch(/\/some\/versioned\.ts\?[vt]=/)
    })

    it('should increment version on subsequent calls', () => {
      const path = '/incrementing.ts'
      const first = moduleApi.getImportUrl(path, true)
      const second = moduleApi.getImportUrl(path, true)
      expect(first).not.toBe(second)
    })
  })

  describe('resetVersion', () => {
    it('should reset version for path', () => {
      moduleApi.getImportUrl('/reset.ts', true)
      const result = moduleApi.resetVersion('/reset.ts')
      expect(result).toBe(true)
    })

    it('should return false for non-existent path', () => {
      const result = moduleApi.resetVersion('/non-existent.ts')
      expect(result).toBe(false)
    })
  })

  describe('clearCache', () => {
    it('should clear cache without error', async () => {
      await expect(moduleApi.clearCache('/some/file.ts')).resolves.not.toThrow()
    })

    it('should handle recursive clearing', async () => {
      await expect(moduleApi.clearCache('/some/file.ts', true)).resolves.not.toThrow()
    })
  })

  describe('clearCaches', () => {
    it('should clear multiple caches', async () => {
      await expect(moduleApi.clearCaches(['/a.ts', '/b.ts'])).resolves.not.toThrow()
    })

    it('should filter empty strings', async () => {
      await expect(moduleApi.clearCaches(['', '   ', '/valid.ts'])).resolves.not.toThrow()
    })
  })

  describe('findDependentModules', () => {
    it('should return array', async () => {
      const result = await moduleApi.findDependentModules('/some/file.ts')
      expect(Array.isArray(result)).toBe(true)
    })
  })

  describe('dependency management', () => {
    it('should add dependency', () => {
      expect(() => moduleApi.addDependency('/from.ts', '/to.ts')).not.toThrow()
    })

    it('should find dependencies', () => {
      moduleApi.addDependency('/a.ts', '/b.ts')
      const deps = moduleApi.findDependencies('/a.ts')
      expect(deps).toContain('/b.ts')
    })

    it('should find dependents', () => {
      moduleApi.addDependency('/c.ts', '/d.ts')
      const dependents = moduleApi.findDependents('/d.ts')
      expect(dependents).toContain('/c.ts')
    })

    it('should clear dependencies', () => {
      moduleApi.addDependency('/e.ts', '/f.ts')
      moduleApi.clearDependencies('/e.ts')
      const deps = moduleApi.findDependencies('/e.ts')
      expect(deps).not.toContain('/f.ts')
    })

    it('should clear all with clear()', () => {
      moduleApi.addDependency('/x.ts', '/y.ts')
      moduleApi.clear()
      expect(moduleApi.findDependencies('/x.ts').length).toBe(0)
    })
  })

  describe('getPackageByFile', () => {
    it('should return undefined for non-existent file', () => {
      expect(moduleApi.getPackageByFile('/non-existent.ts')).toBeNull()
    })

    it('should return package name for registered file', () => {
      cache.package.add('file-pkg', {
        path: '/file',
        source: 'npm',
        files: new Set(['/file/test.ts']),
        status: 'enabled',
        version: '1.0.0',
      })

      expect(moduleApi.getPackageByFile('/file/test.ts')).toBe('file-pkg')
    })
  })

  describe('getFilesByPackage', () => {
    it('should return empty array for non-existent package', () => {
      const files = moduleApi.getFilesByPackage('non-existent')
      expect(files).toEqual([])
    })

    it('should return files for registered package', () => {
      cache.package.add('files-pkg', {
        path: '/files',
        source: 'npm',
        files: new Set(['/files/a.ts', '/files/b.ts']),
        status: 'enabled',
        version: '1.0.0',
      })

      const files = moduleApi.getFilesByPackage('files-pkg')
      expect(files).toContain('/files/a.ts')
      expect(files).toContain('/files/b.ts')
    })
  })
})
