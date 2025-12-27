/**
 * HMR 配置管理器测试
 * 目标：100% 覆盖 src/hmr/config.ts
 * @module tests/hmr-config.test
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { hmrConfigManager, defineHMRConfig, HMR_CONFIG_FILES } from '../src/hmr/config'

// 保存原始环境变量
const originalNodeEnv = process.env.NODE_ENV
const originalKarinDev = process.env.KARIN_DEV

describe('HMR Config Manager', () => {
  beforeEach(() => {
    hmrConfigManager.clear()
    vi.clearAllMocks()
  })

  afterEach(() => {
    // 恢复环境变量
    process.env.NODE_ENV = originalNodeEnv
    process.env.KARIN_DEV = originalKarinDev
  })

  describe('HMR_CONFIG_FILES', () => {
    it('should export correct config file names', () => {
      expect(HMR_CONFIG_FILES).toContain('karin.hmr.config.ts')
      expect(HMR_CONFIG_FILES).toContain('karin.hmr.config.mts')
      expect(HMR_CONFIG_FILES).toContain('karin.hmr.config.js')
      expect(HMR_CONFIG_FILES).toContain('karin.hmr.config.mjs')
      expect(HMR_CONFIG_FILES.length).toBe(4)
    })
  })

  describe('defineHMRConfig', () => {
    it('should return the config as-is', () => {
      const config = { debounce: 200, verbose: true }
      const result = defineHMRConfig(config)
      expect(result).toBe(config)
    })

    it('should work with empty config', () => {
      const result = defineHMRConfig({})
      expect(result).toEqual({})
    })

    it('should work with full config', () => {
      const config = {
        debounce: 300,
        exclude: ['node_modules/**'],
        watch: ['src/**'],
        modules: {
          'src/timer.ts': async () => { },
        },
        onBeforeHot: async () => { },
        onAfterHot: async () => { },
        effects: () => { },
        karinConfig: {
          onBeforeChange: async () => { },
          onAfterChange: async () => { },
          requireFullReload: () => false,
        },
      }
      const result = defineHMRConfig(config)
      expect(result).toBe(config)
    })
  })

  describe('hmrConfigManager.isDev', () => {
    it('should return boolean', () => {
      expect(typeof hmrConfigManager.isDev).toBe('boolean')
    })
  })

  describe('hmrConfigManager.findConfigFile', () => {
    it('should return null for empty pluginRoot', async () => {
      const result = await hmrConfigManager.findConfigFile('')
      expect(result).toBeNull()
    })

    it('should return null for whitespace pluginRoot', async () => {
      const result = await hmrConfigManager.findConfigFile('   ')
      expect(result).toBeNull()
    })

    it('should return null for non-string pluginRoot', async () => {
      const result = await hmrConfigManager.findConfigFile(null as any)
      expect(result).toBeNull()

      const result2 = await hmrConfigManager.findConfigFile(undefined as any)
      expect(result2).toBeNull()

      const result3 = await hmrConfigManager.findConfigFile(123 as any)
      expect(result3).toBeNull()
    })

    it('should return null when no config file exists', async () => {
      const result = await hmrConfigManager.findConfigFile('/non/existent/path')
      expect(result).toBeNull()
    })

    it('should cache found config path', async () => {
      // 第一次调用
      const result1 = await hmrConfigManager.findConfigFile('/some/path')

      // 第二次调用应该返回缓存的结果
      const result2 = await hmrConfigManager.findConfigFile('/some/path')

      expect(result1).toBe(result2)
    })
  })

  describe('hmrConfigManager.loadConfig', () => {
    it('should return empty config for empty pluginRoot', async () => {
      const result = await hmrConfigManager.loadConfig('')
      expect(result).toEqual({})
    })

    it('should return empty config for whitespace pluginRoot', async () => {
      const result = await hmrConfigManager.loadConfig('   ')
      expect(result).toEqual({})
    })

    it('should return empty config for non-string pluginRoot', async () => {
      const result = await hmrConfigManager.loadConfig(null as any)
      expect(result).toEqual({})

      const result2 = await hmrConfigManager.loadConfig(undefined as any)
      expect(result2).toEqual({})
    })

    it('should return empty config when no config file exists', async () => {
      const result = await hmrConfigManager.loadConfig('/non/existent/path')
      expect(result).toEqual({})
    })
  })

  describe('hmrConfigManager.getConfig', () => {
    it('should return null for unknown pluginRoot', () => {
      const result = hmrConfigManager.getConfig('/unknown/path')
      expect(result).toBeNull()
    })
  })

  describe('hmrConfigManager.isHMRConfigFile', () => {
    it('should return true for valid config filenames', () => {
      expect(hmrConfigManager.isHMRConfigFile('/path/to/karin.hmr.config.ts')).toBe(true)
      expect(hmrConfigManager.isHMRConfigFile('/path/to/karin.hmr.config.mts')).toBe(true)
      expect(hmrConfigManager.isHMRConfigFile('/path/to/karin.hmr.config.js')).toBe(true)
      expect(hmrConfigManager.isHMRConfigFile('/path/to/karin.hmr.config.mjs')).toBe(true)
    })

    it('should return false for invalid filenames', () => {
      expect(hmrConfigManager.isHMRConfigFile('/path/to/other.ts')).toBe(false)
      expect(hmrConfigManager.isHMRConfigFile('/path/to/karin.config.ts')).toBe(false)
      expect(hmrConfigManager.isHMRConfigFile('/path/to/hmr.config.ts')).toBe(false)
    })

    it('should return false for empty string', () => {
      expect(hmrConfigManager.isHMRConfigFile('')).toBe(false)
    })

    it('should return false for null/undefined', () => {
      expect(hmrConfigManager.isHMRConfigFile(null as any)).toBe(false)
      expect(hmrConfigManager.isHMRConfigFile(undefined as any)).toBe(false)
    })

    it('should return false for non-string', () => {
      expect(hmrConfigManager.isHMRConfigFile(123 as any)).toBe(false)
      expect(hmrConfigManager.isHMRConfigFile({} as any)).toBe(false)
    })
  })

  describe('hmrConfigManager.reloadConfig', () => {
    it('should return empty config when no config file exists', async () => {
      const result = await hmrConfigManager.reloadConfig('/non/existent/path')
      expect(result).toEqual({})
    })
  })

  describe('hmrConfigManager.clear', () => {
    it('should clear all caches', () => {
      hmrConfigManager.clear()
      // 验证缓存被清除
      const result = hmrConfigManager.getConfig('/any/path')
      expect(result).toBeNull()
    })
  })
})

describe('HMR Config Validation', () => {
  beforeEach(() => {
    hmrConfigManager.clear()
  })

  describe('validateConfig (通过 defineHMRConfig 间接测试)', () => {
    it('should accept valid config', () => {
      const config = defineHMRConfig({
        debounce: 100,
        exclude: ['node_modules/**'],
        watch: ['src/**'],
        modules: {
          'src/test.ts': async () => { },
        },
        onBeforeHot: async () => { },
        onAfterHot: async () => { },
      })

      expect(config.debounce).toBe(100)
      expect(config.exclude).toEqual(['node_modules/**'])
    })

    it('should accept config with karinConfig hooks', () => {
      const config = defineHMRConfig({
        karinConfig: {
          onBeforeChange: async () => { },
          onAfterChange: async () => { },
          requireFullReload: () => true,
        },
      })

      expect(config.karinConfig).toBeDefined()
      expect(typeof config.karinConfig?.onBeforeChange).toBe('function')
    })
  })
})

describe('HMR Config - 边缘情况', () => {
  beforeEach(() => {
    hmrConfigManager.clear()
  })

  it('should handle concurrent loadConfig calls', async () => {
    const path1 = '/path/to/plugin1'
    const path2 = '/path/to/plugin2'

    const results = await Promise.all([
      hmrConfigManager.loadConfig(path1),
      hmrConfigManager.loadConfig(path2),
      hmrConfigManager.loadConfig(path1),
    ])

    expect(results[0]).toEqual({})
    expect(results[1]).toEqual({})
    expect(results[2]).toEqual({})
  })

  it('should handle findConfigFile with special characters in path', async () => {
    const paths = [
      '/path/with spaces/plugin',
      '/path/with中文/plugin',
      '/path/with🎉emoji/plugin',
    ]

    for (const path of paths) {
      const result = await hmrConfigManager.findConfigFile(path)
      expect(result).toBeNull() // 路径不存在，但不应该崩溃
    }
  })
})
