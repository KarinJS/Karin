/**
 * core/utils/status.ts 单元测试
 * @description 插件注册表状态打印工具测试
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { printRegistryStatus } from '../src/core/utils/status'
import { store, packageList } from '../src/store'

describe('core/utils/printRegistryStatus', () => {
  const originalEnv = process.env.NODE_ENV

  beforeEach(() => {
    vi.clearAllMocks()
    store.clear()
    packageList.clear()
  })

  afterEach(() => {
    vi.restoreAllMocks()
    store.clear()
    packageList.clear()
    process.env.NODE_ENV = originalEnv
  })

  describe('printRegistryStatus', () => {
    it('应该是一个函数', () => {
      expect(typeof printRegistryStatus).toBe('function')
    })

    it('应该调用 logger.info 两次', () => {
      const infoSpy = vi.spyOn(logger, 'info')

      printRegistryStatus()

      expect(infoSpy).toHaveBeenCalledTimes(3)
    })

    it('应该打印插件统计信息', () => {
      const infoSpy = vi.spyOn(logger, 'info')

      printRegistryStatus()

      expect(infoSpy).toHaveBeenCalledWith(
        expect.stringContaining('插件:')
      )
    })

    it('应该打印注册统计信息', () => {
      const infoSpy = vi.spyOn(logger, 'info')

      printRegistryStatus()

      expect(infoSpy).toHaveBeenCalledWith(
        expect.stringContaining('注册:')
      )
    })

    it('应该打印 Handler 统计信息', () => {
      const infoSpy = vi.spyOn(logger, 'info')

      printRegistryStatus()

      expect(infoSpy).toHaveBeenCalledWith(
        expect.stringContaining('Handler:')
      )
    })

    it('应该返回 undefined', () => {
      const result = printRegistryStatus()
      expect(result).toBeUndefined()
    })
  })

  describe('生产环境', () => {
    it('应该不包含 Dev 统计在生产环境', () => {
      process.env.NODE_ENV = 'production'
      const infoSpy = vi.spyOn(logger, 'info')

      printRegistryStatus()

      const firstCall = infoSpy.mock.calls[0][0]
      expect(firstCall).not.toContain('Dev:')
    })
  })

  describe('开发环境', () => {
    it('应该包含 Dev 统计在开发环境', () => {
      process.env.NODE_ENV = 'development'
      const infoSpy = vi.spyOn(logger, 'info')

      printRegistryStatus()

      const firstCall = infoSpy.mock.calls[0][0]
      expect(firstCall).toContain('Dev:')
    })
  })

  describe('有数据的统计', () => {
    it('应该正确显示包类型统计', () => {
      // 添加一些测试数据
      packageList.add('apps', { name: 'app1', abs: '/app1', pkg: '/app1/package.json' })
      packageList.add('npm', { name: 'npm1', abs: '/npm1', pkg: '/npm1/package.json' })

      const infoSpy = vi.spyOn(logger, 'info')

      printRegistryStatus()

      const firstCall = infoSpy.mock.calls[0][0]
      expect(firstCall).toContain('插件: 2')
      expect(firstCall).toContain('Apps: 1')
      expect(firstCall).toContain('NPM: 1')
    })

    it('应该正确显示 store 统计', () => {
      const infoSpy = vi.spyOn(logger, 'info')

      printRegistryStatus()

      const secondCall = infoSpy.mock.calls[1][0]
      expect(secondCall).toContain('Commands:')
      expect(secondCall).toContain('Accepts:')
      expect(secondCall).toContain('Buttons:')
      expect(secondCall).toContain('Tasks:')
      expect(secondCall).toContain('Packages:')
    })

    it('应该正确显示 handler 统计', () => {
      const infoSpy = vi.spyOn(logger, 'info')

      printRegistryStatus()

      const thirdCall = infoSpy.mock.calls[2][0]
      expect(thirdCall).toContain('Handler:')
      expect(thirdCall).toContain('Keys:')
      expect(thirdCall).toContain('Funcs:')
    })
  })

  describe('调用 store 和 packageList 方法', () => {
    it('应该调用 store.stats', () => {
      const statsSpy = vi.spyOn(store, 'stats')

      printRegistryStatus()

      expect(statsSpy).toHaveBeenCalled()
    })

    it('应该调用 packageList.stats', () => {
      const statsSpy = vi.spyOn(packageList, 'stats')

      printRegistryStatus()

      expect(statsSpy).toHaveBeenCalled()
    })
  })
})
