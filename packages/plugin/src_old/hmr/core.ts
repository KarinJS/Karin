import chokidar from 'chokidar'
import { pluginCache } from '../cache'
import { registry } from '../registry/registry'
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
  logger: ReturnType<typeof logger.prefix>

  /**
   * 构造函数
   * @param files 模块文件路径
   * @param options 选项
   */
  constructor (files: string | string[], options: HMROptions) {
    super()
    this.logger = logger.prefix('[hmr]')
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
      const fileUrl = formatPath(file, { type: 'fileURL', cwd: this.options.cwd })
      if (event !== 'change' && event !== 'unlink') {
        if (event === 'add') {
          await registry.loader.app(file, { eager: true })
          this.logger.info(`add: ${logger.green(formatPath(file, { type: 'rel' }))}`)
        }
        this.emit(event, fileUrl, stats)
        return
      }

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

      this.emit(event, {
        fileUrl,
        apps,
        modules,
        clear: clearModuleCaches,
        load: async (file: string) => {
          await registry.loader.app(file, { eager: true })
          this.logger.info(`add: ${logger.green(formatPath(file, { type: 'rel' }))}`)
        },
        unlink: async (file: string) => {
          registry.unregister.app(file)
          this.logger.info(`unlink: ${logger.red(formatPath(file, { type: 'rel' }))}`)
        },
        reloadApp: async (file: string) => {
          registry.unregister.plugin(file)
          await registry.loader.app(file, { eager: true })
          this.logger.info(`change: ${logger.yellow(formatPath(file, { type: 'rel' }))}`)
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
    this.logger.debug(`开始重载: ${apps.length} 个应用, 事件: ${event}`)

    await clearModuleCaches(fileUrl)
    this.logger.debug('模块缓存清理完成')

    await Promise.allSettled(apps.map(async (file) => {
      if (event === 'change') {
        registry.unregister.plugin(file)
        await registry.loader.app(file, { eager: true })
        this.logger.info(`change: ${logger.yellow(formatPath(file, { type: 'rel' }))}`)
      } else {
        registry.unregister.app(file)
        this.logger.info(`unlink: ${logger.red(formatPath(file, { type: 'rel' }))}`)
      }
    }))

    this.logger.debug('重载完成')
  }
  /**
   * 查找哪些是apps下的文件
   * @param fileUrl 模块URL数组
   * @returns 属于插件apps的文件路径数组
   */

  getPluginModules (fileUrl: string[]): string[] {
    // 使用新的 package API 获取插件信息
    const files = pluginCache.package.getFilesByPackageName(this.options.pluginName)
    if (!files.length) return []
    const filesSet = new Set(files)
    return fileUrl.map(url => formatPath(url))
      .filter(localPath => filesSet.has(localPath))
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
