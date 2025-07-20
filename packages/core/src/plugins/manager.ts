import fs from 'node:fs'
import path from 'node:path'
import { karinPathPlugins } from '@/root'
import { getModuleType, isTs, NPM_EXCLUDE_LIST } from '@/env'
import { filesByExt, formatPath, isPathEqual, isSubPath, PkgData, requireFileSync } from '@/utils'

import type { CommandCache } from '../core/karin/command'
import type { PluginCacheKeyFile, PluginCacheKeyPkg, PluginPackageType } from '../core/karin/base'
import type { AcceptCache } from '../core/karin/accept'
import type { HandlerCache } from '../core/karin/handler'
import type { ButtonCache } from '../core/karin/button'
import type { TaskCache } from '../core/karin/task'

/** 插件数量统计 */
export interface Count {
  pkg: number
  accept: number
  command: number
  task: number
  button: number
  handler: {
    /** 入口key */
    key: number
    /** handler处理函数 */
    fnc: number
  }
}

/** 插件缓存类型 */
export interface PluginCache {
  /** 插件数量统计 */
  count: Count
  /** 全部插件包名称列表`(带前缀)` */
  plugins: string[]
  /** 全部插件包详细信息`(key不带前缀)` */
  pluginsDetails: Map<string, PluginCacheKeyPkg>
  /** command */
  command: CommandCache[]
  /** accept */
  accept: AcceptCache[]
  /** handler */
  handler: Record<string, HandlerCache[]>
  /** button */
  button: ButtonCache[]
  /** task */
  task: TaskCache[]
  /** 静态资源目录 */
  static: string[]
}

/**
 * @public
 * @description git插件包目录
 */
export const dir = (process.env.KARIN_PLUGINS_DIR || karinPathPlugins).replace(/\\/g, '/')
/**
 * @private
 * @description 插件加载缓存
 */
export const cache: PluginCache = {
  count: {
    pkg: 0,
    accept: 0,
    command: 0,
    task: 0,
    button: 0,
    handler: {
      key: 0,
      fnc: 0,
    },
  },
  plugins: [],
  pluginsDetails: new Map(),
  command: [],
  accept: [],
  handler: {},
  button: [],
  task: [],
  static: [],
}

/**
 * @public
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
export const getPlugins = async (isRefresh = false) => {
  if (!isRefresh && cache.plugins.length) {
    return cache.plugins
  }

  const list: string[] = []
  const files = await Promise.all([
    fs.promises.readdir(path.join(process.cwd(), 'node_modules')),
    fs.promises.readdir(path.resolve(dir)),
  ]).then(results => results.flat())

  files.forEach((v) => {
    if (NPM_EXCLUDE_LIST.includes(v)) return
    const { status, type } = isPluginPackage(v)
    if (!status) return

    list.push(`${type}:${v}`)
  })

  cache.plugins = list
  return cache.plugins
}

/**
 * @private
 * 格式化插件名称
 * @param pluginName 插件名称
 * @returns 插件类型和名称
 */
const _formatPluginName = (pluginName: string): { type: PluginPackageType, name: string } => {
  if (pluginName.includes(':')) {
    const [type, name] = pluginName.split(':') as [PluginPackageType, string]
    if (['npm', 'root', 'git', 'apps'].includes(type)) return { type, name }

    throw new TypeError(`${pluginName}: ${type} 不符合插件包类型规范`)
  }

  const { status, type } = isPluginPackage(pluginName)
  if (!status) {
    throw new TypeError(`${pluginName} 不符合插件包规范`)
  }

  return { type, name: pluginName }
}

/**
 * 获取插件包信息
 * @private
 * @param value 插件包名称 不带前缀
 * @param isRefresh 是否强制刷新不使用缓存
 * @returns 插件包信息
 */
