import path from 'node:path'
import chokidar from 'chokidar'
import { formatPath } from '../path'
import { clearRequire, requireFileSync, requireFile } from '../require'

import type { Stats } from 'node:fs'
import type { } from '@karinjs/logger'
import type { RequireOptions } from '../require'
import type { ChokidarOptions, FSWatcher } from 'chokidar'

/**
 * 文件变动回调选项
 */
export interface CallbackOptions {
  /** 文件变动的状态 */
  stats?: Stats
  /** 获取变动的文件名称 `file.txt` */
  name: string
  /** 获取变动的文件后缀: `.txt` */
  extname: string
  /** 获取变动的文件目录 */
  dirname: string
  /** 获取格式化之后的文件路径 */
  formattedPath: string
}

/**
 * 文件变动回调函数
 */
export type Callback<T> = (
  /** 文件变动的路径 */
  path: string,
  /** 变动之前的数据 */
  oldValue: T,
  /** 变动之后的数据 */
  newValue: T,
  options: CallbackOptions
) => void | Promise<void>

/**
 * watch 配置选项
 */
export interface WatchOptions {
  /**
   * 操作文件数据使用的函数
   * - `requireFile`: 异步
   * - `requireFileSync`: 同步
   *
   * @default 'requireFileSync'
   */
  write?: 'requireFileSync' | 'requireFile'
  /** 操作文件数据参数 */
  require?: RequireOptions
  /** 传递给 `chokidar` 的参数 */
  chokidar?: ChokidarOptions
}

/**
 * 创建回调选项
 */
const createCallbackOptions = (filePath: string, stats?: Stats): CallbackOptions => ({
  stats,
  get name () {
    return path.basename(filePath)
  },
  get extname () {
    return path.extname(filePath)
  },
  get dirname () {
    return formatPath(path.dirname(filePath))
  },
  get formattedPath () {
    return formatPath(filePath)
  },
})

/**
 * 监听文件变动（简化版）
 * @param file 文件路径
 * @param callback 文件变动后调用的函数
 * @param options 配置选项
 * @returns FSWatcher 实例
 *
 * @example
 * ```typescript
 * watch('./config.json', (prev, next) => {
 *   console.log('配置已更新', prev, next)
 * })
 * ```
 */
export const watch = <T = unknown> (
  file: string,
  callback: (prev: T, next: T) => void | Promise<void>,
  options?: RequireOptions
): FSWatcher => {
  return watchs<T>(file, (_, prev, next) => callback(prev, next), {
    require: options,
  })
}

/**
 * 监听文件变动（完整版）
 * @param paths 文件路径或路径数组
 * @param callback 文件变动时的回调函数
 * @param options 配置选项
 * @returns FSWatcher 实例
 *
 * @example
 * ```typescript
 * watchs('./config.json', (path, prev, next, options) => {
 *   console.log(`文件 ${options.name} 已更新`)
 *   console.log('旧数据:', prev)
 *   console.log('新数据:', next)
 * })
 *
 * // 监听多个文件
 * watchs(['./config1.json', './config2.json'], (path, prev, next) => {
 *   console.log(`${path} 已更新`)
 * })
 * ```
 */
export const watchs = <T = unknown> (
  paths: string | string[],
  callback: Callback<T>,
  options?: WatchOptions
): FSWatcher => {
  if (!paths?.length) {
    throw new TypeError('paths 参数不能为空，接受 string | string[] 类型')
  }

  if (typeof callback !== 'function') {
    throw new TypeError('callback 参数必须是函数类型')
  }

  const useSync = options?.write !== 'requireFile'
  const watcher = chokidar.watch(paths, {
    atomic: true,
    ignoreInitial: true,
    ignored: /(^|[/\\])\../,
    ...options?.chokidar,
  })

  const log = (global?.logger || console)

  watcher.on('change', async (eventPath, stats) => {
    const absPath = formatPath(eventPath, { cwd: options?.chokidar?.cwd })
    const relPath = toRelativePath(absPath, options?.chokidar?.cwd)

    const prev = useSync
      ? requireFileSync(absPath, { ...options?.require, readCache: true })
      : await requireFile(absPath, { ...options?.require, readCache: true })
    clearRequire(absPath)
    const next = useSync
      ? requireFileSync(absPath, { ...options?.require, force: true })
      : await requireFile(absPath, { ...options?.require, force: true })

    const callbackOptions = createCallbackOptions(absPath, stats)
    callback(relPath, prev, next, callbackOptions)
    log.info(`[watch][change] ${toRelativePath(absPath, options?.chokidar?.cwd)}`)
  })

  watcher.on('unlink', (filePath) => {
    log.info(`[watch][unlink] ${toRelativePath(filePath, options?.chokidar?.cwd)}`)
    clearRequire(formatPath(filePath, { cwd: options?.chokidar?.cwd }))
  })

  return watcher
}

/**
 * 转相对路径
 * @param filePath 文件路径
 * @param cwd 基准目录，默认 `process.cwd()`
 * @returns 相对路径
 */
const toRelativePath = (filePath: string, cwd?: string): string => {
  cwd = cwd || process.cwd()
  const abs = path.resolve(cwd, filePath)
  return path.relative(cwd, abs).replaceAll('\\', '/')
}
