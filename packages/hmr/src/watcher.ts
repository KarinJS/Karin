/**
 * 文件监听模块
 *
 * @description
 * 封装 chokidar 提供统一的文件监听接口
 *
 * @module hmr/watcher
 */

import path from 'node:path'
import chokidar from 'chokidar'
import { getModuleType } from '@karinjs/envs'

import type { FSWatcher, ChokidarOptions } from 'chokidar'

/**
 * 监听器选项
 */
export interface WatcherOptions {
  /** 监听的目录或文件 */
  paths: string | string[]
  /** 当前工作目录 */
  cwd?: string
  /** 忽略规则 */
  ignored?: ChokidarOptions['ignored']
  /** 是否忽略初始扫描 */
  ignoreInitial?: boolean
  /** 防抖延迟（毫秒） */
  debounce?: number
}

/**
 * 文件变更事件
 */
export interface FileChangeEvent {
  /** 事件类型 */
  type: 'add' | 'change' | 'unlink'
  /** 文件绝对路径 */
  file: string
}

/**
 * 文件变更处理器
 */
export type FileChangeHandler = (event: FileChangeEvent) => void | Promise<void>

/**
 * 创建文件监听器
 *
 * @param options - 监听器选项
 * @param handler - 文件变更处理器
 * @returns 监听器控制对象
 *
 * @example
 * ```ts
 * const watcher = createWatcher({
 *   paths: ['./plugins'],
 *   debounce: 100
 * }, async (event) => {
 *   console.log(`${event.type}: ${event.file}`)
 * })
 *
 * watcher.start()
 * // ... later
 * await watcher.stop()
 * ```
 */
export function createWatcher (
  options: WatcherOptions,
  handler: FileChangeHandler
) {
  let watcher: FSWatcher | null = null
  const debounceTimers = new Map<string, NodeJS.Timeout>()
  const debounceDelay = options.debounce ?? 100

  /**
   * 防抖处理文件变更
   */
  function debouncedHandle (type: 'add' | 'change' | 'unlink', file: string): void {
    // 清除之前的定时器
    const existingTimer = debounceTimers.get(file)
    if (existingTimer) {
      clearTimeout(existingTimer)
    }

    // 设置新的定时器
    const timer = setTimeout(async () => {
      debounceTimers.delete(file)
      try {
        await handler({ type, file })
      } catch (err) {
        console.error('[hmr/watcher] Handler error:', err)
      }
    }, debounceDelay)

    debounceTimers.set(file, timer)
  }

  return {
    /**
     * 启动监听
     */
    start (): FSWatcher {
      if (watcher) {
        return watcher
      }

      const exts = getModuleType()

      watcher = chokidar.watch(options.paths, {
        atomic: true,
        ignoreInitial: options.ignoreInitial ?? true,
        cwd: options.cwd,
        ignored: options.ignored ?? ((file, stats) => {
          // 忽略非文件
          if (!stats?.isFile()) return false
          // 忽略非支持的扩展名
          return !exts.includes(path.extname(file))
        }),
      })

      watcher.on('all', (event, filePath) => {
        if (event === 'add' || event === 'change' || event === 'unlink') {
          const absFile = options.cwd
            ? path.resolve(options.cwd, filePath)
            : path.resolve(filePath)
          debouncedHandle(event, absFile)
        }
      })

      watcher.on('error', (err) => {
        console.error('[hmr/watcher] Watcher error:', err)
      })

      return watcher
    },

    /**
     * 停止监听
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
      }
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
    get instance (): FSWatcher | null {
      return watcher
    },
  }
}
