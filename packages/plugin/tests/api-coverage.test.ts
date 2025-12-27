/**
 * API 模块额外覆盖测试
 * 覆盖 api/*.ts 中未覆盖的行
 * @module tests/api-coverage.test
 */
import { describe, it, expect, beforeEach } from 'vitest'
import { cache } from '../src/api/cache'
import { registry } from '../src/api/registry'

describe('API 额外覆盖测试', () => {
  beforeEach(() => {
    cache.clearAll()
  })

  describe('cache.instance', () => {
    it('delete should throw for invalid type', () => {
      expect(() => cache.instance.delete('invalid' as any, 'id')).toThrow('invalid type')
    })

    it('delete should throw for empty id', () => {
      expect(() => cache.instance.delete('command', '')).toThrow('id must be a non-empty string')
    })

    it('delete should throw for whitespace id', () => {
      expect(() => cache.instance.delete('command', '   ')).toThrow('id must be a non-empty string')
    })

    it('getByPackage should throw for empty pkg', () => {
      expect(() => cache.instance.getByPackage('')).toThrow('pkg must be a non-empty string')
    })

    it('getByFile should throw for empty file', () => {
      expect(() => cache.instance.getByFile('')).toThrow('file must be a non-empty string')
    })

    it('deleteByPackage should throw for empty pkg', () => {
      expect(() => cache.instance.deleteByPackage('')).toThrow('pkg must be a non-empty string')
    })

    it('deleteByFile should throw for empty file', () => {
      expect(() => cache.instance.deleteByFile('')).toThrow('file must be a non-empty string')
    })
  })

  describe('cache.data', () => {
    it('set should throw for empty key', () => {
      expect(() => cache.data.set('', 'value')).toThrow('key must be a non-empty string')
    })

    it('set should throw for whitespace key', () => {
      expect(() => cache.data.set('   ', 'value')).toThrow('key must be a non-empty string')
    })

    it('get should throw for empty key', () => {
      expect(() => cache.data.get('')).toThrow('key must be a non-empty string')
    })

    it('has should throw for empty key', () => {
      expect(() => cache.data.has('')).toThrow('key must be a non-empty string')
    })

    it('delete should throw for empty key', () => {
      expect(() => cache.data.delete('')).toThrow('key must be a non-empty string')
    })
  })

  describe('cache.package', () => {
    it('add should throw for empty name', () => {
      expect(() => cache.package.add('', { version: '1.0.0', path: '/path', source: 'npm', files: new Set(), status: 'loading' })).toThrow('name must be a non-empty string')
    })

    it('getFiles should throw for empty name', () => {
      expect(() => cache.package.getFiles('')).toThrow('name must be a non-empty string')
    })

    it('addFile should throw for empty name', () => {
      expect(() => cache.package.addFile('', '/file.ts')).toThrow('name must be a non-empty string')
    })

    it('addFile should throw for empty file', () => {
      expect(() => cache.package.addFile('pkg', '')).toThrow('file must be a non-empty string')
    })

    it('removeFile should throw for empty name', () => {
      expect(() => cache.package.removeFile('', '/file.ts')).toThrow('name must be a non-empty string')
    })

    it('removeFile should throw for empty file', () => {
      expect(() => cache.package.removeFile('pkg', '')).toThrow('file must be a non-empty string')
    })

    it('findByFile should throw for empty file', () => {
      expect(() => cache.package.findByFile('')).toThrow('file must be a non-empty string')
    })

    it('setStatus should throw for empty name', () => {
      expect(() => cache.package.setStatus('', 'loading')).toThrow('name must be a non-empty string')
    })
  })

  describe('registry 额外测试', () => {
    it('get should throw for invalid type', () => {
      expect(() => registry.get('invalid' as any, 'id')).toThrow('Invalid type')
    })

    it('get should throw for empty id', () => {
      expect(() => registry.get('command', '')).toThrow('id must be a non-empty string')
    })

    it('unregister should throw for invalid type', () => {
      expect(() => registry.unregister('invalid' as any, 'id')).toThrow('Invalid type')
    })

    it('unregister should throw for empty id', () => {
      expect(() => registry.unregister('command', '')).toThrow('id must be a non-empty string')
    })

    it('unregisterByPackage should throw for empty pkg', () => {
      expect(() => registry.unregisterByPackage('')).toThrow('pkg must be a non-empty string')
    })

    it('unregisterByFile should throw for empty file', () => {
      expect(() => registry.unregisterByFile('')).toThrow('file must be a non-empty string')
    })

    it('getByPackage should throw for empty pkg', () => {
      expect(() => registry.getByPackage('')).toThrow('pkg must be a non-empty string')
    })

    it('getByFile should throw for empty file', () => {
      expect(() => registry.getByFile('')).toThrow('file must be a non-empty string')
    })
  })
})
