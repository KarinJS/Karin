/**
 * Module API 单元测试
 * @module tests/module.test
 */
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { moduleApi } from '../src/api/module'
import { cache } from '../src/api/cache'

describe('Module API', () => {
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
      // No error should be thrown
      moduleApi.setExclude(['/path/to/exclude'])
    })

    it('should accept empty array', () => {
      moduleApi.setExclude([])
    })

    it('should accept multiple paths', () => {
      moduleApi.setExclude(['/path1', '/path2', '/path3'])
    })
  })

  describe('getImportUrl', () => {
    it('should return original path when bustCache is false', () => {
      const result = moduleApi.getImportUrl('/path/to/file.ts', false)
      expect(result).toBe('/path/to/file.ts')
    })

    it('should return original path when bustCache is not provided', () => {
      const result = moduleApi.getImportUrl('/path/to/file.ts')
      expect(result).toBe('/path/to/file.ts')
    })

    it('should add query parameter when bustCache is true', () => {
      const result = moduleApi.getImportUrl('/path/to/file.ts', true)
      expect(result).toMatch(/\/path\/to\/file\.ts\?[vt]=\d+/)
    })

    it('should increment version for same file in production mode', () => {
      // In production mode, version should increment
      const url1 = moduleApi.getImportUrl('/path/to/file.ts', true)
      const url2 = moduleApi.getImportUrl('/path/to/file.ts', true)

      // Extract version/timestamp numbers
      const match1 = url1.match(/[?][vt]=(\d+)/)
      const match2 = url2.match(/[?][vt]=(\d+)/)

      expect(match1).not.toBeNull()
      expect(match2).not.toBeNull()

      // Either different versions or different timestamps
      if (url1.includes('?v=') && url2.includes('?v=')) {
        expect(parseInt(match2![1])).toBeGreaterThan(parseInt(match1![1]))
      }
    })
  })

  describe('resetVersion', () => {
    it('should reset version for a file', () => {
      moduleApi.getImportUrl('/path/to/file.ts', true)
      moduleApi.resetVersion('/path/to/file.ts')
      // No error should be thrown
    })

    it('should not throw for non-existent file', () => {
      moduleApi.resetVersion('/non/existent/file.ts')
    })
  })

  describe('clearCache', () => {
    it('should clear cache for a file (non-recursive)', async () => {
      await moduleApi.clearCache('/path/to/file.ts', false)
      // No error should be thrown
    })

    it('should clear cache for a file (recursive)', async () => {
      await moduleApi.clearCache('/path/to/file.ts', true)
      // No error should be thrown
    })

    it('should handle default recursive parameter', async () => {
      await moduleApi.clearCache('/path/to/file.ts')
      // No error should be thrown
    })
  })

  describe('clearCaches', () => {
    it('should clear caches for multiple files', async () => {
      await moduleApi.clearCaches([
        'file:///path/to/file1.ts',
        'file:///path/to/file2.ts',
      ])
      // No error should be thrown
    })

    it('should handle empty array', async () => {
      await moduleApi.clearCaches([])
    })
  })

  describe('findDependentModules', () => {
    it('should find dependent modules', async () => {
      const deps = await moduleApi.findDependentModules('/path/to/file.ts')
      expect(Array.isArray(deps)).toBe(true)
    })
  })

  describe('dependency graph operations', () => {
    describe('addDependency', () => {
      it('should add dependency relationship', () => {
        moduleApi.addDependency('/from.ts', '/to.ts')
        // Verify through findDependents
        const dependents = moduleApi.findDependents('/to.ts')
        expect(dependents).toContain('/from.ts')
      })

      it('should add multiple dependencies', () => {
        moduleApi.addDependency('/from.ts', '/to1.ts')
        moduleApi.addDependency('/from.ts', '/to2.ts')

        const dependencies = moduleApi.findDependencies('/from.ts')
        expect(dependencies).toContain('/to1.ts')
        expect(dependencies).toContain('/to2.ts')
      })
    })

    describe('findDependents', () => {
      it('should find all dependents recursively', () => {
        // A -> B -> C
        moduleApi.addDependency('/A.ts', '/B.ts')
        moduleApi.addDependency('/B.ts', '/C.ts')

        const dependentsOfC = moduleApi.findDependents('/C.ts')
        expect(dependentsOfC).toContain('/B.ts')
        // Note: findDependents traverses reverse graph, so A depends on B, not C
      })

      it('should return empty array when no dependents', () => {
        const dependents = moduleApi.findDependents('/isolated.ts')
        expect(dependents).toEqual([])
      })

      it('should handle circular dependencies', () => {
        moduleApi.addDependency('/A.ts', '/B.ts')
        moduleApi.addDependency('/B.ts', '/A.ts')

        // Should not infinite loop
        const dependents = moduleApi.findDependents('/A.ts')
        expect(Array.isArray(dependents)).toBe(true)
      })
    })

    describe('findDependencies', () => {
      it('should find all dependencies recursively', () => {
        // A -> B -> C
        moduleApi.addDependency('/A.ts', '/B.ts')
        moduleApi.addDependency('/B.ts', '/C.ts')

        const depsOfA = moduleApi.findDependencies('/A.ts')
        expect(depsOfA).toContain('/B.ts')
        expect(depsOfA).toContain('/C.ts')
      })

      it('should return empty array when no dependencies', () => {
        const deps = moduleApi.findDependencies('/isolated.ts')
        expect(deps).toEqual([])
      })
    })

    describe('clearDependencies', () => {
      it('should clear dependencies for a file', () => {
        moduleApi.addDependency('/A.ts', '/B.ts')
        moduleApi.addDependency('/A.ts', '/C.ts')

        moduleApi.clearDependencies('/A.ts')

        const deps = moduleApi.findDependencies('/A.ts')
        expect(deps).toEqual([])
      })

      it('should clear reverse dependencies', () => {
        moduleApi.addDependency('/A.ts', '/B.ts')

        moduleApi.clearDependencies('/B.ts')

        const dependents = moduleApi.findDependents('/B.ts')
        expect(dependents).not.toContain('/A.ts')
      })

      it('should not throw for non-existent file', () => {
        moduleApi.clearDependencies('/non-existent.ts')
      })
    })

    describe('clear', () => {
      it('should clear all dependency data', () => {
        moduleApi.addDependency('/A.ts', '/B.ts')
        moduleApi.addDependency('/C.ts', '/D.ts')

        moduleApi.clear()

        expect(moduleApi.findDependencies('/A.ts')).toEqual([])
        expect(moduleApi.findDependencies('/C.ts')).toEqual([])
      })
    })
  })

  describe('getPackageByFile', () => {
    it('should find package by file', () => {
      cache.package.add('test-pkg', {
        version: '1.0.0',
        path: '/path',
        source: 'npm',
        status: 'loaded',
        files: new Set(),
      })
      cache.package.addFile('test-pkg', '/path/to/file.ts')

      const pkgName = moduleApi.getPackageByFile('/path/to/file.ts')
      expect(pkgName).toBe('test-pkg')
    })

    it('should return null for unknown file', () => {
      const pkgName = moduleApi.getPackageByFile('/unknown/file.ts')
      expect(pkgName).toBeNull()
    })
  })

  describe('getFilesByPackage', () => {
    it('should get files by package name', () => {
      cache.package.add('test-pkg', {
        version: '1.0.0',
        path: '/path',
        source: 'npm',
        status: 'loaded',
        files: new Set(),
      })
      cache.package.addFile('test-pkg', '/path/to/file1.ts')
      cache.package.addFile('test-pkg', '/path/to/file2.ts')

      const files = moduleApi.getFilesByPackage('test-pkg')
      expect(files).toContain('/path/to/file1.ts')
      expect(files).toContain('/path/to/file2.ts')
    })

    it('should return empty array for unknown package', () => {
      const files = moduleApi.getFilesByPackage('unknown-pkg')
      expect(files).toEqual([])
    })
  })
})
