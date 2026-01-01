/**
 * store/settings.ts 测试
 * @module tests/store-settings.test
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { engineSettings } from '../src/store/settings'

describe('store/settings', () => {
  const originalKarinVersion = process.env.KARIN_VERSION

  beforeEach(() => {
    engineSettings.clear()
    process.env.KARIN_VERSION = '1.0.0'
  })

  afterEach(() => {
    if (originalKarinVersion) {
      process.env.KARIN_VERSION = originalKarinVersion
    } else {
      process.env.KARIN_VERSION = undefined as any
    }
  })

  describe('set', () => {
    it('should set engine settings for package', () => {
      engineSettings.set('test-plugin', {
        version: '^1.0.0',
        ignoreEngines: false,
      })

      const settings = engineSettings.get('test-plugin')
      expect(settings).not.toBeNull()
      expect(settings?.version).toBe('^1.0.0')
      expect(settings?.ignoreEngines).toBe(false)
    })

    it('should override existing settings', () => {
      engineSettings.set('test-plugin', { version: '1.0.0', ignoreEngines: false })
      engineSettings.set('test-plugin', { version: '2.0.0', ignoreEngines: true })

      const settings = engineSettings.get('test-plugin')
      expect(settings?.version).toBe('2.0.0')
      expect(settings?.ignoreEngines).toBe(true)
    })
  })

  describe('get', () => {
    it('should return null for non-existent package', () => {
      const settings = engineSettings.get('non-existent')
      expect(settings).toBeNull()
    })

    it('should return copy of settings', () => {
      engineSettings.set('test', { version: '1.0.0', ignoreEngines: false })

      const settings = engineSettings.get('test')
      if (settings) {
        settings.version = 'modified'
      }

      expect(engineSettings.get('test')?.version).toBe('1.0.0')
    })
  })

  describe('getAll', () => {
    it('should return all settings', () => {
      engineSettings.set('pkg1', { version: '1.0.0', ignoreEngines: false })
      engineSettings.set('pkg2', { version: '2.0.0', ignoreEngines: true })

      const all = engineSettings.getAll()
      expect(Object.keys(all)).toHaveLength(2)
      expect(all.pkg1).toBeDefined()
      expect(all.pkg2).toBeDefined()
    })
  })

  describe('check', () => {
    it('should return true when no version required', () => {
      const result = engineSettings.check('test')
      expect(result).toBe(true)
    })

    it('should return true when ignoreEngines is true', () => {
      const result = engineSettings.check('test', '^99.0.0', true)
      expect(result).toBe(true)
    })

    it('should return true for compatible version', () => {
      process.env.KARIN_VERSION = '1.5.0'
      const result = engineSettings.check('test', '^1.0.0', false)
      expect(result).toBe(true)
    })

    it('should return false for incompatible version', () => {
      process.env.KARIN_VERSION = '1.0.0'
      const result = engineSettings.check('test', '^2.0.0', false)
      expect(result).toBe(false)
    })

    it('should return true when KARIN_VERSION is empty string', () => {
      process.env.KARIN_VERSION = ''
      const result = engineSettings.check('test', '^1.0.0', false)
      // 空字符串为 falsy，实现会跳过检查返回 true
      expect(result).toBe(true)
    })
  })

  describe('remove', () => {
    it('should remove settings', () => {
      engineSettings.set('to-remove', { version: '1.0.0', ignoreEngines: false })
      const removed = engineSettings.remove('to-remove')

      expect(removed).toBe(true)
      expect(engineSettings.get('to-remove')).toBeNull()
    })

    it('should return false for non-existent package', () => {
      const removed = engineSettings.remove('non-existent')
      expect(removed).toBe(false)
    })
  })

  describe('clear', () => {
    it('should clear all settings', () => {
      engineSettings.set('pkg1', { version: '1.0.0', ignoreEngines: false })
      engineSettings.set('pkg2', { version: '2.0.0', ignoreEngines: false })

      engineSettings.clear()

      expect(engineSettings.get('pkg1')).toBeNull()
      expect(engineSettings.get('pkg2')).toBeNull()
    })
  })

  describe('count', () => {
    it('should return count of incompatible plugins', () => {
      engineSettings.set('pkg1', { version: '^1.0.0', ignoreEngines: false })
      engineSettings.set('pkg2', { version: '^2.0.0', ignoreEngines: false })

      expect(engineSettings.count()).toBe(2)
    })
  })

  describe('print', () => {
    it('should not throw when printing', () => {
      engineSettings.set('pkg1', { version: '^1.0.0', ignoreEngines: false })

      expect(() => engineSettings.print()).not.toThrow()
    })
  })
})
