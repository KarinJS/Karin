/**
 * store/settings.ts 深度测试
 * 覆盖 engineSettings 的所有功能
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { engineSettings } from '../src/store'

describe('EngineSettings 深度测试', () => {
  const originalKarinVersion = process.env.KARIN_VERSION

  beforeEach(() => {
    engineSettings.clear()
    process.env.KARIN_VERSION = '1.5.0'
  })

  afterEach(() => {
    engineSettings.clear()
    if (originalKarinVersion) {
      process.env.KARIN_VERSION = originalKarinVersion
    } else {
      delete process.env.KARIN_VERSION
    }
  })

  describe('set 和 get', () => {
    it('应该设置和获取引擎配置', () => {
      engineSettings.set('test-plugin', {
        version: '^1.0.0',
        ignoreEngines: false,
      })

      const result = engineSettings.get('test-plugin')
      expect(result).toEqual({
        version: '^1.0.0',
        ignoreEngines: false,
      })
    })

    it('应该返回 null 当插件不存在', () => {
      expect(engineSettings.get('non-existent')).toBeNull()
    })

    it('应该覆盖已存在的配置', () => {
      engineSettings.set('test-plugin', {
        version: '^1.0.0',
        ignoreEngines: false,
      })
      engineSettings.set('test-plugin', {
        version: '^2.0.0',
        ignoreEngines: true,
      })

      const result = engineSettings.get('test-plugin')
      expect(result?.version).toBe('^2.0.0')
      expect(result?.ignoreEngines).toBe(true)
    })
  })

  describe('getAll', () => {
    it('应该返回所有配置', () => {
      engineSettings.set('pkg1', { version: '^1.0.0', ignoreEngines: false })
      engineSettings.set('pkg2', { version: '^2.0.0', ignoreEngines: true })

      const all = engineSettings.getAll()
      expect(Object.keys(all)).toHaveLength(2)
      expect(all['pkg1']).toBeDefined()
      expect(all['pkg2']).toBeDefined()
    })

    it('应该返回配置的副本', () => {
      engineSettings.set('pkg1', { version: '^1.0.0', ignoreEngines: false })

      const all1 = engineSettings.getAll()
      const all2 = engineSettings.getAll()

      expect(all1).not.toBe(all2)
      expect(all1['pkg1']).not.toBe(all2['pkg1'])
    })
  })

  describe('check 版本检查', () => {
    it('应该返回 true 当无版本要求时', () => {
      expect(engineSettings.check('pkg1')).toBe(true)
      expect(engineSettings.check('pkg1', undefined)).toBe(true)
      expect(engineSettings.check('pkg1', '')).toBe(true)
    })

    it('应该返回 true 当 ignoreEngines 为 true 时', () => {
      expect(engineSettings.check('pkg1', '^999.0.0', true)).toBe(true)
    })

    it('应该返回 true 当版本符合要求时', () => {
      process.env.KARIN_VERSION = '1.5.0'

      expect(engineSettings.check('pkg1', '^1.0.0')).toBe(true)
      expect(engineSettings.check('pkg2', '>=1.0.0')).toBe(true)
      expect(engineSettings.check('pkg3', '1.x')).toBe(true)
      expect(engineSettings.check('pkg4', '~1.5.0')).toBe(true)
    })

    it('应该返回 false 当版本不符合要求时', () => {
      process.env.KARIN_VERSION = '1.5.0'

      expect(engineSettings.check('pkg1', '^2.0.0')).toBe(false)
      expect(engineSettings.check('pkg2', '>=2.0.0')).toBe(false)
      expect(engineSettings.check('pkg3', '2.x')).toBe(false)
    })

    it('应该记录不兼容的插件', () => {
      process.env.KARIN_VERSION = '1.5.0'

      engineSettings.check('incompatible-pkg', '^2.0.0')

      const info = engineSettings.get('incompatible-pkg')
      expect(info).toEqual({
        version: '^2.0.0',
        ignoreEngines: false,
      })
    })

    it('应该返回 true 当没有 KARIN_VERSION 时', () => {
      delete process.env.KARIN_VERSION

      expect(engineSettings.check('pkg1', '^2.0.0')).toBe(true)
    })

    it('应该处理无效版本范围', () => {
      process.env.KARIN_VERSION = '1.5.0'

      // 无效的版本范围 - semver 可能返回 false 而不是抛异常
      const result = engineSettings.check('pkg1', 'invalid-version-range!!!')
      // 无论结果如何，不应该抛出异常
      expect(typeof result).toBe('boolean')
    })

    it('应该支持 prerelease 版本', () => {
      process.env.KARIN_VERSION = '2.0.0-beta.1'

      expect(engineSettings.check('pkg1', '>=2.0.0-alpha.0')).toBe(true)
      expect(engineSettings.check('pkg2', '^2.0.0-beta.0')).toBe(true)
    })
  })

  describe('remove', () => {
    it('应该删除存在的记录', () => {
      engineSettings.set('test-pkg', { version: '^1.0.0', ignoreEngines: false })

      expect(engineSettings.remove('test-pkg')).toBe(true)
      expect(engineSettings.get('test-pkg')).toBeNull()
    })

    it('应该返回 false 当记录不存在时', () => {
      expect(engineSettings.remove('non-existent')).toBe(false)
    })
  })

  describe('clear', () => {
    it('应该清空所有记录', () => {
      engineSettings.set('pkg1', { version: '^1.0.0', ignoreEngines: false })
      engineSettings.set('pkg2', { version: '^2.0.0', ignoreEngines: false })

      engineSettings.clear()

      expect(engineSettings.count()).toBe(0)
      expect(engineSettings.get('pkg1')).toBeNull()
      expect(engineSettings.get('pkg2')).toBeNull()
    })
  })

  describe('count', () => {
    it('应该返回正确的数量', () => {
      expect(engineSettings.count()).toBe(0)

      engineSettings.set('pkg1', { version: '^1.0.0', ignoreEngines: false })
      expect(engineSettings.count()).toBe(1)

      engineSettings.set('pkg2', { version: '^2.0.0', ignoreEngines: false })
      expect(engineSettings.count()).toBe(2)

      engineSettings.remove('pkg1')
      expect(engineSettings.count()).toBe(1)
    })
  })

  describe('print', () => {
    it('应该不输出当没有不兼容插件时', () => {
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

      engineSettings.print()

      expect(warnSpy).not.toHaveBeenCalled()
      warnSpy.mockRestore()
    })

    it('应该打印不兼容插件警告', () => {
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

      engineSettings.set('bad-pkg-1', { version: '^2.0.0', ignoreEngines: false })
      engineSettings.set('bad-pkg-2', { version: '>=3.0.0', ignoreEngines: false })

      engineSettings.print()

      expect(warnSpy).toHaveBeenCalled()
      const calls = warnSpy.mock.calls.flat().join(' ')
      expect(calls).toContain('bad-pkg-1')
      expect(calls).toContain('bad-pkg-2')
      warnSpy.mockRestore()
    })

    it('应该使用 global.logger 如果可用', () => {
      const originalLogger = (global as any).logger
      const mockWarn = vi.fn()

      // 模拟完整的 chalk 对象
      const createChalkFn = (s: string) => s
      const mockChalk: any = (s: string) => s
      mockChalk.yellow = Object.assign(createChalkFn, { bold: createChalkFn })
      mockChalk.gray = createChalkFn
      mockChalk.cyan = createChalkFn
      mockChalk.red = createChalkFn
      mockChalk.white = { bold: createChalkFn }
      mockChalk.bold = createChalkFn

      ;(global as any).logger = {
        warn: mockWarn,
        chalk: mockChalk,
      }

      engineSettings.set('test-pkg', { version: '^5.0.0', ignoreEngines: false })
      engineSettings.print()

      expect(mockWarn).toHaveBeenCalled()
      ;(global as any).logger = originalLogger
    })
  })
})
