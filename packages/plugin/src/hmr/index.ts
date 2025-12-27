/**
 * HMR - 热模块重载
 * @module hmr
 *
 * 完全基于内部 API 实现，作为 API 的消费者
 */

import chokidar from 'chokidar'
import { formatPath } from '@karinjs/utils'
import { registry, loader, moduleApi, event, cache as cacheApi } from '../api'

import type { FSWatcher, ChokidarOptions } from 'chokidar'

/** 防抖计时器 */
const debounceTimers = new Map<string, NodeJS.Timeout>()

/**
 * HMR 选项
 */
export interface HMROptions extends ChokidarOptions {
  /** 监听的文件/目录列表 */
  paths: string[]
  /** 插件包名称 */
  pluginName?: string
  /** 受保护的文件路径（不清除缓存） */
  exclude?: string[]
  /** 文件扩展名过滤 */
  extensions?: string[]
  /** 防抖延迟（毫秒） */
  debounce?: number
  /** 重载策略 */
  reloadStrategy?: 'file' | 'package' | 'all'
}

/**
 * 事件上下文
 */
export interface EventContext {
  /** 变动的文件 */
  fileUrl: string
  /** 受影响的 app 列表 */
  apps: () => Promise<string[]>
  /** 需要删除缓存的模块 URL */
  modules: () => Promise<string[]>
  /** 清理缓存函数 */
  clear: (fileUrl: string[]) => Promise<void>
  /** 加载 app 函数 */
  load: (file: string) => Promise<void>
  /** 手动卸载单个 app 函数 */
  unlink: (file: string) => Promise<void>
  /** 重载单个 app 函数 */
  reloadApp: (file: string) => Promise<void>
  /** 一键重载 */
  reload: () => Promise<void>
}

/** HMR 重载结果 */
export interface HMRReloadResult {
  success: boolean
  target: string
  duration: number
  error?: Error
}

/**
 * HMR 类 - 开发环境热更新管理器
 */
export class HotModuleReloader {
  private watcher: FSWatcher | null = null
  private options: Required<Pick<HMROptions, 'paths' | 'extensions' | 'debounce' | 'reloadStrategy'>> & HMROptions
  private logger = global.logger?.prefix?.('[hmr]') || console

  constructor (options: HMROptions) {
    this.options = {
      extensions: options.extensions ?? ['.js', '.ts', '.mjs', '.mts'],
      debounce: options.debounce ?? 100,
      reloadStrategy: options.reloadStrategy ?? 'file',
      pluginName: options.pluginName,
      exclude: options.exclude,
      atomic: true,
      ignoreInitial: options.ignoreInitial ?? true,
      ignored: options.ignored ?? /(^|[/\\])\../,
      ...options,
    }

    // 设置受保护的路径
    const excludePaths = Array.isArray(options.exclude) ? options.exclude : []
    moduleApi.setExclude(excludePaths)
  }

  /**
   * 启动 HMR
   */
  async start (): Promise<void> {
    this.watcher = chokidar.watch(this.options.paths, {
      atomic: this.options.atomic,
      ignoreInitial: this.options.ignoreInitial,
      ignored: this.options.ignored,
    })

    this.watcher.on('all', async (eventName, file) => {
      const fileUrl = formatPath(file, { type: 'fileURL' })

      // 非 change/unlink 事件
      if (eventName !== 'change' && eventName !== 'unlink') {
        if (eventName === 'add') {
          this.debounce(file, () => this.handleAdd(file))
        }
        return
      }

      // change/unlink 事件 - 构建上下文
      this.debounce(file, () => this.handleChangeOrUnlink(eventName, file, fileUrl))
    })

    event.emit('hmr:start', { paths: this.options.paths })
    this.log('info', `watching ${this.options.paths.length} paths`)
  }

  /**
   * 停止 HMR
   */
  async stop (): Promise<void> {
    if (this.watcher) {
      await this.watcher.close()
      this.watcher = null
    }

    // 清除所有防抖计时器
    for (const timer of debounceTimers.values()) {
      clearTimeout(timer)
    }
    debounceTimers.clear()

    event.emit('hmr:stop', {})
    this.log('info', 'stopped')
  }

  /**
   * 处理文件新增
   */
  private async handleAdd (filePath: string): Promise<void> {
    const result = await loader.loadFile(filePath)

    if (result.success) {
      registry.sort()
      this.log('info', `add: ${this.formatRelPath(filePath)} (${result.registered} components)`)
    }
  }

  /**
   * 处理 change 或 unlink 事件
   */
  private async handleChangeOrUnlink (
    eventName: 'change' | 'unlink',
    filePath: string,
    fileUrl: string
  ): Promise<void> {
    // 缓存依赖查找结果
    const cacheState = {
      modules: { isCached: false, data: [] as string[] },
      apps: { isCached: false, data: [] as string[] },
    }

    const modules = async (): Promise<string[]> => {
      if (cacheState.modules.isCached) return cacheState.modules.data
      const m = await moduleApi.findDependentModules(filePath)
      cacheState.modules.isCached = true
      cacheState.modules.data = m
      return m
    }

    const apps = async (): Promise<string[]> => {
      if (cacheState.apps.isCached) return cacheState.apps.data
      const m = await modules()
      const app = this.getPluginModules(m)
      cacheState.apps.isCached = true
      cacheState.apps.data = app
      return app
    }

    const ctx: EventContext = {
      fileUrl,
      apps,
      modules,
      clear: async (urls: string[]) => {
        await moduleApi.clearCaches(urls)
      },
      load: async (file: string) => {
        await loader.loadFile(file, { force: true })
        registry.sort()
        this.log('info', `add: ${this.formatRelPath(file)}`)
      },
      unlink: async (file: string) => {
        registry.unregisterByFile(file)
        this.log('info', `unlink: ${this.formatRelPath(file)}`)
      },
      reloadApp: async (file: string) => {
        registry.unregisterByFile(file)
        await loader.loadFile(file, { force: true })
        registry.sort()
        this.log('info', `change: ${this.formatRelPath(file)}`)
      },
      reload: async () => {
        const [list, appList] = await Promise.all([modules(), apps()])
        await this.reload(list, appList, eventName)
      },
    }

    // 自动执行 reload
    await ctx.reload()
  }

