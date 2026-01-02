/**
 * core/utils/engines.ts 单元测试
 * @description 引擎版本检查器测试
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { engines } from '../src/core/utils/engines'
import { engineSettings } from '../src/store'

describe('core/utils/engines', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    engineSettings.clear()
  })

  afterEach(() => {
    vi.restoreAllMocks()
    engineSettings.clear()
  })

  describe('check', () => {
    it('应该调用 engineSettings.check', () => {
      const spy = vi.spyOn(engineSettings, 'check')
      const result = engines.check('test-package', '^1.0.0', false)

      expect(spy).toHaveBeenCalledWith('test-package', '^1.0.0', false)
      expect(typeof result).toBe('boolean')
    })

    it('应该传递 ignoreEngines 参数', () => {
      const spy = vi.spyOn(engineSettings, 'check')
      engines.check('test-package', '^1.0.0', true)

      expect(spy).toHaveBeenCalledWith('test-package', '^1.0.0', true)
    })

    it('应该处理未定义的 enginesVersion', () => {
      const spy = vi.spyOn(engineSettings, 'check')
      engines.check('test-package', undefined, false)

      expect(spy).toHaveBeenCalledWith('test-package', undefined, false)
    })

    it('应该使用默认的 ignoreEngines 值', () => {
      const spy = vi.spyOn(engineSettings, 'check')
      engines.check('test-package', '^1.0.0')

      expect(spy).toHaveBeenCalledWith('test-package', '^1.0.0', false)
    })

    it('应该正确返回检查结果 - true', () => {
      vi.spyOn(engineSettings, 'check').mockReturnValue(true)
      const result = engines.check('test-package', '^1.0.0')

      expect(result).toBe(true)
    })

    it('应该正确返回检查结果 - false', () => {
      vi.spyOn(engineSettings, 'check').mockReturnValue(false)
      const result = engines.check('test-package', '^1.0.0')

      expect(result).toBe(false)
    })
  })

  describe('print', () => {
    it('应该调用 engineSettings.print', () => {
      const spy = vi.spyOn(engineSettings, 'print')
      engines.print()

      expect(spy).toHaveBeenCalled()
    })

    it('print 应该返回 undefined', () => {
      const result = engines.print()
      expect(result).toBeUndefined()
    })
  })

  describe('engines 对象结构', () => {
    it('应该有 check 方法', () => {
      expect(typeof engines.check).toBe('function')
    })

    it('应该有 print 方法', () => {
      expect(typeof engines.print).toBe('function')
    })

    it('应该只有两个属性', () => {
      expect(Object.keys(engines)).toEqual(['check', 'print'])
    })
  })
})
