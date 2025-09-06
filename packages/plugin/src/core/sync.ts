import fs from 'node:fs'
import path from 'node:path'
import { cache } from '../cache/cache'
import { PluginPackage } from './pkg'
import { PluginCorePromise } from './promise'
import { isDev, NPM_EXCLUDE_LIST } from '@karinjs/envs'
import { getDirsSync, getNodeModulesSync, requireFileSync } from '@karinjs/utils'

import type { PluginPackageType } from '../pkg'
import type { PluginsResult, PluginInfo } from './pkg'
import type { PluginCacheKeyPkg } from '../decorators/base'

/**
 * 插件核心管理器 - 负责最基础的插件发现和分类
 */
export class PluginCoreSync {
  /**
   * @description git插件包目录
   */
  #dir: string
  /**
   * @description 插件核心管理器 - promise版本
   */
  promise: PluginCorePromise

  constructor () {
    const dir = path.resolve(process.env.KARIN_PLUGINS_DIR || './plugins').replace(/\\/g, '/')
    this.promise = new PluginCorePromise(dir)
    this.#dir = dir
  }

  get dir () {
    return this.#dir
  }

  /**
   * @public
   * 获取 npm 类型插件包列表
   * @param isRefresh 是否强制刷新缓存
   * @returns npm 插件包列表
   */
  getNpmPlugins (isRefresh = false): string[] {
    if (!isRefresh && cache.plugins.npm.length) {
      return [...cache.plugins.npm]
    }

    const list: string[] = []
    const node = getNodeModulesSync()

    node.forEach((v) => {
      if (NPM_EXCLUDE_LIST.includes(v)) return
      const _path = path.join(process.cwd(), 'node_modules', v, 'package.json')
      if (!this.isPackageJsonToKarin(_path)) return

      list.push(v)
    })

    cache.plugins.npm = list
    return list
  }

  /**
   * @public
   * 获取 git 类型插件包列表
   * @param isRefresh 是否强制刷新缓存
   * @returns git 插件包列表
   */
  getGitPlugins (isRefresh = false): string[] {
    if (!isRefresh && cache.plugins.git.length) {
      return [...cache.plugins.git]
    }

    this.#refreshGitAndAppsPlugins()
    return [...cache.plugins.git]
  }

  /**
   * @public
   * 获取 apps 类型插件包列表
   * @param isRefresh 是否强制刷新缓存
   * @returns apps 插件包列表
   */
  getAppsPlugins (isRefresh = false): string[] {
    if (!isRefresh && cache.plugins.apps.length) {
      return [...cache.plugins.apps]
    }

    this.#refreshGitAndAppsPlugins()
    return [...cache.plugins.apps]
  }

  /**
   * @public
   * 获取 root 类型插件包列表
   * @param isRefresh 是否强制刷新缓存
   * @returns root 插件包列表
   */
  getRootPlugins (isRefresh = false): string[] {
    /** 开发环境下才会有 root 插件 */
    if (!isDev()) return []

    if (!isRefresh && cache.plugins.root.length) {
      return [...cache.plugins.root]
    }

    const root: string[] = []
    const _path = `${process.cwd()}/package.json`
    if (!fs.existsSync(_path)) return root

    const pkg = this.#requireJson(_path)
    if (typeof pkg?.karin === 'object') {
      root.push(pkg.name)
    }

    return root
  }

  /**
   * @public
   * 获取指定类型的插件包列表
   * @param type 插件包类型
   * @param isRefresh 是否强制刷新缓存
   * @returns 插件包列表
   */
  getPluginsByType (type: PluginPackageType, isRefresh = false): string[] {
    switch (type) {
      case 'npm': return this.getNpmPlugins(isRefresh)
      case 'git': return this.getGitPlugins(isRefresh)
      case 'apps': return this.getAppsPlugins(isRefresh)
      case 'root': return this.getRootPlugins(isRefresh)
      default: return []
    }
  }

  /**
   * @public
   * 获取全部插件包分类信息
   * @param isRefresh 是否强制刷新缓存
   * @returns 插件包分类结果
   */
  getPlugins (isRefresh = false): PluginsResult {
    const npm = this.getNpmPlugins(isRefresh)
    const git = this.getGitPlugins(isRefresh)
    const apps = this.getAppsPlugins(isRefresh)
    const root = this.getRootPlugins(isRefresh)

    return {
      npm,
      git,
      apps,
      root,
      get all () {
        return [
          ...npm.map(name => `npm:${name}`),
          ...git.map(name => `git:${name}`),
          ...apps.map(name => `apps:${name}`),
          ...root.map(name => `root:${name}`),
        ]
      },
      get count () {
        return npm.length + git.length + apps.length + root.length
      },
    }
  }

