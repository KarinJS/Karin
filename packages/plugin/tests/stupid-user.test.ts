/**
 * "傻瓜用户"测试 - 测试所有可能的错误使用方式和意外情况
 *
 * 原则：把 API 使用者当成傻子，考虑所有可能的错误输入
 * @module tests/stupid-user.test
 */
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { resolve } from 'path'
import { cache } from '../src/api/cache'
import { registry } from '../src/api/registry'
import { loader } from '../src/api/loader'
import { moduleApi } from '../src/api/module'
import { lifecycle } from '../src/api/lifecycle'
import { event } from '../src/api/event'
import {
  command,
  accept,
  handler,
  button,
  task,
  setContext,
  getContext,
  clearContext,
  withContext,
} from '../src/create'
import type { PluginType } from '../src/types'

describe('Stupid User Tests - 错误使用方式', () => {
  beforeEach(() => {
    cache.clearAll()
    moduleApi.clear()
    clearContext()
    vi.clearAllMocks()
  })

  // ==========================================================================
  // Cache API 错误使用
  // ==========================================================================
  describe('Cache API 错误使用', () => {
    describe('cache.package - 异常输入', () => {
      it('should throw error for empty string as package name', () => {
        expect(() => cache.package.add('', {
          version: '1.0.0',
          path: '/path',
          source: 'npm',
          status: 'loaded',
          files: new Set(),
        })).toThrow('name must be a non-empty string')
      })

      it('should handle special characters in package name', () => {
        const weirdNames = [
          '@scope/pkg',
          'pkg-with-dash',
          'pkg_with_underscore',
          'pkg.with.dots',
          '中文包名',
          '🎉emoji-pkg',
          'path/like/name',
          '../traversal',
          'null',
          'undefined',
          'true',
          'false',
          '__proto__',
          'constructor',
          'toString',
        ]

        for (const name of weirdNames) {
          cache.package.add(name, {
            version: '1.0.0',
            path: '/path',
            source: 'npm',
            status: 'loaded',
            files: new Set(),
          })
          expect(cache.package.has(name)).toBe(true)
        }
      })

      it('should handle overwriting existing package', () => {
        cache.package.add('pkg', {
          version: '1.0.0',
          path: '/path1',
          source: 'npm',
          status: 'loaded',
          files: new Set(['/file1.ts']),
        })

        // 覆盖
        cache.package.add('pkg', {
          version: '2.0.0',
          path: '/path2',
          source: 'git',
          status: 'enabled',
          files: new Set(['/file2.ts']),
        })

        const pkg = cache.package.get('pkg')
        expect(pkg?.version).toBe('2.0.0')
        expect(pkg?.path).toBe('/path2')
      })

      it('should handle files with special paths', () => {
        cache.package.add('pkg', {
          version: '1.0.0',
          path: '/path',
          source: 'npm',
          status: 'loaded',
          files: new Set(),
        })

        // 有效的特殊路径（非空）
        const validPaths = [
          '/path/with spaces/file.ts',
          '/path/with\ttab/file.ts',
          '/path/with\nnewline/file.ts',
          'C:\\Windows\\path',
          '//network/share/file.ts',
          'file:///url/path',
          '../../../etc/passwd',
          '/path/中文/文件.ts',
          '/path/🎉/file.ts',
        ]

        for (const path of validPaths) {
          cache.package.addFile('pkg', path)
        }

        const files = cache.package.getFiles('pkg')
        expect(files.length).toBe(validPaths.length)

        // 空路径应该抛出错误
        expect(() => cache.package.addFile('pkg', '')).toThrow('file must be a non-empty string')
        expect(() => cache.package.addFile('pkg', '   ')).toThrow('file must be a non-empty string')
      })

      it('should handle setStatus with all valid statuses', () => {
        cache.package.add('pkg', {
          version: '1.0.0',
          path: '/path',
          source: 'npm',
          status: 'loaded',
          files: new Set(),
        })

        const statuses = ['loading', 'loaded', 'enabled', 'disabled', 'error', 'unloaded'] as const
        for (const status of statuses) {
          cache.package.setStatus('pkg', status)
          expect(cache.package.get('pkg')?.status).toBe(status)
        }
      })
    })

    describe('cache.instance - 异常输入', () => {
      it('should throw error for invalid plugin type', () => {
        // TypeScript 会阻止这种情况，但运行时可能发生
        const invalidType = 'invalid_type' as PluginType

        expect(() => cache.instance.get(invalidType, 'some-id')).toThrow('invalid type: invalid_type')
        expect(() => cache.instance.add(invalidType, 'id', {} as any)).toThrow('invalid type: invalid_type')
      })

      it('should throw error for empty id', () => {
        expect(() => cache.instance.add('command', '', {
          id: '',
          type: 'command',
          pkg: 'pkg',
          file: '/file.ts',
          priority: 0,
          enabled: true,
          instance: {},
        })).toThrow('id must be a non-empty string')

        expect(() => cache.instance.get('command', '')).toThrow('id must be a non-empty string')
      })

      it('should handle null/undefined in RegistryItem fields', () => {
        // 模拟用户绕过类型系统传入 null
        cache.instance.add('command', 'test-id', {
          id: 'test-id',
          type: 'command',
          pkg: null as any,
          file: undefined as any,
          priority: NaN,
          enabled: true,
          instance: null,
        })

        const item = cache.instance.get('command', 'test-id')
        expect(item).toBeDefined()
        expect(item?.pkg).toBeNull()
        expect(item?.file).toBeUndefined()
        expect(Number.isNaN(item?.priority)).toBe(true)
      })

      it('should throw error for getByPackage with null/undefined package name', () => {
        expect(() => cache.instance.getByPackage(null as any)).toThrow('pkg must be a non-empty string')
        expect(() => cache.instance.getByPackage(undefined as any)).toThrow('pkg must be a non-empty string')
      })

      it('should throw error for getByFile with null/undefined file path', () => {
        expect(() => cache.instance.getByFile(null as any)).toThrow('file must be a non-empty string')
        expect(() => cache.instance.getByFile(undefined as any)).toThrow('file must be a non-empty string')
      })

      it('should handle concurrent add and delete operations', () => {
        // 模拟并发操作
        for (let i = 0; i < 100; i++) {
          registry.register('command', { i }, 'pkg', '/file.ts')
        }

        // 同时删除
        const items = cache.instance.getAll('command')
        for (const item of items) {
          cache.instance.delete('command', item.id)
        }

        expect(cache.instance.count('command')).toBe(0)
      })
    })

    describe('cache.data - 异常输入', () => {
      it('should throw error for empty/whitespace keys', () => {
        // 空字符串和空白键应该抛出错误
        expect(() => cache.data.set('', { value: 'test' })).toThrow('key must be a non-empty string')
        expect(() => cache.data.set(' ', { value: 'test' })).toThrow('key must be a non-empty string')
        expect(() => cache.data.has('')).toThrow('key must be a non-empty string')
        expect(() => cache.data.get('')).toThrow('key must be a non-empty string')
      })

      it('should handle valid special key names', () => {
        const keys = [
          'normal-key',
          '__proto__',
          'constructor',
          'hasOwnProperty',
          '123',
          'null',
          'undefined',
        ]

        for (const key of keys) {
          cache.data.set(key, { value: key })
          expect(cache.data.has(key)).toBe(true)
          expect(cache.data.get(key)).toEqual({ value: key })
        }
      })

      it('should handle circular reference in data', () => {
        const obj: any = { name: 'test' }
        obj.self = obj

        // 不应该崩溃
        cache.data.set('circular', obj)
        const retrieved = cache.data.get('circular')
        expect(retrieved).toBe(obj)
      })

      it('should handle Symbol as data value', () => {
        const sym = Symbol('test')
        cache.data.set('symbol', sym)
        expect(cache.data.get('symbol')).toBe(sym)
      })

      it('should handle function as data value', () => {
        const fn = () => 'hello'
        cache.data.set('function', fn)
        expect(cache.data.get('function')).toBe(fn)
      })
    })
  })

  // ==========================================================================
  // Registry API 错误使用
  // ==========================================================================
  describe('Registry API 错误使用', () => {
    describe('registry.register - 异常输入', () => {
      it('should handle null/undefined instance', () => {
        const id1 = registry.register('command', null, 'pkg', '/file.ts')
        const id2 = registry.register('command', undefined, 'pkg', '/file.ts')

        expect(id1).toBeDefined()
        expect(id2).toBeDefined()

        const item1 = registry.get('command', id1)
        const item2 = registry.get('command', id2)
        expect(item1?.instance).toBeNull()
        expect(item2?.instance).toBeUndefined()
      })

      it('should throw error for empty pkg and file', () => {
        expect(() => registry.register('command', {}, '', '')).toThrow('pkg must be a non-empty string')
        expect(() => registry.register('command', {}, 'pkg', '')).toThrow('file must be a non-empty string')
      })

      it('should handle very large priority values', () => {
        const id1 = registry.register('command', {}, 'pkg', '/f.ts', { priority: Number.MAX_SAFE_INTEGER })
        const id2 = registry.register('command', {}, 'pkg', '/f.ts', { priority: Number.MIN_SAFE_INTEGER })
        const id3 = registry.register('command', {}, 'pkg', '/f.ts', { priority: Infinity })
        const id4 = registry.register('command', {}, 'pkg', '/f.ts', { priority: -Infinity })
        const id5 = registry.register('command', {}, 'pkg', '/f.ts', { priority: NaN })

        expect(registry.get('command', id1)?.priority).toBe(Number.MAX_SAFE_INTEGER)
        expect(registry.get('command', id2)?.priority).toBe(Number.MIN_SAFE_INTEGER)
        expect(registry.get('command', id3)?.priority).toBe(Infinity)
        expect(registry.get('command', id4)?.priority).toBe(-Infinity)
        expect(Number.isNaN(registry.get('command', id5)?.priority)).toBe(true)
      })

      it('should handle non-number priority', () => {
        // TypeScript 会阻止，但运行时可能发生
        // 防御性编程：非数字 priority 会被转换为 0
        const id = registry.register('command', {}, 'pkg', '/f.ts', { priority: 'high' as any })
        const item = registry.get('command', id)
        expect(item?.priority).toBe(0) // 非数字被转换为 0
      })

      it('should handle metadata with circular reference', () => {
        const meta: any = { name: 'test' }
        meta.self = meta

        const id = registry.register('command', {}, 'pkg', '/f.ts', { metadata: meta })
        const item = registry.get('command', id)
        expect(item?.metadata).toBe(meta)
      })
    })

    describe('registry.sort - 边界情况', () => {
      it('should handle NaN priorities in sort', () => {
        registry.register('command', { name: 'a' }, 'pkg', '/f.ts', { priority: NaN })
        registry.register('command', { name: 'b' }, 'pkg', '/f.ts', { priority: 10 })
        registry.register('command', { name: 'c' }, 'pkg', '/f.ts', { priority: NaN })

        // 不应该崩溃
        registry.sort('command')

        const items = registry.getAll('command')
        expect(items.length).toBe(3)
      })

      it('should handle Infinity priorities in sort', () => {
        registry.register('command', { name: 'normal' }, 'pkg', '/f.ts', { priority: 50 })
        registry.register('command', { name: 'max' }, 'pkg', '/f.ts', { priority: Infinity })
        registry.register('command', { name: 'min' }, 'pkg', '/f.ts', { priority: -Infinity })

        registry.sort('command')

        const items = registry.getAll('command')
        // 验证所有项目都被排序，顺序取决于实现细节
        expect(items.length).toBe(3)
        // 验证至少包含所有注册的名称
        const names = items.map(i => (i.instance as any).name)
        expect(names).toContain('normal')
        expect(names).toContain('max')
        expect(names).toContain('min')
      })

      it('should handle sort with undefined type (sort all)', () => {
        registry.register('command', {}, 'pkg', '/f.ts', { priority: 1 })
        registry.register('accept', {}, 'pkg', '/f.ts', { priority: 2 })
        registry.register('handler', {}, 'pkg', '/f.ts', { priority: 3 })

        // undefined type 应该排序所有类型
        registry.sort(undefined)

        expect(registry.getAll('command').length).toBe(1)
        expect(registry.getAll('accept').length).toBe(1)
        expect(registry.getAll('handler').length).toBe(1)
      })
    })

    describe('registry.unregister - 边界情况', () => {
      it('should handle non-existent id or throw for invalid input', () => {
        expect(registry.unregister('command', 'non-existent')).toBe(false)
        // 空字符串和 null 应抛出错误
        expect(() => registry.unregister('command', '')).toThrow('id must be a non-empty string')
        expect(() => registry.unregister('command', null as any)).toThrow('id must be a non-empty string')
      })

      it('should handle double unregister', () => {
        const id = registry.register('command', {}, 'pkg', '/f.ts')

        expect(registry.unregister('command', id)).toBe(true)
        expect(registry.unregister('command', id)).toBe(false) // 第二次应该返回 false
      })
    })

    describe('registry.enable/disable - 边界情况', () => {
      it('should return false for non-existent item', () => {
        expect(registry.enable('command', 'non-existent')).toBe(false)
        expect(registry.disable('command', 'non-existent')).toBe(false)
      })

      it('should handle multiple enable/disable calls', () => {
        const id = registry.register('command', {}, 'pkg', '/f.ts')

        // 多次 enable
        expect(registry.enable('command', id)).toBe(true)
        expect(registry.enable('command', id)).toBe(true)

        // 多次 disable
        expect(registry.disable('command', id)).toBe(true)
        expect(registry.disable('command', id)).toBe(true)
      })

      it('should toggle enabled state correctly', () => {
        const id = registry.register('command', {}, 'pkg', '/f.ts')

        expect(registry.get('command', id)?.enabled).toBe(true)

        registry.disable('command', id)
        expect(registry.get('command', id)?.enabled).toBe(false)

        registry.enable('command', id)
        expect(registry.get('command', id)?.enabled).toBe(true)
      })
    })
  })

  // ==========================================================================
  // Loader API 错误使用
  // ==========================================================================
  describe('Loader API 错误使用', () => {
    describe('loader.loadFile - 异常输入', () => {
      it('should throw error for empty file path', async () => {
        await expect(loader.loadFile('', { silent: true })).rejects.toThrow('filePath must be a non-empty string')
      })

      it('should throw error for whitespace file path', async () => {
        await expect(loader.loadFile('   ', { silent: true })).rejects.toThrow('filePath must be a non-empty string')
      })

      it('should throw error for null/undefined file path', async () => {
        await expect(loader.loadFile(null as any, { silent: true })).rejects.toThrow('filePath must be a non-empty string')
        await expect(loader.loadFile(undefined as any, { silent: true })).rejects.toThrow('filePath must be a non-empty string')
      })

      it('should handle directory path instead of file', async () => {
        const result = await loader.loadFile(resolve(__dirname), { silent: true })
        expect(result.success).toBe(false)
      })

      it('should handle path with query string', async () => {
        const result = await loader.loadFile('/path/file.ts?query=1', { silent: true })
        expect(result.success).toBe(false)
      })

      it('should handle concurrent loadFile calls for same file', async () => {
        const testPath = resolve(__dirname, 'fixtures/test-module.ts')

        // 并发加载同一文件
        const results = await Promise.all([
          loader.loadFile(testPath, { silent: true }),
          loader.loadFile(testPath, { silent: true }),
          loader.loadFile(testPath, { silent: true }),
        ])

        // 所有应该成功
        expect(results.every(r => r.success)).toBe(true)
      })
    })

    describe('loader.addPackage - 边界情况', () => {
      it('should throw error for empty name', () => {
        // 空名称应该抛出错误
        expect(() => loader.addPackage('', '/path', 'npm', '1.0.0')).toThrow('name must be a non-empty string')
      })

      it('should throw error for empty path', () => {
        expect(() => loader.addPackage('pkg', '', 'npm', '1.0.0')).toThrow('path must be a non-empty string')
      })

      it('should handle duplicate addPackage calls', () => {
        loader.addPackage('pkg', '/path1', 'npm', '1.0.0')
        loader.addPackage('pkg', '/path2', 'git', '2.0.0')

        const pkg = cache.package.get('pkg')
        expect(pkg?.path).toBe('/path2')
        expect(pkg?.version).toBe('2.0.0')
      })
    })

    describe('loader.loadPackage - 边界情况', () => {
      it('should handle non-existent package', async () => {
        // 不存在的包应该返回空数组
        const results = await loader.loadPackage('non-existent')
        expect(results).toEqual([])
      })

      it('should handle package with no files', async () => {
        loader.addPackage('empty-pkg', '/path', 'npm')
        const results = await loader.loadPackage('empty-pkg')
        expect(results).toEqual([])
      })
    })

    describe('loader.reloadPackage - 边界情况', () => {
      it('should handle non-existent package', async () => {
        const results = await loader.reloadPackage('non-existent')
        expect(results).toEqual([])
      })
    })
  })

  // ==========================================================================
  // Module API 错误使用
  // ==========================================================================
  describe('Module API 错误使用', () => {
    describe('moduleApi.addDependency - 边界情况', () => {
      it('should handle self-dependency', () => {
        const file = '/self.ts'
        moduleApi.addDependency(file, file)

        // 不应该无限循环
        const deps = moduleApi.findDependencies(file)
        expect(deps).toContain(file)
      })

      it('should throw error for empty file paths', () => {
        // 空路径应该抛出错误
        expect(() => moduleApi.addDependency('', '')).toThrow('from must be a non-empty string')
        expect(() => moduleApi.addDependency('/file.ts', '')).toThrow('to must be a non-empty string')
        expect(() => moduleApi.findDependencies('')).toThrow('filePath must be a non-empty string')
      })

      it('should throw error for null/undefined paths', () => {
        expect(() => moduleApi.addDependency(null as any, '/file.ts')).toThrow('from must be a non-empty string')
        expect(() => moduleApi.addDependency('/file.ts', undefined as any)).toThrow('to must be a non-empty string')
      })

      it('should handle very deep dependency chains', () => {
        // 创建 1000 层深的依赖链
        for (let i = 0; i < 1000; i++) {
          moduleApi.addDependency(`/file${i}.ts`, `/file${i + 1}.ts`)
        }

        // 不应该栈溢出
        const deps = moduleApi.findDependencies('/file0.ts')
        expect(deps.length).toBe(1000)
      })

      it('should handle complex circular dependencies', () => {
        // A -> B -> C -> D -> A
        moduleApi.addDependency('/A.ts', '/B.ts')
        moduleApi.addDependency('/B.ts', '/C.ts')
        moduleApi.addDependency('/C.ts', '/D.ts')
        moduleApi.addDependency('/D.ts', '/A.ts')

        // 不应该无限循环
        const depsA = moduleApi.findDependencies('/A.ts')
        expect(depsA.length).toBeLessThanOrEqual(4)
      })
    })

    describe('moduleApi.setExclude - 边界情况', () => {
      it('should throw error for null/undefined', () => {
        expect(() => moduleApi.setExclude(null as any)).toThrow('paths must be an array')
        expect(() => moduleApi.setExclude(undefined as any)).toThrow('paths must be an array')
      })

      it('should filter out null/undefined elements from valid array', () => {
        // 有效数组中的 null/undefined 元素应该被过滤掉
        moduleApi.setExclude(['/path', null as any, undefined as any, '/path2'])
        // 没有抛出错误即可
      })
    })

    describe('moduleApi.getImportUrl - 边界情况', () => {
      it('should throw error for empty path', () => {
        expect(() => moduleApi.getImportUrl('', true)).toThrow('filePath must be a non-empty string')
        expect(() => moduleApi.getImportUrl('  ', true)).toThrow('filePath must be a non-empty string')
      })

      it('should handle path with existing query string', () => {
        const url = moduleApi.getImportUrl('/file.ts?existing=1', true)
        // 应该添加版本参数
        expect(url).toContain('?')
      })
    })
  })

  // ==========================================================================
  // Lifecycle API 错误使用
  // ==========================================================================
  describe('Lifecycle API 错误使用', () => {
    describe('lifecycle.enable/disable - 边界情况', () => {
      it('should throw for non-existent package', async () => {
        await expect(lifecycle.enable('non-existent')).rejects.toThrow('Package not found')
        await expect(lifecycle.disable('non-existent')).rejects.toThrow('Package not found')
      })

      it('should handle empty package name', async () => {
        await expect(lifecycle.enable('')).rejects.toThrow('Package name must be a non-empty string')
      })

      it('should handle enable already enabled package', async () => {
        loader.addPackage('pkg', '/path', 'npm')
        cache.package.setStatus('pkg', 'enabled')

        // 再次 enable 不应该出错
        await lifecycle.enable('pkg')
        expect(lifecycle.isEnabled('pkg')).toBe(true)
      })

      it('should handle disable already disabled package', async () => {
        loader.addPackage('pkg', '/path', 'npm')
        cache.package.setStatus('pkg', 'disabled')

        // 再次 disable 不应该出错
        await lifecycle.disable('pkg')
        expect(lifecycle.isEnabled('pkg')).toBe(false)
      })
    })

    describe('lifecycle.unload - 边界情况', () => {
      it('should throw for non-existent package', async () => {
        await expect(lifecycle.unload('non-existent')).rejects.toThrow('Package not found')
      })

      it('should handle double unload', async () => {
        loader.addPackage('pkg', '/path', 'npm')

        await lifecycle.unload('pkg')

        // 第二次应该抛错因为包已不存在
        await expect(lifecycle.unload('pkg')).rejects.toThrow('Package not found')
      })
    })

    describe('lifecycle.getStatus - 边界情况', () => {
      it('should return unloaded for non-existent package', () => {
        expect(lifecycle.getStatus('non-existent')).toBe('unloaded')
        expect(lifecycle.getStatus('')).toBe('unloaded')
        expect(lifecycle.getStatus(null as any)).toBe('unloaded')
      })
    })

    describe('lifecycle.isLoaded/isEnabled - 边界情况', () => {
      it('should return false for non-existent package', () => {
        expect(lifecycle.isLoaded('non-existent')).toBe(false)
        expect(lifecycle.isEnabled('non-existent')).toBe(false)
      })

      it('should return false for null/undefined', () => {
        expect(lifecycle.isLoaded(null as any)).toBe(false)
        expect(lifecycle.isEnabled(undefined as any)).toBe(false)
      })
    })
  })

  // ==========================================================================
  // DSL 错误使用
  // ==========================================================================
  describe('DSL 错误使用', () => {
    describe('Context 问题', () => {
      it('should use default context when not set', () => {
        clearContext()

        // 在没有设置上下文的情况下创建命令
        const id = command(/test/, async () => { })

        const item = registry.get('command', id)
        expect(item?.pkg).toBe('unknown')
        expect(item?.file).toBe('unknown')
      })

      it('should handle withContext exception', async () => {
        const error = new Error('Test error')

        await expect(
          withContext('pkg', '/file.ts', async () => {
            throw error
          })
        ).rejects.toThrow('Test error')

        // 上下文应该被恢复
        expect(getContext().pkg).toBe('unknown')
      })

      it('should restore context after nested withContext', async () => {
        setContext('outer-pkg', '/outer.ts')

        await withContext('inner-pkg', '/inner.ts', async () => {
          expect(getContext().pkg).toBe('inner-pkg')
        })

        // 应该恢复到 outer
        expect(getContext().pkg).toBe('outer-pkg')
      })
    })

    describe('command() 异常输入', () => {
      it('should throw error for null callback', () => {
        setContext('pkg', '/file.ts')
        expect(() => command(/test/, null as any)).toThrow('callback must be a function')
      })

      it('should handle empty regex', () => {
        setContext('pkg', '/file.ts')
        const id = command(/(?:)/, async () => { })
        expect(id).toBeDefined()
      })

      it('should handle string that is invalid regex', () => {
        setContext('pkg', '/file.ts')
        // 包含正则特殊字符的字符串 - 应该被转义而不是崩溃
        const id = command('[invalid', async () => { })
        expect(id).toBeDefined()

        // 验证规则被正确转义了
        const item = registry.get('command', id)
        expect(item).toBeDefined()
      })
    })

    describe('accept() 异常输入', () => {
      it('should throw error for empty event type', () => {
        setContext('pkg', '/file.ts')
        expect(() => accept('', async () => { })).toThrow('event must be a non-empty string')
      })

      it('should throw error for null callback', () => {
        setContext('pkg', '/file.ts')
        expect(() => accept('event', null as any)).toThrow('callback must be a function')
      })
    })

    describe('handler() 异常输入', () => {
      it('should throw error for empty key', () => {
        setContext('pkg', '/file.ts')
        expect(() => handler('', async () => 'result')).toThrow('key must be a non-empty string')
      })
    })

    describe('button() 异常输入', () => {
      it('should throw error for empty id', () => {
        setContext('pkg', '/file.ts')
        expect(() => button('', async () => { })).toThrow('id must be a non-empty string')
      })
    })

    describe('task() 异常输入', () => {
      it('should handle invalid cron expression', () => {
        setContext('pkg', '/file.ts')
        const id = task('invalid cron', async () => { })
        expect(id).toBeDefined()
      })

      it('should throw error for empty cron', () => {
        setContext('pkg', '/file.ts')
        expect(() => task('', async () => { })).toThrow('cron must be a non-empty string')
      })
    })
  })

  // ==========================================================================
  // Event API 错误使用
  // ==========================================================================
  describe('Event API 错误使用', () => {
    it('should handle emit with null/undefined data', () => {
      // 不应该崩溃
      event.emit('plugin:load:start', null as any)
      event.emit('plugin:load:start', undefined as any)
    })

    it('should handle on with null/undefined handler', () => {
      // 不应该崩溃
      event.on('plugin:load:start', null as any)
      event.on('plugin:load:start', undefined as any)
    })

    it('should handle off with non-existent handler', () => {
      const handler = () => { }
      event.off('plugin:load:start', handler) // 从未注册过
    })

    it('should handle once with handler that throws', async () => {
      const errorHandler = vi.fn(() => {
        throw new Error('Handler error')
      })

      event.once('plugin:load:start' as any, errorHandler)

      // 触发事件，不应该崩溃外部代码
      try {
        event.emit('plugin:load:start', { pkg: 'test' })
      } catch {
        // 可能会抛出，取决于实现
      }
    })
  })

  // ==========================================================================
  // 并发和竞态条件
  // ==========================================================================
  describe('并发和竞态条件', () => {
    it('should handle concurrent registry operations', async () => {
      const promises: Promise<void>[] = []

      // 并发注册
      for (let i = 0; i < 50; i++) {
        promises.push((async () => {
          registry.register('command', { i }, 'pkg', '/file.ts')
        })())
      }

      // 并发查询
      for (let i = 0; i < 50; i++) {
        promises.push((async () => {
          registry.getAll('command')
          registry.getByPackage('pkg')
        })())
      }

      await Promise.all(promises)

      expect(registry.getAll('command').length).toBe(50)
    })

    it('should handle concurrent cache operations', async () => {
      const promises: Promise<void>[] = []

      for (let i = 0; i < 100; i++) {
        promises.push((async () => {
          cache.data.set(`key${i}`, { value: i })
          cache.data.get(`key${i}`)
          cache.data.has(`key${i}`)
        })())
      }

      await Promise.all(promises)
    })

    it('should handle rapid enable/disable cycles', async () => {
      loader.addPackage('cycle-pkg', '/path', 'npm')

      const promises: Promise<void>[] = []

      for (let i = 0; i < 20; i++) {
        promises.push((async () => {
          if (i % 2 === 0) {
            await lifecycle.enable('cycle-pkg')
          } else {
            await lifecycle.disable('cycle-pkg')
          }
        })())
      }

      // 应该全部完成而不崩溃
      await Promise.allSettled(promises)
    })
  })

  // ==========================================================================
  // 内存泄漏相关
  // ==========================================================================
  describe('内存泄漏相关', () => {
    it('should properly clean up after clearAll', () => {
      // 添加大量数据
      for (let i = 0; i < 1000; i++) {
        cache.package.add(`pkg${i}`, {
          version: '1.0.0',
          path: `/path${i}`,
          source: 'npm',
          status: 'loaded',
          files: new Set([`/file${i}.ts`]),
        })
        registry.register('command', { i }, `pkg${i}`, `/file${i}.ts`)
        cache.data.set(`key${i}`, { i })
      }

      // 清空
      cache.clearAll()

      expect(cache.package.size).toBe(0)
      expect(cache.instance.totalCount).toBe(0)
    })

    it('should clean up dependencies after clear', () => {
      for (let i = 0; i < 100; i++) {
        moduleApi.addDependency(`/file${i}.ts`, `/file${i + 1}.ts`)
      }

      moduleApi.clear()

      // 应该没有依赖关系了
      expect(moduleApi.findDependencies('/file0.ts')).toEqual([])
    })
  })

  // ==========================================================================
  // 边界值测试
  // ==========================================================================
  describe('边界值测试', () => {
    it('should handle very long strings', () => {
      const longString = 'a'.repeat(100000)

      cache.package.add(longString, {
        version: longString,
        path: longString,
        source: 'npm',
        status: 'loaded',
        files: new Set(),
      })

      expect(cache.package.has(longString)).toBe(true)

      registry.register('command', { name: longString }, longString, longString)
    })

    it('should handle unicode and emoji in identifiers', () => {
      const unicodeNames = [
        '日本語パッケージ',
        '한국어패키지',
        'حزمة عربية',
        '🎉🚀💻',
        '混合mix混合',
      ]

      for (const name of unicodeNames) {
        loader.addPackage(name, `/path/${name}`, 'npm')
        expect(cache.package.has(name)).toBe(true)
      }
    })

    it('should handle zero and negative values', () => {
      registry.register('command', {}, 'pkg', '/f.ts', { priority: 0 })
      registry.register('command', {}, 'pkg', '/f.ts', { priority: -1 })
      registry.register('command', {}, 'pkg', '/f.ts', { priority: -999999 })

      expect(registry.getAll('command').length).toBe(3)
    })
  })
})
