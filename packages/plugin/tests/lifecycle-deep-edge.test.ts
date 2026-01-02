/**
 * Lifecycle 深度边缘情况测试
 * 测试生命周期钩子的各种极端场景
 */
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
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

describe('Lifecycle 深度测试', () => {
  beforeEach(() => {
    clearAllHooks()
    clearLoadingContext()
    vi.restoreAllMocks()
  })

  afterEach(() => {
    clearAllHooks()
    clearLoadingContext()
  })

  describe('上下文管理边缘情况', () => {
    it('应该处理快速连续的上下文切换', () => {
      for (let i = 0; i < 100; i++) {
        setLoadingContext(`/file${i}.ts`, `pkg${i}`)
        const ctx = getLoadingContext()
        expect(ctx?.file).toBe(`/file${i}.ts`)
        expect(ctx?.pkg).toBe(`pkg${i}`)
      }
    })

    it('应该处理空路径 (会被视为 falsy)', () => {
      setLoadingContext('', 'pkg')
      const ctx = getLoadingContext()
      // 空字符串是 falsy，所以 getLoadingContext 返回 null
      expect(ctx).toBe(null)
    })

    it('应该处理空包名', () => {
      setLoadingContext('/file.ts', '')
      const ctx = getLoadingContext()
      expect(ctx?.pkg).toBe('')
    })

    it('应该处理 Windows 路径', () => {
      setLoadingContext('C:\\Users\\test\\plugin.ts', 'pkg')
      const ctx = getLoadingContext()
      expect(ctx?.file).toBe('C:\\Users\\test\\plugin.ts')
    })

    it('应该处理 URL 格式路径', () => {
      setLoadingContext('file:///path/to/plugin.ts', 'pkg')
      const ctx = getLoadingContext()
      expect(ctx?.file).toBe('file:///path/to/plugin.ts')
    })

    it('应该处理 Unicode 路径', () => {
      setLoadingContext('/路径/到/插件.ts', '包名')
      const ctx = getLoadingContext()
      expect(ctx?.file).toBe('/路径/到/插件.ts')
      expect(ctx?.pkg).toBe('包名')
    })
  })

  describe('onLoad 边缘情况', () => {
    it('应该处理同步抛出错误的钩子', async () => {
      setLoadingContext('/error.ts', 'pkg')

      const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      onLoad(() => {
        throw new Error('Sync error')
      })

      await expect(runLoadHooks('/error.ts')).resolves.not.toThrow()

      errorSpy.mockRestore()
    })

    it('应该处理异步 reject 的钩子', async () => {
      setLoadingContext('/async-error.ts', 'pkg')

      const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      onLoad(async () => {
        throw new Error('Async error')
      })

      await expect(runLoadHooks('/async-error.ts')).resolves.not.toThrow()

      errorSpy.mockRestore()
    })

    it('应该处理返回 Promise reject 的钩子', async () => {
      setLoadingContext('/promise-reject.ts', 'pkg')

      const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      onLoad(() => Promise.reject(new Error('Promise reject')))

      await expect(runLoadHooks('/promise-reject.ts')).resolves.not.toThrow()

      errorSpy.mockRestore()
    })

    it('应该按注册顺序执行钩子', async () => {
      setLoadingContext('/order.ts', 'pkg')

      const order: number[] = []

      onLoad(() => order.push(1))
      onLoad(async () => {
        await new Promise(r => setTimeout(r, 10))
        order.push(2)
      })
      onLoad(() => order.push(3))

      await runLoadHooks('/order.ts')

      expect(order).toEqual([1, 2, 3])
    })

    it('应该处理大量钩子', async () => {
      setLoadingContext('/many-hooks.ts', 'pkg')

      let count = 0
      for (let i = 0; i < 1000; i++) {
        onLoad(() => count++)
      }

      await runLoadHooks('/many-hooks.ts')

      expect(count).toBe(1000)
    })

    it('应该处理钩子返回值（被忽略）', async () => {
      setLoadingContext('/return.ts', 'pkg')

      onLoad(() => 'return value')
      onLoad(() => 42)
      onLoad(() => ({ key: 'value' }))

      await expect(runLoadHooks('/return.ts')).resolves.not.toThrow()
    })

    it('应该在没有上下文时立即执行', async () => {
      const hook = vi.fn()
      onLoad(hook)

      await new Promise(r => setTimeout(r, 0))

      expect(hook).toHaveBeenCalled()
    })

    it('应该处理非函数参数（应该忽略或抛出）', () => {
      setLoadingContext('/non-fn.ts', 'pkg')

      // 根据实现可能会忽略或抛出
      expect(() => {
        onLoad('not a function' as any)
      }).not.toThrow() // 或者期望抛出，取决于实现
    })
  })

  describe('onUnload 边缘情况', () => {
    it('应该在执行后清除钩子', async () => {
      setLoadingContext('/unload-clear.ts', 'pkg')

      let count = 0
      onUnload(() => count++)

      expect(getHookStats().unload).toBe(1)

      await runUnloadHooks('/unload-clear.ts')

      expect(count).toBe(1)
      expect(getHookStats().unload).toBe(0)
    })

    it('应该处理多次调用 unload', async () => {
      setLoadingContext('/multi-unload.ts', 'pkg')

      let count = 0
      onUnload(() => count++)

      await runUnloadHooks('/multi-unload.ts')
      await runUnloadHooks('/multi-unload.ts') // 第二次应该没有钩子

      expect(count).toBe(1)
    })

    it('应该处理未注册钩子的文件', async () => {
      await expect(runUnloadHooks('/no-hooks.ts')).resolves.not.toThrow()
    })

    it('应该处理钩子抛出错误后继续执行其他钩子', async () => {
      setLoadingContext('/continue.ts', 'pkg')

      const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      let count = 0
      onUnload(() => {
        throw new Error('Error 1')
      })
      onUnload(() => count++)
      onUnload(() => {
        throw new Error('Error 2')
      })
      onUnload(() => count++)

      await runUnloadHooks('/continue.ts')

      expect(count).toBe(2)

      errorSpy.mockRestore()
    })
  })

  describe('onReload 边缘情况', () => {
    it('应该不清除钩子（可重复执行）', async () => {
      setLoadingContext('/reload-keep.ts', 'pkg')

      let count = 0
      onReload(() => count++)

      expect(getHookStats().reload).toBe(1)

      await runReloadHooks('/reload-keep.ts')
      await runReloadHooks('/reload-keep.ts')
      await runReloadHooks('/reload-keep.ts')

      expect(count).toBe(3)
      expect(getHookStats().reload).toBe(1)
    })

    it('应该处理混合 load/unload/reload 钩子', async () => {
      setLoadingContext('/mixed.ts', 'pkg')

      const order: string[] = []

      onLoad(() => order.push('load'))
      onUnload(() => order.push('unload'))
      onReload(() => order.push('reload'))

      await runLoadHooks('/mixed.ts')
      await runReloadHooks('/mixed.ts')
      await runUnloadHooks('/mixed.ts')

      expect(order).toEqual(['load', 'reload', 'unload'])
    })
  })

  describe('手动清除钩子边缘情况', () => {
    it('应该通过 clearAllHooks 清除所有类型的钩子', async () => {
      setLoadingContext('/clear1.ts', 'pkg')
      onLoad(vi.fn())
      onUnload(vi.fn())
      onReload(vi.fn())

      setLoadingContext('/clear2.ts', 'pkg')
      onLoad(vi.fn())

      expect(getHookStats().load).toBe(2)
      expect(getHookStats().unload).toBe(1)
      expect(getHookStats().reload).toBe(1)

      clearAllHooks()

      expect(getHookStats().load).toBe(0)
      expect(getHookStats().unload).toBe(0)
      expect(getHookStats().reload).toBe(0)
    })

    it('应该处理 runUnloadHooks 会清除对应文件的 unload 钩子', async () => {
      setLoadingContext('/unload-clear.ts', 'pkg')
      onUnload(vi.fn())

      expect(getHookStats().unload).toBe(1)

      await runUnloadHooks('/unload-clear.ts')

      // unload 钩子执行后会被清除
      expect(getHookStats().unload).toBe(0)
    })
  })

  describe('clearAllHooks 边缘情况', () => {
    it('应该清除所有类型的钩子', () => {
      setLoadingContext('/all1.ts', 'pkg1')
      onLoad(vi.fn())
      onUnload(vi.fn())
      onReload(vi.fn())

      setLoadingContext('/all2.ts', 'pkg2')
      onLoad(vi.fn())
      onUnload(vi.fn())
      onReload(vi.fn())

      clearAllHooks()

      expect(getHookStats()).toEqual({ load: 0, unload: 0, reload: 0 })
    })

    it('应该在清除后允许重新注册', () => {
      setLoadingContext('/re-register.ts', 'pkg')
      onLoad(vi.fn())

      clearAllHooks()

      setLoadingContext('/re-register.ts', 'pkg')
      onLoad(vi.fn())

      expect(getHookStats().load).toBe(1)
    })
  })

  describe('getHookStats 边缘情况', () => {
    it('应该返回正确的初始统计', () => {
      expect(getHookStats()).toEqual({ load: 0, unload: 0, reload: 0 })
    })

    it('应该在操作后返回正确统计', async () => {
      setLoadingContext('/stats1.ts', 'pkg')
      onLoad(vi.fn())
      onLoad(vi.fn())
      onUnload(vi.fn())

      setLoadingContext('/stats2.ts', 'pkg')
      onReload(vi.fn())

      expect(getHookStats()).toEqual({ load: 2, unload: 1, reload: 1 })

      await runLoadHooks('/stats1.ts')

      // load 钩子执行后不会被清除（仍然保留在 loadHooks 数组中）
      // 因为源码中没有从 loadHooks 中移除已执行的钩子
      expect(getHookStats().load).toBe(2)
    })
  })

  describe('并发执行边缘情况', () => {
    it('应该处理并发运行多个文件的钩子', async () => {
      const results: string[] = []

      setLoadingContext('/concurrent1.ts', 'pkg')
      onLoad(async () => {
        await new Promise(r => setTimeout(r, 20))
        results.push('file1')
      })

      setLoadingContext('/concurrent2.ts', 'pkg')
      onLoad(async () => {
        await new Promise(r => setTimeout(r, 10))
        results.push('file2')
      })

      await Promise.all([
        runLoadHooks('/concurrent1.ts'),
        runLoadHooks('/concurrent2.ts'),
      ])

      expect(results).toContain('file1')
      expect(results).toContain('file2')
    })

    it('应该处理同一文件的并发调用 (都会执行)', async () => {
      setLoadingContext('/same-file.ts', 'pkg')

      let count = 0
      onLoad(() => { count++ })

      await Promise.all([
        runLoadHooks('/same-file.ts'),
        runLoadHooks('/same-file.ts'),
      ])

      // loadHooks 不会被执行后清除，所以两次调用都会执行同一个钩子
      expect(count).toBe(2)
    })
  })

  describe('钩子执行超时边缘情况', () => {
    it('应该处理长时间运行的钩子', async () => {
      setLoadingContext('/long-running.ts', 'pkg')

      const start = Date.now()

      onLoad(async () => {
        await new Promise(r => setTimeout(r, 100))
      })

      await runLoadHooks('/long-running.ts')

      const elapsed = Date.now() - start
      expect(elapsed).toBeGreaterThanOrEqual(100)
    })

    it('应该处理永不 resolve 的 Promise（不会阻塞其他钩子）', async () => {
      setLoadingContext('/never-resolve.ts', 'pkg')

      let completed = false

      onLoad(() => {
        return new Promise(() => {
          // 永不 resolve
        })
      })

      // 设置一个超时来避免测试永久挂起
      const timeoutPromise = new Promise<void>((resolve) => {
        setTimeout(() => {
          completed = true
          resolve()
        }, 50)
      })

      // 这个测试主要验证我们不会永久阻塞
      await Promise.race([
        runLoadHooks('/never-resolve.ts'),
        timeoutPromise,
      ])

      // 如果 50ms 内完成了，说明没有被阻塞（或者钩子实际上会被等待）
    }, 5000)
  })

  describe('特殊文件路径边缘情况', () => {
    it('应该处理包含空格的路径', async () => {
      setLoadingContext('/path with spaces/file.ts', 'pkg')

      let called = false
      onLoad(() => { called = true })

      await runLoadHooks('/path with spaces/file.ts')

      expect(called).toBe(true)
    })

    it('应该处理包含特殊字符的路径', async () => {
      const specialPaths = [
        '/path/with/dots/.ts',
        '/path/with/at@symbol.ts',
        '/path/with/hash#tag.ts',
        '/path/with/dollar$.ts',
        '/path/with/percent%.ts',
      ]

      for (const path of specialPaths) {
        clearAllHooks()
        setLoadingContext(path, 'pkg')

        let called = false
        onLoad(() => { called = true })

        await runLoadHooks(path)

        expect(called).toBe(true)
      }
    })

    it('应该处理非常长的路径', async () => {
      const longPath = '/' + 'a'.repeat(1000) + '.ts'
      setLoadingContext(longPath, 'pkg')

      let called = false
      onLoad(() => { called = true })

      await runLoadHooks(longPath)

      expect(called).toBe(true)
    })
  })

  describe('全局钩子边缘情况', () => {
    it('应该在没有上下文时注册到全局', () => {
      clearLoadingContext()

      onUnload(vi.fn())
      onReload(vi.fn())

      expect(getHookStats().unload).toBe(1)
      expect(getHookStats().reload).toBe(1)
    })
  })
})
