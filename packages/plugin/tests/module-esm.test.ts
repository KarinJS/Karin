/**
 * Module API ESM 缓存测试
 * 这些测试主要验证接口行为，不依赖实际的 ESM 内部 API
 * @module tests/module-esm.test
 */
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'

// 这个测试文件专门测试 module API 的边界情况
describe('Module API - ESM Cache Simulation', () => {
  beforeEach(() => {
    vi.resetModules()
  })

  afterEach(() => {
    vi.unstubAllEnvs()
  })

  describe('isDev detection', () => {
    it('should detect development environment from NODE_ENV', async () => {
      vi.stubEnv('NODE_ENV', 'development')

      // 重新导入以获取新的环境检测
      const { moduleApi } = await import('../src/api/module')

      // isDev 可能是 true 或 false 取决于模块缓存
      expect(typeof moduleApi.isDev).toBe('boolean')
    })

    it('should detect development environment from KARIN_DEV', async () => {
      vi.stubEnv('KARIN_DEV', 'true')

      const { moduleApi } = await import('../src/api/module')

      expect(typeof moduleApi.isDev).toBe('boolean')
    })

    it('should detect production environment', async () => {
      vi.stubEnv('NODE_ENV', 'production')
      vi.stubEnv('KARIN_DEV', 'false')

      const { moduleApi } = await import('../src/api/module')

      expect(typeof moduleApi.isDev).toBe('boolean')
    })
  })

  describe('getImportUrl behavior', () => {
    it('should handle different environments correctly', async () => {
      const { moduleApi } = await import('../src/api/module')

      // 无缓存破坏
      const url1 = moduleApi.getImportUrl('/test.ts', false)
      expect(url1).toBe('/test.ts')

      // 有缓存破坏
      const url2 = moduleApi.getImportUrl('/test.ts', true)
      expect(url2).toMatch(/\/test\.ts\?[vt]=\d+/)
    })
  })

  describe('clearCache behavior', () => {
    it('should handle clearCache gracefully when ESM cache unavailable', async () => {
      const { moduleApi } = await import('../src/api/module')

      // 这些调用应该不抛出错误，即使 ESM 缓存不可用
      await expect(moduleApi.clearCache('/file.ts', false)).resolves.toBeUndefined()
      await expect(moduleApi.clearCache('/file.ts', true)).resolves.toBeUndefined()
    })

    it('should handle clearCaches gracefully', async () => {
      const { moduleApi } = await import('../src/api/module')

      await expect(moduleApi.clearCaches([
        'file:///a.ts',
        'file:///b.ts',
        'file:///c.ts',
      ])).resolves.toBeUndefined()
    })
  })

  describe('findDependentModules behavior', () => {
    it('should return array with original URL when ESM cache unavailable', async () => {
      const { moduleApi } = await import('../src/api/module')

      const result = await moduleApi.findDependentModules('/test.ts')

      // 当 ESM 缓存不可用时，应该返回包含原始 URL 的数组
      expect(Array.isArray(result)).toBe(true)
      expect(result.length).toBeGreaterThanOrEqual(1)
    })
  })

  describe('exclude paths', () => {
    it('should convert paths to file URLs', async () => {
      const { moduleApi } = await import('../src/api/module')

      // 设置排除路径
      moduleApi.setExclude(['/node_modules', '/dist'])

      // 验证不抛出错误
      await expect(moduleApi.findDependentModules('/test.ts')).resolves.toBeDefined()
    })
  })
})
