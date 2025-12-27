/**
 * HMR 热模块重载单元测试
 * @module tests/hmr.test
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { HotModuleReloader, createHMR, startHMR, HMRManager } from '../src/hmr'
import { cache } from '../src/api/cache'

// Mock chokidar
vi.mock('chokidar', () => ({
  default: {
    watch: vi.fn(() => ({
      on: vi.fn().mockReturnThis(),
      close: vi.fn().mockResolvedValue(undefined),
    })),
  },
}))

describe('HMR', () => {
  beforeEach(() => {
    cache.clearAll()
    vi.clearAllMocks()
  })

  afterEach(async () => {
    vi.useRealTimers()
  })

  describe('HotModuleReloader', () => {
    it('should create instance with options', () => {
      const hmr = new HotModuleReloader({
        paths: ['/path/to/watch'],
      })

      expect(hmr).toBeInstanceOf(HotModuleReloader)
    })

    it('should accept custom extensions', () => {
      const hmr = new HotModuleReloader({
        paths: ['/path'],
        extensions: ['.ts', '.js'],
      })

      expect(hmr).toBeDefined()
    })

    it('should accept custom debounce', () => {
      const hmr = new HotModuleReloader({
        paths: ['/path'],
        debounce: 200,
      })

      expect(hmr).toBeDefined()
    })

    it('should accept custom reloadStrategy', () => {
      const hmr = new HotModuleReloader({
        paths: ['/path'],
        reloadStrategy: 'package',
      })

      expect(hmr).toBeDefined()
    })

    it('should accept pluginName', () => {
      const hmr = new HotModuleReloader({
        paths: ['/path'],
        pluginName: 'my-plugin',
      })

      expect(hmr).toBeDefined()
    })

    it('should accept exclude paths', () => {
      const hmr = new HotModuleReloader({
        paths: ['/path'],
        exclude: ['/path/excluded'],
      })

      expect(hmr).toBeDefined()
    })

    describe('start', () => {
      it('should start watching', async () => {
        const hmr = new HotModuleReloader({
          paths: ['/path'],
        })

        await hmr.start()

        // Should not throw
        expect(hmr).toBeDefined()
      })
    })

    describe('stop', () => {
      it('should stop watching', async () => {
        const hmr = new HotModuleReloader({
          paths: ['/path'],
        })

        await hmr.start()
        await hmr.stop()

        // Should not throw
        expect(hmr).toBeDefined()
      })

      it('should do nothing if not started', async () => {
        const hmr = new HotModuleReloader({
          paths: ['/path'],
        })

        await hmr.stop()

        // Should not throw
        expect(hmr).toBeDefined()
      })
    })

    describe('reloadFile', () => {
      it('should return HMRReloadResult', async () => {
        const hmr = new HotModuleReloader({
          paths: ['/path'],
        })

        const result = await hmr.reloadFile('/path/to/file.ts')

        expect(result).toHaveProperty('success')
        expect(result).toHaveProperty('target', '/path/to/file.ts')
        expect(result).toHaveProperty('duration')
        expect(typeof result.duration).toBe('number')
      })
    })

    describe('reloadPackage', () => {
      it('should return HMRReloadResult', async () => {
        const hmr = new HotModuleReloader({
          paths: ['/path'],
        })

        const result = await hmr.reloadPackage('test-pkg')

        expect(result).toHaveProperty('success')
        expect(result).toHaveProperty('target', 'test-pkg')
        expect(result).toHaveProperty('duration')
      })
    })
  })

  describe('createHMR', () => {
    it('should create HotModuleReloader instance', () => {
      const hmr = createHMR({
        paths: ['/path'],
      })

      expect(hmr).toBeInstanceOf(HotModuleReloader)
    })
  })

  describe('startHMR', () => {
    it('should return null when no packages', async () => {
      const result = await startHMR()

      expect(result).toBeNull()
    })

    it('should start HMR when packages exist', async () => {
      // Add a package with files using correct API
      cache.package.add('test-pkg', {
        version: '1.0.0',
        path: '/path/to/pkg',
        source: 'npm',
        status: 'loaded',
        files: new Set(['/path/to/file.ts']),
      })

      const result = await startHMR()

      expect(result).toBeInstanceOf(HotModuleReloader)

      // Cleanup
      await result?.stop()
    })
  })

  describe('HMRManager', () => {
    it('should have init method', () => {
      expect(HMRManager.init).toBe(startHMR)
    })

    it('should have create method', () => {
      expect(HMRManager.create).toBe(createHMR)
    })

    it('should have Module property', () => {
      expect(HMRManager.Module).toBe(HotModuleReloader)
    })
  })
})
