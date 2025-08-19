import fs from 'node:fs'
import path from 'node:path'
import { isTs, isDev, getModuleType } from '@karinjs/envs'
import { requireFileSync, formatPath, imports, filesByExt } from '@karinjs/utils'

import type { PluginCoreSync } from './sync'
import type { PluginPackageType } from '../pkg'
import type { PluginCorePromise } from './promise'
import type { PluginCacheKeyPkg } from '../decorators/base'

/** 插件包分类结果 */
export interface PluginsResult {
  /**
   * npm 类型插件包列表
   * @example
   * ```json
   * [
   *   "karin-plugin-example",
   *   "@karinjs/plugin-adapter-onebot"
   * ]
   * ```
   */
  npm: string[]
  /**
   * git 类型插件包列表
   * @example
   * ```json
   * [
   *   "karin-plugin-game"
   * ]
   * ```
   */
  git: string[]
  /**
   * apps 类型插件包列表
   * @example
   * ```json
   * [
   *   "karin-plugin-example"
   * ]
   * ```
   */
  apps: string[]
  /**
   * root 类型插件包列表
   * @example
   * ```json
   * [
   *   "karin-plugin-dev"
   * ]
   * ```
   */
  root: string[]
  /**
   * 全部插件包名称列表 (带前缀)
   * @example
   * ```json
   * [
   *   "npm:karin-plugin-example",
   *   "git:karin-plugin-example",
   *   "apps:karin-plugin-example",
   *   "root:karin-plugin-example"
   * ]
   * ```
   */
  get all (): string[]
  /** 插件包总数 */
  get count (): number
}

/** 插件包基本信息结果 */
export interface PluginInfo {
  /** 插件包名称 */
  name: string
  /** 插件包类型 */
  type: PluginPackageType
  /** 插件包根目录 */
  dir: string
}

/**
 * @class PluginPackage
 * @description 插件包的信息
 * @throws
 */
export class PluginPackage implements PluginCacheKeyPkg {
  #_name: string
  #dir!: string
  #name!: string
  #type!: PluginCacheKeyPkg['type']
  #manager: PluginCoreSync | PluginCorePromise

  constructor (manager: PluginCoreSync | PluginCorePromise, _name: string) {
    this.#manager = manager
    this.#_name = _name
  }

  async _init () {
    const result = await this.#manager.getPluginDir(this.#_name)
    if (!result) {
      throw new Error(`插件包 ${this.#_name} 不存在`)
    }

    const { dir, name, type } = result
    this.#dir = dir
    this.#name = name
    this.#type = type
    return this
  }

  _initSync () {
    const result = this.#manager.getPluginDir(this.#_name) as PluginInfo | null
    if (!result) {
      throw new Error(`插件包 ${this.#_name} 不存在`)
    }

    const { dir, name, type } = result
    this.#dir = dir
    this.#name = name
    this.#type = type
    return this
  }

  get name () {
    return this.#name
  }

  get type () {
    return this.#type
  }

  get dir () {
    return this.#dir
  }

  get apps () {
    if (!this.appsDirs) return []
    const list: string[][] = []
    this.appsDirs.forEach((v) => {
      list.push(filesByExt(v, getModuleType(), 'abs'))
    })

    return list.flat()
  }

  get appsDirs () {
    const pkg = this.data
    if (!pkg) {
      return this.#type === 'apps' ? [this.#dir] : []
    }

    const getApps = (apps?: string | string[]) => {
      if (typeof apps === 'string') {
        const app = path.join(this.#dir, apps)
        return fs.existsSync(app) ? [app] : []
      }

      if (!Array.isArray(apps)) return []

      const list: string[] = []
      apps.forEach((v) => {
        if (typeof v !== 'string') return
        const app = path.join(this.#dir, v)
        if (fs.existsSync(app)) list.push(app)
      })
      return list.map(v => formatPath(v))
    }

    if (isTs()) {
      const apps = this.data.karin?.['ts-apps']
      return getApps(apps)
    }

    const apps = this.data.karin?.apps
    return getApps(apps)
  }

  get path () {
    const filePath = path.join(this.#dir, 'package.json')
    return formatPath(filePath)
  }

  get data () {
    return requireFileSync(this.path, { ex: 0 })
  }

  get webConfigPath () {
    const pkg = this.data
    if (!pkg || !pkg.karin) return null

    let dir = isTs() ? pkg.karin['ts-web'] : pkg.karin['web']
    if (!dir || typeof dir !== 'string') return null
    dir = path.join(this.#dir, dir)

    if (!fs.existsSync(dir)) {
      return null
    }

    return formatPath(dir)
  }

  async loadWebConfig (isRefresh?: boolean) {
    if (!isRefresh) isRefresh = isDev()
    const dir = this.webConfigPath
    if (!dir || !fs.existsSync(dir)) return null

    return imports(dir, { import: 'default', eager: isDev() })
  }

  /**
   * @public
   * 获取入口文件
   * @param pkg - package.json
   * @param dir - 插件包目录
   * @returns 入口文件路径
   */
  get getMain (): string | null {
    if (isTs()) {
      if (this.data?.karin?.main &&
        typeof this.data.karin.main === 'string' &&
        fs.existsSync(path.join(this.#dir, this.data.karin.main))
      ) {
        return path.join(this.#dir, this.data.karin.main)
      }

      return null
    }

    if (this.data?.main &&
      typeof this.data.main === 'string' &&
      fs.existsSync(path.join(this.#dir, this.data.main))
    ) {
      return path.join(this.#dir, this.data.main)
    }

    return null
  }
}
