/**
 * Apps 热更新模块测试
 * @module tests/hot-apps.test
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { createAppsHMR, reloadAppsFile } from '../src/hot/apps'
import { store } from '../src/store'

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

describe('hot/apps', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(async () => {
    // 清理
  })

  describe('createAppsHMR', () => {
    it('should create HMR instance with default options', () => {
      const hmr = createAppsHMR({
        paths: ['./test-plugins'],
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
      const hmr = createAppsHMR({
        paths: ['./test-plugins'],
        debounce: 50,
      })

      // 启动
      const watcher = hmr.start()
      expect(watcher).toBeDefined()
      expect(hmr.isRunning).toBe(true)

      // 停止
      await hmr.stop()
      expect(hmr.isRunning).toBe(false)
    })

    it('should emit start event when started', () => {
      const hmr = createAppsHMR({
        paths: ['./test-plugins'],
      })

      const startHandler = vi.fn()
      hmr.on('start', startHandler)

      hmr.start()
      expect(startHandler).toHaveBeenCalled()
    })

    it('should emit stop event when stopped', async () => {
      const hmr = createAppsHMR({
        paths: ['./test-plugins'],
      })

      const stopHandler = vi.fn()
      hmr.on('stop', stopHandler)

      hmr.start()
      await hmr.stop()
      expect(stopHandler).toHaveBeenCalled()
    })

    it('should warn when starting already running HMR', () => {
      const hmr = createAppsHMR({
        paths: ['./test-plugins'],
      })

      hmr.start()
      const watcher2 = hmr.start() // 应该返回同一个 watcher

      expect(watcher2).toBeDefined()
    })

    it('should accept custom options', () => {
      const hmr = createAppsHMR({
        paths: ['./plugins', './custom'],
        debounce: 200,
        logLevel: 'debug',
        cwd: '/custom/cwd',
      })

      expect(hmr).toBeDefined()
    })

    it('should accept array paths', () => {
      const hmr = createAppsHMR({
        paths: ['./path1', './path2', './path3'],
      })

      expect(hmr).toBeDefined()
    })
  })

  describe('reloadAppsFile', () => {
    it('should be a function', () => {
      expect(typeof reloadAppsFile).toBe('function')
    })

    it('should call store.delByFile', async () => {
      const delByFileSpy = vi.spyOn(store, 'delByFile').mockReturnValue(0)
      const getByFileSpy = vi.spyOn(store, 'getByFile').mockReturnValue([])

      // Mock dynamic import (会失败，但我们只测试逻辑)
      try {
        await reloadAppsFile('/path/to/test-plugin.ts')
      } catch {
        // 预期会失败因为文件不存在
      }

      expect(delByFileSpy).toHaveBeenCalledWith('/path/to/test-plugin.ts')

      delByFileSpy.mockRestore()
      getByFileSpy.mockRestore()
    })
  })

  describe('event handling', () => {
    it('should support on/off/once event methods', () => {
      const hmr = createAppsHMR({
        paths: ['./test-plugins'],
      })

      const handler = vi.fn()

      // on
      hmr.on('start', handler)
      hmr.start()
      expect(handler).toHaveBeenCalledTimes(1)

      // off
      hmr.off('start', handler)
      hmr.stop()
      hmr.start()
      expect(handler).toHaveBeenCalledTimes(1) // 不应该再次调用
    })

    it('should support once event', async () => {
      const hmr = createAppsHMR({
        paths: ['./test-plugins'],
      })

      const handler = vi.fn()
      hmr.once('start', handler)

      hmr.start()
      expect(handler).toHaveBeenCalledTimes(1)

      await hmr.stop()
      hmr.start()
      expect(handler).toHaveBeenCalledTimes(1) // once 只触发一次
    })
  })

  describe('watcher property', () => {
    it('should return null when not running', () => {
      const hmr = createAppsHMR({
        paths: ['./test-plugins'],
      })

      expect(hmr.watcher).toBeNull()
    })

    it('should return watcher when running', () => {
      const hmr = createAppsHMR({
        paths: ['./test-plugins'],
      })

      hmr.start()
      expect(hmr.watcher).not.toBeNull()
    })
  })
})
