/**
 * store/list.ts 测试
 * @module tests/store-list.test
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { packageList } from '../src/store/list'

describe('store/list', () => {
  beforeEach(() => {
    packageList.clear()
  })

  describe('set', () => {
    it('should set package list for a type', () => {
      const npmPackages = [
        { name: 'plugin-a', abs: '/path/to/a', pkg: '/path/to/a/package.json' },
        { name: 'plugin-b', abs: '/path/to/b', pkg: '/path/to/b/package.json' },
      ]

      packageList.set('npm', npmPackages)

      const result = packageList.get('npm')
      expect(result).toHaveLength(2)
      expect(result[0].name).toBe('plugin-a')
      expect(result[1].name).toBe('plugin-b')
    })

    it('should replace existing list', () => {
      packageList.set('npm', [{ name: 'old', abs: '/old', pkg: '/old/package.json' }])
      packageList.set('npm', [{ name: 'new', abs: '/new', pkg: '/new/package.json' }])

      const result = packageList.get('npm')
      expect(result).toHaveLength(1)
      expect(result[0].name).toBe('new')
    })
  })

  describe('add', () => {
    it('should add single package to list', () => {
      packageList.add('dev', { name: 'dev-plugin', abs: '/dev', pkg: '/dev/package.json' })

      const result = packageList.get('dev')
      expect(result).toHaveLength(1)
      expect(result[0].name).toBe('dev-plugin')
    })

    it('should not add duplicate package', () => {
      const pkg = { name: 'plugin', abs: '/path', pkg: '/path/package.json' }
      packageList.add('apps', pkg)
      packageList.add('apps', pkg)

      const result = packageList.get('apps')
      expect(result).toHaveLength(1)
    })
  })

  describe('get', () => {
    it('should return empty array for empty type', () => {
      const result = packageList.get('npm')
      expect(result).toEqual([])
    })

    it('should return copy of list', () => {
      const original = [{ name: 'test', abs: '/test', pkg: '/test/package.json' }]
      packageList.set('npm', original)

      const result = packageList.get('npm')
      result.push({ name: 'modified', abs: '/mod', pkg: '/mod/package.json' })

      expect(packageList.get('npm')).toHaveLength(1)
    })
  })

  describe('getAll', () => {
    it('should return all packages with type', () => {
      packageList.add('npm', { name: 'npm-pkg', abs: '/npm', pkg: '/npm/package.json' })
      packageList.add('dev', { name: 'dev-pkg', abs: '/dev', pkg: '/dev/package.json' })
      packageList.add('apps', { name: 'apps-pkg', abs: '/apps', pkg: '/apps/package.json' })

      const result = packageList.getAll()
      expect(result).toHaveLength(3)
      expect(result.find(p => p.type === 'npm')?.name).toBe('npm-pkg')
      expect(result.find(p => p.type === 'dev')?.name).toBe('dev-pkg')
      expect(result.find(p => p.type === 'apps')?.name).toBe('apps-pkg')
    })
  })

  describe('names', () => {
    it('should return names for specific type', () => {
      packageList.add('npm', { name: 'a', abs: '/a', pkg: '/a/package.json' })
      packageList.add('npm', { name: 'b', abs: '/b', pkg: '/b/package.json' })

      const names = packageList.names('npm')
      expect(names).toEqual(['a', 'b'])
    })

    it('should return all names with type prefix', () => {
      packageList.add('npm', { name: 'npm-pkg', abs: '/npm', pkg: '/npm/package.json' })
      packageList.add('dev', { name: 'dev-pkg', abs: '/dev', pkg: '/dev/package.json' })

      const names = packageList.names('all')
      expect(names).toContain('npm:npm-pkg')
      expect(names).toContain('dev:dev-pkg')
    })
  })

  describe('findByName', () => {
    it('should find package by name', () => {
      packageList.add('npm', { name: 'target', abs: '/target', pkg: '/target/package.json' })

      const result = packageList.findByName('target')
      expect(result).not.toBeNull()
      expect(result?.type).toBe('npm')
      expect(result?.item.abs).toBe('/target')
    })

    it('should return null for non-existent package', () => {
      const result = packageList.findByName('non-existent')
      expect(result).toBeNull()
    })

    it('should search across all types', () => {
      packageList.add('apps', { name: 'apps-target', abs: '/apps', pkg: '/apps/package.json' })

      const result = packageList.findByName('apps-target')
      expect(result?.type).toBe('apps')
    })
  })

  describe('remove', () => {
    it('should remove package by name', () => {
      packageList.add('npm', { name: 'to-remove', abs: '/rm', pkg: '/rm/package.json' })

      const removed = packageList.remove('npm', 'to-remove')
      expect(removed).toBe(true)
      expect(packageList.get('npm')).toHaveLength(0)
    })

    it('should return false for non-existent package', () => {
      const removed = packageList.remove('npm', 'non-existent')
      expect(removed).toBe(false)
    })
  })

  describe('clear', () => {
    it('should clear specific type', () => {
      packageList.add('npm', { name: 'npm', abs: '/npm', pkg: '/npm/package.json' })
      packageList.add('dev', { name: 'dev', abs: '/dev', pkg: '/dev/package.json' })

      packageList.clear('npm')

      expect(packageList.get('npm')).toHaveLength(0)
      expect(packageList.get('dev')).toHaveLength(1)
    })

    it('should clear all types', () => {
      packageList.add('npm', { name: 'npm', abs: '/npm', pkg: '/npm/package.json' })
      packageList.add('dev', { name: 'dev', abs: '/dev', pkg: '/dev/package.json' })
      packageList.add('apps', { name: 'apps', abs: '/apps', pkg: '/apps/package.json' })

      packageList.clear()

      expect(packageList.get('npm')).toHaveLength(0)
      expect(packageList.get('dev')).toHaveLength(0)
      expect(packageList.get('apps')).toHaveLength(0)
    })
  })

  describe('stats', () => {
    it('should return correct statistics', () => {
      packageList.add('npm', { name: 'a', abs: '/a', pkg: '/a/package.json' })
      packageList.add('npm', { name: 'b', abs: '/b', pkg: '/b/package.json' })
      packageList.add('dev', { name: 'c', abs: '/c', pkg: '/c/package.json' })

      const stats = packageList.stats()
      expect(stats.npm).toBe(2)
      expect(stats.dev).toBe(1)
      expect(stats.apps).toBe(0)
      expect(stats.total).toBe(3)
    })
  })
})
