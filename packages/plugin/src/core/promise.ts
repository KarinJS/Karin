import fs from 'node:fs'
import path from 'node:path'
import { cache } from './cache'
import { PluginPackage } from './pkg'
import { isDev, NPM_EXCLUDE_LIST } from '@karinjs/envs'
import { getNodeModules, requireFile } from '@karinjs/utils'
import { searchGitAndApps } from '../utils'

import type { PluginPackageType } from './types'
import type { PluginCacheKeyPkg } from '../builders/base'
import type { PluginsResult, PluginInfo } from './pkg'

/**
 * @class
 * 插件核心管理器 - promise
 */
export class PluginCorePromise {
  /**
   * @description git插件包目录
   */
  #dir: string

  constructor (dir: string) {
    this.#dir = dir
  }

  /**
   * @public
   * 获取 npm 类型插件包列表
   * @param isRefresh 是否强制刷新缓存
   * @returns npm 插件包列表
   */
  async getNpmPlugins (isRefresh = false): Promise<string[]> {
    if (!isRefresh && cache.plugins.npm.length) {
      return [...cache.plugins.npm]
    }

    const list: string[] = []
    const node = await getNodeModules()

    await Promise.all(node.map(async (v) => {
      if (NPM_EXCLUDE_LIST.includes(v)) return
      const _path = path.join(process.cwd(), 'node_modules', v, 'package.json')
      if (!await this.isPackageJsonToKarin(_path)) return

      list.push(v)
    }))

    cache.plugins.npm = list
    return list
  }

  /**
   * @public
   * 获取 git 类型插件包列表
   * @param isRefresh 是否强制刷新缓存
   * @returns git 插件包列表
   */
  async getGitPlugins (isRefresh = false): Promise<string[]> {
    if (!isRefresh && cache.plugins.git.length) {
      return [...cache.plugins.git]
    }

    const { git, apps } = await this.#refreshGitAndAppsPlugins()
    cache.plugins.git = git
    cache.plugins.apps = apps
    return git
  }

  /**
   * @public
   * 获取 apps 类型插件包列表
   * @param isRefresh 是否强制刷新缓存
   * @returns apps 插件包列表
   */
  async getAppsPlugins (isRefresh = false): Promise<string[]> {
    if (!isRefresh && cache.plugins.apps.length) {
      return [...cache.plugins.apps]
    }

    const { git, apps } = await this.#refreshGitAndAppsPlugins()
    cache.plugins.git = git
    cache.plugins.apps = apps
    return apps
  }

  /**
   * @public
   * 获取 root 类型插件包列表
   * @param isRefresh 是否强制刷新缓存
   * @returns root 插件包列表
   */
  async getRootPlugins (isRefresh = false): Promise<string[]> {
    /** 开发环境下才会有 root 插件 */
    if (!isDev()) return []

    if (!isRefresh && cache.plugins.root.length) {
      return [...cache.plugins.root]
    }

    const root: string[] = []
    const _path = `${process.cwd()}/package.json`
    if (!fs.existsSync(_path)) return root

    const pkg = await this.#requireJson(_path)
    if (typeof pkg?.karin === 'object') {
      root.push(pkg.name)
    }

    cache.plugins.root = root
    return root
  }

  /**
   * @public
   * 获取指定类型的插件包列表
   * @param type 插件包类型
   * @param isRefresh 是否强制刷新缓存
   * @returns 插件包列表
   */
  async getPluginsByType (type: PluginPackageType, isRefresh = false): Promise<string[]> {
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
  async getPlugins (isRefresh = false): Promise<PluginsResult> {
    const [npm, git, apps, root] = await Promise.all([
      this.getNpmPlugins(isRefresh),
      this.getGitPlugins(isRefresh),
      this.getAppsPlugins(isRefresh),
      this.getRootPlugins(isRefresh),
    ])

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

  async #requireJson <T = any> (filePath: string): Promise<T> {
    return requireFile<T>(filePath, { ex: 0, type: 'json' })
  }

  /**
   * @private
   * 刷新 git 和 apps 插件包缓存
   */
  async #refreshGitAndAppsPlugins (): Promise<{ git: string[], apps: string[] }> {
    const result = await searchGitAndApps(this.#dir)

    // 处理 git 和 apps 包，确保符合 karin-plugin- 命名规范
    const git: string[] = []
    const apps: string[] = []

    result.git.forEach(item => {
      if (item.name.startsWith('karin-plugin-')) {
        git.push(item.name)
      }
    })

    result.apps.forEach(item => {
      if (item.name.startsWith('karin-plugin-')) {
        apps.push(item.name)
      }
    })

    return { git, apps }
  }

  /**
   * @public
   * 判断package.json是否存在karin配置
   * @param pkgPath package.json路径
   * @returns 是否为插件包
   */
  async isPackageJsonToKarin (pkgPath: string): Promise<boolean> {
    try {
      const pkg = await this.#requireJson(pkgPath)
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
  async formatPluginName (name: string) {
    const result = await this.getPluginDir(name)
    if (!result) throw new Error(`${name} 不是一个有效的插件包名称`)

    return result
  }

  /**
   * @public
   * @description 获取插件包基本信息
   * 通过插件包名称获取插件包根目录、类型、实际名称
   */
  async getPluginDir (name: string): Promise<PluginInfo | null> {
    const _dir = (type: PluginPackageType, pkgName: string) => {
      switch (type) {
        case 'npm': return path.join(process.cwd(), 'node_modules', pkgName)
        case 'git': case 'apps': return path.join(this.#dir, pkgName)
        case 'root': return process.cwd()
      }
    }

    const { all } = await this.getPlugins()
    if (all.includes(name)) {
      const [type, pkgName] = name.split(':') as [PluginPackageType, string]
      return { type, name: pkgName, dir: _dir(type, pkgName) }
    }

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
   */
  async getPluginsMap (isRefresh = false): Promise<Map<string, PluginCacheKeyPkg>> {
    if (!isRefresh && cache.pluginsMap.size) {
      return cache.pluginsMap
    }

    const _get = async (type: PluginPackageType) => {
      const list = await this.getPluginsByType(type, isRefresh)
      await Promise.all(list.map(async (v) => {
        const info = await new PluginPackage(this, v)._init()
        cache.pluginsMap.set(info.name, info)
      }))
    }

    const _target: PluginPackageType[] = ['npm', 'git', 'apps', 'root']
    await Promise.all(_target.map((v) => _get(v)))
    return cache.pluginsMap
  }

  /**
   * @public
   * 通过插件包名获取插件包详细信息
   * @param pkgName 插件包名 不带前缀
   * @param isRefresh 是否强制刷新不使用缓存
   * @returns 插件包详细信息
   */
  async getPluginPackageDetail (
    pkgName: string,
    isRefresh = false
  ): Promise<PluginCacheKeyPkg | null> {
    const info = await this.getPluginsMap(isRefresh)
    return info.get(pkgName) || null
  }
}
