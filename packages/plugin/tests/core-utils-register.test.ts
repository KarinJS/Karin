/**
 * core/utils/registerModule.ts 单元测试
 * @description 模块注册工具测试
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { registerModule } from '../src/core/utils/registerModule'
import type { PackageMetaInfoCache } from '../src/package/find'

describe('core/utils/registerModule', () => {
  const mockMeta: PackageMetaInfoCache = {
    name: 'test-plugin',
    abs: '/path/to/plugin',
    pkg: '/path/to/plugin/package.json',
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('registerModule', () => {
    it('应该是一个异步函数', () => {
      expect(typeof registerModule).toBe('function')
    })

    it('应该在模块存在时记录调试信息', async () => {
      const debugSpy = vi.spyOn(logger, 'debug')
      const mockResult = { default: {} }

      await registerModule(mockMeta, '/path/to/file.ts', mockResult)

      expect(debugSpy).toHaveBeenCalledWith(
        expect.stringContaining('[test-plugin] 模块已加载')
      )
    })

    it('应该返回 undefined', async () => {
      const result = await registerModule(mockMeta, '/path/to/file.ts', { default: {} })
      expect(result).toBeUndefined()
    })

    it('应该处理空的模块对象', async () => {
      const debugSpy = vi.spyOn(logger, 'debug')

      await registerModule(mockMeta, '/path/to/file.ts', {})

      expect(debugSpy).toHaveBeenCalled()
    })

    it('应该处理有多个导出的模块', async () => {
      const debugSpy = vi.spyOn(logger, 'debug')
      const mockResult = {
        default: {},
        namedExport1: () => {},
        namedExport2: 'value',
      }

      await registerModule(mockMeta, '/path/to/file.ts', mockResult)

      expect(debugSpy).toHaveBeenCalledWith(
        expect.stringContaining('/path/to/file.ts')
      )
    })

    it('不应该在模块为 null 或 undefined 时记录', async () => {
      const debugSpy = vi.spyOn(logger, 'debug')

      // @ts-expect-error 测试 falsy 值
      await registerModule(mockMeta, '/path/to/file.ts', null)

      expect(debugSpy).not.toHaveBeenCalled()
    })

    it('不应该在模块为 undefined 时记录', async () => {
      const debugSpy = vi.spyOn(logger, 'debug')

      // @ts-expect-error 测试 falsy 值
      await registerModule(mockMeta, '/path/to/file.ts', undefined)

      expect(debugSpy).not.toHaveBeenCalled()
    })

    it('应该在日志中包含文件路径', async () => {
      const debugSpy = vi.spyOn(logger, 'debug')
      const filePath = '/some/custom/path.ts'

      await registerModule(mockMeta, filePath, { export: true })

      expect(debugSpy).toHaveBeenCalledWith(
        expect.stringContaining(filePath)
      )
    })

    it('应该在日志中包含包名', async () => {
      const debugSpy = vi.spyOn(logger, 'debug')

      await registerModule(mockMeta, '/file.ts', { export: true })

      expect(debugSpy).toHaveBeenCalledWith(
        expect.stringContaining('test-plugin')
      )
    })
  })

  describe('不同的 meta 数据', () => {
    it('应该处理不同的包名', async () => {
      const debugSpy = vi.spyOn(logger, 'debug')
      const customMeta: PackageMetaInfoCache = {
        name: 'custom-package',
        abs: '/custom/path',
        pkg: '/custom/path/package.json',
      }

      await registerModule(customMeta, '/file.ts', { data: 1 })

      expect(debugSpy).toHaveBeenCalledWith(
        expect.stringContaining('[custom-package]')
      )
    })

    it('应该处理带有特殊字符的包名', async () => {
      const debugSpy = vi.spyOn(logger, 'debug')
      const specialMeta: PackageMetaInfoCache = {
        name: '@scope/package-name',
        abs: '/path',
        pkg: '/path/package.json',
      }

      await registerModule(specialMeta, '/file.ts', { data: 1 })

      expect(debugSpy).toHaveBeenCalledWith(
        expect.stringContaining('[@scope/package-name]')
      )
    })
  })
})
