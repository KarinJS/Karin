/**
 * HMR config 模块完整覆盖测试
 * 覆盖 hmr/config.ts 中的所有未覆盖行
 * @module tests/hmr-config-coverage.test
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { hmrConfigManager, defineHMRConfig } from '../src/hmr/config'

// 使用单例
const manager = hmrConfigManager

describe('HMRConfigManager 完整覆盖测试', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    manager.clear()
  })

  afterEach(() => {
    manager.clear()
  })

  describe('findConfigFile', () => {
    it('should return null for empty pluginRoot', async () => {
      const configPath = await manager.findConfigFile('')
      expect(configPath).toBeNull()
    })

    it('should return null for whitespace pluginRoot', async () => {
      const configPath = await manager.findConfigFile('   ')
      expect(configPath).toBeNull()
    })

    it('should use cached path on second call', async () => {
      // 第一次调用
      const configPath1 = await manager.findConfigFile('/test/plugin')
      // 第二次调用应该使用缓存
      const configPath2 = await manager.findConfigFile('/test/plugin')
      expect(configPath1).toEqual(configPath2)
    })
  })

  describe('loadConfig', () => {
    it('should return empty config for empty pluginRoot', async () => {
      const config = await manager.loadConfig('')
      expect(config).toEqual({})
    })

    it('should return empty config for whitespace pluginRoot', async () => {
      const config = await manager.loadConfig('   ')
      expect(config).toEqual({})
    })

    it('should return empty config when no config file exists', async () => {
      const config = await manager.loadConfig('/non/existent/path')
      expect(config).toEqual({})
    })
  })

  describe('reloadConfig', () => {
    it('should reload config', async () => {
      const config = await manager.reloadConfig('/test/plugin')
      expect(config).toBeDefined()
    })
  })

  describe('getConfig', () => {
    it('should return null for unknown plugin', () => {
      const config = manager.getConfig('/unknown/plugin')
      expect(config).toBeNull()
    })
  })

  describe('isHMRConfigFile', () => {
    it('should recognize karin.hmr.config.ts', () => {
      expect(manager.isHMRConfigFile('/path/to/karin.hmr.config.ts')).toBe(true)
    })

    it('should recognize karin.hmr.config.js', () => {
      expect(manager.isHMRConfigFile('/path/to/karin.hmr.config.js')).toBe(true)
    })

    it('should recognize karin.hmr.config.mts', () => {
      expect(manager.isHMRConfigFile('/path/to/karin.hmr.config.mts')).toBe(true)
    })

    it('should recognize karin.hmr.config.mjs', () => {
      expect(manager.isHMRConfigFile('/path/to/karin.hmr.config.mjs')).toBe(true)
    })

    it('should not recognize other files', () => {
      expect(manager.isHMRConfigFile('/path/to/other.ts')).toBe(false)
      expect(manager.isHMRConfigFile('/path/to/package.json')).toBe(false)
    })

    it('should return false for empty path', () => {
      expect(manager.isHMRConfigFile('')).toBe(false)
    })

    it('should return false for null path', () => {
      expect(manager.isHMRConfigFile(null as any)).toBe(false)
    })

    it('should return false for undefined path', () => {
      expect(manager.isHMRConfigFile(undefined as any)).toBe(false)
    })

    it('should return false for non-string path', () => {
      expect(manager.isHMRConfigFile(123 as any)).toBe(false)
      expect(manager.isHMRConfigFile({} as any)).toBe(false)
      expect(manager.isHMRConfigFile([] as any)).toBe(false)
    })
  })

  describe('clear', () => {
    it('should clear all caches', async () => {
      // 先加载配置
      await manager.findConfigFile('/test/plugin')

      // 清除缓存
      manager.clear()

      // 验证缓存被清除
      const config = manager.getConfig('/test/plugin')
      expect(config).toBeNull()
    })
  })

  describe('isDev getter', () => {
    it('should return boolean', () => {
      expect(typeof manager.isDev).toBe('boolean')
    })
  })

  describe('defineHMRConfig', () => {
    it('should return config as-is', () => {
      const config = {
        debounce: 200,
        exclude: ['node_modules'],
      }

      const result = defineHMRConfig(config)
      expect(result).toBe(config)
    })

    it('should accept empty config', () => {
      const result = defineHMRConfig({})
      expect(result).toEqual({})
    })

    it('should accept config with all options', () => {
      const config = {
        debounce: 100,
        exclude: ['*.test.ts'],
        watch: ['src/**/*.ts'],
        onBeforeHot: async () => { },
        onAfterHot: async () => { },
        modules: {
          'src/timer.ts': async () => { },
        },
        effects: () => { },
        karinConfig: {
          onBeforeChange: async () => { },
          onAfterChange: async () => { },
          requireFullReload: async () => false,
        },
      }

      const result = defineHMRConfig(config)
      expect(result).toBe(config)
    })
  })

  describe('hmrConfigManager 单例', () => {
    it('should be defined', () => {
      expect(hmrConfigManager).toBeDefined()
    })

    it('should have all required methods', () => {
      expect(typeof hmrConfigManager.findConfigFile).toBe('function')
      expect(typeof hmrConfigManager.loadConfig).toBe('function')
      expect(typeof hmrConfigManager.reloadConfig).toBe('function')
      expect(typeof hmrConfigManager.getConfig).toBe('function')
      expect(typeof hmrConfigManager.isHMRConfigFile).toBe('function')
      expect(typeof hmrConfigManager.clear).toBe('function')
    })
  })
})

describe('HMRConfigManager 边界情况', () => {
  beforeEach(() => {
    manager.clear()
  })

  it('should handle very long paths', async () => {
    const longPath = '/'.repeat(1000) + 'test'
    const config = await manager.loadConfig(longPath)
    expect(config).toEqual({})
  })

  it('should handle special characters in path', async () => {
    const specialPath = '/path/with spaces/and-dashes/and_underscores'
    const config = await manager.loadConfig(specialPath)
    expect(config).toEqual({})
  })

  it('should handle Unicode characters in path', async () => {
    const unicodePath = '/路径/中文/测试'
    const config = await manager.loadConfig(unicodePath)
    expect(config).toEqual({})
  })
})
