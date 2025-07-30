import path from 'node:path'
import chokidar from 'chokidar'
import { EventEmitter } from 'node:events'
import { clearRequire, requireFileSync } from '../require'

import type { FSWatcher } from 'chokidar'
import type { RequireOptions } from '../require'

/**
 * 文件变动回调函数类型
 */
export interface WatchCallback<T> {
  (
    /** 旧数据 */
    oldData: T,
    /** 新数据 */
    newData: T
  ): void
}

/**
 * 带文件路径的文件变动回调函数类型（用于批量监听）
 */
export interface WatchCallbackWithPath<T> {
  (
    /** 文件路径 */
    filePath: string,
    /** 旧数据 */
    oldData: T,
    /** 新数据 */
    newData: T
  ): void
}

/**
 * 文件监听配置选项
 */
export interface WatchOptions extends RequireOptions {
  /** 是否立即获取初始值 */
  immediate?: boolean
  /** 自定义错误处理 */
  onError?: (error: unknown) => void
}

/**
 * 全局文件监听管理器 - 使用单一chokidar实例优化性能
 */
class GlobalWatchManager {
  private static instance?: GlobalWatchManager
  private watcher?: FSWatcher
  private fileWatchers = new Map<string, Set<FileWatcher<any>>>()
  private isInitialized = false

  private constructor () { }

  static getInstance (): GlobalWatchManager {
    if (!GlobalWatchManager.instance) {
      GlobalWatchManager.instance = new GlobalWatchManager()
    }
    return GlobalWatchManager.instance
  }

  private initWatcher (): void {
    if (this.isInitialized) return

    this.watcher = chokidar.watch([], {
      persistent: true,
      ignoreInitial: true,
    })

    this.watcher.on('change', (filePath) => {
      const normalizedPath = this.normalizePath(filePath)
      this.notifyWatchers(normalizedPath, 'change')
    })

    this.watcher.on('unlink', (filePath) => {
      const normalizedPath = this.normalizePath(filePath)
      this.notifyWatchers(normalizedPath, 'unlink')
      /** 文件被删除时，清理所有相关监听器 */
      this.removeFile(normalizedPath)
    })

    this.watcher.on('error', (error) => {
      /** 将错误传播给所有监听器 */
      for (const watchers of this.fileWatchers.values()) {
        for (const watcher of watchers) {
          watcher.handleError(error)
        }
      }
    })

    this.isInitialized = true
  }

  private normalizePath (filePath: string): string {
    return path.resolve(filePath).replace(/\\/g, '/')
  }

  private notifyWatchers (filePath: string, event: 'change' | 'unlink'): void {
    const watchers = this.fileWatchers.get(filePath)
    if (!watchers || watchers.size === 0) return

    for (const watcher of watchers) {
      if (event === 'change') {
        watcher.handleFileChange()
      } else if (event === 'unlink') {
        watcher.handleFileDelete()
      }
    }
  }

  addWatcher (filePath: string, watcher: FileWatcher<any>): void {
    this.initWatcher()

    const normalizedPath = this.normalizePath(filePath)

    if (!this.fileWatchers.has(normalizedPath)) {
      this.fileWatchers.set(normalizedPath, new Set())
      /** 只有第一次监听该文件时才添加到chokidar */
      this.watcher?.add(normalizedPath)
    }

    this.fileWatchers.get(normalizedPath)?.add(watcher)
  }

  removeWatcher (filePath: string, watcher: FileWatcher<any>): void {
    const normalizedPath = this.normalizePath(filePath)
    const watchers = this.fileWatchers.get(normalizedPath)

    if (!watchers) return

    watchers.delete(watcher)

    /** 如果没有监听器了，停止监听该文件 */
    if (watchers.size === 0) {
      this.removeFile(normalizedPath)
    }
  }

  private removeFile (filePath: string): void {
    this.fileWatchers.delete(filePath)
    this.watcher?.unwatch(filePath)
  }

  /** 获取统计信息 */
  getStats () {
    return {
      totalFiles: this.fileWatchers.size,
      totalWatchers: Array.from(this.fileWatchers.values())
        .reduce((sum, watchers) => sum + watchers.size, 0),
    }
  }
}

/**
 * 文件监听器类 - 使用共享的GlobalWatchManager优化性能
 */
class FileWatcher<T = any> extends EventEmitter {
  private readonly filePath: string
  private readonly options: WatchOptions
  private currentData?: T
  private isWatching = false
  private static globalManager = GlobalWatchManager.getInstance()

  constructor (filePath: string, options: WatchOptions = {}) {
    super()
    this.filePath = this.normalizePath(filePath)
    this.options = options

    /** 如果需要立即获取初始值 */
    if (options.immediate !== false) {
      this.loadInitialData()
    }
  }

  /**
   * 标准化路径
   */
  private normalizePath (filePath: string): string {
    return path.resolve(filePath).replace(/\\/g, '/')
  }

