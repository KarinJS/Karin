/**
 * store/public.ts 测试
 * @module tests/store-public.test
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { publicManager } from '../src/store/public'

describe('store/public', () => {
  beforeEach(() => {
    publicManager.clear()
  })

  describe('set', () => {
    it('should set single directory', () => {
      publicManager.set('test-plugin', './public')

      const dirs = publicManager.get('test-plugin')
      expect(dirs).toEqual(['./public'])
    })

    it('should set multiple directories', () => {
      publicManager.set('test-plugin', ['./public', './dist/assets'])

      const dirs = publicManager.get('test-plugin')
      expect(dirs).toEqual(['./public', './dist/assets'])
    })

    it('should ignore empty string', () => {
      publicManager.set('test-plugin', '')

      const dirs = publicManager.get('test-plugin')
      expect(dirs).toEqual([])
    })

    it('should ignore empty array', () => {
      publicManager.set('test-plugin', [])

      const dirs = publicManager.get('test-plugin')
      expect(dirs).toEqual([])
    })

    it('should filter empty strings in array', () => {
      publicManager.set('test-plugin', ['./valid', '', './another'])

      const dirs = publicManager.get('test-plugin')
      expect(dirs).toEqual(['./valid', './another'])
    })

    it('should handle undefined', () => {
      publicManager.set('test-plugin', undefined)

      const dirs = publicManager.get('test-plugin')
      expect(dirs).toEqual([])
    })
  })

  describe('get', () => {
    it('should return empty array for non-existent package', () => {
      const dirs = publicManager.get('non-existent')
      expect(dirs).toEqual([])
    })

    it('should return copy of directories', () => {
      publicManager.set('test', ['./public'])

      const dirs = publicManager.get('test')
      dirs.push('./modified')

      expect(publicManager.get('test')).toEqual(['./public'])
    })
  })

  describe('getAll', () => {
    it('should return all package directories', () => {
      publicManager.set('pkg1', './public1')
      publicManager.set('pkg2', ['./public2', './assets'])

      const all = publicManager.getAll()
      expect(Object.keys(all)).toHaveLength(2)
      expect(all.pkg1).toEqual(['./public1'])
      expect(all.pkg2).toEqual(['./public2', './assets'])
    })
  })

  describe('remove', () => {
    it('should remove package directories', () => {
      publicManager.set('to-remove', './public')
      const removed = publicManager.remove('to-remove')

      expect(removed).toBe(true)
      expect(publicManager.get('to-remove')).toEqual([])
    })

    it('should return false for non-existent package', () => {
      const removed = publicManager.remove('non-existent')
      expect(removed).toBe(false)
    })
  })

  describe('clear', () => {
    it('should clear all directories', () => {
      publicManager.set('pkg1', './public1')
      publicManager.set('pkg2', './public2')

      publicManager.clear()

      expect(publicManager.get('pkg1')).toEqual([])
      expect(publicManager.get('pkg2')).toEqual([])
    })
  })

  describe('stats', () => {
    it('should return correct statistics', () => {
      publicManager.set('pkg1', ['./a', './b'])
      publicManager.set('pkg2', './c')

      const stats = publicManager.stats()
      expect(stats.packages).toBe(2)
      expect(stats.directories).toBe(3)
    })

    it('should return zeros for empty manager', () => {
      const stats = publicManager.stats()
      expect(stats.packages).toBe(0)
      expect(stats.directories).toBe(0)
    })
  })
})
