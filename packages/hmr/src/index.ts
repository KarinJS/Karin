/**
 * @karinjs/hmr - Hot Module Replacement for Karin Dev Packages
 *
 * @description
 * 提供 dev 类型插件的热更新支持
 * 使用 Node.js 内部 ESM 缓存 API 实现真正的模块热替换
 *
 * @example
 * ```ts
 * import { createDevHMR } from '@karinjs/hmr'
 *
 * // 创建 HMR 实例
 * const hmr = createDevHMR({
 *   paths: ['./plugins/my-dev-plugin'],
 *   debounce: 100
 * })
 *
 * // 启动监听
 * hmr.start()
 *
 * // 监听事件
 * hmr.on('reload', (result) => {
 *   console.log(`Reloaded: ${result.file}`)
 * })
 *
 * // 停止监听
 * await hmr.stop()
 * ```
 *
 * @module @karinjs/hmr
 */

import { EventEmitter } from 'node:events'
import { formatPath } from '@karinjs/utils'
import { createWatcher } from './watcher'
import { reloadDevFile, reloadDevPackage, handleFileAdd, handleFileUnlink } from './reload'

import type { WatcherOptions } from './watcher'
import type { ReloadResult } from './reload'

// ==================== 类型定义 ====================

/**
 * Dev HMR 选项
 */
export interface DevHMROptions extends WatcherOptions {
  /** 日志级别 */
  logLevel?: 'debug' | 'info' | 'warn' | 'error' | 'silent'
}

/**
 * Dev HMR 事件
 */
export interface DevHMREvents {
  /** 文件添加 */
  add: [ReloadResult]
  /** 文件变更并重载 */
  change: [ReloadResult]
  /** 文件删除 */
  unlink: [ReloadResult]
  /** 重载完成（统一事件） */
  reload: [ReloadResult]
  /** 错误 */
  error: [Error]
  /** 启动 */
  start: []
  /** 停止 */
  stop: []
}

// ==================== 日志工具 ====================

function createLogger (level: DevHMROptions['logLevel']) {
  const shouldLog = (targetLevel: string) => {
    const levels = ['debug', 'info', 'warn', 'error', 'silent']
    return levels.indexOf(targetLevel) >= levels.indexOf(level ?? 'info')
  }

  const log = (method: 'debug' | 'info' | 'warn' | 'error', ...args: unknown[]) => {
    if (level === 'silent') return
    if (!shouldLog(method)) return

    const prefix = '[hmr]'
    if (typeof logger !== 'undefined') {
      logger[method](prefix, ...args)
    } else {
      console[method](prefix, ...args)
    }
  }

  return {
    debug: (...args: unknown[]) => log('debug', ...args),
    info: (...args: unknown[]) => log('info', ...args),
    warn: (...args: unknown[]) => log('warn', ...args),
    error: (...args: unknown[]) => log('error', ...args),
  }
}

// ==================== 主入口 ====================

/**
 * 创建 Dev HMR 管理器
 *
 * @description
 * Dev 类型使用 Node.js 内部 ESM 缓存 API 实现热更新：
 * 1. 监听文件变化
 * 2. 删除旧插件（通过 store.delByFile）
 * 3. 清理 ESM 缓存（Node 内部 API）
 * 4. 重新导入模块
 * 5. 新插件自动注册到 store
 *
 * @example
 * ```ts
 * const hmr = createDevHMR({
 *   paths: ['./plugins/dev'],
 *   debounce: 100
 * })
 *
 * hmr.start()
 *
 * hmr.on('reload', (result) => {
 *   if (result.success) {
 *     console.log(`✅ ${result.file}: -${result.removedCount} +${result.addedCount}`)
 *   } else {
 *     console.error(`❌ ${result.file}: ${result.error}`)
 *   }
 * })
 * ```
 */
export function createDevHMR (options: DevHMROptions) {
  const emitter = new EventEmitter()
  const log = createLogger(options.logLevel)

  // 创建文件监听器
  const watcher = createWatcher(options, async (event) => {
    let result: ReloadResult

    switch (event.type) {
      case 'add':
        log.debug(`File added: ${event.file}`)
        result = await handleFileAdd(event.file)
        emitter.emit('add', result)
        break

      case 'change':
        log.debug(`File changed: ${event.file}`)
        result = await reloadDevFile(event.file)
        emitter.emit('change', result)
        break

      case 'unlink':
        log.debug(`File unlinked: ${event.file}`)
        result = handleFileUnlink(event.file)
        emitter.emit('unlink', result)
        break
    }

    // 统一发送 reload 事件
    emitter.emit('reload', result!)

    // 日志输出
    if (result!.success) {
      const relPath = formatPath(result!.file, { type: 'rel' })
      log.info(`${event.type}: ${relPath} (-${result!.removedCount} +${result!.addedCount})`)
    } else {
      log.error(`Failed to ${event.type} ${result!.file}: ${result!.error}`)
      emitter.emit('error', new Error(result!.error))
    }
  })

  return {
    /**
     * 启动热更新监听
     */
    start () {
      watcher.start()
      emitter.emit('start')
      log.info(`Started watching: ${Array.isArray(options.paths) ? options.paths.join(', ') : options.paths}`)
      return watcher.instance
    },

    /**
     * 停止热更新监听
     */
    async stop () {
      await watcher.stop()
      emitter.emit('stop')
      log.info('Stopped')
    },

    /**
     * 手动重载单个文件
     */
    async reloadFile (file: string): Promise<ReloadResult> {
      return reloadDevFile(file)
    },

    /**
     * 手动重载整个包
     */
    async reloadPackage (pkgName: string) {
      return reloadDevPackage(pkgName)
    },

    /**
     * 检查是否正在运行
     */
    get isRunning () {
      return watcher.isRunning
    },

    /**
     * 获取 watcher 实例
     */
    get watcher () {
      return watcher.instance
    },

    // ==================== 事件 ====================

    on<K extends keyof DevHMREvents> (
      event: K,
      listener: (...args: DevHMREvents[K]) => void
    ) {
      emitter.on(event, listener as any)
      return this
    },

    off<K extends keyof DevHMREvents> (
      event: K,
      listener: (...args: DevHMREvents[K]) => void
    ) {
      emitter.off(event, listener as any)
      return this
    },

    once<K extends keyof DevHMREvents> (
      event: K,
      listener: (...args: DevHMREvents[K]) => void
    ) {
      emitter.once(event, listener as any)
      return this
    },
  }
}

// ==================== 导出 ====================

// 缓存工具
export {
  clearModuleCache,
  clearModuleCaches,
  findDependentModules,
  getCacheStats,
  clearCacheByPrefix,
} from './cache'

// 重载工具
export {
  reloadDevFile,
  reloadDevPackage,
  handleFileAdd,
  handleFileUnlink,
} from './reload'

// 监听器
export { createWatcher } from './watcher'

// 类型导出
export type { ReloadResult } from './reload'
export type { WatcherOptions, FileChangeEvent, FileChangeHandler } from './watcher'
