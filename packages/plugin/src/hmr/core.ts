import path from 'node:path'
import chokidar from 'chokidar'
import { cache, core } from '../core'
import { loadClass } from '../decorators'
import { register } from '../register/register'
import { getPluginLoader } from '../load'
import { imports } from '@karinjs/utils'
import { EventEmitter } from 'node:events'
import { fileURLToPath } from 'node:url'
import { findDependentModules, clearModuleCaches } from './internal'

import type { Stats } from 'node:fs'
import type { EventName } from 'chokidar/handler.js'
import type { FSWatcher, ChokidarOptions } from 'chokidar'

export interface EventContext {
  /** 受影响的apps */
  apps: string[]
  /** 变动的文件 */
  fileUrl: string
  /**
   * 清理缓存函数
   * @param fileUrl 需要清理的模块URL数组
   */
  clear: (fileUrl: string[]) => Promise<void>
  /**
   * 加载app函数
   * @param file app的绝对路径或文件URL
   */
  load: (file: string) => Promise<void>
  /**
   * 手动卸载单个app函数
   * @param file app的绝对路径或文件URL
   */
  unlink: (file: string) => Promise<void>
  /**
   * 重载单个app函数
   * @description 先卸载再加载指定的app
   * @param file app的绝对路径或文件URL
   */
  reloadApp: (file: string) => Promise<void>
  /**
   * 一键重载
   * @description 清理获取到的依赖列表缓存，并将其重新 `import` 和 plugin.load
   */
  reload: () => Promise<void>
}

/** 非change、unlink 事件的上下文key */
type Keys = Exclude<EventName, 'change' | 'unlink'>

type EventMap = {
  [K in Keys]: [string, Stats | undefined]
} & {
  change: [EventContext]
  unlink: [EventContext]
}

/** HMR 事件类型定义 */
type HMREvent =
  | { event: 'change' | 'unlink'; ctx: EventContext }
  | { event: Exclude<EventName, 'change' | 'unlink'>; file: string; stats?: Stats }

/** HMR 回调函数类型 */
type HMRCallback = (event: HMREvent) => void | Promise<void>

/** 操作类型 */
type OperationType = '加载' | '卸载' | '重载'

/** 插件包信息返回类型 */
interface PackageInfo {
  pkgName: string
  pluginPkg: any
  normalizedPath: string
}

/**
 * @class
 * 热更新管理器
 */
class HotReloadManager {
  logger: ReturnType<typeof logger.prefix>

  constructor () {
    this.logger = logger.prefix('[hmr]')
  }

  /**
   * 路径工具类 - 统一路径处理逻辑
   */
  readonly pathUtils = {
    /**
     * 规范化路径 - 转换为绝对路径并统一分隔符
     * @param filePath 文件路径（绝对路径或file URL）
     * @returns 规范化的绝对路径，使用正斜杠分隔
     */
    normalize: (filePath: string): string => {
      const absolutePath = filePath.startsWith('file://')
        ? fileURLToPath(filePath)
        : path.resolve(filePath)
      return absolutePath.replace(/\\/g, '/')
    },

    /**
     * 转换为相对路径
     * @param filePath 文件路径（绝对路径或file URL）
     * @returns 相对于工作目录的路径
     */
    toRelative: (filePath: string): string => {
      const absolutePath = this.pathUtils.normalize(filePath)
      return path.relative(process.cwd(), absolutePath).replace(/\\/g, '/')
    },
  }

  /**
   * 插件包操作工具类 - 统一插件包验证和获取逻辑
   */
  readonly packageUtils = {
    /**
     * 验证并获取插件包信息
     * @param pkgName 插件包名称
     * @param throwOnNotFound 不存在时是否抛出错误
     * @returns 插件包信息或null
     */
    validateAndGet: async (pkgName: string, throwOnNotFound = true) => {
      const pluginPkg = await core.promise.getPluginPackageDetail(pkgName, true)
      if (!pluginPkg && throwOnNotFound) {
        throw new Error(`插件包 ${pkgName} 不存在`)
      }
      return pluginPkg
    },

    /**
     * 从路径获取插件包名称并验证
     * @param appPath app的绝对路径
     * @returns 插件包名称和详细信息
     */
    getPackageByPath: async (appPath: string): Promise<PackageInfo> => {
      const normalizedPath = this.pathUtils.normalize(appPath)
      const pkgName = core.getPackageName(normalizedPath)

      if (!pkgName) {
        throw new Error(`无法确定app ${normalizedPath} 所属的插件包`)
      }

      const pluginPkg = await core.promise.getPluginPackageDetail(pkgName)
      if (!pluginPkg) {
        throw new Error(`插件包 ${pkgName} 不存在`)
      }

      return { pkgName, pluginPkg, normalizedPath }
    },

    /**
     * 检查插件包是否存在于缓存中
     * @param pkgName 插件包名称
     * @returns 是否存在
     */
    isLoaded: (pkgName: string) => cache.pluginsMap.has(pkgName),
  }

