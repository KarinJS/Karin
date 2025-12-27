/**
 * API 模块完整覆盖测试
 * 覆盖所有剩余未覆盖的行
 * @module tests/api-coverage-full.test
 */
import { describe, it, expect, beforeEach } from 'vitest'
import { cache } from '../src/api/cache'
import { registry } from '../src/api/registry'
import { loader } from '../src/api/loader'
import { lifecycle } from '../src/api/lifecycle'
import { moduleApi } from '../src/api/module'

describe('API 完整覆盖测试', () => {
  beforeEach(() => {
    cache.clearAll()
  })

  describe('cache.package 验证测试', () => {
    // 覆盖 cache.ts 第23行 - data 必须是有效对象
    it('add should throw for non-object data (null)', () => {
      expect(() => cache.package.add('pkg', null as any)).toThrow('data must be a valid object')
    })

    it('add should throw for primitive data', () => {
      expect(() => cache.package.add('pkg', 'string' as any)).toThrow('data must be a valid object')
      expect(() => cache.package.add('pkg', 123 as any)).toThrow('data must be a valid object')
      expect(() => cache.package.add('pkg', undefined as any)).toThrow('data must be a valid object')
    })

    // get/has/delete 不抛出错误的验证
    it('get should return undefined for empty name', () => {
      expect(cache.package.get('')).toBeUndefined()
    })

    it('has should return false for empty name', () => {
      expect(cache.package.has('')).toBe(false)
    })

    it('delete should return false for empty name', () => {
      expect(cache.package.delete('')).toBe(false)
    })
  })

  describe('cache.instance 验证测试', () => {
    // 覆盖 cache.ts 第183行 - item 必须是有效对象
    it('add should throw for non-object item (null)', () => {
      expect(() => cache.instance.add('command', 'id', null as any)).toThrow('item must be a valid object')
    })

    it('add should throw for primitive item', () => {
      expect(() => cache.instance.add('command', 'id', 'string' as any)).toThrow('item must be a valid object')
      expect(() => cache.instance.add('command', 'id', 123 as any)).toThrow('item must be a valid object')
      expect(() => cache.instance.add('command', 'id', undefined as any)).toThrow('item must be a valid object')
    })

    // get 抛出错误的验证
    it('get should throw for empty id', () => {
      expect(() => cache.instance.get('command', '')).toThrow('id must be a non-empty string')
    })

    // 类型验证
    it('add should throw for invalid type', () => {
      const item = { id: 'id', type: 'command', pkg: 'pkg', file: 'file', priority: 0, enabled: true, instance: {} }
      expect(() => cache.instance.add('invalid' as any, 'id', item)).toThrow('invalid type')
    })
  })

  describe('lifecycle 验证测试', () => {
    // 覆盖 lifecycle.ts 第46行 - disable 中 Package not found
    it('disable should throw for non-existent package', async () => {
      await expect(lifecycle.disable('non-existent-package')).rejects.toThrow('Package not found')
    })

    // 覆盖 lifecycle.ts 第70行 - unload 中 Package not found
    it('unload should throw for non-existent package', async () => {
      await expect(lifecycle.unload('non-existent-package')).rejects.toThrow('Package not found')
    })

    // 正常情况下的 disable 和 unload
    it('disable should work for existing package', async () => {
      // 先添加一个包
      cache.package.add('test-pkg', {
        version: '1.0.0',
        path: '/test/path',
        source: 'npm',
        files: new Set(),
        status: 'loaded',
      })

      await lifecycle.disable('test-pkg')
      expect(cache.package.get('test-pkg')?.status).toBe('disabled')
    })

    it('unload should work for existing package', async () => {
      // 先添加一个包
      cache.package.add('test-pkg-2', {
        version: '1.0.0',
        path: '/test/path',
        source: 'npm',
        files: new Set(),
        status: 'loaded',
      })

      await lifecycle.unload('test-pkg-2')
      expect(cache.package.has('test-pkg-2')).toBe(false)
    })
  })

  describe('loader 验证测试', () => {
    // 覆盖 loader.ts 第83行 - loadPackage 中 pkgPath 验证
    it('loadPackage should throw for empty pkgPath', async () => {
      await expect(loader.loadPackage({ pkgPath: '', pkgName: 'name' })).rejects.toThrow('pkgPath must be a non-empty string')
    })

    it('loadPackage should throw for whitespace pkgPath', async () => {
      await expect(loader.loadPackage({ pkgPath: '   ', pkgName: 'name' })).rejects.toThrow('pkgPath must be a non-empty string')
    })

    // 覆盖 loader.ts 第108行 - reloadFile 验证
    it('reloadFile should throw for empty filePath', async () => {
      await expect(loader.reloadFile('')).rejects.toThrow('filePath must be a non-empty string')
    })

    it('reloadFile should throw for whitespace filePath', async () => {
      await expect(loader.reloadFile('   ')).rejects.toThrow('filePath must be a non-empty string')
    })

    // 覆盖 loader.ts 第119行 - reloadPackage 验证
    it('reloadPackage should throw for empty pkgName', async () => {
      await expect(loader.reloadPackage('')).rejects.toThrow('pkgName must be a non-empty string')
    })

    it('reloadPackage should throw for whitespace pkgName', async () => {
      await expect(loader.reloadPackage('   ')).rejects.toThrow('pkgName must be a non-empty string')
    })

    // 覆盖 loader.ts 第213行 - addFileToPackage pkgName 验证
    it('addFileToPackage should throw for empty pkgName', () => {
      expect(() => loader.addFileToPackage('', '/file.ts')).toThrow('pkgName must be a non-empty string')
    })

    // 覆盖 loader.ts 第216行 - addFileToPackage file 验证
    it('addFileToPackage should throw for empty file', () => {
      expect(() => loader.addFileToPackage('pkg', '')).toThrow('file must be a non-empty string')
    })
  })

  describe('moduleApi 验证测试', () => {
    // 覆盖 module.ts - clearCache 验证
    it('clearCache should throw for empty filePath', async () => {
      await expect(moduleApi.clearCache('')).rejects.toThrow('filePath must be a non-empty string')
    })

    it('clearCache should throw for whitespace filePath', async () => {
      await expect(moduleApi.clearCache('   ')).rejects.toThrow('filePath must be a non-empty string')
    })

    // 覆盖 module.ts - clearCaches 验证
    it('clearCaches should throw for non-array', async () => {
      await expect(moduleApi.clearCaches('notarray' as any)).rejects.toThrow('fileURLs must be an array')
    })

    it('clearCaches should throw for null', async () => {
      await expect(moduleApi.clearCaches(null as any)).rejects.toThrow('fileURLs must be an array')
    })

    // 空数组应该正常工作
    it('clearCaches should work for empty array', async () => {
      await expect(moduleApi.clearCaches([])).resolves.toBeUndefined()
    })

    // 覆盖 module.ts - findDependentModules 验证
    it('findDependentModules should throw for empty filePath', async () => {
      await expect(moduleApi.findDependentModules('')).rejects.toThrow('filePath must be a non-empty string')
    })

    it('findDependentModules should throw for whitespace filePath', async () => {
      await expect(moduleApi.findDependentModules('   ')).rejects.toThrow('filePath must be a non-empty string')
    })

    // 覆盖 module.ts - findDependents 验证
    it('findDependents should throw for empty filePath', () => {
      expect(() => moduleApi.findDependents('')).toThrow('filePath must be a non-empty string')
    })

    it('findDependents should throw for whitespace filePath', () => {
      expect(() => moduleApi.findDependents('   ')).toThrow('filePath must be a non-empty string')
    })

    // 覆盖 module.ts - addDependency 验证
    it('addDependency should throw for empty from', () => {
      expect(() => moduleApi.addDependency('', '/dep.ts')).toThrow('from must be a non-empty string')
    })

    it('addDependency should throw for empty to', () => {
      expect(() => moduleApi.addDependency('/file.ts', '')).toThrow('to must be a non-empty string')
    })

    // 覆盖 module.ts - clearDependencies 验证
    it('clearDependencies should throw for empty filePath', () => {
      expect(() => moduleApi.clearDependencies('')).toThrow('filePath must be a non-empty string')
    })

    it('clearDependencies should throw for whitespace filePath', () => {
      expect(() => moduleApi.clearDependencies('   ')).toThrow('filePath must be a non-empty string')
    })

    // 覆盖依赖关系管理
    it('should manage dependencies correctly', () => {
      moduleApi.addDependency('/a.ts', '/b.ts')
      moduleApi.addDependency('/a.ts', '/c.ts')
      moduleApi.addDependency('/b.ts', '/c.ts')

      const dependents = moduleApi.findDependents('/c.ts')
      expect(dependents).toContain('/a.ts')
      expect(dependents).toContain('/b.ts')

      moduleApi.clearDependencies('/a.ts')
      const dependentsAfter = moduleApi.findDependents('/c.ts')
      expect(dependentsAfter).not.toContain('/a.ts')
      expect(dependentsAfter).toContain('/b.ts')
    })

    // 覆盖 findDependencies 验证
    it('findDependencies should throw for empty filePath', () => {
      expect(() => moduleApi.findDependencies('')).toThrow('filePath must be a non-empty string')
    })

    // 覆盖 getPackageByFile 和 getFilesByPackage
    it('getPackageByFile should return null for unknown file', () => {
      expect(moduleApi.getPackageByFile('/unknown/file.ts')).toBeNull()
    })

    it('getFilesByPackage should return empty array for unknown package', () => {
      expect(moduleApi.getFilesByPackage('unknown-package')).toEqual([])
    })

    // 覆盖 setExclude
    it('setExclude should accept array of patterns', () => {
      moduleApi.setExclude(['node_modules', '*.test.ts'])
    })

    // 覆盖 getImportUrl
    it('getImportUrl should return valid URL', () => {
      const url = moduleApi.getImportUrl('/test/file.ts')
      expect(typeof url).toBe('string')
      expect(url).toContain('/test/file.ts')
    })

    // 覆盖 resetVersion
    it('resetVersion should not throw', () => {
      expect(() => moduleApi.resetVersion('/test/file.ts')).not.toThrow()
    })

    // 覆盖 clear
    it('clear should not throw', () => {
      moduleApi.addDependency('/a.ts', '/b.ts')
      expect(() => moduleApi.clear()).not.toThrow()
    })
  })

  describe('registry 额外验证测试', () => {
    // 覆盖 registry.ts 第38行 - register 中 Invalid type
    it('register should throw for invalid type', () => {
      expect(() => registry.register('invalid' as any, {}, 'pkg', 'file')).toThrow('Invalid type')
    })

    // 覆盖 registry.ts - register 验证
    it('register should throw for empty pkg', () => {
      expect(() => registry.register('command', {}, '', 'file')).toThrow('pkg must be a non-empty string')
    })

    it('register should throw for empty file', () => {
      expect(() => registry.register('command', {}, 'pkg', '')).toThrow('file must be a non-empty string')
    })

    // 覆盖 registry.ts - getAll 验证
    it('getAll should throw for invalid type', () => {
      expect(() => registry.getAll('invalid' as any)).toThrow('Invalid type')
    })

    // 覆盖 registry.ts - enable 验证
    it('enable should throw for invalid type', () => {
      expect(() => registry.enable('invalid' as any, 'id')).toThrow('Invalid type')
    })

    it('enable should throw for empty id', () => {
      expect(() => registry.enable('command', '')).toThrow('id must be a non-empty string')
    })

    // 覆盖 registry.ts - disable 验证
    it('disable should throw for invalid type', () => {
      expect(() => registry.disable('invalid' as any, 'id')).toThrow('Invalid type')
    })

    it('disable should throw for empty id', () => {
      expect(() => registry.disable('command', '')).toThrow('id must be a non-empty string')
    })

    // 覆盖 registry.ts - getEnabled 验证
    it('getEnabled should throw for invalid type', () => {
      expect(() => registry.getEnabled('invalid' as any)).toThrow('Invalid type')
    })

    // 覆盖 enable/disable 返回值
    it('enable should return false for non-existent item', () => {
      expect(registry.enable('command', 'non-existent-id')).toBe(false)
    })

    it('disable should return false for non-existent item', () => {
      expect(registry.disable('command', 'non-existent-id')).toBe(false)
    })

    // 覆盖正常的 enable/disable 流程
    it('enable and disable should work for existing item', () => {
      const id = registry.register('command', { fn: () => { } }, 'pkg', 'file')

      // 默认是启用的
      expect(registry.getEnabled('command').some(item => item.id === id)).toBe(true)

      // 禁用
      expect(registry.disable('command', id)).toBe(true)
      expect(registry.getEnabled('command').some(item => item.id === id)).toBe(false)

      // 启用
      expect(registry.enable('command', id)).toBe(true)
      expect(registry.getEnabled('command').some(item => item.id === id)).toBe(true)
    })

    // 覆盖 registry.ts - sort 方法
    it('sort should order by priority descending', () => {
      registry.register('command', {}, 'pkg', 'file1', { priority: 10 })
      registry.register('command', {}, 'pkg', 'file2', { priority: 50 })
      registry.register('command', {}, 'pkg', 'file3', { priority: 30 })

      registry.sort('command')

      const items = registry.getAll('command')
      expect(items[0].priority).toBe(50)
      expect(items[1].priority).toBe(30)
      expect(items[2].priority).toBe(10)
    })

    it('sort without type should sort all types', () => {
      registry.register('command', {}, 'pkg', 'file1', { priority: 10 })
      registry.register('command', {}, 'pkg', 'file2', { priority: 50 })
      registry.register('handler', {}, 'pkg', 'file3', { priority: 20 })
      registry.register('handler', {}, 'pkg', 'file4', { priority: 40 })

      registry.sort()

      const commands = registry.getAll('command')
      const handlers = registry.getAll('handler')

      expect(commands[0].priority).toBe(50)
      expect(commands[1].priority).toBe(10)
      expect(handlers[0].priority).toBe(40)
      expect(handlers[1].priority).toBe(20)
    })

    // 覆盖 stats 方法
    it('stats should return statistics', () => {
      registry.register('command', {}, 'pkg', 'file1')
      registry.register('handler', {}, 'pkg', 'file2')

      const stats = registry.stats()
      expect(stats).toBeDefined()
      expect(typeof stats).toBe('object')
    })
  })
})