  #requireJson <T = any> (filePath: string): T {
    return requireFileSync<T>(filePath, { ex: 0, type: 'json' })
  }

  /**
   * @private
   * 刷新 git 和 apps 插件包缓存
   */
  #refreshGitAndAppsPlugins (): { git: string[], apps: string[] } {
    const git: string[] = []
    const apps: string[] = []
    const dirs = getDirsSync(this.dir)

    dirs.forEach((v) => {
      const _path = path.join(this.dir, v, 'package.json')
      /** 需要是karin-plugin-开头的目录 */
      if (!v.startsWith('karin-plugin-')) return

      /** 如果是没有package.json的目录 则判断为 apps */
      if (!fs.existsSync(_path)) {
        /** 创建一个空的package.json */
        fs.writeFileSync(
          _path,
          JSON.stringify({
            name: v,
            version: '0.0.0',
            description: '',
            main: '',
            scripts: {},
            dependencies: {},
          }, null, 2)
        )

        apps.push(v)
        return
      }

      const pkg = this.#requireJson(_path)
      /** 配置了karin字段视为git */
      if (typeof pkg?.karin === 'object') {
        git.push(v)
        return
      }

      /** 没有配置karin字段视为apps */
      apps.push(v)
    })

    return { git, apps }
  }

  /**
   * @public
   * 判断package.json是否存在karin配置
   * @param pkgPath package.json路径
   * @returns 是否为插件包
   */
  isPackageJsonToKarin (pkgPath: string): boolean {
    try {
      const pkg = this.#requireJson(pkgPath)
      return typeof pkg?.karin === 'object'
    } catch {
      return false
    }
  }

  /**
   * @public
   * 格式化插件包名称 支持带前缀
   * @param name 插件包名称
   * @throws 如果不是有效的插件包名称
   * @returns 返回格式化后的插件包名称
   */
  formatPluginName (name: string) {
    const result = this.getPluginDir(name)
    if (!result) throw new Error(`${name} 不是一个有效的插件包名称`)

    return result
  }

  /**
   * @public
   * @description 获取插件包基本信息
   * 通过插件包名称获取插件包根目录、类型、实际名称
   */
  getPluginDir (name: string): PluginInfo | null {
    const _dir = (type: PluginPackageType, pkgName: string) => {
      switch (type) {
        case 'npm': return path.join(process.cwd(), 'node_modules', pkgName)
        case 'git': case 'apps': return path.join(this.dir, pkgName)
        case 'root': return process.cwd()
      }
    }

    const { all } = this.getPlugins()
    if (all.includes(name)) {
      const [type, pkgName] = name.split(':') as [PluginPackageType, string]
      return { type, name: pkgName, dir: _dir(type, pkgName) }
    };

    const list: PluginPackageType[] = ['apps', 'git', 'npm', 'root']
    for (const type of list) {
      if (all.includes(`${type}:${name}`)) {
        return { type, name, dir: _dir(type, name) }
      }
    }

    return null
  }

  /**
   * @public
   * 获取插件包基本信息Map
   * @param isRefresh 是否强制刷新不使用缓存
   * @throws
   */
  getPluginsMap (isRefresh = false): Map<string, PluginCacheKeyPkg> {
    if (!isRefresh && cache.pluginsMap.size) {
      return cache.pluginsMap
    }

    const _get = (type: PluginPackageType) => {
      const list = this.getPluginsByType(type, isRefresh)
      list.forEach((v) => {
        const info = new PluginPackage(this, v)._initSync()
        cache.pluginsMap.set(info.name, info)
      })
    }

    const _target: PluginPackageType[] = ['npm', 'git', 'apps', 'root']
    _target.forEach((v) => _get(v))
    return cache.pluginsMap
  }

  /**
   * @public
   * 通过插件包名获取插件包详细信息
   * @param pkgName 插件包名 不带前缀
   * @param isRefresh 是否强制刷新不使用缓存
   * @returns 插件包详细信息
   */
  getPluginPackageDetail (
    pkgName: string,
    isRefresh = false
  ): PluginCacheKeyPkg | null {
    const info = this.getPluginsMap(isRefresh)
    return info.get(pkgName) || null
  }
}
