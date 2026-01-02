/**
 * lifecycle API 单元测试
 */
import { describe, it, expect, beforeEach, vi } from 'vitest'
import {
  onLoad,
  onUnload,
  onReload,
  setLoadingContext,
  clearLoadingContext,
  getLoadingContext,
  runLoadHooks,
  runUnloadHooks,
  runReloadHooks,
  clearAllHooks,
  getHookStats,
} from '../src/lifecycle'

describe('lifecycle', () => {
  beforeEach(() => {
    clearAllHooks()
    clearLoadingContext()
  })

  describe('loading context', () => {
    it('should set and get loading context', () => {
      setLoadingContext('/path/to/file.ts', 'my-package')

      const ctx = getLoadingContext()
      expect(ctx).toEqual({
        file: '/path/to/file.ts',
        pkg: 'my-package',
      })
    })

    it('should return null when no context', () => {
      expect(getLoadingContext()).toBeNull()
    })

    it('should clear loading context', () => {
      setLoadingContext('/path/to/file.ts', 'my-package')
      clearLoadingContext()

      expect(getLoadingContext()).toBeNull()
    })
  })

  describe('onLoad()', () => {
    it('should register load hook with context', () => {
      setLoadingContext('/path/to/file.ts', 'my-package')

      const hook = vi.fn()
      onLoad(hook)

      const stats = getHookStats()
      expect(stats.load).toBe(1)
    })

    it('should execute immediately without context', async () => {
      const hook = vi.fn()
      onLoad(hook)

      // 等待微任务执行
      await new Promise(resolve => setTimeout(resolve, 0))

      expect(hook).toHaveBeenCalled()
    })
  })

  describe('onUnload()', () => {
    it('should register unload hook with context', () => {
      setLoadingContext('/path/to/file.ts', 'my-package')

      const hook = vi.fn()
      onUnload(hook)

      const stats = getHookStats()
      expect(stats.unload).toBe(1)
    })

    it('should register to global without context', () => {
      const hook = vi.fn()
      onUnload(hook)

      const stats = getHookStats()
      expect(stats.unload).toBe(1)
    })
  })

  describe('onReload()', () => {
    it('should register reload hook with context', () => {
      setLoadingContext('/path/to/file.ts', 'my-package')

      const hook = vi.fn()
      onReload(hook)

      const stats = getHookStats()
      expect(stats.reload).toBe(1)
    })

    it('should register to global without context', () => {
      const hook = vi.fn()
      onReload(hook)

      const stats = getHookStats()
      expect(stats.reload).toBe(1)
    })
  })

  describe('runLoadHooks()', () => {
    it('should execute load hooks for file', async () => {
      setLoadingContext('/path/to/file.ts', 'my-package')

      const hook = vi.fn()
      onLoad(hook)

      await runLoadHooks('/path/to/file.ts')

      expect(hook).toHaveBeenCalled()
    })

    it('should not execute hooks for other files', async () => {
      setLoadingContext('/path/to/file.ts', 'my-package')

      const hook = vi.fn()
      onLoad(hook)

      await runLoadHooks('/path/to/other.ts')

      expect(hook).not.toHaveBeenCalled()
    })

    it('should handle async hooks', async () => {
      setLoadingContext('/path/to/file.ts', 'my-package')

      const asyncHook = vi.fn(async () => {
        await new Promise(resolve => setTimeout(resolve, 10))
      })
      onLoad(asyncHook)

      await runLoadHooks('/path/to/file.ts')

      expect(asyncHook).toHaveBeenCalled()
    })

    it('should catch hook errors', async () => {
      setLoadingContext('/path/to/file.ts', 'my-package')

      const errorHook = vi.fn(() => {
        throw new Error('test error')
      })
      onLoad(errorHook)

      // 不应该抛出
      await expect(runLoadHooks('/path/to/file.ts')).resolves.not.toThrow()
    })
  })

  describe('runUnloadHooks()', () => {
    it('should execute unload hooks for file', async () => {
      setLoadingContext('/path/to/file.ts', 'my-package')

      const hook = vi.fn()
      onUnload(hook)

      await runUnloadHooks('/path/to/file.ts')

      expect(hook).toHaveBeenCalled()
    })

    it('should clear hooks after execution', async () => {
      setLoadingContext('/path/to/file.ts', 'my-package')

      const hook = vi.fn()
      onUnload(hook)

      expect(getHookStats().unload).toBe(1)

      await runUnloadHooks('/path/to/file.ts')

      expect(getHookStats().unload).toBe(0)
    })
  })

  describe('runReloadHooks()', () => {
    it('should execute reload hooks for file', async () => {
      setLoadingContext('/path/to/file.ts', 'my-package')

      const hook = vi.fn()
      onReload(hook)

      await runReloadHooks('/path/to/file.ts')

      expect(hook).toHaveBeenCalled()
    })

    it('should not clear hooks after execution', async () => {
      setLoadingContext('/path/to/file.ts', 'my-package')

      const hook = vi.fn()
      onReload(hook)

      expect(getHookStats().reload).toBe(1)

      await runReloadHooks('/path/to/file.ts')

      // reload hooks 不应该被清理（可以多次执行）
      expect(getHookStats().reload).toBe(1)
    })
  })

  describe('clearAllHooks()', () => {
    it('should clear all hooks', () => {
      setLoadingContext('/path/to/file.ts', 'my-package')

      onLoad(vi.fn())
      onUnload(vi.fn())
      onReload(vi.fn())

      expect(getHookStats()).toEqual({
        load: 1,
        unload: 1,
        reload: 1,
      })

      clearAllHooks()

      expect(getHookStats()).toEqual({
        load: 0,
        unload: 0,
        reload: 0,
      })
    })
  })

  describe('getHookStats()', () => {
    it('should return correct stats', () => {
      setLoadingContext('/file1.ts', 'pkg1')
      onLoad(vi.fn())
      onLoad(vi.fn())
      onUnload(vi.fn())

      setLoadingContext('/file2.ts', 'pkg2')
      onReload(vi.fn())
      onReload(vi.fn())
      onReload(vi.fn())

      expect(getHookStats()).toEqual({
        load: 2,
        unload: 1,
        reload: 3,
      })
    })
  })

  describe('multiple hooks per file', () => {
    it('should execute multiple hooks in order', async () => {
      setLoadingContext('/path/to/file.ts', 'my-package')

      const order: number[] = []
      onLoad(() => order.push(1))
      onLoad(() => order.push(2))
      onLoad(() => order.push(3))

      await runLoadHooks('/path/to/file.ts')

      expect(order).toEqual([1, 2, 3])
    })
  })
})
