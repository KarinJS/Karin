/**
 * 增强型 HMR - 支持副作用清理和配置
 * @module hmr/enhanced
 *
 * 基于 HotModuleReloader 的增强版本，支持：
 * - karin.hmr.config 配置文件
 * - 副作用清理机制
 * - karin.config 热更新
 * - 依赖树管理
 */

import chokidar from 'chokidar'
import { formatPath } from '@karinjs/utils'
import { registry, loader, moduleApi, event, cache as cacheApi } from '../api'
import { effectRegistry } from './effects'
import { hmrConfigManager, HMR_CONFIG_FILES } from './config'
// 使用简单的 glob 匹配（支持 * 和 **）

import type { FSWatcher } from 'chokidar'
import type { HMRContext, DefineHMRConfig, ModuleHotHandler } from './types'

/** 防抖计时器 */
const debounceTimers = new Map<string, NodeJS.Timeout>()

/** 是否为开发环境 */
const isDev = process.env.NODE_ENV === 'development' || process.env.KARIN_DEV === 'true'

/** Karin 配置文件名 */
const KARIN_CONFIG_FILES = [
  'karin.config.ts',
  'karin.config.mts',
  'karin.config.js',
  'karin.config.mjs',
] as const

/**
 * 增强型 HMR 选项
 */
export interface EnhancedHMROptions {
  /** 插件根目录 */
  pluginRoot: string
  /** 插件包名 */
  pluginName: string
  /** 监听的路径列表 */
  paths: string[]
  /** 防抖延迟（毫秒） */
  debounce?: number
  /** 是否启用详细日志 */
  verbose?: boolean
}

/**
 * 增强型 HMR 类
 */
export class EnhancedHMR {
  private watcher: FSWatcher | null = null
  private options: EnhancedHMROptions
  private config: DefineHMRConfig = {}
  private logger = global.logger?.prefix?.('[hmr]') || console
  /** 待处理的配置文件更新 */
  private pendingConfigReload = false
  /** 缓存的旧 karin.config */
  private oldKarinConfig: Record<string, unknown> | null = null

  constructor (options: EnhancedHMROptions) {
    // 防御性检查
    if (!options || typeof options !== 'object') {
      throw new Error('EnhancedHMR: options must be an object')
    }

    if (typeof options.pluginRoot !== 'string' || !options.pluginRoot.trim()) {
      throw new Error('EnhancedHMR: pluginRoot must be a non-empty string')
    }

    if (typeof options.pluginName !== 'string' || !options.pluginName.trim()) {
      throw new Error('EnhancedHMR: pluginName must be a non-empty string')
    }

    if (!Array.isArray(options.paths)) {
      throw new Error('EnhancedHMR: paths must be an array')
    }

    // 过滤无效路径
    const validPaths = options.paths.filter(
      (p): p is string => typeof p === 'string' && p.trim().length > 0
    )

    // 验证并修复 debounce
    let debounce = options.debounce ?? 100
    if (typeof debounce !== 'number' || debounce < 0 || !Number.isFinite(debounce)) {
      this.logger.warn?.('invalid debounce value, using default 100ms')
      debounce = 100
    }

    this.options = {
      debounce,
      verbose: Boolean(options.verbose),
      pluginRoot: options.pluginRoot,
      pluginName: options.pluginName,
      paths: validPaths,
    }
  }

  /**
   * 启动 HMR
   */
  async start (): Promise<void> {
    // 非开发环境不启动
    if (!isDev) {
      this.log('info', 'skipped: not in development mode')
      return
    }

    // 加载 HMR 配置
    this.config = await hmrConfigManager.loadConfig(this.options.pluginRoot)

    // 合并配置中的排除路径
    if (this.config.exclude) {
      moduleApi.setExclude(this.config.exclude)
    }

    // 构建监听路径
    const watchPaths = [
      ...this.options.paths,
      ...(this.config.watch ?? []),
    ]

    // 添加配置文件到监听
    const configFile = await hmrConfigManager.findConfigFile(this.options.pluginRoot)
    if (configFile) {
      watchPaths.push(configFile)
    }

    this.watcher = chokidar.watch(watchPaths, {
      atomic: true,
      ignoreInitial: true,
      ignored: /(^|[/\\])\../,
    })

    this.watcher.on('all', (eventName, file) => {
      if (eventName !== 'change' && eventName !== 'unlink' && eventName !== 'add') {
        return
      }
      this.debounce(file, () => this.handleFileEvent(eventName as 'change' | 'unlink' | 'add', file))
    })

    event.emit('hmr:start', { paths: watchPaths })
    this.log('info', `watching ${watchPaths.length} paths`)
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

    // 清理所有副作用
    await effectRegistry.cleanupAll()

    event.emit('hmr:stop', {})
    this.log('info', 'stopped')
  }

