/**
 * Apps 类型热更新模块
 *
 * 使用 ESM 的 URL 参数机制实现热更新：
 * - 任何环境都支持
 * - 无需清理 Node 内部缓存
 * - 通过 `?t=timestamp` 绕过缓存
 *
 * @module hot/apps
 */

import path from 'node:path'
import { EventEmitter } from 'node:events'
import chokidar from 'chokidar'
import { formatPath } from '@karinjs/utils'
import { getModuleType } from '@karinjs/envs'
import { store } from '../store'
import { pkgRegistry } from '../package/registry'

import type { FSWatcher, ChokidarOptions } from 'chokidar'

// ==================== 类型定义 ====================

/** Apps 热更新选项 */
export interface AppsHMROptions {
  /** 监听的目录 */
  paths: string | string[]
  /** 当前工作目录 */
  cwd?: string
  /** 忽略规则 */
  ignored?: ChokidarOptions['ignored']
  /** 防抖延迟（毫秒） */
  debounce?: number
  /** 日志级别 */
  logLevel?: 'debug' | 'info' | 'warn' | 'error' | 'silent'
}

/** Apps 热更新事件 */
export interface AppsHMREvents {
  /** 文件添加 */
  add: [file: string]
  /** 文件变更 */
  change: [file: string]
  /** 文件删除 */
  unlink: [file: string]
  /** 重载完成 */
  reload: [{ file: string; removedCount: number; addedCount: number }]
  /** 错误 */
  error: [Error]
  /** 启动 */
  start: []
  /** 停止 */
  stop: []
}

// ==================== Apps HMR 管理器 ====================

/**
 * 创建 Apps 热更新管理器
 *
 * @description
 * Apps 类型使用 URL 参数方式实现热更新：
 * 1. 删除旧插件（通过 store.delByFile）
 * 2. 通过 `import(file + '?t=' + Date.now())` 绕过 ESM 缓存
 * 3. 新插件自动注册到 store
 *
 * @example
 * ```ts
 * const appsHMR = createAppsHMR({
 *   paths: ['./plugins'],
 *   debounce: 100
 * })
 *
 * await appsHMR.start()
 *
 * // 监听事件
 * appsHMR.on('reload', ({ file, removedCount, addedCount }) => {
 *   console.log(`Reloaded: ${file}, -${removedCount} +${addedCount}`)
 * })
 * ```
 */
