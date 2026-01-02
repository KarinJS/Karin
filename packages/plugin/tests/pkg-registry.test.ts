/**
 * pkgRegistry API 单元测试
 */
import { describe, it, expect, beforeEach } from 'vitest'
import { pkgRegistry } from '../src/pkg'

describe('pkg/pkgRegistry', () => {
  beforeEach(() => {
    pkgRegistry.clear()
  })

  describe('register()', () => {
    it('should register a package', () => {
      pkgRegistry.register({
        name: 'test-pkg',
        abs: '/path/to/test-pkg',
        pkgPath: '/path/to/test-pkg/package.json',
        type: 'npm',
      })

      const pkg = pkgRegistry.get('test-pkg')
      expect(pkg).toBeDefined()
      expect(pkg?.name).toBe('test-pkg')
      expect(pkg?.type).toBe('npm')
    })

    it('should register with optional main', () => {
      pkgRegistry.register({
        name: 'main-pkg',
        abs: '/path/to/main-pkg',
        pkgPath: '/path/to/main-pkg/package.json',
        type: 'npm',
        main: '/path/to/main-pkg/dist/index.js',
      })

      const pkg = pkgRegistry.get('main-pkg')
      expect(pkg?.main).toBe('/path/to/main-pkg/dist/index.js')
    })

    it('should overwrite existing package', () => {
      pkgRegistry.register({
        name: 'dup-pkg',
        abs: '/old/path',
        pkgPath: '/old/path/package.json',
        type: 'npm',
      })

      pkgRegistry.register({
        name: 'dup-pkg',
        abs: '/new/path',
        pkgPath: '/new/path/package.json',
        type: 'apps',
      })

      const pkg = pkgRegistry.get('dup-pkg')
      expect(pkg?.abs).toBe('/new/path')
      expect(pkg?.type).toBe('apps')
    })
  })

  describe('addFile()', () => {
    it('should add file to package', () => {
      pkgRegistry.register({
        name: 'file-pkg',
        abs: '/path/to/file-pkg',
        pkgPath: '/path/to/file-pkg/package.json',
        type: 'npm',
      })

      pkgRegistry.addFile('file-pkg', '/path/to/file-pkg/src/index.ts')

      const files = pkgRegistry.getFiles('file-pkg')
      expect(files).toContain('/path/to/file-pkg/src/index.ts')
    })

    it('should normalize paths', () => {
      pkgRegistry.register({
        name: 'norm-pkg',
        abs: '/path/to/norm-pkg',
        pkgPath: '/path/to/norm-pkg/package.json',
        type: 'npm',
      })

      pkgRegistry.addFile('norm-pkg', '\\path\\to\\norm-pkg\\src\\index.ts')

      const files = pkgRegistry.getFiles('norm-pkg')
      expect(files).toContain('/path/to/norm-pkg/src/index.ts')
    })

    it('should add multiple files', () => {
      pkgRegistry.register({
        name: 'multi-pkg',
        abs: '/path',
        pkgPath: '/path/package.json',
        type: 'npm',
      })

      pkgRegistry.addFile('multi-pkg', '/path/src/a.ts')
      pkgRegistry.addFile('multi-pkg', '/path/src/b.ts')
      pkgRegistry.addFile('multi-pkg', '/path/src/c.ts')

      const files = pkgRegistry.getFiles('multi-pkg')
      expect(files.length).toBe(3)
    })

    it('should not duplicate files', () => {
      pkgRegistry.register({
        name: 'dup-file-pkg',
        abs: '/path',
        pkgPath: '/path/package.json',
        type: 'npm',
      })

      pkgRegistry.addFile('dup-file-pkg', '/path/src/a.ts')
      pkgRegistry.addFile('dup-file-pkg', '/path/src/a.ts')

      const files = pkgRegistry.getFiles('dup-file-pkg')
      expect(files.length).toBe(1)
    })
  })

  describe('removeFile()', () => {
    it('should remove file from package', () => {
      pkgRegistry.register({
        name: 'rm-pkg',
        abs: '/path',
        pkgPath: '/path/package.json',
        type: 'npm',
      })

      pkgRegistry.addFile('rm-pkg', '/path/src/a.ts')
      pkgRegistry.addFile('rm-pkg', '/path/src/b.ts')

      pkgRegistry.removeFile('/path/src/a.ts')

      const files = pkgRegistry.getFiles('rm-pkg')
      expect(files).not.toContain('/path/src/a.ts')
      expect(files).toContain('/path/src/b.ts')
    })

    it('should handle non-existent file', () => {
      expect(() => {
        pkgRegistry.removeFile('/non/existent/file.ts')
      }).not.toThrow()
    })
  })

  describe('remove()', () => {
    it('should remove package and its files', () => {
      pkgRegistry.register({
        name: 'rm-all-pkg',
        abs: '/path',
        pkgPath: '/path/package.json',
        type: 'npm',
      })

      pkgRegistry.addFile('rm-all-pkg', '/path/src/a.ts')
      pkgRegistry.addFile('rm-all-pkg', '/path/src/b.ts')

      pkgRegistry.remove('rm-all-pkg')

      expect(pkgRegistry.get('rm-all-pkg')).toBeUndefined()
      expect(pkgRegistry.getFiles('rm-all-pkg')).toEqual([])
      expect(pkgRegistry.getPackageNameByFile('/path/src/a.ts')).toBeNull()
    })
  })

  describe('getPackageNameByFile()', () => {
    it('should return package name for file', () => {
      pkgRegistry.register({
        name: 'lookup-pkg',
        abs: '/path',
        pkgPath: '/path/package.json',
        type: 'npm',
      })

      pkgRegistry.addFile('lookup-pkg', '/path/src/index.ts')

      const pkgName = pkgRegistry.getPackageNameByFile('/path/src/index.ts')
      expect(pkgName).toBe('lookup-pkg')
    })

    it('should return null for unknown file', () => {
      const pkgName = pkgRegistry.getPackageNameByFile('/unknown/file.ts')
      expect(pkgName).toBeNull()
    })

    it('should normalize path when looking up', () => {
      pkgRegistry.register({
        name: 'norm-lookup-pkg',
        abs: '/path',
        pkgPath: '/path/package.json',
        type: 'npm',
      })

      pkgRegistry.addFile('norm-lookup-pkg', '/path/src/index.ts')

      const pkgName = pkgRegistry.getPackageNameByFile('\\path\\src\\index.ts')
      expect(pkgName).toBe('norm-lookup-pkg')
    })
  })

  describe('get()', () => {
    it('should return package info', () => {
      pkgRegistry.register({
        name: 'get-pkg',
        abs: '/path/to/get-pkg',
        pkgPath: '/path/to/get-pkg/package.json',
        type: 'dev',
      })

      const pkg = pkgRegistry.get('get-pkg')
      expect(pkg).toEqual({
        name: 'get-pkg',
        abs: '/path/to/get-pkg',
        pkgPath: '/path/to/get-pkg/package.json',
        type: 'dev',
      })
    })

    it('should return undefined for unknown package', () => {
      expect(pkgRegistry.get('unknown-pkg')).toBeUndefined()
    })
  })

  describe('getAbsPath()', () => {
    it('should return absolute path', () => {
      pkgRegistry.register({
        name: 'abs-pkg',
        abs: '/absolute/path',
        pkgPath: '/absolute/path/package.json',
        type: 'npm',
      })

      expect(pkgRegistry.getAbsPath('abs-pkg')).toBe('/absolute/path')
    })

    it('should return empty string for unknown package', () => {
      expect(pkgRegistry.getAbsPath('unknown-pkg')).toBe('')
    })
  })

  describe('getFiles()', () => {
    it('should return all files for package', () => {
      pkgRegistry.register({
        name: 'files-pkg',
        abs: '/path',
        pkgPath: '/path/package.json',
        type: 'npm',
      })

      pkgRegistry.addFile('files-pkg', '/path/a.ts')
      pkgRegistry.addFile('files-pkg', '/path/b.ts')

      const files = pkgRegistry.getFiles('files-pkg')
      expect(files).toEqual(['/path/a.ts', '/path/b.ts'])
    })

    it('should return empty array for unknown package', () => {
      expect(pkgRegistry.getFiles('unknown-pkg')).toEqual([])
    })
  })

  describe('list()', () => {
    it('should return all package names', () => {
      pkgRegistry.register({
        name: 'pkg-a',
        abs: '/a',
        pkgPath: '/a/package.json',
        type: 'npm',
      })

      pkgRegistry.register({
        name: 'pkg-b',
        abs: '/b',
        pkgPath: '/b/package.json',
        type: 'apps',
      })

      const list = pkgRegistry.list()
      expect(list).toContain('pkg-a')
      expect(list).toContain('pkg-b')
      expect(list.length).toBe(2)
    })

    it('should return empty array when no packages', () => {
      expect(pkgRegistry.list()).toEqual([])
    })
  })

  describe('clear()', () => {
    it('should clear all data', () => {
      pkgRegistry.register({
        name: 'clear-pkg',
        abs: '/path',
        pkgPath: '/path/package.json',
        type: 'npm',
      })

      pkgRegistry.addFile('clear-pkg', '/path/a.ts')

      pkgRegistry.clear()

      expect(pkgRegistry.list()).toEqual([])
      expect(pkgRegistry.stats()).toEqual({ packages: 0, files: 0 })
    })
  })

  describe('stats()', () => {
    it('should return correct statistics', () => {
      pkgRegistry.register({
        name: 'stat-pkg-1',
        abs: '/a',
        pkgPath: '/a/package.json',
        type: 'npm',
      })

      pkgRegistry.register({
        name: 'stat-pkg-2',
        abs: '/b',
        pkgPath: '/b/package.json',
        type: 'apps',
      })

      pkgRegistry.addFile('stat-pkg-1', '/a/x.ts')
      pkgRegistry.addFile('stat-pkg-1', '/a/y.ts')
      pkgRegistry.addFile('stat-pkg-2', '/b/z.ts')

      expect(pkgRegistry.stats()).toEqual({
        packages: 2,
        files: 3,
      })
    })
  })

  describe('package types', () => {
    it('should support npm type', () => {
      pkgRegistry.register({
        name: 'npm-pkg',
        abs: '/path',
        pkgPath: '/path/package.json',
        type: 'npm',
      })

      expect(pkgRegistry.get('npm-pkg')?.type).toBe('npm')
    })

    it('should support apps type', () => {
      pkgRegistry.register({
        name: 'apps-pkg',
        abs: '/path',
        pkgPath: '/path/package.json',
        type: 'apps',
      })

      expect(pkgRegistry.get('apps-pkg')?.type).toBe('apps')
    })

    it('should support dev type', () => {
      pkgRegistry.register({
        name: 'dev-pkg',
        abs: '/path',
        pkgPath: '/path/package.json',
        type: 'dev',
      })

      expect(pkgRegistry.get('dev-pkg')?.type).toBe('dev')
    })
  })
})