  /**
   * 日志工具类 - 统一日志输出格式
   */
  readonly logUtils = {
    logOperation: (operation: OperationType, target: string, isPackage = false) => {
      const displayPath = isPackage ? target : this.pathUtils.toRelative(target)
      const prefix = isPackage ? '插件包' : ''
      this.logger.info(`${operation}${prefix}: ${displayPath}`)
    },
  }

  /**
   * 动态加载插件包
   * @param pkgName 插件包名称(不带前缀)
   */
  async loadPackage (pkgName: string): Promise<void> {
    const pluginPkg = await this.packageUtils.validateAndGet(pkgName)

    /** 检查是否已经存在, 如果存在则先卸载 */
    if (this.packageUtils.isLoaded(pkgName)) {
      await this.unloadPackage(pkgName)
    }

    /** 使用现有的加载器加载插件包 */
    await getPluginLoader().loadPackage(pluginPkg!, true)
    this.logUtils.logOperation('加载', pkgName, true)
  }

  /**
   * 动态加载单个app
   * @param appPath app的绝对路径
   */
  async loadApp (appPath: string): Promise<void> {
    const { pkgName, normalizedPath } = await this.packageUtils.getPackageByPath(appPath)

    this.logger.debug(`开始加载app: ${normalizedPath}`)

    /** 重新导入模块 */
    const result = await imports(normalizedPath, { eager: true })
    this.logger.debug(`模块导入成功: ${normalizedPath}`)

    /** 加载class插件 */
    loadClass(pkgName, normalizedPath, result)

    this.logUtils.logOperation('加载', normalizedPath)
  }

  /**
   * 动态卸载插件包
   * @param pkgName 插件包名称(不带前缀)
   */
  async unloadPackage (pkgName: string): Promise<void> {
    const pluginPkg = cache.pluginsMap.get(pkgName)
    if (!pluginPkg) {
      this.logger.warn(`插件包 ${pkgName} 不存在, 跳过卸载`)
      return
    }

    /** 卸载插件包注册信息 */
    register.unregisterPackage(pkgName)
    this.logUtils.logOperation('卸载', pkgName, true)
  }

  /**
   * 动态卸载单个app
   * @param appPath app的绝对路径
   */
  async unloadApp (appPath: string): Promise<void> {
    const normalizedPath = this.pathUtils.normalize(appPath)

    /** 卸载app注册信息 */
    register.unregisterApp(normalizedPath)
    this.logUtils.logOperation('卸载', normalizedPath)
  }

  /**
   * 重新加载插件包(卸载后重新加载)
   * @param pkgName 插件包名称(不带前缀)
   */
  async reloadPackage (pkgName: string): Promise<void> {
    await this.unloadPackage(pkgName)
    await this.loadPackage(pkgName)
  }

  /**
   * 重新加载单个app(卸载后重新加载)
   * @param appPath app的绝对路径
   */
  async reloadApp (appPath: string): Promise<void> {
    const { pkgName, normalizedPath } = await this.packageUtils.getPackageByPath(appPath)

    /** 静默卸载：只执行卸载逻辑，不输出日志 */
    register.unregisterApp(normalizedPath)

    /** 静默加载：执行加载逻辑，但不输出加载日志 */
    const result = await imports(normalizedPath, { eager: true })
    loadClass(pkgName, normalizedPath, result)

    /** 输出重载日志 */
    this.logUtils.logOperation('重载', normalizedPath)
  }
}

/**
 * 热更新管理器单例
 */
export const hot = new HotReloadManager()

/**
 * fileUrl 前缀
 * - windows: `file:///`
 * - macOS/Linux: `file://`
 */
const fileUrlPrefix = process.platform === 'win32' ? 'file:///' : 'file://'

/**
 * HMR 选项接口
 */
export interface HMROptions extends ChokidarOptions {
  /**
   * 插件包名称
   * @description 用于重载插件时，识别哪些模块属于 apps 下的插件模块
   */
  pluginName: string

  /**
   * 这些文件路径将被保护不被清理缓存
   * @description node_modules、node自身模块、karin本身模块永远被保护
   */
  exclude?: string[]
}

/**
 * @class HMRModule
 * @extends EventEmitter
 * HMR 模块
 */