  /**
   * 加载初始数据
   */
  private loadInitialData (): void {
    try {
      this.currentData = requireFileSync<T>(this.filePath, this.options)
    } catch (error) {
      this.handleError(error)
    }
  }

  /**
   * 错误处理 - 改为public以便GlobalWatchManager调用
   */
  public handleError (error: unknown): void {
    if (this.options.onError) {
      this.options.onError(error)
    } else {
      this.emit('error', error)
    }
  }

  /**
   * 开始监听文件
   */
  start (): this {
    if (this.isWatching) return this

    /** 使用共享的GlobalWatchManager */
    FileWatcher.globalManager.addWatcher(this.filePath, this)
    this.isWatching = true
    this.emit('start', this.filePath)
    return this
  }

  /**
   * 处理文件变更 - 改为public以便GlobalWatchManager调用
   */
  public handleFileChange (): void {
    try {
      const oldData = this.currentData
      clearRequire(this.filePath)

      const newData = requireFileSync<T>(this.filePath, this.options)
      this.currentData = newData

      this.emit('change', oldData, newData)
    } catch (error) {
      this.handleError(error)
    }
  }

  /**
   * 处理文件删除 - 改为public以便GlobalWatchManager调用
   */
  public handleFileDelete (): void {
    clearRequire(this.filePath)
    this.currentData = undefined
    this.emit('unlink', this.filePath)
  }

  /**
   * 获取当前数据
   */
  get value (): T | undefined {
    return this.currentData
  }

  /**
   * 刷新数据
   */
  refresh (): T {
    this.loadInitialData()
    return this.currentData as T
  }

  /**
   * 停止监听并清理资源
   */
  stop (): void {
    if (!this.isWatching) return

    /** 从GlobalWatchManager中移除 */
    FileWatcher.globalManager.removeWatcher(this.filePath, this)
    clearRequire(this.filePath)
    this.isWatching = false
    this.emit('stop', this.filePath)
    this.removeAllListeners()
  }

  /**
   * 添加变更监听器的便捷方法
   */
  onChange (callback: WatchCallback<T>): this {
    this.on('change', callback)
    return this
  }

  /**
   * 添加错误监听器的便捷方法
   */
  onError (callback: (error: Error) => void): this {
    this.on('error', callback)
    return this
  }

  /**
   * 获取全局监听统计信息
   */
  static getGlobalStats () {
    return FileWatcher.globalManager.getStats()
  }
}

/**
 * 监听单个文件变更
 * @param file 文件路径
 * @param callback 变更回调函数
 * @param options 配置选项
 * @returns 文件监听器实例
 */
export function watch<T> (
  file: string,
  callback: WatchCallback<T>,
  options?: WatchOptions
): FileWatcher<T>

/**
 * 监听多个文件变更
 * @param files 文件路径数组
 * @param callback 变更回调函数（带文件路径）
 * @param options 配置选项
 * @returns 文件监听器实例数组
 */
export function watch<T> (
  files: string[],
  callback: WatchCallbackWithPath<T>,
  options?: WatchOptions
): FileWatcher<T>[]

/**
 * 监听文件变更 - 支持单文件和多文件
 */
export function watch<T> (
  fileOrFiles: string | string[],
  callback: WatchCallback<T> | WatchCallbackWithPath<T>,
  options: WatchOptions = {}
): FileWatcher<T> | FileWatcher<T>[] {
  /** 单文件监听 */
  if (typeof fileOrFiles === 'string') {
    const watcher = new FileWatcher<T>(fileOrFiles, options)
    watcher.onChange(callback as WatchCallback<T>)
    watcher.start()
    return watcher
  }

  /** 多文件监听 */
  const watchers: FileWatcher<T>[] = []
  const multiCallback = callback as WatchCallbackWithPath<T>

  for (const file of fileOrFiles) {
    const watcher = new FileWatcher<T>(file, options)

    /** 为每个文件创建带路径的回调包装器 */
    watcher.onChange((oldData, newData) => {
      multiCallback(file, oldData, newData)
    })

    watcher.start()
    watchers.push(watcher)
  }

  return watchers
}

/**
 * 创建文件监听器实例（不自动开始监听）- 支持单文件和多文件
 * @param fileOrFiles 文件路径或文件路径数组
 * @param options 配置选项
 * @returns 文件监听器实例或实例数组
 */
export function createWatcher<T> (file: string, options?: WatchOptions): FileWatcher<T>
export function createWatcher<T> (files: string[], options?: WatchOptions): FileWatcher<T>[]
export function createWatcher<T> (
  fileOrFiles: string | string[],
  options: WatchOptions = {}
): FileWatcher<T> | FileWatcher<T>[] {
  if (typeof fileOrFiles === 'string') {
    return new FileWatcher<T>(fileOrFiles, options)
  }

  return fileOrFiles.map(file => new FileWatcher<T>(file, options))
}

/**
 * 为了向后兼容，保留原有的 Watch 类型别名
 */
export interface Watch<T> extends FileWatcher<T> { }