  /**
   * 一键重载
   */
  private async reload (
    fileUrls: string[],
    apps: string[],
    eventName: 'change' | 'unlink'
  ): Promise<void> {
    // 清理缓存
    await moduleApi.clearCaches(fileUrls)

    // 重载或卸载 apps
    await Promise.allSettled(apps.map(async (file) => {
      if (eventName === 'change') {
        registry.unregisterByFile(file)
        await loader.loadFile(file, { force: true })
        this.log('info', `change: ${this.formatRelPath(file)}`)
      } else {
        registry.unregisterByFile(file)
        this.log('info', `unlink: ${this.formatRelPath(file)}`)
      }
    }))

    registry.sort()
  }

  /**
   * 重载单个文件
   */
  async reloadFile (filePath: string): Promise<HMRReloadResult> {
    const start = Date.now()

    try {
      registry.unregisterByFile(filePath)
      await moduleApi.clearCache(filePath, true)
      const result = await loader.loadFile(filePath, { force: true })
      registry.sort()

      event.emit('file:change', { file: filePath, result })

      return {
        success: result.success,
        target: filePath,
        duration: Date.now() - start,
        error: result.error,
      }
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error))
      return {
        success: false,
        target: filePath,
        duration: Date.now() - start,
        error: err,
      }
    }
  }

  /**
   * 重载整个包
   */
  async reloadPackage (pkgName: string): Promise<HMRReloadResult> {
    const start = Date.now()

    try {
      registry.unregisterByPackage(pkgName)

      const files = moduleApi.getFilesByPackage(pkgName)
      for (const file of files) {
        await moduleApi.clearCache(file, true)
      }

      const results = await loader.reloadPackage(pkgName)
      registry.sort()

      const success = results.every(r => r.success)
      const registered = results.reduce((sum, r) => sum + r.registered, 0)

      event.emit('plugin:reload', {
        pkg: pkgName,
        result: { success, file: pkgName, registered },
      })

      return {
        success,
        target: pkgName,
        duration: Date.now() - start,
      }
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error))
      return {
        success: false,
        target: pkgName,
        duration: Date.now() - start,
        error: err,
      }
    }
  }

  /**
   * 查找哪些是 apps 下的文件
   */
  private getPluginModules (fileUrls: string[]): string[] {
    const pkgName = this.options.pluginName
    if (!pkgName) return fileUrls.map(url => formatPath(url))

    const files = cacheApi.package.getFiles(pkgName)
    if (!files.length) return []

    const filesSet = new Set(files)
    return fileUrls
      .map(url => formatPath(url))
      .filter(localPath => filesSet.has(localPath))
  }

  /**
   * 防抖处理
   */
  private debounce (key: string, fn: () => void): void {
    const existing = debounceTimers.get(key)
    if (existing) {
      clearTimeout(existing)
    }

    const timer = setTimeout(() => {
      debounceTimers.delete(key)
      fn()
    }, this.options.debounce)

    debounceTimers.set(key, timer)
  }

  /**
   * 格式化相对路径
   */
  private formatRelPath (filePath: string): string {
    return formatPath(filePath, { type: 'rel' })
  }

  /**
   * 日志输出
   */
  private log (level: 'info' | 'debug' | 'warn' | 'error', message: string): void {
    if (this.logger[level]) {
      this.logger[level](message)
    } else {
      console.log(`[hmr] ${message}`)
    }
  }
}

/**
 * 创建 HMR 实例
 */
export function createHMR (options: HMROptions): HotModuleReloader {
  return new HotModuleReloader(options)
}

/**
 * 快速启动 HMR（基于已加载的包）
 */
export async function startHMR (): Promise<HotModuleReloader | null> {
  const packages = cacheApi.package.getAll()
  const paths: string[] = []

  for (const [, pkg] of packages) {
    paths.push(...pkg.files)
  }

  if (paths.length === 0) {
    console.log('[hmr] no files to watch')
    return null
  }

  const hmr = createHMR({ paths })
  await hmr.start()
  return hmr
}

/**
 * HMR 管理器 - 统一的 HMR API（兼容旧接口）
 */
export const HMRManager = {
  /** 初始化插件热重载 */
  init: startHMR,
  /** 创建 HMR 实例 */
  create: createHMR,
  /** HMR 类 */
  Module: HotModuleReloader,
}

// ============================================================================
// 导出增强型 HMR 功能
// ============================================================================

export { EnhancedHMR, createEnhancedHMR } from './enhanced'
export type { EnhancedHMROptions } from './enhanced'

export { effectRegistry, registerEffect, createEffect } from './effects'
export { hmrConfigManager, defineHMRConfig, HMR_CONFIG_FILES } from './config'

export type {
  HMRConfig,
  DefineHMRConfig,
  HMRContext,
  CleanupFunction,
  ModuleHotHandler,
  EffectRegistry,
  ConfigChangeContext,
  KarinConfigHooks,
} from './types'