export class HMRModule extends EventEmitter<EventMap> {
  /** 受保护的文件路径 */
  exclude: string[]
  /** Chokidar 监听器 */
  watcher: FSWatcher
  options: HMROptions
  /** 热更新管理器实例 */
  hot = hot

  /**
   * 构造函数
   * @param files 模块文件路径
   * @param options 选项
   */
  constructor (files: string | string[], options: HMROptions) {
    super()
    const exclude: string[] = Array.isArray(options.exclude) ? options.exclude : []
    this.exclude = exclude.map(p => this.formatFileUrl(p))
    this.options = {
      ...options,
      ignoreInitial: options.ignoreInitial ?? true,
      ignored: options.ignored ?? /(^|[/\\])\../,
      // 返回绝对路径

    }
    this.watcher = chokidar.watch(files, this.options)
  }

  async init (): Promise<void> {
    this.watcher.on('all', async (event, file, stats) => {
      if (this.options.cwd) {
        file = path.resolve(this.options.cwd, file)
      }

      const fileUrl = this.formatFileUrl(file)

      if (event !== 'change' && event !== 'unlink') {
        if (event === 'add') {
          this.hot.loadApp(this.hot.pathUtils.normalize(file))
        }
        this.emit(event, fileUrl, stats)
        return
      }

      const list = await findDependentModules(fileUrl, this.exclude)
      const apps = this.getPluginModules(list)
      this.emit(event, {
        apps,
        fileUrl,
        clear: clearModuleCaches,
        load: (file: string) => this.hot.loadApp(this.hot.pathUtils.normalize(file)),
        unlink: (file: string) => this.hot.unloadApp(this.hot.pathUtils.normalize(file)),
        reloadApp: async (file: string) => {
          const normalizedFile = this.hot.pathUtils.normalize(file)
          await this.hot.reloadApp(normalizedFile)
        },
        reload: () => this.reload(list, apps, event),
      })
    })
  }

  /**
   * 一键重载
   * @description 清理获取到的依赖列表缓存，并将其重新 `import` 和 plugin.load
   * @param fileUrl 模块URL数组
   * @param apps 属于插件apps的文件路径数组
   * @param event 事件类型 'change' | 'unlink'
   */
  async reload (fileUrl: string[], apps: string[], event: 'change' | 'unlink'): Promise<void> {
    const logger = this.hot.logger
    logger.debug(`开始重载: ${apps.length} 个应用, 事件: ${event}`)

    await clearModuleCaches(fileUrl)
    logger.debug('模块缓存清理完成')

    await Promise.allSettled(apps.map(async (file) => {
      if (event === 'change') {
        return await this.hot.reloadApp(file)
      }
      await this.hot.unloadApp(file)
    }))

    logger.debug('重载完成')
  }
  /**
   * 查找哪些是apps下的文件
   * @param fileUrl 模块URL数组
   * @returns 属于插件apps的文件路径数组
   */

  getPluginModules (fileUrl: string[]): string[] {
    const result = core.getPluginPackageDetail(this.options.pluginName)
    if (!result || !result.apps.length) return []
    return fileUrl.map(url => this.hot.pathUtils.normalize(url))
      .filter(localPath => result.apps.includes(localPath))
  }

  /**
   * 格式化文件路径为 file URL
   * - Windows: `file:///D:/path/to/file.js`
   * - macOS/Linux: `file:///D:/path/to/file.js`
   * @param filePath 模块文件路径
   */
  formatFileUrl (filePath: string): string {
    /** 规范化路径 */
    const normalizedPath = this.hot.pathUtils.normalize(filePath)
    /** 添加 file URL 前缀 */
    return `${fileUrlPrefix}${normalizedPath}`
  }

  /**
   * 优雅的相对路径转换
   * @description 以工作目录为起点，将绝对路径转换为相对路径，并将反斜杠替换为正斜杠
   * @param filePath 文件路径（绝对路径或file URL）
   * @returns 相对于工作目录的路径，使用正斜杠分隔
   */
  toRelativePath (filePath: string): string {
    return this.hot.pathUtils.toRelative(filePath)
  }
}

export const hmr = async (
  files: string | string[],
  cb: HMRCallback,
  options: HMROptions
): Promise<HMRModule> => {
  const module = new HMRModule(files, options)
  await module.init()

  module.watcher.on('all', (event, file, stats) => {
    if (event === 'change' || event === 'unlink') return
    cb({ event, file, stats })
  })

  module.on('change', (ctx) => cb({ event: 'change', ctx }))
  module.on('unlink', (ctx) => cb({ event: 'unlink', ctx }))
  return module
}
