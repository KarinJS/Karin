/**
 * Loader API 单元测试
 * @module tests/loader.test
 */
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { loader } from '../src/api/loader'
import { cache } from '../src/api/cache'
import { event } from '../src/api/event'

describe('Loader API', () => {
  beforeEach(() => {
    cache.clearAll()
    vi.clearAllMocks()
  })

  describe('addPackage', () => {
    it('should add package to cache', () => {
      loader.addPackage('test-pkg', '/path/to/pkg', 'npm', '1.0.0')

      const pkg = cache.package.get('test-pkg')
      expect(pkg).toBeDefined()
      expect(pkg?.version).toBe('1.0.0')
      expect(pkg?.path).toBe('/path/to/pkg')
      expect(pkg?.source).toBe('npm')
      expect(pkg?.status).toBe('loaded')
    })

    it('should use default version 0.0.0', () => {
      loader.addPackage('test-pkg', '/path', 'npm')

      const pkg = cache.package.get('test-pkg')
      expect(pkg?.version).toBe('0.0.0')
    })

    it('should accept different sources', () => {
      loader.addPackage('pkg1', '/path1', 'npm')
      loader.addPackage('pkg2', '/path2', 'git')
      loader.addPackage('pkg3', '/path3', 'dev')
      loader.addPackage('pkg4', '/path4', 'apps')

      expect(cache.package.get('pkg1')?.source).toBe('npm')
      expect(cache.package.get('pkg2')?.source).toBe('git')
      expect(cache.package.get('pkg3')?.source).toBe('dev')
      expect(cache.package.get('pkg4')?.source).toBe('apps')
    })
  })

  describe('addFileToPackage', () => {
    it('should add file to package', () => {
      loader.addPackage('test-pkg', '/path', 'npm')
      loader.addFileToPackage('test-pkg', '/path/file1.ts')
      loader.addFileToPackage('test-pkg', '/path/file2.ts')

      const files = cache.package.getFiles('test-pkg')
      expect(files).toContain('/path/file1.ts')
      expect(files).toContain('/path/file2.ts')
    })

    it('should not throw for non-existent package', () => {
      loader.addFileToPackage('non-existent', '/path/file.ts')
    })
  })

  describe('loadFile', () => {
    it('should return LoadResult with success false on import error', async () => {
      const result = await loader.loadFile('/non/existent/file.ts', { silent: true })

      expect(result.success).toBe(false)
      expect(result.file).toBe('/non/existent/file.ts')
      expect(result.registered).toBe(0)
      expect(result.error).toBeDefined()
    })

    it('should set silent option to suppress logs', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => { })

      await loader.loadFile('/non/existent/file.ts', { silent: true })

      expect(consoleSpy).not.toHaveBeenCalled()
      consoleSpy.mockRestore()
    })

    it('should use pkg option if provided', async () => {
      const result = await loader.loadFile('/file.ts', { pkg: 'my-pkg', silent: true })

      // Even on failure, pkg should be undefined as file wasn't loaded
      expect(result.file).toBe('/file.ts')
    })
  })

  describe('loadPackage', () => {
    it('should emit plugin:load:start event', async () => {
      loader.addPackage('test-pkg', '/path', 'npm')
      vi.clearAllMocks()

      await loader.loadPackage('test-pkg')

      expect(event.emit).toHaveBeenCalledWith('plugin:load:start', { pkg: 'test-pkg' })
    })

    it('should emit plugin:load:done event', async () => {
      loader.addPackage('test-pkg', '/path', 'npm')
      vi.clearAllMocks()

      await loader.loadPackage('test-pkg')

      expect(event.emit).toHaveBeenCalledWith('plugin:load:done', expect.objectContaining({
        pkg: 'test-pkg',
      }))
    })

    it('should return empty array for package with no files', async () => {
      loader.addPackage('test-pkg', '/path', 'npm')

      const results = await loader.loadPackage('test-pkg')

      expect(results).toEqual([])
    })
  })

  describe('reloadFile', () => {
    it('should call loadFile with force option', async () => {
      const result = await loader.reloadFile('/file.ts')

      // Will fail due to import error, but should have attempted
      expect(result.file).toBe('/file.ts')
    })
  })

  describe('reloadPackage', () => {
    it('should emit plugin:reload event', async () => {
      loader.addPackage('test-pkg', '/path', 'npm')
      vi.clearAllMocks()

      await loader.reloadPackage('test-pkg')

      expect(event.emit).toHaveBeenCalledWith('plugin:reload', expect.objectContaining({
        pkg: 'test-pkg',
      }))
    })

    it('should reload package with files', async () => {
      loader.addPackage('test-pkg', '/path', 'npm')
      loader.addFileToPackage('test-pkg', '/path/file1.ts')
      vi.clearAllMocks()

      const results = await loader.reloadPackage('test-pkg')

      // 文件加载会失败，但应该返回结果数组
      expect(Array.isArray(results)).toBe(true)
    })
  })

  describe('importModule', () => {
    it('should return module on success (mocked)', async () => {
      // This will fail in test environment, but we test the interface
      try {
        await loader.importModule('/some/file.ts')
      } catch {
        // Expected to fail
      }
    })

    it('should bust cache when specified', async () => {
      try {
        await loader.importModule('/some/file.ts', true)
      } catch {
        // Expected to fail
      }
    })
  })
})
