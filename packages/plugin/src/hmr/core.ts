import chokidar from 'chokidar'
import { cache, core } from '../core'
import { register } from '../register/register'
import { getPluginLoader } from '../load'
import { EventEmitter } from 'node:events'
import { formatPath } from '@karinjs/utils'
import { findDependentModules, clearModuleCaches } from './internal'

import type { Stats } from 'node:fs'
import type { EventName } from 'chokidar/handler.js'
import type { FSWatcher, ChokidarOptions } from 'chokidar'

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
  /**
   * 监听器的当前工作目录
   * @default process.cwd()
   */
  cwd?: string
  /**
   * 忽视规则
   * - 支持字符串、正则表达式、函数、对象、数组等多种形式
   * @example
   * ```ts
   * {
   *   ignored: (file, stats) => {
   *     return stats?.isFile() && path.extname(file) !== '.mjs' // 仅监听mjs文件变化
   *   },
   *   ignored: /(^|[/\\])\../, // 忽略所有点文件
   *   ignored: [/*test.js', /(^|[/\\])\../], // 忽略test.js和所有点文件
   *   ignored: 'test.js', // 忽略test.js文件
   *   ...
   * }
   */
  ignored?: ChokidarOptions['ignored']
}

export interface EventContext {
  /** 变动的文件 */
  fileUrl: string
  /** 受影响的app列表 */
  apps: () => Promise<string[]>
  /** 需要删除缓存的模块URL */
  modules: () => Promise<string[]>
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

/**
 * @class
 * 开发环境热更新管理器
 */
class HmrDevManager {
  logger: ReturnType<typeof logger.prefix>

  constructor () {
    this.logger = logger.prefix('[hmr]')
  }

  /**
   * 动态加载插件包
   * @param pkgName 插件包名称(不带前缀)
   */
  async loadPackage (pkgName: string): Promise<void> {
    const pluginPkg = await core.promise.getPluginPackageDetail(pkgName, true)
    if (!pluginPkg) {
      this.logger.warn(`插件包 ${pkgName} 不存在, 跳过加载`)
      return
    }

    await getPluginLoader().loadPackage(pluginPkg, true)
    this.logger.info(`add: ${logger.green(pkgName)}`)
  }

  /**
   * 动态加载单个app
   * @param appPath app的绝对路径
   */
  async loadApp (appPath: string): Promise<void> {
    await register.loadApp(appPath, true)
    this.logger.info(`add: ${logger.green(formatPath(appPath, { type: 'rel' }))}`)
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
    this.logger.info(`unlink: ${logger.red(pkgName)}`)
  }

  /**
   * 动态卸载单个app
   * @param appPath app的绝对路径
   */
  async unloadApp (appPath: string): Promise<void> {
    register.unregisterApp(appPath)
    this.logger.info(`unlink: ${logger.red(formatPath(appPath, { type: 'rel' }))}`)
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
    register.unregisterApp(appPath)
    await register.loadApp(appPath, true)
    this.logger.info(`change: ${logger.yellow(formatPath(appPath, { type: 'rel' }))}`)
  }
}

/**
 * 热更新管理器单例
 */
export const hot = new HmrDevManager()

/**
 * @class HMRModule
 * @extends EventEmitter
 * 开发环境热更新管理器
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
    this.exclude = exclude.map(p => formatPath(p, { type: 'fileURL' }))
    this.options = {
      ...options,
      atomic: true,
      ignoreInitial: options.ignoreInitial ?? true,
      ignored: options.ignored ?? /(^|[/\\])\../,
    }
    this.watcher = chokidar.watch(files, this.options)
  }

  async init (): Promise<void> {
    this.watcher.on('all', async (event, file, stats) => {
      console.time(`hmr event ${event}`)
      const fileUrl = formatPath(file, { type: 'fileURL', cwd: this.options.cwd })
      console.timeLog(`hmr event ${event}`)
      if (event !== 'change' && event !== 'unlink') {
        if (event === 'add') {
          this.hot.loadApp(file)
        }
        this.emit(event, fileUrl, stats)
        return
      }
      console.timeLog(`hmr event ${event}`)
      const cache = {
        modules: { isCached: false, data: [] as string[] },
        apps: { isCached: false, data: [] as string[] },
      }
      const modules = async () => {
        if (cache.modules.isCached) return cache.modules.data
        const m = await findDependentModules(fileUrl, this.exclude)
        cache.modules.isCached = true
        cache.modules.data = m
        return m
      }

      const apps = async () => {
        if (cache.apps.isCached) return cache.apps.data
        const m = await modules()
        const app = this.getPluginModules(m)
        cache.apps.isCached = true
        cache.apps.data = app
        return app
      }

      console.timeEnd(`hmr event ${event}`)
      this.emit(event, {
        fileUrl,
        apps,
        modules,
        clear: clearModuleCaches,
        load: (file: string) => this.hot.loadApp(file),
        unlink: (file: string) => this.hot.unloadApp(file),
        reloadApp: async (file: string) => {
          await this.hot.reloadApp(file)
        },
        reload: async () => {
          const [list, app] = await Promise.all([modules(), apps()])
          return this.reload(list, app, event)
        },
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
    return fileUrl.map(url => formatPath(url))
      .filter(localPath => result.apps.includes(localPath))
  }
}

/** 热更新函数
 * @param files 监听的文件路径或路径数组
 * @param cb 回调函数
 * @param options 选项
 * @returns HMRModule 实例
 */
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
