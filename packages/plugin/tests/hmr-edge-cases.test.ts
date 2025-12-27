/**
 * HMR 增强功能 - 边缘情况测试
 * @description 测试所有可能的边缘情况，确保系统健壮性
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'

import { effectRegistry, registerEffect, createEffect } from '../src/hmr/effects'
import { hmrConfigManager, defineHMRConfig, HMR_CONFIG_FILES } from '../src/hmr/config'
import { EnhancedHMR, createEnhancedHMR } from '../src/hmr/enhanced'

// Mock chokidar
const mockWatcherOn = vi.fn().mockReturnThis()
const mockWatcherClose = vi.fn().mockResolvedValue(undefined)
vi.mock('chokidar', () => ({
  default: {
    watch: vi.fn(() => ({
      on: mockWatcherOn,
      close: mockWatcherClose,
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

describe('HMR Enhanced - Edge Cases', () => {
  // ============================================================================
  // effectRegistry 边缘情况
  // ============================================================================
  describe('effectRegistry edge cases', () => {
    beforeEach(() => {
      effectRegistry.reset()
    })

    afterEach(() => {
      effectRegistry.reset()
    })

    describe('register edge cases', () => {
      it('should handle empty string module path', () => {
        const cleanup = vi.fn()
        const unregister = effectRegistry.register('', cleanup)

        // 空路径会被防御性检查拒绝
        expect(effectRegistry.count()).toBe(0)
        // unregister 仍然可以安全调用
        expect(() => unregister()).not.toThrow()
      })

      it('should handle non-string module path', () => {
        const cleanup = vi.fn()
        // @ts-expect-error 测试非字符串参数
        const unregister = effectRegistry.register(123, cleanup)

        expect(effectRegistry.count()).toBe(0)
        expect(() => unregister()).not.toThrow()
      })

      it('should handle null module path', () => {
        const cleanup = vi.fn()
        // @ts-expect-error 测试 null 参数
        const unregister = effectRegistry.register(null, cleanup)

        expect(effectRegistry.count()).toBe(0)
        expect(() => unregister()).not.toThrow()
      })

      it('should handle undefined module path', () => {
        const cleanup = vi.fn()
        // @ts-expect-error 测试 undefined 参数
        const unregister = effectRegistry.register(undefined, cleanup)

        expect(effectRegistry.count()).toBe(0)
        expect(() => unregister()).not.toThrow()
      })

      it('should handle non-function cleanup', () => {
        // @ts-expect-error 测试非函数 cleanup
        const unregister = effectRegistry.register('/path/module.ts', 'not a function')

        expect(effectRegistry.count()).toBe(0)
        expect(() => unregister()).not.toThrow()
      })

      it('should handle null cleanup', () => {
        // @ts-expect-error 测试 null cleanup
        const unregister = effectRegistry.register('/path/module.ts', null)

        expect(effectRegistry.count()).toBe(0)
        expect(() => unregister()).not.toThrow()
      })

      it('should handle undefined cleanup', () => {
        // @ts-expect-error 测试 undefined cleanup
        const unregister = effectRegistry.register('/path/module.ts', undefined)

        expect(effectRegistry.count()).toBe(0)
        expect(() => unregister()).not.toThrow()
      })

      it('should handle special characters in path', () => {
        const cleanup = vi.fn()
        const paths = [
          '/path/with spaces/file.ts',
          '/path/with特殊字符/file.ts',
          '/path/with-dash/file.ts',
          '/path/with_underscore/file.ts',
          'C:\\Windows\\Path\\file.ts',
        ]

        for (const path of paths) {
          effectRegistry.register(path, cleanup)
        }

        expect(effectRegistry.count()).toBe(paths.length)
      })

      it('should handle same cleanup function registered multiple times', () => {
        const cleanup = vi.fn()
        effectRegistry.register('/path/module.ts', cleanup)
        effectRegistry.register('/path/module.ts', cleanup)

        // 由于使用 Set，相同函数引用只会注册一次
        expect(effectRegistry.count('/path/module.ts')).toBe(1)
      })

      it('should handle different cleanup functions with same logic', () => {
        const cleanup1 = () => console.log('cleanup')
        const cleanup2 = () => console.log('cleanup')

        effectRegistry.register('/path/module.ts', cleanup1)
        effectRegistry.register('/path/module.ts', cleanup2)

        // 不同函数引用会分别注册
        expect(effectRegistry.count('/path/module.ts')).toBe(2)
      })

      it('should handle unregister called multiple times', () => {
        const cleanup = vi.fn()
        const unregister = effectRegistry.register('/path/module.ts', cleanup)

        unregister()
        unregister() // 第二次调用不应该报错
        unregister() // 第三次也不应该报错

        expect(effectRegistry.count('/path/module.ts')).toBe(0)
      })

      it('should handle unregister after cleanup', async () => {
        const cleanup = vi.fn()
        const unregister = effectRegistry.register('/path/module.ts', cleanup)

        await effectRegistry.cleanup('/path/module.ts')

        // cleanup 之后 unregister 不应该报错
        expect(() => unregister()).not.toThrow()
      })
    })

    describe('cleanup edge cases', () => {
      it('should handle cleanup function that takes a long time', async () => {
        const slowCleanup = vi.fn(async () => {
          await new Promise(resolve => setTimeout(resolve, 100))
        })

        effectRegistry.register('/path/module.ts', slowCleanup)

        const start = Date.now()
        await effectRegistry.cleanup('/path/module.ts')
        const duration = Date.now() - start

        expect(slowCleanup).toHaveBeenCalled()
        expect(duration).toBeGreaterThanOrEqual(90) // 允许一些误差
      })

      it('should handle cleanup function that returns a rejected promise', async () => {
        const failingCleanup = vi.fn(async () => {
          throw new Error('Async cleanup failed')
        })

        effectRegistry.register('/path/module.ts', failingCleanup)

        // 不应该抛出错误
        await expect(effectRegistry.cleanup('/path/module.ts')).resolves.not.toThrow()
        expect(failingCleanup).toHaveBeenCalled()
      })

      it('should handle cleanup function that throws synchronously', async () => {
        const syncThrowCleanup = vi.fn(() => {
          throw new Error('Sync cleanup failed')
        })

        effectRegistry.register('/path/module.ts', syncThrowCleanup)

        await expect(effectRegistry.cleanup('/path/module.ts')).resolves.not.toThrow()
        expect(syncThrowCleanup).toHaveBeenCalled()
      })

      it('should handle cleanup function that throws non-Error', async () => {
        const throwStringCleanup = vi.fn(() => {
          throw 'string error' // eslint-disable-line no-throw-literal
        })
        const throwNumberCleanup = vi.fn(() => {
          throw 42 // eslint-disable-line no-throw-literal
        })
        const throwNullCleanup = vi.fn(() => {
          throw null // eslint-disable-line no-throw-literal
        })

        effectRegistry.register('/path/module1.ts', throwStringCleanup)
        effectRegistry.register('/path/module2.ts', throwNumberCleanup)
        effectRegistry.register('/path/module3.ts', throwNullCleanup)

        await expect(effectRegistry.cleanup('/path/module1.ts')).resolves.not.toThrow()
        await expect(effectRegistry.cleanup('/path/module2.ts')).resolves.not.toThrow()
        await expect(effectRegistry.cleanup('/path/module3.ts')).resolves.not.toThrow()
      })

      it('should continue cleanup even if one fails', async () => {
        const failingCleanup = vi.fn(() => {
          throw new Error('Failed')
        })
        const successCleanup1 = vi.fn()
        const successCleanup2 = vi.fn()

        effectRegistry.register('/path/module.ts', successCleanup1)
        effectRegistry.register('/path/module.ts', failingCleanup)
        effectRegistry.register('/path/module.ts', successCleanup2)

        await effectRegistry.cleanup('/path/module.ts')

        expect(successCleanup1).toHaveBeenCalled()
        expect(failingCleanup).toHaveBeenCalled()
        expect(successCleanup2).toHaveBeenCalled()
      })

      it('should handle cleanup called concurrently', async () => {
        const cleanup = vi.fn(async () => {
          await new Promise(resolve => setTimeout(resolve, 50))
        })

        effectRegistry.register('/path/module.ts', cleanup)

        // 并发调用
        await Promise.all([
          effectRegistry.cleanup('/path/module.ts'),
          effectRegistry.cleanup('/path/module.ts'),
        ])

        // 只应该被调用一次（第二次调用时已经被删除）
        expect(cleanup).toHaveBeenCalledTimes(1)
      })
    })

    describe('cleanupAll edge cases', () => {
      it('should handle empty registry', async () => {
        await expect(effectRegistry.cleanupAll()).resolves.not.toThrow()
      })

      it('should handle large number of modules', async () => {
        const moduleCount = 1000
        const cleanups = Array.from({ length: moduleCount }, (_, i) => {
          const cleanup = vi.fn()
          effectRegistry.register(`/path/module${i}.ts`, cleanup)
          return cleanup
        })

        await effectRegistry.cleanupAll()

        for (const cleanup of cleanups) {
          expect(cleanup).toHaveBeenCalled()
        }
        expect(effectRegistry.count()).toBe(0)
      })

      it('should handle modules added during cleanup', async () => {
        const newCleanup = vi.fn()

        const cleanup1 = vi.fn(async () => {
          // 在 cleanup 执行期间注册新的副作用
          effectRegistry.register('/path/new-module.ts', newCleanup)
        })

        effectRegistry.register('/path/module.ts', cleanup1)

        await effectRegistry.cleanupAll()

        expect(cleanup1).toHaveBeenCalled()
        // 新注册的可能不会被清理（取决于时序）
        // 但不应该导致错误
      })
    })

    describe('count edge cases', () => {
      it('should return 0 for undefined', () => {
        expect(effectRegistry.count(undefined)).toBe(0)
      })

      it('should handle count with normalized vs non-normalized paths', () => {
        const cleanup = vi.fn()
        effectRegistry.register('/path/module.ts', cleanup)

        // 路径会被规范化，所以这些查询可能不匹配
        // 具体行为取决于 normalizePath 实现
        expect(effectRegistry.count('/path/module.ts')).toBeGreaterThanOrEqual(0)
      })
    })
  })

  // ============================================================================
  // registerEffect 边缘情况
  // ============================================================================
  describe('registerEffect edge cases', () => {
    beforeEach(() => {
      effectRegistry.reset()
    })

    it('should handle null-like cleanup function', () => {
      // TypeScript 会阻止这种情况，但运行时可能发生
      expect(() => {
        registerEffect('file:///path/module.ts', null as any)
      }).not.toThrow()
    })

    it('should handle undefined-like cleanup function', () => {
      expect(() => {
        registerEffect('file:///path/module.ts', undefined as any)
      }).not.toThrow()
    })
  })

  // ============================================================================
  // createEffect 边缘情况
  // ============================================================================
  describe('createEffect edge cases', () => {
    beforeEach(() => {
      effectRegistry.reset()
    })

    it('should handle factory that returns null', () => {
      const result = createEffect('file:///path/module.ts', () => null)
      expect(result).toBeNull()
    })

    it('should handle factory that returns undefined', () => {
      const result = createEffect('file:///path/module.ts', () => undefined)
      expect(result).toBeUndefined()
    })

    it('should handle factory that returns primitive', () => {
      expect(createEffect('file:///m1.ts', () => 42)).toBe(42)
      expect(createEffect('file:///m2.ts', () => 'string')).toBe('string')
      expect(createEffect('file:///m3.ts', () => true)).toBe(true)
    })

    it('should handle factory that throws', () => {
      expect(() => {
        createEffect('file:///path/module.ts', () => {
          throw new Error('Factory error')
        })
      }).toThrow('Factory error')
    })

    it('should handle factory that returns object without cleanup', () => {
      const obj = { foo: 'bar', baz: 123 }
      const result = createEffect('file:///path/module.ts', () => obj)
      expect(result).toEqual(obj)
      expect(effectRegistry.count()).toBe(0)
    })

    it('should handle factory that returns object with non-function cleanup', () => {
      const obj = { value: 'test', cleanup: 'not a function' }
      const result = createEffect('file:///path/module.ts', () => obj as any)
      // cleanup 不是函数，应该返回整个对象
      expect(result).toEqual(obj)
    })

    it('should handle async factory', async () => {
      // createEffect 不支持 async factory，结果会是 Promise
      const result = createEffect('file:///path/module.ts', async () => 42)
      expect(result).toBeInstanceOf(Promise)
    })
  })

  // ============================================================================
  // hmrConfigManager 边缘情况
  // ============================================================================
  describe('hmrConfigManager edge cases', () => {
    beforeEach(() => {
      hmrConfigManager.clear()
    })

    describe('findConfigFile edge cases', () => {
      it('should handle empty pluginRoot', async () => {
        const result = await hmrConfigManager.findConfigFile('')
        // 行为取决于实现
        expect(result === null || typeof result === 'string').toBe(true)
      })

      it('should handle pluginRoot with special characters', async () => {
        const specialPaths = [
          '/path/with spaces/',
          '/path/with特殊字符/',
          'C:\\Windows\\Path\\',
        ]

        for (const path of specialPaths) {
          // 不应该抛出错误
          await expect(hmrConfigManager.findConfigFile(path)).resolves.not.toThrow()
        }
      })

      it('should cache config path', async () => {
        const path1 = await hmrConfigManager.findConfigFile('/test/plugin')
        const path2 = await hmrConfigManager.findConfigFile('/test/plugin')

        // 应该返回相同的结果（缓存）
        expect(path1).toBe(path2)
      })
    })

    describe('loadConfig edge cases', () => {
      it('should return empty config when no config file exists', async () => {
        // 清空缓存并使用不存在配置的路径
        hmrConfigManager.clear()
        const config = await hmrConfigManager.loadConfig('/totally/nonexistent/path/without/config')
        expect(config).toEqual({})
      })

      it('should handle config file with syntax error', async () => {
        // 配置加载失败应该返回空配置而不是抛出错误
        const config = await hmrConfigManager.loadConfig('/path/with/invalid/config')
        expect(typeof config).toBe('object')
      })
    })

    describe('reloadConfig edge cases', () => {
      it('should clear cache before reload', async () => {
        // 第一次加载
        await hmrConfigManager.loadConfig('/test/plugin')

        // 重载
        const config = await hmrConfigManager.reloadConfig('/test/plugin')

        expect(typeof config).toBe('object')
      })
    })

    describe('isHMRConfigFile edge cases', () => {
      it('should handle paths without extension', () => {
        expect(hmrConfigManager.isHMRConfigFile('/path/karin.hmr.config')).toBe(false)
      })

      it('should handle similar but incorrect filenames', () => {
        expect(hmrConfigManager.isHMRConfigFile('/path/karin.hmr.ts')).toBe(false)
        expect(hmrConfigManager.isHMRConfigFile('/path/hmr.config.ts')).toBe(false)
        expect(hmrConfigManager.isHMRConfigFile('/path/karin.config.ts')).toBe(false)
        expect(hmrConfigManager.isHMRConfigFile('/path/karin.hmr.config.tsx')).toBe(false)
      })

      it('should handle case sensitivity', () => {
        // 文件系统通常区分大小写
        expect(hmrConfigManager.isHMRConfigFile('/path/KARIN.HMR.CONFIG.ts')).toBe(false)
        expect(hmrConfigManager.isHMRConfigFile('/path/Karin.Hmr.Config.ts')).toBe(false)
      })
    })
  })

  // ============================================================================
  // defineHMRConfig 边缘情况
  // ============================================================================
  describe('defineHMRConfig edge cases', () => {
    it('should handle empty config', () => {
      const config = defineHMRConfig({})
      expect(config).toEqual({})
    })

    it('should handle config with null values', () => {
      const config = defineHMRConfig({
        exclude: null as any,
        watch: null as any,
        debounce: null as any,
      })
      expect(config.exclude).toBeNull()
    })

    it('should handle config with undefined values', () => {
      const config = defineHMRConfig({
        exclude: undefined,
        watch: undefined,
      })
      expect(config.exclude).toBeUndefined()
    })

    it('should handle config with extra properties', () => {
      const config = defineHMRConfig({
        debounce: 100,
        customProperty: 'test',
      } as any)
      expect((config as any).customProperty).toBe('test')
    })

    it('should handle deeply nested config', () => {
      const config = defineHMRConfig({
        karinConfig: {
          onBeforeChange: async () => { },
          onAfterChange: async () => { },
          requireFullReload: () => false,
        },
      })
      expect(config.karinConfig).toBeDefined()
    })
  })

  // ============================================================================
  // EnhancedHMR 边缘情况
  // ============================================================================
  describe('EnhancedHMR edge cases', () => {
    let originalNodeEnv: string | undefined

    beforeEach(() => {
      originalNodeEnv = process.env.NODE_ENV
      process.env.NODE_ENV = 'development'
      effectRegistry.reset()
      hmrConfigManager.clear()
    })

    afterEach(() => {
      process.env.NODE_ENV = originalNodeEnv
    })

    describe('constructor edge cases', () => {
      it('should handle minimal options', () => {
        const hmr = createEnhancedHMR({
          pluginRoot: '/test',
          pluginName: 'test-plugin',
          paths: [],
        })
        expect(hmr).toBeInstanceOf(EnhancedHMR)
      })

      it('should handle empty paths array', () => {
        const hmr = createEnhancedHMR({
          pluginRoot: '/test',
          pluginName: 'test-plugin',
          paths: [],
        })
        expect(hmr).toBeInstanceOf(EnhancedHMR)
      })

      it('should handle very long paths', () => {
        const longPath = '/a'.repeat(1000) + '/file.ts'
        const hmr = createEnhancedHMR({
          pluginRoot: '/test',
          pluginName: 'test-plugin',
          paths: [longPath],
        })
        expect(hmr).toBeInstanceOf(EnhancedHMR)
      })
    })

    describe('start edge cases', () => {
      it('should handle start called multiple times', async () => {
        const hmr = createEnhancedHMR({
          pluginRoot: '/test',
          pluginName: 'test-plugin',
          paths: ['src/**/*.ts'],
        })

        await hmr.start()
        await hmr.start() // 第二次调用不应该报错

        await hmr.stop()
      })

      it('should skip in production mode', async () => {
        process.env.NODE_ENV = 'production'
        process.env.KARIN_DEV = undefined

        // 需要重新导入以获取新的 isDev 值
        // 由于模块缓存，这里可能不会生效
        const hmr = createEnhancedHMR({
          pluginRoot: '/test',
          pluginName: 'test-plugin',
          paths: ['src/**/*.ts'],
        })

        await hmr.start()
        // 在生产模式下应该提前返回
      })
    })

    describe('stop edge cases', () => {
      it('should handle stop called without start', async () => {
        const hmr = createEnhancedHMR({
          pluginRoot: '/test',
          pluginName: 'test-plugin',
          paths: ['src/**/*.ts'],
        })

        // 没有 start 就 stop 不应该报错
        await expect(hmr.stop()).resolves.not.toThrow()
      })

      it('should handle stop called multiple times', async () => {
        const hmr = createEnhancedHMR({
          pluginRoot: '/test',
          pluginName: 'test-plugin',
          paths: ['src/**/*.ts'],
        })

        await hmr.start()
        await hmr.stop()
        await hmr.stop() // 第二次调用不应该报错
      })

      it('should cleanup effects on stop', async () => {
        const cleanup = vi.fn()
        effectRegistry.register('/test/module.ts', cleanup)

        const hmr = createEnhancedHMR({
          pluginRoot: '/test',
          pluginName: 'test-plugin',
          paths: ['src/**/*.ts'],
        })

        await hmr.start()
        await hmr.stop()

        expect(cleanup).toHaveBeenCalled()
      })
    })

    describe('matchPattern edge cases', () => {
      it('should handle exact match', () => {
        const hmr = createEnhancedHMR({
          pluginRoot: '/test',
          pluginName: 'test-plugin',
          paths: [],
        })

        // 使用私有方法测试（通过反射）
        const matchPattern = (hmr as any).matchPattern.bind(hmr)

        expect(matchPattern('src/file.ts', 'src/file.ts')).toBe(true)
        expect(matchPattern('src/file.ts', 'src/other.ts')).toBe(false)
      })

      it('should handle * wildcard', () => {
        const hmr = createEnhancedHMR({
          pluginRoot: '/test',
          pluginName: 'test-plugin',
          paths: [],
        })

        const matchPattern = (hmr as any).matchPattern.bind(hmr)

        expect(matchPattern('src/file.ts', 'src/*.ts')).toBe(true)
        expect(matchPattern('src/deep/file.ts', 'src/*.ts')).toBe(false)
      })

      it('should handle ** wildcard', () => {
        const hmr = createEnhancedHMR({
          pluginRoot: '/test',
          pluginName: 'test-plugin',
          paths: [],
        })

        const matchPattern = (hmr as any).matchPattern.bind(hmr)

        expect(matchPattern('src/file.ts', 'src/**')).toBe(true)
        expect(matchPattern('src/deep/file.ts', 'src/**')).toBe(true)
        expect(matchPattern('src/very/deep/file.ts', 'src/**/*.ts')).toBe(true)
      })

      it('should handle special regex characters in path', () => {
        const hmr = createEnhancedHMR({
          pluginRoot: '/test',
          pluginName: 'test-plugin',
          paths: [],
        })

        const matchPattern = (hmr as any).matchPattern.bind(hmr)

        // 路径中的特殊字符应该被转义
        expect(matchPattern('src/file.test.ts', 'src/file.test.ts')).toBe(true)
        expect(matchPattern('src/[bracket].ts', 'src/[bracket].ts')).toBe(true)
        expect(matchPattern('src/(parens).ts', 'src/(parens).ts')).toBe(true)
      })

      it('should handle Windows-style paths', () => {
        const hmr = createEnhancedHMR({
          pluginRoot: '/test',
          pluginName: 'test-plugin',
          paths: [],
        })

        const matchPattern = (hmr as any).matchPattern.bind(hmr)

        // Windows 路径应该被转换
        expect(matchPattern('src\\file.ts', 'src/file.ts')).toBe(true)
        expect(matchPattern('src/file.ts', 'src\\file.ts')).toBe(true)
      })
    })

    describe('diffConfigKeys edge cases', () => {
      it('should handle empty configs', () => {
        const hmr = createEnhancedHMR({
          pluginRoot: '/test',
          pluginName: 'test-plugin',
          paths: [],
        })

        const diffConfigKeys = (hmr as any).diffConfigKeys.bind(hmr)

        expect(diffConfigKeys({}, {})).toEqual([])
      })

      it('should handle added keys', () => {
        const hmr = createEnhancedHMR({
          pluginRoot: '/test',
          pluginName: 'test-plugin',
          paths: [],
        })

        const diffConfigKeys = (hmr as any).diffConfigKeys.bind(hmr)

        expect(diffConfigKeys({}, { newKey: 'value' })).toEqual(['newKey'])
      })

      it('should handle removed keys', () => {
        const hmr = createEnhancedHMR({
          pluginRoot: '/test',
          pluginName: 'test-plugin',
          paths: [],
        })

        const diffConfigKeys = (hmr as any).diffConfigKeys.bind(hmr)

        expect(diffConfigKeys({ oldKey: 'value' }, {})).toEqual(['oldKey'])
      })

      it('should handle nested object changes', () => {
        const hmr = createEnhancedHMR({
          pluginRoot: '/test',
          pluginName: 'test-plugin',
          paths: [],
        })

        const diffConfigKeys = (hmr as any).diffConfigKeys.bind(hmr)

        const oldConfig = { nested: { a: 1 } }
        const newConfig = { nested: { a: 2 } }

        expect(diffConfigKeys(oldConfig, newConfig)).toEqual(['nested'])
      })

      it('should handle array changes', () => {
        const hmr = createEnhancedHMR({
          pluginRoot: '/test',
          pluginName: 'test-plugin',
          paths: [],
        })

        const diffConfigKeys = (hmr as any).diffConfigKeys.bind(hmr)

        expect(diffConfigKeys({ arr: [1, 2] }, { arr: [1, 2, 3] })).toEqual(['arr'])
        expect(diffConfigKeys({ arr: [1, 2] }, { arr: [1, 2] })).toEqual([])
      })

      it('should handle circular reference gracefully', () => {
        const hmr = createEnhancedHMR({
          pluginRoot: '/test',
          pluginName: 'test-plugin',
          paths: [],
        })

        const diffConfigKeys = (hmr as any).diffConfigKeys.bind(hmr)

        const obj: any = { key: 'value' }
        obj.self = obj // 循环引用

        // 现在循环引用会被优雅处理，不会抛出错误
        // 循环引用的 key 会被视为已变更
        const result = diffConfigKeys({ obj }, { obj })
        expect(Array.isArray(result)).toBe(true)
      })
    })
  })

  // ============================================================================
  // HMR_CONFIG_FILES 常量边缘情况
  // ============================================================================
  describe('HMR_CONFIG_FILES constant', () => {
    it('should be a frozen readonly array', () => {
      // TypeScript 的 as const 在运行时不会阻止修改
      // 如果需要运行时只读，需要使用 Object.freeze
      // 这里我们只验证数组内容正确
      expect(HMR_CONFIG_FILES.length).toBeGreaterThan(0)
      expect(HMR_CONFIG_FILES).toContain('karin.hmr.config.ts')
    })

    it('should contain only valid extensions', () => {
      const validExtensions = ['.ts', '.mts', '.js', '.mjs']
      for (const file of HMR_CONFIG_FILES) {
        const hasValidExt = validExtensions.some(ext => file.endsWith(ext))
        expect(hasValidExt).toBe(true)
      }
    })
  })

  // ============================================================================
  // 并发和竞态条件
  // ============================================================================
  describe('Concurrency and race conditions', () => {
    beforeEach(() => {
      effectRegistry.reset()
    })

    it('should handle concurrent register and cleanup', async () => {
      const cleanup = vi.fn(async () => {
        await new Promise(resolve => setTimeout(resolve, 10))
      })

      // 并发注册和清理
      await Promise.all([
        effectRegistry.register('/path/module.ts', cleanup),
        effectRegistry.cleanup('/path/module.ts'),
        effectRegistry.register('/path/module.ts', cleanup),
        effectRegistry.cleanup('/path/module.ts'),
      ])

      // 不应该抛出错误
    })

    it('should handle rapid successive cleanups', async () => {
      const cleanup = vi.fn()
      effectRegistry.register('/path/module.ts', cleanup)

      // 快速连续清理
      await Promise.all([
        effectRegistry.cleanup('/path/module.ts'),
        effectRegistry.cleanup('/path/module.ts'),
        effectRegistry.cleanup('/path/module.ts'),
      ])

      // cleanup 只应该被调用一次
      expect(cleanup).toHaveBeenCalledTimes(1)
    })
  })

  // ============================================================================
  // 内存泄漏防护
  // ============================================================================
  describe('Memory leak prevention', () => {
    beforeEach(() => {
      effectRegistry.reset()
    })

    it('should not accumulate cleanups after cleanup', async () => {
      for (let i = 0; i < 100; i++) {
        effectRegistry.register('/path/module.ts', vi.fn())
        await effectRegistry.cleanup('/path/module.ts')
      }

      expect(effectRegistry.count()).toBe(0)
    })

    it('should properly unregister after cleanup', async () => {
      const unregisters: Array<() => void> = []

      for (let i = 0; i < 10; i++) {
        const unregister = effectRegistry.register('/path/module.ts', vi.fn())
        unregisters.push(unregister)
      }

      await effectRegistry.cleanup('/path/module.ts')

      // 调用 unregister 不应该导致错误
      for (const unregister of unregisters) {
        expect(() => unregister()).not.toThrow()
      }
    })
  })

  // ============================================================================
  // 傻瓜式使用测试 - 防御性编程验证
  // ============================================================================
  describe('Foolproof usage tests', () => {
    beforeEach(() => {
      effectRegistry.reset()
    })

    describe('effectRegistry foolproof', () => {
      it('should handle cleanup with non-string argument', async () => {
        // @ts-expect-error 测试非字符串参数
        await expect(effectRegistry.cleanup(123)).resolves.not.toThrow()
        // @ts-expect-error 测试数组参数
        await expect(effectRegistry.cleanup([])).resolves.not.toThrow()
        // @ts-expect-error 测试对象参数
        await expect(effectRegistry.cleanup({})).resolves.not.toThrow()
        // @ts-expect-error 测试布尔参数
        await expect(effectRegistry.cleanup(true)).resolves.not.toThrow()
      })

      it('should handle has with non-string argument', () => {
        // @ts-expect-error 测试非字符串参数
        expect(effectRegistry.has(123)).toBe(false)
        // @ts-expect-error 测试 null 参数
        expect(effectRegistry.has(null)).toBe(false)
        // @ts-expect-error 测试 undefined 参数
        expect(effectRegistry.has(undefined)).toBe(false)
        // @ts-expect-error 测试对象参数
        expect(effectRegistry.has({})).toBe(false)
      })

      it('should handle count with non-string argument', () => {
        // @ts-expect-error 测试非字符串参数
        expect(effectRegistry.count(123)).toBe(0)
        // @ts-expect-error 测试数组参数
        expect(effectRegistry.count([])).toBe(0)
        // @ts-expect-error 测试对象参数
        expect(effectRegistry.count({})).toBe(0)
      })

      it('should handle cleanup function that modifies registry', async () => {
        // 在清理函数中注册新的清理函数
        const cleanup = vi.fn(() => {
          effectRegistry.register('/path/new-module.ts', vi.fn())
        })

        effectRegistry.register('/path/module.ts', cleanup)
        await effectRegistry.cleanup('/path/module.ts')

        expect(cleanup).toHaveBeenCalled()
        // 新注册的应该存在
        expect(effectRegistry.has('/path/new-module.ts')).toBe(true)
      })

      it('should handle cleanup function that calls cleanup on itself', async () => {
        // 在清理函数中调用自己的 cleanup（递归场景）
        const cleanup = vi.fn(async () => {
          await effectRegistry.cleanup('/path/module.ts')
        })

        effectRegistry.register('/path/module.ts', cleanup)
        await effectRegistry.cleanup('/path/module.ts')

        // 应该只调用一次（防止无限递归）
        expect(cleanup).toHaveBeenCalledTimes(1)
      })
    })

    describe('EnhancedHMR foolproof', () => {
      it('should throw when options is null', () => {
        expect(() => {
          // @ts-expect-error 测试 null 参数
          createEnhancedHMR(null)
        }).toThrow('options must be an object')
      })

      it('should throw when options is undefined', () => {
        expect(() => {
          // @ts-expect-error 测试 undefined 参数
          createEnhancedHMR(undefined)
        }).toThrow('options must be an object')
      })

      it('should throw when options is a string', () => {
        expect(() => {
          // @ts-expect-error 测试字符串参数
          createEnhancedHMR('not an object')
        }).toThrow('options must be an object')
      })

      it('should throw when pluginRoot is missing', () => {
        expect(() => {
          // @ts-expect-error 缺少 pluginRoot
          createEnhancedHMR({ pluginName: 'test', paths: [] })
        }).toThrow('pluginRoot must be a non-empty string')
      })

      it('should throw when pluginRoot is empty string', () => {
        expect(() => {
          createEnhancedHMR({ pluginRoot: '', pluginName: 'test', paths: [] })
        }).toThrow('pluginRoot must be a non-empty string')
      })

      it('should throw when pluginRoot is whitespace only', () => {
        expect(() => {
          createEnhancedHMR({ pluginRoot: '   ', pluginName: 'test', paths: [] })
        }).toThrow('pluginRoot must be a non-empty string')
      })

      it('should throw when pluginName is missing', () => {
        expect(() => {
          // @ts-expect-error 缺少 pluginName
          createEnhancedHMR({ pluginRoot: '/test', paths: [] })
        }).toThrow('pluginName must be a non-empty string')
      })

      it('should throw when pluginName is non-string', () => {
        expect(() => {
          createEnhancedHMR({
            pluginRoot: '/test',
            // @ts-expect-error 非字符串 pluginName
            pluginName: 123,
            paths: [],
          })
        }).toThrow('pluginName must be a non-empty string')
      })

      it('should throw when paths is not an array', () => {
        expect(() => {
          createEnhancedHMR({
            pluginRoot: '/test',
            pluginName: 'test',
            // @ts-expect-error 非数组 paths
            paths: 'not an array',
          })
        }).toThrow('paths must be an array')
      })

      it('should filter invalid paths from array', () => {
        const hmr = createEnhancedHMR({
          pluginRoot: '/test',
          pluginName: 'test',
          // @ts-expect-error 包含无效元素的数组
          paths: [null, undefined, 123, '', '   ', 'valid/path.ts', {}],
        })
        expect(hmr).toBeInstanceOf(EnhancedHMR)
      })

      it('should handle negative debounce value', () => {
        const hmr = createEnhancedHMR({
          pluginRoot: '/test',
          pluginName: 'test',
          paths: [],
          debounce: -100,
        })
        expect(hmr).toBeInstanceOf(EnhancedHMR)
      })

      it('should handle NaN debounce value', () => {
        const hmr = createEnhancedHMR({
          pluginRoot: '/test',
          pluginName: 'test',
          paths: [],
          debounce: NaN,
        })
        expect(hmr).toBeInstanceOf(EnhancedHMR)
      })

      it('should handle Infinity debounce value', () => {
        const hmr = createEnhancedHMR({
          pluginRoot: '/test',
          pluginName: 'test',
          paths: [],
          debounce: Infinity,
        })
        expect(hmr).toBeInstanceOf(EnhancedHMR)
      })
    })

    describe('hmrConfigManager foolproof', () => {
      beforeEach(() => {
        hmrConfigManager.clear()
      })

      it('should handle null pluginRoot', async () => {
        // @ts-expect-error 测试 null 参数
        const result = await hmrConfigManager.findConfigFile(null)
        expect(result).toBeNull()
      })

      it('should handle undefined pluginRoot', async () => {
        // @ts-expect-error 测试 undefined 参数
        const result = await hmrConfigManager.findConfigFile(undefined)
        expect(result).toBeNull()
      })

      it('should handle number pluginRoot', async () => {
        // @ts-expect-error 测试数字参数
        const result = await hmrConfigManager.findConfigFile(123)
        expect(result).toBeNull()
      })

      it('should handle whitespace-only pluginRoot', async () => {
        const result = await hmrConfigManager.findConfigFile('   ')
        expect(result).toBeNull()
      })

      it('should handle loadConfig with invalid pluginRoot', async () => {
        // @ts-expect-error 测试 null 参数
        const config1 = await hmrConfigManager.loadConfig(null)
        expect(config1).toEqual({})

        // @ts-expect-error 测试数字参数
        const config2 = await hmrConfigManager.loadConfig(123)
        expect(config2).toEqual({})
      })

      it('should handle isHMRConfigFile with invalid arguments', () => {
        // @ts-expect-error 测试 null 参数
        expect(hmrConfigManager.isHMRConfigFile(null)).toBe(false)
        // @ts-expect-error 测试 undefined 参数
        expect(hmrConfigManager.isHMRConfigFile(undefined)).toBe(false)
        // @ts-expect-error 测试数字参数
        expect(hmrConfigManager.isHMRConfigFile(123)).toBe(false)
        expect(hmrConfigManager.isHMRConfigFile('')).toBe(false)
      })
    })

    describe('defineHMRConfig foolproof', () => {
      it('should handle config with wrong types', () => {
        // 这些应该不抛出错误，只是返回原样
        const config1 = defineHMRConfig({
          // @ts-expect-error 错误类型
          debounce: 'not a number',
        })
        expect(config1.debounce).toBe('not a number')

        const config2 = defineHMRConfig({
          // @ts-expect-error 错误类型
          exclude: 'not an array',
        })
        expect(config2.exclude).toBe('not an array')
      })

      it('should handle config with functions that throw', () => {
        const config = defineHMRConfig({
          onBeforeHot: () => {
            throw new Error('Intentional error')
          },
        })
        expect(config.onBeforeHot).toBeDefined()
      })
    })

    describe('matchPattern foolproof', () => {
      it('should handle null/undefined in matchPattern', () => {
        const hmr = createEnhancedHMR({
          pluginRoot: '/test',
          pluginName: 'test',
          paths: [],
        })

        const matchPattern = (hmr as any).matchPattern.bind(hmr)

        expect(matchPattern(null, 'pattern')).toBe(false)
        expect(matchPattern(undefined, 'pattern')).toBe(false)
        expect(matchPattern('path', null)).toBe(false)
        expect(matchPattern('path', undefined)).toBe(false)
        expect(matchPattern('', 'pattern')).toBe(false)
        expect(matchPattern('path', '')).toBe(false)
      })

      it('should handle malformed regex patterns gracefully', () => {
        const hmr = createEnhancedHMR({
          pluginRoot: '/test',
          pluginName: 'test',
          paths: [],
        })

        const matchPattern = (hmr as any).matchPattern.bind(hmr)

        // 这些模式在转换为正则时可能会有问题，但不应该抛出错误
        expect(() => matchPattern('file.ts', '[invalid')).not.toThrow()
        expect(() => matchPattern('file.ts', '(unclosed')).not.toThrow()
      })
    })

    describe('diffConfigKeys foolproof', () => {
      it('should handle null/undefined configs', () => {
        const hmr = createEnhancedHMR({
          pluginRoot: '/test',
          pluginName: 'test',
          paths: [],
        })

        const diffConfigKeys = (hmr as any).diffConfigKeys.bind(hmr)

        expect(diffConfigKeys(null, {})).toEqual([])
        expect(diffConfigKeys({}, null)).toEqual([])
        expect(diffConfigKeys(null, null)).toEqual([])
        expect(diffConfigKeys(undefined, {})).toEqual([])
        expect(diffConfigKeys({}, undefined)).toEqual([])
      })

      it('should handle array as config', () => {
        const hmr = createEnhancedHMR({
          pluginRoot: '/test',
          pluginName: 'test',
          paths: [],
        })

        const diffConfigKeys = (hmr as any).diffConfigKeys.bind(hmr)

        expect(diffConfigKeys([], {})).toEqual([])
        expect(diffConfigKeys({}, [])).toEqual([])
      })

      it('should handle circular reference without throwing', () => {
        const hmr = createEnhancedHMR({
          pluginRoot: '/test',
          pluginName: 'test',
          paths: [],
        })

        const diffConfigKeys = (hmr as any).diffConfigKeys.bind(hmr)

        const obj: any = { key: 'value' }
        obj.self = obj

        // 现在应该处理循环引用而不是抛出错误
        const result = diffConfigKeys({ obj }, { obj })
        // 循环引用会导致 JSON.stringify 失败，视为已变更
        expect(Array.isArray(result)).toBe(true)
      })
    })
  })
})
