/**
 * HMR 增强功能测试
 * @description 测试副作用注册、HMR 配置加载、增强型 HMR 等功能
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'

// 重置 mock 后导入
import { effectRegistry, registerEffect, createEffect } from '../src/hmr/effects'
import { hmrConfigManager, defineHMRConfig, HMR_CONFIG_FILES } from '../src/hmr/config'

// Mock chokidar
vi.mock('chokidar', () => ({
  default: {
    watch: vi.fn(() => ({
      on: vi.fn().mockReturnThis(),
      close: vi.fn().mockResolvedValue(undefined),
    })),
  },
}))

// Mock node:fs
vi.mock('node:fs', () => ({
  existsSync: vi.fn((path: string) => {
    if (path.includes('karin.hmr.config')) return true
    return false
  }),
}))

describe('HMR Enhanced Features', () => {
  // ============================================================================
  // 副作用注册器测试
  // ============================================================================
  describe('effectRegistry', () => {
    beforeEach(() => {
      effectRegistry.reset()
    })

    afterEach(() => {
      effectRegistry.reset()
    })

    describe('register', () => {
      it('should register a cleanup function', () => {
        const cleanup = vi.fn()
        effectRegistry.register('/path/to/module.ts', cleanup)

        expect(effectRegistry.count('/path/to/module.ts')).toBe(1)
        expect(effectRegistry.has('/path/to/module.ts')).toBe(true)
      })

      it('should register multiple cleanup functions for the same module', () => {
        const cleanup1 = vi.fn()
        const cleanup2 = vi.fn()

        effectRegistry.register('/path/to/module.ts', cleanup1)
        effectRegistry.register('/path/to/module.ts', cleanup2)

        expect(effectRegistry.count('/path/to/module.ts')).toBe(2)
      })

      it('should return an unregister function', () => {
        const cleanup = vi.fn()
        const unregister = effectRegistry.register('/path/to/module.ts', cleanup)

        expect(effectRegistry.count('/path/to/module.ts')).toBe(1)

        unregister()

        expect(effectRegistry.count('/path/to/module.ts')).toBe(0)
        expect(effectRegistry.has('/path/to/module.ts')).toBe(false)
      })

      it('should normalize file paths to fileURL', () => {
        const cleanup = vi.fn()
        effectRegistry.register('/path/to/module.ts', cleanup)

        // 内部使用 fileURL 格式存储
        const modules = effectRegistry.getModules()
        expect(modules.length).toBe(1)
        expect(modules[0]).toContain('file://')
      })
    })

    describe('cleanup', () => {
      it('should execute cleanup function when cleaning up', async () => {
        const cleanup = vi.fn()
        effectRegistry.register('/path/to/module.ts', cleanup)

        await effectRegistry.cleanup('/path/to/module.ts')

        expect(cleanup).toHaveBeenCalledTimes(1)
      })

      it('should execute all cleanup functions for a module', async () => {
        const cleanup1 = vi.fn()
        const cleanup2 = vi.fn()

        effectRegistry.register('/path/to/module.ts', cleanup1)
        effectRegistry.register('/path/to/module.ts', cleanup2)

        await effectRegistry.cleanup('/path/to/module.ts')

        expect(cleanup1).toHaveBeenCalledTimes(1)
        expect(cleanup2).toHaveBeenCalledTimes(1)
      })

      it('should remove cleanup functions after executing', async () => {
        const cleanup = vi.fn()
        effectRegistry.register('/path/to/module.ts', cleanup)

        await effectRegistry.cleanup('/path/to/module.ts')

        expect(effectRegistry.count('/path/to/module.ts')).toBe(0)
      })

      it('should handle async cleanup functions', async () => {
        const order: number[] = []
        const cleanup = vi.fn(async () => {
          await new Promise(resolve => setTimeout(resolve, 10))
          order.push(1)
        })

        effectRegistry.register('/path/to/module.ts', cleanup)
        await effectRegistry.cleanup('/path/to/module.ts')

        expect(cleanup).toHaveBeenCalled()
        expect(order).toEqual([1])
      })

      it('should handle cleanup errors gracefully', async () => {
        const errorCleanup = vi.fn(() => {
          throw new Error('Cleanup failed')
        })
        const successCleanup = vi.fn()

        effectRegistry.register('/path/to/module.ts', errorCleanup)
        effectRegistry.register('/path/to/module.ts', successCleanup)

        // 不应该抛出错误
        await expect(effectRegistry.cleanup('/path/to/module.ts')).resolves.not.toThrow()

        // 两个都应该被调用
        expect(errorCleanup).toHaveBeenCalled()
        expect(successCleanup).toHaveBeenCalled()
      })

      it('should do nothing for non-existent module', async () => {
        await expect(effectRegistry.cleanup('/non/existent.ts')).resolves.not.toThrow()
      })
    })

    describe('cleanupAll', () => {
      it('should cleanup all registered modules', async () => {
        const cleanup1 = vi.fn()
        const cleanup2 = vi.fn()

        effectRegistry.register('/path/module1.ts', cleanup1)
        effectRegistry.register('/path/module2.ts', cleanup2)

        await effectRegistry.cleanupAll()

        expect(cleanup1).toHaveBeenCalled()
        expect(cleanup2).toHaveBeenCalled()
        expect(effectRegistry.count()).toBe(0)
      })
    })

    describe('count', () => {
      it('should return 0 for non-existent module', () => {
        expect(effectRegistry.count('/non/existent.ts')).toBe(0)
      })

      it('should return total count when no module specified', () => {
        effectRegistry.register('/path/module1.ts', vi.fn())
        effectRegistry.register('/path/module1.ts', vi.fn())
        effectRegistry.register('/path/module2.ts', vi.fn())

        expect(effectRegistry.count()).toBe(3)
      })
    })

    describe('has', () => {
      it('should return false for non-existent module', () => {
        expect(effectRegistry.has('/non/existent.ts')).toBe(false)
      })

      it('should return true for module with cleanup functions', () => {
        effectRegistry.register('/path/module.ts', vi.fn())
        expect(effectRegistry.has('/path/module.ts')).toBe(true)
      })
    })

    describe('getModules', () => {
      it('should return all registered modules', () => {
        effectRegistry.register('/path/module1.ts', vi.fn())
        effectRegistry.register('/path/module2.ts', vi.fn())

        const modules = effectRegistry.getModules()
        expect(modules.length).toBe(2)
      })

      it('should return empty array when no modules registered', () => {
        expect(effectRegistry.getModules()).toEqual([])
      })
    })
  })

  // ============================================================================
  // registerEffect 辅助函数测试
  // ============================================================================
  describe('registerEffect', () => {
    beforeEach(() => {
      effectRegistry.reset()
    })

    it('should register effect via helper function', () => {
      const cleanup = vi.fn()
      registerEffect('file:///path/to/module.ts', cleanup)

      expect(effectRegistry.count()).toBe(1)
    })

    it('should return unregister function', () => {
      const cleanup = vi.fn()
      const unregister = registerEffect('file:///path/to/module.ts', cleanup)

      unregister()

      expect(effectRegistry.count()).toBe(0)
    })
  })

  // ============================================================================
  // createEffect 辅助函数测试
  // ============================================================================
  describe('createEffect', () => {
    beforeEach(() => {
      effectRegistry.reset()
    })

    it('should return value from factory', () => {
      const result = createEffect('file:///path/to/module.ts', () => 42)
      expect(result).toBe(42)
    })

    it('should register cleanup when factory returns cleanup object', async () => {
      const cleanup = vi.fn()
      const result = createEffect('file:///path/to/module.ts', () => ({
        value: 'test-value',
        cleanup,
      }))

      expect(result).toBe('test-value')
      expect(effectRegistry.count()).toBe(1)

      await effectRegistry.cleanup('file:///path/to/module.ts')
      expect(cleanup).toHaveBeenCalled()
    })

    it('should not register cleanup when factory returns plain value', () => {
      createEffect('file:///path/to/module.ts', () => ({ foo: 'bar' }))
      expect(effectRegistry.count()).toBe(0)
    })
  })

  // ============================================================================
  // HMR 配置管理器测试
  // ============================================================================
  describe('hmrConfigManager', () => {
    beforeEach(() => {
      hmrConfigManager.clear()
    })

    describe('isDev', () => {
      it('should be a boolean', () => {
        expect(typeof hmrConfigManager.isDev).toBe('boolean')
      })
    })

    describe('isHMRConfigFile', () => {
      it('should return true for valid config file names', () => {
        expect(hmrConfigManager.isHMRConfigFile('/path/karin.hmr.config.ts')).toBe(true)
        expect(hmrConfigManager.isHMRConfigFile('/path/karin.hmr.config.mts')).toBe(true)
        expect(hmrConfigManager.isHMRConfigFile('/path/karin.hmr.config.js')).toBe(true)
        expect(hmrConfigManager.isHMRConfigFile('/path/karin.hmr.config.mjs')).toBe(true)
      })

      it('should return false for invalid config file names', () => {
        expect(hmrConfigManager.isHMRConfigFile('/path/other.config.ts')).toBe(false)
        expect(hmrConfigManager.isHMRConfigFile('/path/karin.config.ts')).toBe(false)
        expect(hmrConfigManager.isHMRConfigFile('/path/hmr.config.ts')).toBe(false)
      })
    })

    describe('clear', () => {
      it('should clear all caches', () => {
        // 调用 clear 不应该抛出错误
        expect(() => hmrConfigManager.clear()).not.toThrow()
      })
    })

    describe('getConfig', () => {
      it('should return null when no config loaded', () => {
        const config = hmrConfigManager.getConfig('/some/plugin/root')
        expect(config).toBeNull()
      })
    })
  })

  // ============================================================================
  // defineHMRConfig 辅助函数测试
  // ============================================================================
  describe('defineHMRConfig', () => {
    it('should return the same config object', () => {
      const config = {
        debounce: 200,
        verbose: true,
      }

      const result = defineHMRConfig(config)
      expect(result).toEqual(config)
    })

    it('should support all config options', () => {
      const config = defineHMRConfig({
        exclude: ['node_modules/**'],
        watch: ['src/**'],
        debounce: 150,
        verbose: true,
        onBeforeHot: async () => { },
        onAfterHot: async () => { },
        modules: {
          'src/timer.ts': async () => { },
        },
        effects: () => { },
        karinConfig: {
          onBeforeChange: async () => { },
          onAfterChange: async () => { },
          requireFullReload: () => false,
        },
      })

      expect(config.exclude).toEqual(['node_modules/**'])
      expect(config.debounce).toBe(150)
      expect(typeof config.onBeforeHot).toBe('function')
      expect(typeof config.modules).toBe('object')
      expect(typeof config.karinConfig).toBe('object')
    })
  })

  // ============================================================================
  // HMR_CONFIG_FILES 常量测试
  // ============================================================================
  describe('HMR_CONFIG_FILES', () => {
    it('should contain all expected config file names', () => {
      expect(HMR_CONFIG_FILES).toContain('karin.hmr.config.ts')
      expect(HMR_CONFIG_FILES).toContain('karin.hmr.config.mts')
      expect(HMR_CONFIG_FILES).toContain('karin.hmr.config.js')
      expect(HMR_CONFIG_FILES).toContain('karin.hmr.config.mjs')
    })

    it('should have exactly 4 entries', () => {
      expect(HMR_CONFIG_FILES.length).toBe(4)
    })
  })
})