const _pluginInfo = (value: string, isRefresh = false): PluginCacheKeyPkg => {
  if (!isRefresh && cache.pluginsDetails.has(value)) {
    return cache.pluginsDetails.get(value)!
  }

  const { type, name } = _formatPluginName(value)
  const _dir = (() => {
    if (type === 'npm') return path.join(process.cwd(), 'node_modules', name)
    if (type === 'root') return process.cwd()
    return path.join(dir, name)
  })()

  if (!fs.existsSync(_dir)) {
    throw new Error(`插件包不存在，请检查插件名称 ${value} 是否正确`)
  }

  return {
    name,
    type,
    dir: formatPath(_dir),
    get apps () {
      if (!this.appsDirs) return []
      return getAllApp(this.appsDirs)
    },
    get appsDirs () {
      const pkg = this.data
      if (!pkg) {
        return this.type === 'apps' ? [this.dir] : []
      }

      return getAppsDir(pkg, this.dir)
    },
    get path () {
      const filePath = path.join(this.dir, 'package.json')
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
 * @public
 * 获取插件包列表 `(带详细信息)`
 * @param isRefresh 是否强制刷新不使用缓存
 * @returns 插件包列表
 */
export const getPluginDetails = async (isRefresh = false): Promise<Map<string, PluginCacheKeyPkg>> => {
  if (!isRefresh && cache.pluginsDetails.size) {
    return cache.pluginsDetails
  }

  const map: Map<string, PluginCacheKeyPkg> = new Map()
  const list = await getPlugins(isRefresh)

  await Promise.all(list.map(async (v) => {
    const info = _pluginInfo(v, isRefresh)
    map.set(info.name, info)
  }))

  return map
}

/**
 * @public
 * 通过插件包名获取插件包详细信息
 * @param pkgName 插件包名 不带前缀
 * @param isRefresh 是否强制刷新不使用缓存
 * @returns 插件包详细信息
 */
export const getPluginPackageDetail = (pkgName: string, isRefresh = false): PluginCacheKeyPkg => {
  const _cache = cache.pluginsDetails.get(pkgName)
  if (_cache && !isRefresh) return _cache

  const info = _pluginInfo(pkgName, isRefresh)
  cache.pluginsDetails.set(info.name, info)
  return info
}

/**
 * @public
 * 判断一个目录是否为插件包
 * @param dir 目录
 * @returns 是否为插件包
 */
export const isPluginPackage = (dir: string): { status: boolean, type: PluginPackageType } => {
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
    const status = isPackageJsonToKarin(pkgPath)
    return { status, type: 'npm' }
  }

  /** root */
  if (isPathEqual(dir, process.cwd())) {
    const status = isPackageJsonToKarin(pkgPath)
    return { status, type: 'root' }
  }

  /** git */
  if (path.dirname(pkgPath).includes('karin-plugin-')) {
    const status = isPackageJsonToKarin(pkgPath)
    return { status, type: 'git' }
  }

  return { status: false, type: 'apps' }
}

/**
 * @public
 * 判断package.json是否存在karin配置
 * @param pkgPath package.json路径
 * @returns 是否为插件包
 */
export const isPackageJsonToKarin = (pkgPath: string) => {
  const pkg = requireFileSync(pkgPath, { ex: 0 })
  return typeof pkg.karin === 'object'
}

/**
 * @public
 * 获取全部 apps 目录
 * @param pkg - package.json
 * @param dir - 插件包目录
 * @returns
 */
export const getAppsDir = (pkg: PkgData, dir: string): string[] => {
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
 * @public
 * 获取入口文件
 * @param pkg - package.json
 * @param dir - 插件包目录
 * @returns 入口文件路径
 */
export const getMain = (pkg: PkgData, dir: string): string | null => {
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
 * @public
 * 获取全部 app 列表
 * @param dirs - 插件包目录列表
 * @returns 全部 app 列表
 */
export const getAllApp = (dirs: string[]): string[] => {
  const list: string[][] = []
  dirs.forEach((v) => {
    list.push(filesByExt(v, getModuleType(), 'abs'))
  })

  return list.flat()
}

/**
 * @public
 * 获取文件缓存
 * @param dir 文件目录
 * @returns 文件缓存
 */
export const getFileCache = (dir: string): PluginCacheKeyFile => {
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
 * @public
 * 传入一个app文件路径 返回包名
 * @param appPath app文件路径
 * @returns 包名
 */
export const getPackageName = (appPath: string): string | null => {
  appPath = formatPath(appPath)
  /** npm */
  if (appPath.includes('node_modules')) {
    return appPath.split('node_modules/')[1].split('/')[1]
  }

  /** git、apps */
  if (isSubPath(dir, appPath)) {
    return appPath.split(dir)[1].split('/')[1]
  }

  /** root */
  if (isPathEqual(appPath, process.cwd())) {
    return requireFileSync(path.join(appPath, 'package.json'), { ex: 0 }).name
  }

  return null
}
