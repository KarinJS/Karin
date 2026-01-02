/**
 * MissingDeps 模块测试
 * 覆盖 store/missingDeps.ts
 */
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { missingDeps, type DedupedMissingDeps } from '../src/store/missingDeps'
import { pkgRegistry } from '../src/pkg'

// Mock logger
vi.stubGlobal('logger', {
  info: vi.fn(),
  debug: vi.fn(),
  warn: vi.fn(),
  error: vi.fn(),
  yellow: (s: string) => s,
  blue: (s: string) => s,
  cyan: (s: string) => s,
  gray: (s: string) => s,
  red: (s: string) => s,
})

describe('MissingDeps 模块', () => {
  beforeEach(() => {
    missingDeps.clear()
    pkgRegistry.clear()
    vi.clearAllMocks()
  })

  afterEach(() => {
    missingDeps.clear()
    vi.clearAllMocks()
  })

  describe('基础功能', () => {
    it('应该初始为空', () => {
      const deps = missingDeps.get()
      expect(Object.keys(deps)).toHaveLength(0)
    })

    it('应该清空所有记录', () => {
      missingDeps.add('pkg1', '/file1.ts', { code: 'ERR_MODULE_NOT_FOUND', message: "Cannot find 'dep1'" } as any)
      missingDeps.add('pkg2', '/file2.ts', { code: 'ERR_MODULE_NOT_FOUND', message: "Cannot find 'dep2'" } as any)

      missingDeps.clear()

      const deps = missingDeps.get()
      expect(Object.keys(deps)).toHaveLength(0)
    })
  })

  describe('add 功能', () => {
    it('应该添加 ERR_MODULE_NOT_FOUND 错误', () => {
      const error = {
        code: 'ERR_MODULE_NOT_FOUND',
        message: "Cannot find module 'missing-dep'",
      }

      missingDeps.add('test-pkg', '/path/to/file.ts', error)

      const deps = missingDeps.get()
      expect(deps['test-pkg']).toBeDefined()
      expect(deps['test-pkg']['/path/to/file.ts']).toBeDefined()
      expect(deps['test-pkg']['/path/to/file.ts'][0].type).toBe('import')
    })

    it('应该提取依赖名称从 url', () => {
      const error = {
        code: 'ERR_MODULE_NOT_FOUND',
        url: 'lodash',
        message: '',
      }

      missingDeps.add('test-pkg', '/file.ts', error)

      const deps = missingDeps.get()
      expect(deps['test-pkg']['/file.ts'][0].deps).toBe('lodash')
    })

    it('应该提取依赖名称从 message', () => {
      const error = {
        code: 'ERR_MODULE_NOT_FOUND',
        message: "Cannot find module 'axios'",
      }

      missingDeps.add('test-pkg', '/file.ts', error)

      const deps = missingDeps.get()
      expect(deps['test-pkg']['/file.ts'][0].deps).toBe('axios')
    })

    it('应该处理普通 Error', () => {
      const error = new Error('Some other error')

      missingDeps.add('test-pkg', '/file.ts', error)

      const deps = missingDeps.get()
      expect(deps['test-pkg']['/file.ts'][0].type).toBe('error')
      expect(deps['test-pkg']['/file.ts'][0].error).toBe(error)
    })

    it('应该去重相同的 import 错误', () => {
      const error = {
        code: 'ERR_MODULE_NOT_FOUND',
        message: "Cannot find module 'lodash'",
      }

      missingDeps.add('test-pkg', '/file.ts', error)
      missingDeps.add('test-pkg', '/file.ts', error)
      missingDeps.add('test-pkg', '/file.ts', error)

      const deps = missingDeps.get()
      expect(deps['test-pkg']['/file.ts']).toHaveLength(1)
    })

    it('应该去重相同的 Error 错误', () => {
      const error = new Error('Same error message')

      missingDeps.add('test-pkg', '/file.ts', error)
      missingDeps.add('test-pkg', '/file.ts', error)

      const deps = missingDeps.get()
      expect(deps['test-pkg']['/file.ts']).toHaveLength(1)
    })

    it('应该处理多个包', () => {
      missingDeps.add('pkg1', '/file1.ts', { code: 'ERR_MODULE_NOT_FOUND', message: "'dep1'" } as any)
      missingDeps.add('pkg2', '/file2.ts', { code: 'ERR_MODULE_NOT_FOUND', message: "'dep2'" } as any)

      const deps = missingDeps.get()
      expect(Object.keys(deps)).toHaveLength(2)
    })

    it('应该处理同一包的多个文件', () => {
      missingDeps.add('test-pkg', '/file1.ts', { code: 'ERR_MODULE_NOT_FOUND', message: "'dep1'" } as any)
      missingDeps.add('test-pkg', '/file2.ts', { code: 'ERR_MODULE_NOT_FOUND', message: "'dep2'" } as any)

      const deps = missingDeps.get()
      expect(Object.keys(deps['test-pkg'])).toHaveLength(2)
    })

    it('应该规范化 Windows 路径', () => {
      const error = {
        code: 'ERR_MODULE_NOT_FOUND',
        url: 'C:\\Users\\test\\node_modules\\missing',
        message: '',
      }

      missingDeps.add('test-pkg', '/file.ts', error)

      const deps = missingDeps.get()
      expect(deps['test-pkg']['/file.ts'][0].deps).toBe('C:/Users/test/node_modules/missing')
    })

    it('应该处理非对象错误', () => {
      missingDeps.add('test-pkg', '/file.ts', null)
      missingDeps.add('test-pkg', '/file.ts', undefined)
      missingDeps.add('test-pkg', '/file.ts', 'string error')
      missingDeps.add('test-pkg', '/file.ts', 123)

      const deps = missingDeps.get()
      // 这些都不是有效的错误类型，数组会被创建但为空
      expect(deps['test-pkg']?.['/file.ts']).toEqual([])
    })
  })

  describe('getByPackage 功能', () => {
    it('应该获取指定包的缺失依赖', () => {
      missingDeps.add('pkg1', '/file1.ts', { code: 'ERR_MODULE_NOT_FOUND', message: "'dep1'" } as any)
      missingDeps.add('pkg2', '/file2.ts', { code: 'ERR_MODULE_NOT_FOUND', message: "'dep2'" } as any)

      const pkg1Deps = missingDeps.getByPackage('pkg1')

      expect(Object.keys(pkg1Deps)).toHaveLength(1)
      expect(pkg1Deps['/file1.ts']).toBeDefined()
    })

    it('应该返回空对象当包不存在时', () => {
      const deps = missingDeps.getByPackage('non-existent')
      expect(deps).toEqual({})
    })
  })

  describe('getDeduped 功能', () => {
    it('应该返回去重后的数据', () => {
      missingDeps.add('pkg1', '/file1.ts', { code: 'ERR_MODULE_NOT_FOUND', message: "'lodash'" } as any)
      missingDeps.add('pkg1', '/file2.ts', { code: 'ERR_MODULE_NOT_FOUND', message: "'lodash'" } as any) // 相同依赖
      missingDeps.add('pkg1', '/file2.ts', { code: 'ERR_MODULE_NOT_FOUND', message: "'axios'" } as any)

      const deduped = missingDeps.getDeduped()

      expect(deduped.byPackage['pkg1'].deps).toContain('lodash')
      expect(deduped.byPackage['pkg1'].deps).toContain('axios')
      expect(deduped.byPackage['pkg1'].fileCount).toBe(2)
    })

    it('应该统计错误数量', () => {
      missingDeps.add('pkg1', '/file1.ts', new Error('Error 1'))
      missingDeps.add('pkg1', '/file1.ts', new Error('Error 2'))

      const deduped = missingDeps.getDeduped()

      expect(deduped.byPackage['pkg1'].errorCount).toBe(2)
    })

    it('应该返回正确的统计', () => {
      missingDeps.add('pkg1', '/file1.ts', { code: 'ERR_MODULE_NOT_FOUND', message: "'dep1'" } as any)
      missingDeps.add('pkg1', '/file2.ts', { code: 'ERR_MODULE_NOT_FOUND', message: "'dep2'" } as any)
      missingDeps.add('pkg2', '/file3.ts', new Error('Error'))

      const deduped = missingDeps.getDeduped()

      expect(deduped.stats.totalPackages).toBe(2)
      expect(deduped.stats.totalDeps).toBe(2)
      expect(deduped.stats.totalErrors).toBe(1)
      expect(deduped.stats.totalFiles).toBe(3)
    })

    it('应该处理空存储', () => {
      const deduped = missingDeps.getDeduped()

      expect(deduped.byPackage).toEqual({})
      expect(deduped.stats).toEqual({
        totalPackages: 0,
        totalDeps: 0,
        totalErrors: 0,
        totalFiles: 0,
      })
    })
  })

  describe('printReport 功能', () => {
    it('应该打印空报告', () => {
      missingDeps.printReport()

      // 检查 debug 被调用了
      expect((logger as any).debug).toHaveBeenCalled()
    })

    it('应该打印缺失依赖报告', () => {
      missingDeps.add('test-pkg', '/path/to/file.ts', { code: 'ERR_MODULE_NOT_FOUND', message: "'missing-dep'" } as any)

      missingDeps.printReport()

      expect((logger as any).warn).toHaveBeenCalled()
      expect((logger as any).info).toHaveBeenCalled()
    })

    it('应该支持显示完整文件路径', () => {
      missingDeps.add('test-pkg', '/very/long/path/to/file.ts', { code: 'ERR_MODULE_NOT_FOUND', message: "'dep'" } as any)

      missingDeps.printReport({ showFilePaths: true })

      expect((logger as any).info).toHaveBeenCalled()
    })

    it('应该处理已注册的包（显示相对路径）', () => {
      pkgRegistry.register({
        name: 'test-pkg',
        abs: '/project',
        pkgPath: '/project/package.json',
        type: 'npm',
      })

      missingDeps.add('test-pkg', '/project/src/file.ts', { code: 'ERR_MODULE_NOT_FOUND', message: "'dep'" } as any)

      missingDeps.printReport()

      expect((logger as any).info).toHaveBeenCalled()
    })

    it('应该打印错误类型的条目', () => {
      missingDeps.add('test-pkg', '/file.ts', new Error('Some error occurred'))

      missingDeps.printReport()

      expect((logger as any).info).toHaveBeenCalled()
    })

    it('应该打印多个包的报告', () => {
      missingDeps.add('pkg1', '/file1.ts', { code: 'ERR_MODULE_NOT_FOUND', message: "'dep1'" } as any)
      missingDeps.add('pkg2', '/file2.ts', { code: 'ERR_MODULE_NOT_FOUND', message: "'dep2'" } as any)

      missingDeps.printReport()

      // 应该多次调用 info
      expect((logger as any).info).toHaveBeenCalled()
    })

    it('应该打印多个文件的报告', () => {
      missingDeps.add('pkg1', '/file1.ts', { code: 'ERR_MODULE_NOT_FOUND', message: "'dep1'" } as any)
      missingDeps.add('pkg1', '/file2.ts', { code: 'ERR_MODULE_NOT_FOUND', message: "'dep2'" } as any)

      missingDeps.printReport()

      expect((logger as any).info).toHaveBeenCalled()
    })
  })

  describe('边缘情况', () => {
    it('应该处理没有引号的错误消息', () => {
      const error = {
        code: 'ERR_MODULE_NOT_FOUND',
        message: 'Cannot find module missing-module',
      }

      missingDeps.add('test-pkg', '/file.ts', error)

      const deps = missingDeps.get()
      // 没有引号匹配，应该返回 'unknown'
      expect(deps['test-pkg']['/file.ts'][0].deps).toBe('unknown')
    })

    it('应该处理空 url 和空 message', () => {
      const error = {
        code: 'ERR_MODULE_NOT_FOUND',
        url: '',
        message: '',
      }

      missingDeps.add('test-pkg', '/file.ts', error)

      const deps = missingDeps.get()
      expect(deps['test-pkg']['/file.ts'][0].deps).toBe('unknown')
    })

    it('应该处理非 Error 实例的对象', () => {
      const fakeError = { message: 'Not a real error' }

      missingDeps.add('test-pkg', '/file.ts', fakeError)

      // 这不是 ERR_MODULE_NOT_FOUND 也不是 Error 实例，数组会被创建但为空
      const deps = missingDeps.get()
      expect(deps['test-pkg']?.['/file.ts']).toEqual([])
    })
  })
})
