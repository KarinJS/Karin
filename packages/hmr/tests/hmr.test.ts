/**
 * @karinjs/hmr 测试
 * @module tests/hmr.test
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createDevHMR, createWatcher, clearModuleCache, clearModuleCaches, getCacheStats } from '../src'

// Mock chokidar
vi.mock('chokidar', () => ({
  default: {
    watch: vi.fn(() => ({
      on: vi.fn().mockReturnThis(),
      close: vi.fn().mockResolvedValue(undefined),
    })),
  },
}))

// Mock @karinjs/envs
vi.mock('@karinjs/envs', () => ({
  getModuleType: vi.fn(() => ['.ts', '.js', '.mts', '.mjs']),
}))

// Mock @karinjs/utils
vi.mock('@karinjs/utils', () => ({
  formatPath: (path: string, options?: { type?: string }) => {
    if (options?.type === 'fileURL') {
      return `file:///${path.replace(/\\/g, '/')}`
    }
    if (options?.type === 'rel') {
      return path.split('/').pop() || path
    }
    return path
  },
}))

// Mock @karinjs/plugin
vi.mock('@karinjs/plugin', () => ({
  store: {
    delByFile: vi.fn(() => 0),
    delByPkg: vi.fn(),
    getByFile: vi.fn(() => []),
  },
  pkgRegistry: {
    getFiles: vi.fn(() => []),
  },
}))

describe('@karinjs/hmr', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('createDevHMR', () => {
    it('should create HMR instance', () => {
      const hmr = createDevHMR({
        paths: ['./plugins'],
      })

      expect(hmr).toBeDefined()
      expect(typeof hmr.start).toBe('function')
      expect(typeof hmr.stop).toBe('function')
      expect(typeof hmr.reloadFile).toBe('function')
      expect(typeof hmr.reloadPackage).toBe('function')
      expect(typeof hmr.on).toBe('function')
      expect(typeof hmr.off).toBe('function')
      expect(typeof hmr.once).toBe('function')
      expect(hmr.isRunning).toBe(false)
    })

    it('should start and stop watching', async () => {
      const hmr = createDevHMR({
        paths: ['./plugins'],
        debounce: 50,
      })

      hmr.start()
      expect(hmr.isRunning).toBe(true)

      await hmr.stop()
      expect(hmr.isRunning).toBe(false)
    })

    it('should emit start event', () => {
      const hmr = createDevHMR({
        paths: ['./plugins'],
      })

      const startHandler = vi.fn()
      hmr.on('start', startHandler)

      hmr.start()
      expect(startHandler).toHaveBeenCalled()
    })

    it('should emit stop event', async () => {
      const hmr = createDevHMR({
        paths: ['./plugins'],
      })

      const stopHandler = vi.fn()
      hmr.on('stop', stopHandler)

      hmr.start()
      await hmr.stop()
      expect(stopHandler).toHaveBeenCalled()
    })

    it('should support chaining on/off/once', () => {
      const hmr = createDevHMR({
        paths: ['./plugins'],
      })

      const result = hmr.on('start', () => { }).off('start', () => { }).once('stop', () => { })
      expect(result).toBe(hmr)
    })

    it('should accept custom options', () => {
      const hmr = createDevHMR({
        paths: ['./plugins'],
        debounce: 200,
        logLevel: 'debug',
        cwd: '/custom',
      })

      expect(hmr).toBeDefined()
    })
  })

  describe('createWatcher', () => {
    it('should create watcher instance', () => {
      const handler = vi.fn()
      const watcher = createWatcher({
        paths: ['./test'],
      }, handler)

      expect(watcher).toBeDefined()
      expect(typeof watcher.start).toBe('function')
      expect(typeof watcher.stop).toBe('function')
      expect(watcher.isRunning).toBe(false)
    })

    it('should start and stop', async () => {
      const handler = vi.fn()
      const watcher = createWatcher({
        paths: ['./test'],
      }, handler)

      watcher.start()
      expect(watcher.isRunning).toBe(true)

      await watcher.stop()
      expect(watcher.isRunning).toBe(false)
    })
  })

  describe('cache utilities', () => {
    it('clearModuleCache should be a function', () => {
      expect(typeof clearModuleCache).toBe('function')
    })

    it('clearModuleCaches should be a function', () => {
      expect(typeof clearModuleCaches).toBe('function')
    })

    it('getCacheStats should return stats object', () => {
      const stats = getCacheStats()
      expect(stats).toHaveProperty('available')
      expect(stats).toHaveProperty('size')
      expect(stats).toHaveProperty('modules')
    })

    it('clearModuleCache should return boolean', () => {
      const result = clearModuleCache('/some/path.ts')
      expect(typeof result).toBe('boolean')
    })

    it('clearModuleCaches should return count', () => {
      const result = clearModuleCaches(['/a.ts', '/b.ts'])
      expect(typeof result).toBe('number')
    })
  })
})
