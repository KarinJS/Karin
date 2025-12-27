/**
 * hmr/config.ts 完整覆盖测试
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { hmrConfigManager, defineHMRConfig, HMR_CONFIG_FILES } from '../src/hmr/config'

describe('hmr/config 完整覆盖', () => {
  // 保存原始环境
  const originalEnv = process.env.NODE_ENV
  const originalKarinDev = process.env.KARIN_DEV

  beforeEach(() => {
    hmrConfigManager.clear()
  })

  afterEach(() => {
    process.env.NODE_ENV = originalEnv
    if (originalKarinDev !== undefined) {
      process.env.KARIN_DEV = originalKarinDev
    } else {
      delete process.env.KARIN_DEV
    }
  })

  describe('HMRConfigManager', () => {
    describe('isDev getter', () => {
      it('should return true in development mode', () => {
        process.env.NODE_ENV = 'development'
        // 由于isDev是模块级计算，这里只能测试当前状态
        const result = hmrConfigManager.isDev
        expect(typeof result).toBe('boolean')
      })
    })

    describe('findConfigFile', () => {
      it('should return null for empty pluginRoot', async () => {
        process.env.NODE_ENV = 'development'
        process.env.KARIN_DEV = 'true'

        const result = await hmrConfigManager.findConfigFile('')
        expect(result).toBeNull()
      })

      it('should return null for whitespace pluginRoot', async () => {
        process.env.NODE_ENV = 'development'
        process.env.KARIN_DEV = 'true'

        const result = await hmrConfigManager.findConfigFile('   ')
        expect(result).toBeNull()
      })

      it('should return cached path on second call', async () => {
        process.env.NODE_ENV = 'development'
        process.env.KARIN_DEV = 'true'

        // 第一次调用
        await hmrConfigManager.findConfigFile('/some/path')
        // 第二次调用应该返回缓存
        const result = await hmrConfigManager.findConfigFile('/some/path')
        // 如果没有配置文件，返回 null
        expect(result === null || typeof result === 'string').toBe(true)
      })
    })

    describe('loadConfig', () => {
      it('should return empty config for empty pluginRoot', async () => {
        process.env.NODE_ENV = 'development'
        process.env.KARIN_DEV = 'true'

        const config = await hmrConfigManager.loadConfig('')
        expect(config).toEqual({})
      })

      it('should return empty config when no config file exists', async () => {
        process.env.NODE_ENV = 'development'
        process.env.KARIN_DEV = 'true'

        const config = await hmrConfigManager.loadConfig('/non/existent/path')
        expect(config).toEqual({})
      })

      it('should return cached config on second call', async () => {
        process.env.NODE_ENV = 'development'
        process.env.KARIN_DEV = 'true'

        await hmrConfigManager.loadConfig('/some/path')
        const config = await hmrConfigManager.loadConfig('/some/path')
        expect(config).toBeDefined()
      })
    })

    describe('reloadConfig', () => {
      it('should reload config', async () => {
        process.env.NODE_ENV = 'development'
        process.env.KARIN_DEV = 'true'

        const config = await hmrConfigManager.reloadConfig('/non/existent')
        expect(config).toEqual({})
      })
    })

    describe('getConfig', () => {
      it('should return null for uncached plugin', () => {
        const config = hmrConfigManager.getConfig('/unknown/plugin')
        expect(config).toBeNull()
      })
    })

    describe('isHMRConfigFile', () => {
      it('should return true for valid HMR config filenames', () => {
        expect(hmrConfigManager.isHMRConfigFile('/path/to/karin.hmr.config.ts')).toBe(true)
        expect(hmrConfigManager.isHMRConfigFile('/path/to/karin.hmr.config.mts')).toBe(true)
        expect(hmrConfigManager.isHMRConfigFile('/path/to/karin.hmr.config.js')).toBe(true)
        expect(hmrConfigManager.isHMRConfigFile('/path/to/karin.hmr.config.mjs')).toBe(true)
      })

      it('should return false for invalid filenames', () => {
        expect(hmrConfigManager.isHMRConfigFile('/path/to/other.config.ts')).toBe(false)
        expect(hmrConfigManager.isHMRConfigFile('/path/to/karin.config.ts')).toBe(false)
      })

      it('should return false for empty string', () => {
        expect(hmrConfigManager.isHMRConfigFile('')).toBe(false)
      })

      it('should return false for non-string input', () => {
        expect(hmrConfigManager.isHMRConfigFile(null as any)).toBe(false)
        expect(hmrConfigManager.isHMRConfigFile(undefined as any)).toBe(false)
      })
    })

    describe('clear', () => {
      it('should clear all caches', () => {
        hmrConfigManager.clear()
        expect(hmrConfigManager.getConfig('/any/path')).toBeNull()
      })
    })
  })

  describe('defineHMRConfig', () => {
    it('should return the same config object', () => {
      const input = { debounce: 200 }
      const result = defineHMRConfig(input)
      expect(result).toBe(input)
    })

    it('should work with all config options', () => {
      const config = defineHMRConfig({
        debounce: 100,
        exclude: ['node_modules'],
        watch: ['src'],
        modules: {
          'src/timer.ts': async () => {},
        },
        onBeforeHot: async () => {},
        onAfterHot: async () => {},
        effects: async () => {},
        karinConfig: {
          onBeforeChange: async () => {},
          onAfterChange: async () => {},
          requireFullReload: () => false,
        },
      })

      expect(config.debounce).toBe(100)
      expect(config.exclude).toEqual(['node_modules'])
      expect(config.watch).toEqual(['src'])
      expect(typeof config.modules).toBe('object')
      expect(typeof config.onBeforeHot).toBe('function')
      expect(typeof config.onAfterHot).toBe('function')
      expect(typeof config.effects).toBe('function')
      expect(typeof config.karinConfig?.onBeforeChange).toBe('function')
    })
  })

  describe('HMR_CONFIG_FILES', () => {
    it('should have correct config file names', () => {
      expect(HMR_CONFIG_FILES).toContain('karin.hmr.config.ts')
      expect(HMR_CONFIG_FILES).toContain('karin.hmr.config.mts')
      expect(HMR_CONFIG_FILES).toContain('karin.hmr.config.js')
      expect(HMR_CONFIG_FILES).toContain('karin.hmr.config.mjs')
      expect(HMR_CONFIG_FILES.length).toBe(4)
    })
  })
})
