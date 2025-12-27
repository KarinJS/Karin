/**
 * Lifecycle API 单元测试
 * @module tests/lifecycle.test
 */
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { lifecycle } from '../src/api/lifecycle'
import { cache } from '../src/api/cache'
import { registry } from '../src/api/registry'
import { event } from '../src/api/event'

describe('Lifecycle API', () => {
  beforeEach(() => {
    cache.clearAll()
    vi.clearAllMocks()
  })

  const addTestPackage = (name: string, status = 'loaded' as const) => {
    cache.package.add(name, {
      version: '1.0.0',
      path: `/path/to/${name}`,
      source: 'npm',
      status,
      files: new Set(),
    })
  }

  describe('enable', () => {
    it('should enable a package', async () => {
      addTestPackage('test-pkg')
      registry.register('command', {}, 'test-pkg', '/file.ts')

      await lifecycle.enable('test-pkg')

      const pkg = cache.package.get('test-pkg')
      expect(pkg?.status).toBe('enabled')
    })

    it('should enable all components in package', async () => {
      addTestPackage('test-pkg')
      const id1 = registry.register('command', {}, 'test-pkg', '/file.ts')
      const id2 = registry.register('accept', {}, 'test-pkg', '/file.ts')

      // Disable first
      registry.disable('command', id1)
      registry.disable('accept', id2)

      await lifecycle.enable('test-pkg')

      expect(cache.instance.get('command', id1)?.enabled).toBe(true)
      expect(cache.instance.get('accept', id2)?.enabled).toBe(true)
    })

    it('should emit plugin:enable event', async () => {
      addTestPackage('test-pkg')
      vi.clearAllMocks()

      await lifecycle.enable('test-pkg')

      expect(event.emit).toHaveBeenCalledWith('plugin:enable', { pkg: 'test-pkg' })
    })

    it('should throw for non-existent package', async () => {
      await expect(lifecycle.enable('non-existent')).rejects.toThrow('Package not found')
    })
  })

  describe('disable', () => {
    it('should disable a package', async () => {
      addTestPackage('test-pkg')

      await lifecycle.disable('test-pkg')

      const pkg = cache.package.get('test-pkg')
      expect(pkg?.status).toBe('disabled')
    })

    it('should disable all components in package', async () => {
      addTestPackage('test-pkg')
      const id1 = registry.register('command', {}, 'test-pkg', '/file.ts')
      const id2 = registry.register('accept', {}, 'test-pkg', '/file.ts')

      await lifecycle.disable('test-pkg')

      expect(cache.instance.get('command', id1)?.enabled).toBe(false)
      expect(cache.instance.get('accept', id2)?.enabled).toBe(false)
    })

    it('should emit plugin:disable event', async () => {
      addTestPackage('test-pkg')
      vi.clearAllMocks()

      await lifecycle.disable('test-pkg')

      expect(event.emit).toHaveBeenCalledWith('plugin:disable', { pkg: 'test-pkg' })
    })

    it('should throw for non-existent package', async () => {
      await expect(lifecycle.disable('non-existent')).rejects.toThrow('Package not found')
    })
  })

  describe('unload', () => {
    it('should unload a package', async () => {
      addTestPackage('test-pkg')
      cache.package.addFile('test-pkg', '/file.ts')
      registry.register('command', {}, 'test-pkg', '/file.ts')

      await lifecycle.unload('test-pkg')

      expect(cache.package.has('test-pkg')).toBe(false)
    })

    it('should unregister all components', async () => {
      addTestPackage('test-pkg')
      registry.register('command', {}, 'test-pkg', '/file.ts')
      registry.register('accept', {}, 'test-pkg', '/file.ts')

      await lifecycle.unload('test-pkg')

      expect(cache.instance.getByPackage('test-pkg').length).toBe(0)
    })

    it('should emit plugin:unload event', async () => {
      addTestPackage('test-pkg')
      vi.clearAllMocks()

      await lifecycle.unload('test-pkg')

      expect(event.emit).toHaveBeenCalledWith('plugin:unload', { pkg: 'test-pkg' })
    })

    it('should throw for non-existent package', async () => {
      await expect(lifecycle.unload('non-existent')).rejects.toThrow('Package not found')
    })
  })

  describe('getStatus', () => {
    it('should return package status', () => {
      addTestPackage('test-pkg', 'enabled')

      expect(lifecycle.getStatus('test-pkg')).toBe('enabled')
    })

    it('should return unloaded for non-existent package', () => {
      expect(lifecycle.getStatus('non-existent')).toBe('unloaded')
    })

    it('should return correct status after changes', async () => {
      addTestPackage('test-pkg', 'loaded')

      expect(lifecycle.getStatus('test-pkg')).toBe('loaded')

      await lifecycle.enable('test-pkg')
      expect(lifecycle.getStatus('test-pkg')).toBe('enabled')

      await lifecycle.disable('test-pkg')
      expect(lifecycle.getStatus('test-pkg')).toBe('disabled')
    })
  })

  describe('getLoadedPackages', () => {
    it('should return all loaded packages', () => {
      addTestPackage('pkg1')
      addTestPackage('pkg2')

      const packages = lifecycle.getLoadedPackages()

      expect(packages.length).toBe(2)
      expect(packages.map(p => p.name)).toContain('pkg1')
      expect(packages.map(p => p.name)).toContain('pkg2')
    })

    it('should return empty array when no packages loaded', () => {
      expect(lifecycle.getLoadedPackages()).toEqual([])
    })

    it('should include correct package info', () => {
      cache.package.add('test-pkg', {
        version: '2.0.0',
        path: '/custom/path',
        source: 'git',
        status: 'enabled',
        files: new Set(),
      })
      cache.package.addFile('test-pkg', '/file1.ts')
      cache.package.addFile('test-pkg', '/file2.ts')
      registry.register('command', {}, 'test-pkg', '/file1.ts')

      const packages = lifecycle.getLoadedPackages()
      const pkg = packages.find(p => p.name === 'test-pkg')

      expect(pkg).toBeDefined()
      expect(pkg?.version).toBe('2.0.0')
      expect(pkg?.path).toBe('/custom/path')
      expect(pkg?.status).toBe('enabled')
      expect(pkg?.files.length).toBe(2)
      expect(pkg?.components).toBe(1)
    })
  })

  describe('isLoaded', () => {
    it('should return true for loaded package', () => {
      addTestPackage('test-pkg')
      expect(lifecycle.isLoaded('test-pkg')).toBe(true)
    })

    it('should return false for non-existent package', () => {
      expect(lifecycle.isLoaded('non-existent')).toBe(false)
    })
  })

  describe('isEnabled', () => {
    it('should return true for enabled package', () => {
      addTestPackage('test-pkg', 'enabled')
      expect(lifecycle.isEnabled('test-pkg')).toBe(true)
    })

    it('should return false for disabled package', () => {
      addTestPackage('test-pkg', 'disabled')
      expect(lifecycle.isEnabled('test-pkg')).toBe(false)
    })

    it('should return false for loaded but not enabled package', () => {
      addTestPackage('test-pkg', 'loaded')
      expect(lifecycle.isEnabled('test-pkg')).toBe(false)
    })

    it('should return false for non-existent package', () => {
      expect(lifecycle.isEnabled('non-existent')).toBe(false)
    })
  })
})