export function createAppsHMR (options: AppsHMROptions) {
  const emitter = new EventEmitter()
  let watcher: FSWatcher | null = null
  const debounceTimers = new Map<string, NodeJS.Timeout>()

  const logLevel = options.logLevel ?? 'info'
  const debounceDelay = options.debounce ?? 100

  // 日志工具
  const log = {
    debug: (...args: unknown[]) => {
      if (logLevel === 'debug') {
        console.debug('[apps-hmr]', ...args)
      }
    },
    info: (...args: unknown[]) => {
      if (logLevel === 'debug' || logLevel === 'info') {
        if (typeof logger !== 'undefined') {
          logger.info('[apps-hmr]', ...args)
        } else {
          console.log('[apps-hmr]', ...args)
        }
      }
    },
    warn: (...args: unknown[]) => {
      if (logLevel !== 'error' && logLevel !== 'silent') {
        if (typeof logger !== 'undefined') {
          logger.warn('[apps-hmr]', ...args)
        } else {
          console.warn('[apps-hmr]', ...args)
        }
      }
    },
    error: (...args: unknown[]) => {
      if (logLevel !== 'silent') {
        if (typeof logger !== 'undefined') {
          logger.error('[apps-hmr]', ...args)
        } else {
          console.error('[apps-hmr]', ...args)
        }
      }
    },
  }

  /**
   * 通过 URL 参数重新加载文件（绕过缓存）
   */
  async function reloadWithTimestamp (file: string): Promise<void> {
    const fileUrl = formatPath(file, { type: 'fileURL', cwd: options.cwd })
    const urlWithTimestamp = `${fileUrl}?t=${Date.now()}`
    await import(urlWithTimestamp)
  }

  /**
   * 处理文件添加
   */
  async function handleAdd (file: string): Promise<void> {
    try {
      log.debug(`File added: ${file}`)

      // 加载新文件
      await reloadWithTimestamp(file)

      emitter.emit('add', file)
      log.info(`Added: ${formatPath(file, { type: 'rel' })}`)
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err))
      emitter.emit('error', error)
      log.error(`Failed to add ${file}:`, error.message)
    }
  }

  /**
   * 处理文件变更
   */
  async function handleChange (file: string): Promise<void> {
    try {
      log.debug(`File changed: ${file}`)

      // 1. 获取变更前的插件数量
      const beforePlugins = store.getByFile(file)
      const removedCount = beforePlugins.length

      // 2. 删除旧插件
      store.delByFile(file)

      // 3. 使用 URL 参数重新加载（绕过缓存）
      await reloadWithTimestamp(file)

      // 4. 获取新注册的插件数量
      const afterPlugins = store.getByFile(file)
      const addedCount = afterPlugins.length

      emitter.emit('change', file)
      emitter.emit('reload', { file, removedCount, addedCount })
      log.info(`Reloaded: ${formatPath(file, { type: 'rel' })} (-${removedCount} +${addedCount})`)
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err))
      emitter.emit('error', error)
      log.error(`Failed to reload ${file}:`, error.message)
    }
  }

  /**
   * 处理文件删除
   */
  function handleUnlink (file: string): void {
    try {
      log.debug(`File unlinked: ${file}`)

      // 删除该文件注册的所有插件
      const count = store.delByFile(file)

      emitter.emit('unlink', file)
      log.info(`Unlinked: ${formatPath(file, { type: 'rel' })} (${count} plugins removed)`)
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err))
      emitter.emit('error', error)
      log.error(`Failed to unlink ${file}:`, error.message)
    }
  }

  /**
   * 防抖处理文件变更
   */
  function debouncedHandle (
    event: 'add' | 'change' | 'unlink',
    file: string
  ): void {
    // 清除之前的定时器
    const existingTimer = debounceTimers.get(file)
    if (existingTimer) {
      clearTimeout(existingTimer)
    }

    // 设置新的定时器
    const timer = setTimeout(() => {
      debounceTimers.delete(file)

      switch (event) {
        case 'add':
          handleAdd(file)
          break
        case 'change':
          handleChange(file)
          break
        case 'unlink':
          handleUnlink(file)
          break
      }
    }, debounceDelay)

    debounceTimers.set(file, timer)
  }

  return {
    /**
     * 启动热更新监听
     */
    start (): FSWatcher {
      if (watcher) {
        log.warn('HMR is already running')
        return watcher
      }

      const exts = getModuleType()

      watcher = chokidar.watch(options.paths, {
        atomic: true,
        ignoreInitial: true,
        cwd: options.cwd,
        ignored: options.ignored ?? ((file, stats) => {
          // 忽略非文件
          if (!stats?.isFile()) return false
          // 忽略非支持的扩展名
          return !exts.includes(path.extname(file))
        }),
      })

      watcher.on('all', (event, file) => {
        if (event === 'add' || event === 'change' || event === 'unlink') {
          const absFile = options.cwd ? path.resolve(options.cwd, file) : path.resolve(file)
          debouncedHandle(event, absFile)
        }
      })

      watcher.on('error', (err) => {
        const error = err instanceof Error ? err : new Error(String(err))
        emitter.emit('error', error)
        log.error('Watcher error:', error.message)
      })

      emitter.emit('start')
      log.info(`Started watching: ${Array.isArray(options.paths) ? options.paths.join(', ') : options.paths}`)

      return watcher
    },

    /**
     * 停止热更新监听
     */
    async stop (): Promise<void> {
      // 清除所有防抖定时器
      for (const timer of debounceTimers.values()) {
        clearTimeout(timer)
      }
      debounceTimers.clear()

      if (watcher) {
        await watcher.close()
        watcher = null
        emitter.emit('stop')
        log.info('Stopped')
      }
    },

    /**
     * 手动重载单个文件
     */
    async reloadFile (file: string): Promise<void> {
      await handleChange(file)
    },

    /**
     * 手动重载整个包
     */
    async reloadPackage (pkgName: string): Promise<void> {
      const files = pkgRegistry.getFiles(pkgName)
      if (files.length === 0) {
        log.warn(`Package ${pkgName} has no files`)
        return
      }

      log.info(`Reloading package: ${pkgName} (${files.length} files)`)

      // 先删除所有插件
      store.delByPkg(pkgName)

      // 重新加载所有文件
      for (const file of files) {
        try {
          await reloadWithTimestamp(file)
        } catch (err) {
          log.error(`Failed to reload ${file}:`, err)
        }
      }

      log.info(`Reloaded package: ${pkgName}`)
    },

    /**
     * 检查是否正在运行
     */
    get isRunning (): boolean {
      return watcher !== null
    },

    /**
     * 获取 watcher 实例
     */
    get watcher (): FSWatcher | null {
      return watcher
    },

    // ==================== 事件 ====================

    on<K extends keyof AppsHMREvents> (
      event: K,
      listener: (...args: AppsHMREvents[K]) => void
    ): void {
      emitter.on(event, listener as any)
    },

    off<K extends keyof AppsHMREvents> (
      event: K,
      listener: (...args: AppsHMREvents[K]) => void
    ): void {
      emitter.off(event, listener as any)
    },

    once<K extends keyof AppsHMREvents> (
      event: K,
      listener: (...args: AppsHMREvents[K]) => void
    ): void {
      emitter.once(event, listener as any)
    },
  }
}

/**
 * 简单的 apps 文件重载函数
 *
 * @description
 * 适用于只需要重载单个文件的场景
 *
 * @example
 * ```ts
 * import { reloadAppsFile } from '@karinjs/plugin'
 *
 * // 文件变更时调用
 * await reloadAppsFile('/path/to/plugin.ts')
 * ```
 */
export async function reloadAppsFile (file: string): Promise<{
  removedCount: number
  addedCount: number
}> {
  // 1. 删除旧插件
  const removedCount = store.delByFile(file)

  // 2. 通过 URL 参数绕过缓存重新导入
  const fileUrl = formatPath(file, { type: 'fileURL' })
  await import(`${fileUrl}?t=${Date.now()}`)

  // 3. 获取新插件数量
  const addedCount = store.getByFile(file).length

  return { removedCount, addedCount }
}
