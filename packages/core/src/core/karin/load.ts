import fs from 'node:fs'
import path from 'node:path'
import lodash from 'lodash'
import { karinPathPlugins } from '@/root'
import { getModuleType, isTs } from '@/env'
import { createPluginDir, filesByExt, formatPath, importModule, isPathEqual, isSubPath, PkgData, requireFileSync, satisfies } from '@/utils'

import type { CommandCache } from './command'
import type { PluginCacheKeyFile, PluginCacheKeyPkg, PluginPackageType } from './base'
import { errorHandler } from '../internal'
import { createAddEnv } from '@/plugin/system/env'

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
    /** 静态资源目录 */
    static: string[]
  }

  constructor (dir: string = karinPathPlugins) {
    this.dir = dir.replace(/\\/g, '/')
    this.cache = {
      plugins: [],
      pluginsDetails: new Map(),
      command: [],
      static: [],
    }
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
        if (!pkg) return []
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

/** 插件管理注册类 */
export class PluginPackageManagerRegister extends PluginPackageManager {
  constructor (dir: string = karinPathPlugins) {
    super(dir)
  }

  /**
   * 注册命令插件
   * @param command 命令
   */
  registerCommand (command: CommandCache) {
    this.cache.command.push(command)
  }

  /**
   * 卸载命令插件
   * @param command 命令
   */
  unregisterCommand (id: string) {
    const index = this.cache.command.findIndex(v => v.app.id === id)
    if (index === -1) {
      logger.error(`[unregisterCommand] ${id} 未找到`)
    }

    this.cache.command.splice(index, 1)
  }
}

/** 插件管理加载类 */
export class PluginPackageManagerLoad extends PluginPackageManagerRegister {
  /** 是否初始化 */
  #isInit = false
  constructor (dir: string = karinPathPlugins) {
    super(dir)

    this.#isInit = false
  }

  async init () {
    if (this.#isInit) return
    await this.getPluginDetails()
    const list = await this.getPlugins()
    await Promise.all(list.map(async (v) => {
      const [, name] = v.split(':')
      await this.load(name)
    }))

    this.#isInit = true
  }

  /**
   * 加载插件
   * @param pluginName 插件名称 不带前缀
   */
  async load (pluginName: string) {
    const pkg = this.getPluginPackageDetail(pluginName)
    const files = this.getFiles(pkg)

    /** 检查版本号是否符合加载要求 */
    if (!this.checkVersion(pkg)) return

    /** 创建插件基本文件夹 - 这个需要立即执行 */
    await createPluginDir(pkg.name, files)

    /** 加载入口文件 */
    if (pkg.data) {
      const main = PluginPackageManager.getMain(pkg.data, pkg.dir)
      if (main) await this.loadMain(pluginName, main)
    }

    /** 加载全部app */
    await Promise.all(pkg.apps.map(async (file) => {
      const { status, data } = await importModule(file)
      if (status) return

      logger.debug(new Error(`加载模块失败: ${pluginName} ${file}`, { cause: data }))
      errorHandler.loaderPlugin(pluginName, file, data)
    }))

    /** 获取静态资源目录 */
    this.getStaticDir(pkg)
  }

  sort () {
    this.cache.command = lodash.sortBy(this.cache.command, ['register.options.priority'], ['asc'])
  }

  getFiles (pkg: PluginCacheKeyPkg) {
    const files: string[] = []
    if (!Array.isArray(pkg.data?.karin?.files)) {
      files.push('config', 'data', 'resources')
    } else {
      files.push(...pkg.data.karin.files)
    }

    return files
  }

  /**
   * 获取静态资源目录
   * @param pkg 插件包
   * @returns 静态资源目录
   */
  getStaticDir (pkg: PluginCacheKeyPkg) {
    if (!pkg.data) {
      this.cache.static.push(path.resolve(pkg.dir, 'resource'))
      this.cache.static.push(path.resolve(pkg.dir, 'resources'))
      return
    }

    /** 静态资源目录处理 */
    if (typeof pkg.data?.karin?.static === 'string') {
      return this.cache.static.push(path.resolve(pkg.dir, pkg.data.karin.static))
    }

    if (Array.isArray(pkg.data.karin?.static)) {
      return this.cache.static.push(...pkg.data.karin.static.map(file => path.resolve(pkg.dir, file)))
    }
  }

  /**
   * 加载入口文件
   * @param name 插件名称
   * @param file 入口文件路径
   */
  async loadMain (name: string, file: string) {
    const { status, data } = await importModule<{ KARIN_PLUGIN_INIT?: () => Promise<void> }>(file)
    if (!status) {
      errorHandler.loaderPlugin(name, file, data)
      return
    }

    if (!data || typeof data.KARIN_PLUGIN_INIT !== 'function') return

    try {
      await data.KARIN_PLUGIN_INIT()
      logger.debug(`[load][${name}] 插件执行KARIN_PLUGIN_INIT函数成功`)
    } catch (error) {
      logger.error(new Error(`[load][${name}] 插件执行KARIN_PLUGIN_INIT函数失败`, { cause: error }))
    }
  }

  /**
   * 检查版本号是否符合加载要求
   * @param pkg 插件包
   * @returns 是否符合加载要求
   */
  checkVersion (pkg: PluginCacheKeyPkg) {
    const data = pkg.data
    if (!data) return true

    /** 检查版本兼容性 */
    const engines = data.karin?.engines?.karin || data.engines?.karin
    if (!engines) return true

    if (satisfies(engines, process.env.KARIN_VERSION)) return true
    logger.error(`[getPlugins][npm] ${name} 要求 node-karin 版本为 ${engines}，当前不符合要求，跳过加载插件`)
  }

  /**
   * 收集环境变量
   * @param pkg 插件包
   */
  collectEnv (pkg: PluginCacheKeyPkg) {
    const data = pkg.data
    if (!data || !Array.isArray(data.karin?.env)) return

    createAddEnv(data.karin.env)
  }
}

/** 插件管理类实例 */
export const plguinManager = new PluginPackageManagerLoad()