  /**
   * 处理文件事件
   */
  private async handleFileEvent (
    eventName: 'change' | 'unlink' | 'add',
    filePath: string
  ): Promise<void> {
    const fileUrl = formatPath(filePath, { type: 'fileURL' })
    const { basename } = require('node:path')
    const filename = basename(filePath)

    // 1. 检查是否是 HMR 配置文件变更
    if (HMR_CONFIG_FILES.includes(filename as typeof HMR_CONFIG_FILES[number])) {
      await this.handleHMRConfigChange(filePath, eventName)
      return
    }

    // 2. 检查是否是 karin.config 变更
    if (KARIN_CONFIG_FILES.includes(filename as typeof KARIN_CONFIG_FILES[number])) {
      await this.handleKarinConfigChange(filePath, eventName)
      return
    }

    // 3. 普通文件热更新
    if (eventName === 'add') {
      await this.handleFileAdd(filePath)
    } else {
      await this.handleFileChangeOrUnlink(eventName, filePath, fileUrl)
    }
  }

  /**
   * 处理 HMR 配置文件变更
   * HMR 配置文件必须最后处理
   */
  private async handleHMRConfigChange (
    _filePath: string,
    eventName: 'change' | 'unlink' | 'add'
  ): Promise<void> {
    if (eventName === 'unlink') {
      // 配置文件被删除，使用默认配置
      this.config = {}
      this.log('info', 'hmr config removed, using defaults')
      return
    }

    // 标记需要重载配置
    this.pendingConfigReload = true

    // 重新加载配置
    try {
      this.config = await hmrConfigManager.reloadConfig(this.options.pluginRoot)
      this.log('info', 'hmr config reloaded')
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error))
      this.log('error', `failed to reload hmr config: ${err.message}`)
    } finally {
      this.pendingConfigReload = false
    }
  }

  /**
   * 处理 karin.config 变更
   */
  private async handleKarinConfigChange (
    filePath: string,
    eventName: 'change' | 'unlink' | 'add'
  ): Promise<void> {
    if (eventName === 'unlink') {
      this.log('warn', 'karin.config removed!')
      return
    }

    const karinConfigHooks = this.config.karinConfig

    try {
      // 加载新配置
      const version = Date.now()
      const importUrl = `${formatPath(filePath, { type: 'fileURL' })}?v=${version}`

      // 清理旧缓存
      await moduleApi.clearCache(filePath, false)

      const mod = await import(importUrl)
      const newConfig = mod.default ?? mod

      // 计算变更的键
      const changedKeys = this.diffConfigKeys(this.oldKarinConfig ?? {}, newConfig)

      const ctx = {
        file: filePath,
        oldConfig: this.oldKarinConfig ?? undefined,
        newConfig,
        changedKeys,
      }

      // 调用 onBeforeChange 钩子
      if (karinConfigHooks?.onBeforeChange) {
        await karinConfigHooks.onBeforeChange(ctx)
      }

      // 检查是否需要完全重载
      const needFullReload = karinConfigHooks?.requireFullReload
        ? await karinConfigHooks.requireFullReload(ctx)
        : false

      if (needFullReload) {
        // 完全重载插件
        this.log('info', 'karin.config requires full reload')
        await loader.reloadPackage(this.options.pluginName)
      } else {
        // 仅热更新配置
        this.log('info', `karin.config updated: ${changedKeys.join(', ')}`)
      }

      // 更新缓存
      this.oldKarinConfig = newConfig

      // 调用 onAfterChange 钩子
      if (karinConfigHooks?.onAfterChange) {
        await karinConfigHooks.onAfterChange(ctx)
      }
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error))
      this.log('error', `failed to handle karin.config change: ${err.message}`)
    }
  }

  /**
   * 比较配置差异
   */
  private diffConfigKeys (
    oldConfig: Record<string, unknown>,
    newConfig: Record<string, unknown>
  ): string[] {
    // 防御性检查
    const safeOld = (oldConfig && typeof oldConfig === 'object' && !Array.isArray(oldConfig))
      ? oldConfig
      : {}
    const safeNew = (newConfig && typeof newConfig === 'object' && !Array.isArray(newConfig))
      ? newConfig
      : {}

    const changed: string[] = []
    const allKeys = new Set([...Object.keys(safeOld), ...Object.keys(safeNew)])

    for (const key of allKeys) {
      try {
        // JSON.stringify 可能因循环引用抛出错误
        if (JSON.stringify(safeOld[key]) !== JSON.stringify(safeNew[key])) {
          changed.push(key)
        }
      } catch {
        // 循环引用或其他序列化错误，视为已变更
        changed.push(key)
      }
    }

    return changed
  }

  /**
   * 处理文件新增
   */
  private async handleFileAdd (filePath: string): Promise<void> {
    const result = await loader.loadFile(filePath)

    if (result.success) {
      registry.sort()
      this.log('info', `add: ${this.formatRelPath(filePath)} (${result.registered} components)`)
    }
  }

  /**
   * 处理 change 或 unlink 事件
   */
  private async handleFileChangeOrUnlink (
    eventName: 'change' | 'unlink',
    filePath: string,
    fileUrl: string
  ): Promise<void> {
    // 1. 查找所有受影响的模块
    const affectedModules = await moduleApi.findDependentModules(filePath)

    // 2. 构建 HMR 上下文
    const ctx: HMRContext = {
      file: filePath,
      fileUrl,
      affectedModules,
      eventType: eventName,
      timestamp: Date.now(),
    }

    // 3. 调用全局 onBeforeHot 钩子
    if (this.config.onBeforeHot) {
      try {
        await this.config.onBeforeHot(ctx)
      } catch (error) {
        const err = error instanceof Error ? error : new Error(String(error))
        this.log('error', `onBeforeHot error: ${err.message}`)
      }
    }

    // 4. 调用特定模块的处理器
    await this.executeModuleHandlers(filePath, ctx)

    // 5. 清理所有受影响模块的副作用
    for (const moduleUrl of affectedModules) {
      const modulePath = formatPath(moduleUrl)
      if (effectRegistry.has(modulePath)) {
        await effectRegistry.cleanup(modulePath)
        if (this.options.verbose) {
          this.log('debug', `cleaned up effects for: ${this.formatRelPath(modulePath)}`)
        }
      }
    }

    // 6. 清理 ESM 缓存
    await moduleApi.clearCaches(affectedModules)

    // 7. 重载或卸载 apps
    const apps = this.getPluginModules(affectedModules)
    await this.reloadApps(apps, eventName)

    // 8. 调用全局 onAfterHot 钩子
    if (this.config.onAfterHot) {
      try {
        await this.config.onAfterHot(ctx)
      } catch (error) {
        const err = error instanceof Error ? error : new Error(String(error))
        this.log('error', `onAfterHot error: ${err.message}`)
      }
    }

    // 9. 如果有待处理的配置重载，现在执行
    if (this.pendingConfigReload) {
      this.config = await hmrConfigManager.reloadConfig(this.options.pluginRoot)
      this.pendingConfigReload = false
    }
  }

  /**
   * 执行模块特定的处理器
   */
  private async executeModuleHandlers (
    _filePath: string,
    ctx: HMRContext
  ): Promise<void> {
    if (!this.config.modules) return

    const relPath = this.formatRelPath(ctx.file)

    for (const [pattern, handler] of Object.entries(this.config.modules)) {
      // 使用简单的路径匹配
      if (this.matchPattern(relPath, pattern) || this.matchPattern(ctx.file, pattern)) {
        try {
          await (handler as ModuleHotHandler)(ctx)
          if (this.options.verbose) {
            this.log('debug', `executed handler for: ${pattern}`)
          }
        } catch (error) {
          const err = error instanceof Error ? error : new Error(String(error))
          this.log('error', `module handler error (${pattern}): ${err.message}`)
        }
      }
    }
  }

  /**
   * 简单的 glob 模式匹配
   * 支持 * 和 ** 通配符
   */
  private matchPattern (path: string, pattern: string): boolean {
    // 防御性检查
    if (typeof path !== 'string' || typeof pattern !== 'string') {
      return false
    }

    if (!path || !pattern) {
      return false
    }

    // 精确匹配
    if (path === pattern) return true

    // 将 glob 模式转换为正则表达式
    const regexPattern = pattern
      .replace(/\\/g, '/') // 统一路径分隔符
      .replace(/[.+^${}()|[\]]/g, '\\$&') // 转义正则特殊字符
      .replace(/\*\*/g, '{{GLOBSTAR}}') // 临时替换 **
      .replace(/\*/g, '[^/]*') // * 匹配除 / 外的任意字符
      .replace(/{{GLOBSTAR}}/g, '.*') // ** 匹配任意字符

    try {
      const regex = new RegExp(`^${regexPattern}$`)
      return regex.test(path.replace(/\\/g, '/'))
    } catch {
      // 正则表达式无效，回退到精确匹配
      return path === pattern
    }
  }

  /**
   * 重载 apps
   */
  private async reloadApps (apps: string[], eventName: 'change' | 'unlink'): Promise<void> {
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
    // 防御性检查
    if (typeof key !== 'string' || !key) {
      return
    }
    if (typeof fn !== 'function') {
      return
    }

    let delay = this.config.debounce ?? this.options.debounce ?? 100
    // 确保 delay 是有效的正数
    if (typeof delay !== 'number' || delay < 0 || !Number.isFinite(delay)) {
      delay = 100
    }

    const existing = debounceTimers.get(key)
    if (existing) {
      clearTimeout(existing)
    }

    const timer = setTimeout(() => {
      debounceTimers.delete(key)
      fn()
    }, delay)

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
    if (level === 'debug' && !this.options.verbose) return

    if (this.logger[level]) {
      this.logger[level](message)
    } else {
      console.log(`[hmr] ${message}`)
    }
  }
}

/**
 * 创建增强型 HMR 实例
 */
export function createEnhancedHMR (options: EnhancedHMROptions): EnhancedHMR {
  return new EnhancedHMR(options)
}
