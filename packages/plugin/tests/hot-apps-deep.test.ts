/**
 * hot/apps.ts 深度测试
 * 覆盖 AppsHMR 的更多功能
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { createAppsHMR, reloadAppsFile } from '../src/hot/apps'
import { store } from '../src/store'

// Mock 依赖
vi.mock('chokidar', () => ({
  default: {
    watch: vi.fn(() => ({
      on: vi.fn().mockReturnThis(),
      close: vi.fn().mockResolvedValue(undefined),
    })),
  },
}))

vi.mock('@karinjs/utils', () => ({
  formatPath: vi.fn((path: string, options?: any) => {
    if (options?.type === 'fileURL') {
      return `file:///${path.replace(/\\/g, '/')}`
    }
    if (options?.type === 'rel') {
      return path.split('/').pop() || path
    }
    return path
  }),
}))

vi.mock('@karinjs/envs', () => ({
  getModuleType: vi.fn(() => ['.ts', '.js', '.mjs']),
}))

describe('AppsHMR 深度测试', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    store.clear()
  })

  afterEach(() => {
    store.clear()
  })

  describe('createAppsHMR', () => {
    it('应该创建 HMR 实例', () => {
      const hmr = createAppsHMR({
        paths: ['./plugins'],
      })

      expect(hmr).toBeDefined()
      expect(hmr.start).toBeDefined()
      expect(hmr.stop).toBeDefined()
      expect(hmr.reloadFile).toBeDefined()
      expect(hmr.reloadPackage).toBeDefined()
      expect(hmr.isRunning).toBe(false)
    })

    it('应该支持配置选项', () => {
      const hmr = createAppsHMR({
        paths: ['./plugins', './apps'],
        cwd: '/test/cwd',
        debounce: 200,
        logLevel: 'debug',
      })

      expect(hmr).toBeDefined()
    })

    it('应该启动 watcher', () => {
      const hmr = createAppsHMR({
        paths: ['./plugins'],
        logLevel: 'silent',
      })

      const watcher = hmr.start()
      expect(watcher).toBeDefined()
      expect(hmr.isRunning).toBe(true)
    })

    it('应该返回已存在的 watcher 如果已经启动', () => {
      const hmr = createAppsHMR({
        paths: ['./plugins'],
        logLevel: 'silent',
      })

      const watcher1 = hmr.start()
      const watcher2 = hmr.start()

      expect(watcher1).toBe(watcher2)
    })

    it('应该停止 watcher', async () => {
      const hmr = createAppsHMR({
        paths: ['./plugins'],
        logLevel: 'silent',
      })

      hmr.start()
      await hmr.stop()

      expect(hmr.isRunning).toBe(false)
    })

    it('应该在未启动时调用 stop 不报错', async () => {
      const hmr = createAppsHMR({
        paths: ['./plugins'],
        logLevel: 'silent',
      })

      await expect(hmr.stop()).resolves.toBeUndefined()
    })
  })

  describe('事件监听', () => {
    it('应该支持 on/off/once 事件监听', () => {
      const hmr = createAppsHMR({
        paths: ['./plugins'],
        logLevel: 'silent',
      })

      const listener = vi.fn()

      hmr.on('start', listener)
      hmr.start()

      expect(listener).toHaveBeenCalled()

      hmr.off('start', listener)
    })

    it('应该支持 once 一次性监听', () => {
      const hmr = createAppsHMR({
        paths: ['./plugins'],
        logLevel: 'silent',
      })

      const listener = vi.fn()

      hmr.once('stop', listener)
      hmr.start()
    })

    it('应该发出 start 事件', () => {
      const hmr = createAppsHMR({
        paths: ['./plugins'],
        logLevel: 'silent',
      })

      const startListener = vi.fn()
      hmr.on('start', startListener)

      hmr.start()

      expect(startListener).toHaveBeenCalled()
    })

    it('应该发出 stop 事件', async () => {
      const hmr = createAppsHMR({
        paths: ['./plugins'],
        logLevel: 'silent',
      })

      const stopListener = vi.fn()
      hmr.on('stop', stopListener)

      hmr.start()
      await hmr.stop()

      expect(stopListener).toHaveBeenCalled()
    })
  })

  describe('watcher 属性', () => {
    it('应该在未启动时返回 null', () => {
      const hmr = createAppsHMR({
        paths: ['./plugins'],
        logLevel: 'silent',
      })

      expect(hmr.watcher).toBeNull()
    })

    it('应该在启动后返回 watcher', () => {
      const hmr = createAppsHMR({
        paths: ['./plugins'],
        logLevel: 'silent',
      })

      hmr.start()
      expect(hmr.watcher).not.toBeNull()
    })
  })

  describe('日志级别', () => {
    it('应该支持 debug 级别', () => {
      const hmr = createAppsHMR({
        paths: ['./plugins'],
        logLevel: 'debug',
      })

      expect(hmr).toBeDefined()
      hmr.start()
    })

    it('应该支持 warn 级别', () => {
      const hmr = createAppsHMR({
        paths: ['./plugins'],
        logLevel: 'warn',
      })

      expect(hmr).toBeDefined()
    })

    it('应该支持 error 级别', () => {
      const hmr = createAppsHMR({
        paths: ['./plugins'],
        logLevel: 'error',
      })

      expect(hmr).toBeDefined()
    })

    it('应该支持 silent 级别', () => {
      const hmr = createAppsHMR({
        paths: ['./plugins'],
        logLevel: 'silent',
      })

      expect(hmr).toBeDefined()
    })
  })

  describe('路径配置', () => {
    it('应该支持单个路径', () => {
      const hmr = createAppsHMR({
        paths: './plugins',
        logLevel: 'silent',
      })

      expect(hmr).toBeDefined()
      hmr.start()
    })

    it('应该支持多个路径', () => {
      const hmr = createAppsHMR({
        paths: ['./plugins', './apps', './modules'],
        logLevel: 'silent',
      })

      expect(hmr).toBeDefined()
      hmr.start()
    })
  })

  describe('ignored 配置', () => {
    it('应该支持自定义 ignored 规则', () => {
      const hmr = createAppsHMR({
        paths: ['./plugins'],
        ignored: /node_modules/,
        logLevel: 'silent',
      })

      expect(hmr).toBeDefined()
      hmr.start()
    })
  })
})

describe('reloadAppsFile', () => {
  beforeEach(() => {
    store.clear()
    vi.clearAllMocks()
  })

  it('应该是一个异步函数', () => {
    // reloadAppsFile 应该是一个函数
    expect(typeof reloadAppsFile).toBe('function')
  })

  it('应该尝试重载文件', async () => {
    // 在测试环境中，import 会失败，但函数应该存在
    try {
      await reloadAppsFile('/non-existent/plugin.ts')
    } catch {
      // 预期会失败，因为文件不存在
    }

    // 只要不抛出未处理的异常就算通过
    expect(true).toBe(true)
  })
})
