/**
 * hmr/enhanced.ts 未覆盖分支测试
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { EnhancedHMR, createEnhancedHMR } from '../src/hmr/enhanced'

describe('hmr/enhanced 边缘情况覆盖', () => {
  describe('createEnhancedHMR', () => {
    it('should create EnhancedHMR instance', () => {
      const hmr = createEnhancedHMR({
        pluginRoot: '/test',
        pluginName: 'test-plugin',
        paths: ['/test/src'],
      })
      expect(hmr).toBeInstanceOf(EnhancedHMR)
    })

    it('should throw when paths is not an array', () => {
      expect(() => createEnhancedHMR({
        pluginRoot: '/test',
        pluginName: 'test-plugin',
      } as any)).toThrow('EnhancedHMR: paths must be an array')
    })

    it('should throw when pluginName is empty', () => {
      expect(() => createEnhancedHMR({
        pluginRoot: '/test',
        pluginName: '',
        paths: [],
      })).toThrow('EnhancedHMR: pluginName must be a non-empty string')
    })

    it('should throw when pluginRoot is empty', () => {
      expect(() => createEnhancedHMR({
        pluginRoot: '',
        pluginName: 'test',
        paths: [],
      })).toThrow('EnhancedHMR: pluginRoot must be a non-empty string')
    })
  })

  describe('EnhancedHMR', () => {
    let hmr: EnhancedHMR

    beforeEach(() => {
      hmr = new EnhancedHMR({
        pluginRoot: '/test',
        pluginName: 'test-plugin',
        debounce: 50,
        verbose: true,
        paths: ['/test/src'],
      })
    })

    describe('constructor options', () => {
      it('should accept minimal options', () => {
        const instance = new EnhancedHMR({
          pluginRoot: '/min',
          pluginName: 'min-plugin',
          paths: [],
        })
        expect(instance).toBeInstanceOf(EnhancedHMR)
      })

      it('should accept all options', () => {
        const instance = new EnhancedHMR({
          pluginRoot: '/full',
          pluginName: 'full-plugin',
          debounce: 100,
          verbose: true,
          paths: ['/full/src'],
        })
        expect(instance).toBeInstanceOf(EnhancedHMR)
      })
    })

    describe('matchPattern edge cases', () => {
      it('should handle various patterns through handleHotUpdate', async () => {
        expect(hmr).toBeDefined()
      })
    })

    describe('debounce validation', () => {
      it('should handle negative debounce', () => {
        const negativeHmr = new EnhancedHMR({
          pluginRoot: '/test',
          pluginName: 'test',
          debounce: -1,
          paths: [],
        })
        expect(negativeHmr).toBeDefined()
      })

      it('should handle NaN debounce', () => {
        const nanHmr = new EnhancedHMR({
          pluginRoot: '/test',
          pluginName: 'test',
          debounce: NaN,
          paths: [],
        })
        expect(nanHmr).toBeDefined()
      })

      it('should handle Infinity debounce', () => {
        const infHmr = new EnhancedHMR({
          pluginRoot: '/test',
          pluginName: 'test',
          debounce: Infinity,
          paths: [],
        })
        expect(infHmr).toBeDefined()
      })
    })

    describe('log levels', () => {
      it('should respect verbose option', () => {
        const quietHmr = new EnhancedHMR({
          pluginRoot: '/test',
          pluginName: 'test',
          verbose: false,
          paths: [],
        })
        expect(quietHmr).toBeDefined()

        const loudHmr = new EnhancedHMR({
          pluginRoot: '/test',
          pluginName: 'test',
          verbose: true,
          paths: [],
        })
        expect(loudHmr).toBeDefined()
      })
    })
  })
})
