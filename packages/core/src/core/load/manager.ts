import fs from 'node:fs'
import path from 'node:path'
import { karinPathPlugins } from '@/root'
import { getModuleType, isTs } from '@/env'
import { filesByExt, formatPath, isPathEqual, isSubPath, PkgData, requireFileSync } from '@/utils'

import type { CommandCache } from '../karin/command'
import type { PluginCacheKeyFile, PluginCacheKeyPkg, PluginPackageType } from '../karin/base'
import type { ClassCache } from '../karin/class'
import type { AcceptCache } from '../karin/accept'
import type { HandlerCache } from '../karin/handler'
import type { ButtonCache } from '../karin/button'
import type { TaskCache } from '../karin/task'

/** 插件管理父类 */
export abstract class PluginPackageManager {
  /** git插件包目录 */
  dir: string
  /** 缓存 */
  cache: {
    /** 全部插件包名称列表`(带前缀)` */
    plugins: string[]
    /** 全部插件包详细信息 */
    pluginsDetails: Map<string, PluginCacheKeyPkg>
    /** command */
    command: CommandCache[]
    /** class */
    class: ClassCache[]
    /** accept */
    accept: AcceptCache[]
    /** handler */
    handler: HandlerCache[]
    /** button */
    button: ButtonCache[]
    /** task */
    task: TaskCache[]
    /** 静态资源目录 */
    static: string[]
  }

  constructor (dir: string = karinPathPlugins) {
    this.dir = dir.replace(/\\/g, '/')
    this.cache = {
      plugins: [],
      pluginsDetails: new Map(),
      command: [],
      class: [],
      accept: [],
      handler: [],
      button: [],
      task: [],
      static: [],
    }
  }

  get command () {
    return this.cache.command
  }

  get class () {
    return this.cache.class
  }

  get accept () {
    return this.cache.accept
  }

  /**
   * 获取全部插件包名称列表`(带前缀)`
   * @param isRefresh 是否强制刷新不使用缓存
   * @example
   * ```json
   * [
   *  "npm:karin-plugin-demo",
   *  "git:karin-plugin-demo",
   *  "apps:karin-plugin-demo",
   *  "root:karin-plugin-demo",
   * ]
   * ```
   */
  async getPlugins (isRefresh = false) {
    if (!isRefresh && this.cache.plugins.length) {
      return this.cache.plugins
    }

    /**
 * 要排除的NPM包列表
 */
    const NPM_EXCLUDE_LIST = [
      '@karinjs/node-pty',
      '@karinjs/plugin-webui-network-monitor',
      '@karinjs/plugins-list',
      '@types/express',
      '@types/lodash',
      '@types/node-schedule',
      '@types/ws',
      'art-template',
      'axios',
      'chalk',
      'chokidar',
      'commander',
      'dotenv',
      'express',
      'level',
      'lodash',
      'log4js',
      'moment',
      'node-schedule',
      'redis',
      'ws',
      'yaml',
      'sqlite3',
    ]

    const list: string[] = []
    const files = await Promise.all([
      fs.promises.readdir(path.join(process.cwd(), 'node_modules')),
      fs.promises.readdir(path.resolve(this.dir)),
    ]).then(results => results.flat())

    files.forEach((v) => {
      if (NPM_EXCLUDE_LIST.includes(v)) return
      const { status, type } = this.isPluginPackage(v)
      if (!status) return

      list.push(`${type}:${v}`)
    })

    this.cache.plugins = list
    return this.cache.plugins
  }

  /** 格式化插件名称 */
  _formatPluginName (pluginName: string): { type: PluginPackageType, name: string } {
    if (pluginName.includes(':')) {
      const [type, name] = pluginName.split(':') as [PluginPackageType, string]
      if (['npm', 'root', 'git', 'apps'].includes(type)) return { type, name }

      throw new TypeError(`${pluginName}: ${type} 不符合插件包类型规范`)
    }

    const { status, type } = this.isPluginPackage(pluginName)
    if (!status) {
      throw new TypeError(`${pluginName} 不符合插件包规范`)
    }

    return { type, name: pluginName }
  }

  /**
   * 获取插件包信息
   * @param value 插件包名称 不带前缀
   * @param isRefresh 是否强制刷新不使用缓存
   * @returns 插件包信息
   */
  _pluginInfo (value: string, isRefresh = false): PluginCacheKeyPkg {
    if (!isRefresh && this.cache.pluginsDetails.has(value)) {
      return this.cache.pluginsDetails.get(value)!
    }

    const { type, name } = this._formatPluginName(value)
    const dir = (() => {
      if (type === 'npm') return path.join(process.cwd(), 'node_modules', name)
      if (type === 'root') return process.cwd()
      return path.join(this.dir, name)
    })()

    if (!fs.existsSync(dir)) {
      throw new Error(`插件包不存在，请检查插件名称 ${value} 是否正确`)
    }

    return {
      name,
      type,
      dir: formatPath(dir),
      get apps () {
        if (!this.appsDirs) return []
        return PluginPackageManager.getAllApp(this.appsDirs)
      },
      get appsDirs () {
        const pkg = this.data
        if (!pkg) {
          return this.type === 'apps' ? [this.dir] : []
        }

        return PluginPackageManager.getAppsDir(pkg, this.dir)
      },
      get path () {
        const filePath = path.join(dir, 'package.json')
        if (fs.existsSync(filePath)) {
          return formatPath(filePath)
        }

        return null
      },
      get data () {
        if (!this.path) return null
        return requireFileSync(this.path, { ex: 0 })
      },
    }
  }

