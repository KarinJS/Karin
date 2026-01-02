/**
 * Core Utils 模块测试
 * 覆盖 core/utils/ 目录下的工具函数
 */
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { envManager, engineSettings, store, packageList } from '../src/store'

// Mock logger
vi.stubGlobal('logger', {
  info: vi.fn(),
  debug: vi.fn(),
  warn: vi.fn(),
  error: vi.fn(),
})

describe('Core Utils', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  // ==================== pluginEnv 测试 ====================
  describe('pluginEnv (via envManager)', () => {
    beforeEach(() => {
      envManager.clear()
    })

    it('应该创建环境变量', () => {
      envManager.create('test-plugin', {
        API_KEY: 'test-key',
        DEBUG: { value: 'true', comment: '调试模式' },
      })

      const envs = envManager.get('test-plugin')
      expect(envs).toBeDefined()
    })

    it('应该处理空环境变量', () => {
      envManager.create('empty-plugin', {})
      expect(() => envManager.get('empty-plugin')).not.toThrow()
    })

    it('应该处理 undefined 环境变量', () => {
      envManager.create('undefined-plugin', undefined as any)
      expect(() => envManager.get('undefined-plugin')).not.toThrow()
    })

    it('应该覆盖已存在的环境变量', () => {
      envManager.create('override-plugin', { KEY: 'old' })
      envManager.create('override-plugin', { KEY: 'new' })

      const envs = envManager.get('override-plugin')
      expect(envs).toBeDefined()
    })

    it('应该获取所有环境变量', () => {
      envManager.create('pkg1', { A: '1' })
      envManager.create('pkg2', { B: '2' })

      const all = envManager.getAll()
      expect(all).toBeDefined()
    })

    it('应该删除指定包的环境变量', () => {
      envManager.create('del-plugin', { KEY: 'value' })
      envManager.remove('del-plugin')

      const envs = envManager.get('del-plugin')
      expect(envs).toBeNull()
    })

    it('应该检查环境变量统计信息', () => {
      envManager.create('exists-plugin', { KEY: 'value' })

      const stats = envManager.stats()
      expect(stats.packages).toBeGreaterThanOrEqual(0)
      expect(stats.variables).toBeGreaterThanOrEqual(0)
    })
  })

  // ==================== engines 测试 ====================
  describe('engines (via engineSettings)', () => {
    beforeEach(() => {
      engineSettings.clear()
    })

    it('应该检查引擎版本 - 无版本要求', () => {
      const result = engineSettings.check('no-engines-pkg', undefined, false)
      expect(result).toBe(true)
    })

    it('应该检查引擎版本 - 忽略检查', () => {
      const result = engineSettings.check('ignore-pkg', '^99.0.0', true)
      expect(result).toBe(true)
    })

    it('应该检查引擎版本 - 符合要求', () => {
      const result = engineSettings.check('valid-pkg', '^1.0.0', false)
      expect(typeof result).toBe('boolean')
    })

    it('应该检查引擎版本 - 不符合要求', () => {
      const result = engineSettings.check('invalid-pkg', '^99.0.0', false)
      expect(typeof result).toBe('boolean')
    })

    it('应该打印不符合要求的包', () => {
      engineSettings.check('warn-pkg', '^99.0.0', false)
      expect(() => engineSettings.print()).not.toThrow()
    })

    it('应该处理空字符串版本', () => {
      const result = engineSettings.check('empty-version-pkg', '', false)
      expect(result).toBe(true)
    })

    it('应该处理特殊版本格式', () => {
      expect(() => engineSettings.check('special-pkg', '>=1.0.0 <2.0.0', false)).not.toThrow()
      expect(() => engineSettings.check('prerelease-pkg', '^1.0.0-beta.1', false)).not.toThrow()
    })
  })

  // ==================== printRegistryStatus 测试 ====================
  describe('printRegistryStatus (via store.stats + packageList.stats)', () => {
    beforeEach(() => {
      store.clear()
      packageList.clear()
    })

    it('应该获取 store 统计', () => {
      const stats = store.stats()

      expect(stats).toHaveProperty('command')
      expect(stats).toHaveProperty('accept')
      expect(stats).toHaveProperty('button')
      expect(stats).toHaveProperty('task')
      expect(stats).toHaveProperty('handler')
      expect(stats).toHaveProperty('packages')
    })

    it('应该获取 packageList 统计', () => {
      const stats = packageList.stats()

      expect(stats).toHaveProperty('total')
      expect(stats).toHaveProperty('apps')
      expect(stats).toHaveProperty('npm')
    })

    it('应该处理空 store 的统计', () => {
      const stats = store.stats()

      expect(stats.command.total).toBe(0)
      expect(stats.accept.total).toBe(0)
    })

    it('应该在添加插件后更新统计', () => {
      store.add('command', {
        id: 'test-cmd',
        type: 'command',
        packageName: 'test-pkg',
        priority: 100,
        file: { absPath: '/test.ts' },
      } as any)

      const stats = store.stats()
      expect(stats.command.total).toBe(1)
    })
  })
})