  /**
   * 获取插件包列表 `(带详细信息)`
   * @param isRefresh 是否强制刷新不使用缓存
   * @returns 插件包列表
   */
  async getPluginDetails (
    isRefresh = false
  ): Promise<Map<string, PluginCacheKeyPkg>> {
    if (!isRefresh && this.cache.pluginsDetails.size) {
      return this.cache.pluginsDetails
    }

    const map: Map<string, PluginCacheKeyPkg> = new Map()
    const list = await this.getPlugins(isRefresh)

    await Promise.all(list.map(async (v) => {
      const info = this._pluginInfo(v, isRefresh)
      map.set(info.name, info)
    }))

    return map
  }

  /**
   * 通过插件包名获取插件包详细信息
   * @param pkgName 插件包名 不带前缀
   * @param isRefresh 是否强制刷新不使用缓存
   * @returns 插件包详细信息
   */
  getPluginPackageDetail (pkgName: string, isRefresh = false): PluginCacheKeyPkg {
    const cache = this.cache.pluginsDetails.get(pkgName)
    if (cache && !isRefresh) return cache

    const info = this._pluginInfo(pkgName, isRefresh)
    this.cache.pluginsDetails.set(info.name, info)
    return info
  }

  /**
   * 判断一个目录是否为插件包
   * @param dir 目录
   * @returns 是否为插件包
   */
  isPluginPackage (dir: string): { status: boolean, type: PluginPackageType } {
    const pkgPath = path.join(dir, 'package.json')
    if (!fs.existsSync(pkgPath)) {
      /** apps */
      if (path.basename(dir).includes('karin-plugin-')) {
        return { status: true, type: 'apps' }
      }

      return { status: false, type: 'apps' }
    }

    /** npm */
    if (pkgPath.includes('node_modules')) {
      const status = this.isPackageJsonToKarin(pkgPath)
      return { status, type: 'npm' }
    }

    /** root */
    if (isPathEqual(dir, process.cwd())) {
      const status = this.isPackageJsonToKarin(pkgPath)
      return { status, type: 'root' }
    }

    /** git */
    if (path.dirname(pkgPath).includes('karin-plugin-')) {
      const status = this.isPackageJsonToKarin(pkgPath)
      return { status, type: 'git' }
    }

    return { status: false, type: 'apps' }
  }

  /**
   * 判断package.json是否存在karin配置
   * @param pkgPath package.json路径
   * @returns 是否为插件包
   */
  isPackageJsonToKarin (pkgPath: string) {
    const pkg = requireFileSync(pkgPath, { ex: 0 })
    return typeof pkg.karin === 'object'
  }

  /**
   * 获取全部 apps 目录
   * @param pkg - package.json
   * @param dir - 插件包目录
   * @returns
   */
  static getAppsDir (pkg: PkgData, dir: string): string[] {
    const getApps = (apps?: string | string[]) => {
      if (typeof apps === 'string') {
        const app = path.join(dir, apps)
        return fs.existsSync(app) ? [app] : []
      }

      if (!Array.isArray(apps)) return []

      const list: string[] = []
      apps.forEach((v) => {
        if (typeof v !== 'string') return
        const app = path.join(dir, v)
        if (fs.existsSync(app)) list.push(app)
      })
      return list.map(v => formatPath(v))
    }

    if (isTs()) {
      const apps = pkg?.karin?.['ts-apps']
      return getApps(apps)
    }

    const apps = pkg?.karin?.apps
    return getApps(apps)
  }

  /**
   * 获取入口文件
   * @param pkg - package.json
   * @param dir - 插件包目录
   * @returns 入口文件路径
   */
  static getMain (pkg: PkgData, dir: string): string | null {
    if (isTs()) {
      if (pkg?.karin?.main &&
        typeof pkg.karin.main === 'string' &&
        fs.existsSync(path.join(dir, pkg.karin.main))
      ) {
        return path.join(dir, pkg.karin.main)
      }

      return null
    }

    if (pkg?.main &&
      typeof pkg.main === 'string' &&
      fs.existsSync(path.join(dir, pkg.main))
    ) {
      return path.join(dir, pkg.main)
    }

    return null
  }

  /**
   * 获取全部 app 列表
   * @param dirs - 插件包目录列表
   * @returns 全部 app 列表
   */
  static getAllApp (dirs: string[]): string[] {
    const list: string[][] = []
    dirs.forEach((v) => {
      list.push(filesByExt(v, getModuleType(), 'abs'))
    })

    return list.flat()
  }

  /**
   * 获取文件缓存
   * @param dir 文件目录
   * @returns 文件缓存
   */
  getFileCache (dir: string): PluginCacheKeyFile {
    return {
      absPath: dir,
      get dirname () {
        return path.dirname(dir)
      },
      get basename () {
        return path.basename(dir)
      },
    }
  }

  /**
   * 传入一个app文件路径 返回包名
   * @param appPath app文件路径
   * @returns 包名
   */
  getPackageName (appPath: string): string | null {
    appPath = formatPath(appPath)
    /** npm */
    if (appPath.includes('node_modules')) {
      return appPath.split('node_modules/')[1].split('/')[1]
    }

    /** git、apps */
    if (isSubPath(this.dir, appPath)) {
      return appPath.split(this.dir)[1].split('/')[1]
    }

    /** root */
    if (isPathEqual(appPath, process.cwd())) {
      return requireFileSync(path.join(appPath, 'package.json'), { ex: 0 }).name
    }

    return null
  }
}
