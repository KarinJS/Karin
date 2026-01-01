import fs from 'node:fs'
import path from 'node:path'
import { packageList } from '../store'
import { NPM_EXCLUDE_LIST, isDev } from '@karinjs/envs'
import { getDirs, requireFile, npm } from '@karinjs/utils'

/**
 * 包元信息缓存项
 */
export interface PackageMetaInfoCache {
  /** 包名 */
  name: string
  /** 包绝对路径 */
  abs: string
  /** package.json 路径 */
  pkg: string
}

/**
 * 插件包查找器
 * @class PackageFinder
 */
class PackageFinder {
  cwd = process.cwd().replaceAll('\\', '/')

  /**
   * 创建默认package.json数据
   * @param filePath - package.json文件路径
   */
  private createDefaultPkg (filePath: string) {
    return {
      name: path.basename(path.dirname(filePath)),
      version: '0.0.1',
      description: '',
      main: '',
      dependencies: {},
      karinType: 'apps',
    }
  }

  /**
   * 写入package.json文件
   * @param filePath - package.json文件路径
   * @param data - package.json内容对象
   */
  private async writePkg (filePath: string, data: Record<string, any>) {
    await fs.promises.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8')
  }

  /**
   * 检查是否为Karin插件
   * @param pkg - package.json内容对象
   */
  private isKarinPlugin (pkg: Record<string, any>): boolean {
    return Boolean(pkg.exports?.['./karin.config'] || typeof pkg.karin === 'object')
  }

  /**
   * 规范化路径
   * @param filePath - 文件路径
   */
  private normPath (filePath: string): string {
    return filePath.replaceAll('\\', '/')
  }

  /**
   * 读取package.json信息
   * @param filePath - package.json文件路径
   * @returns package.json内容对象
   */
  async readPkg (filePath: string): Promise<Record<string, any>> {
    if (fs.existsSync(filePath)) {
      return await requireFile(filePath, { ex: 0, type: 'json' })
    }

    const data = this.createDefaultPkg(filePath)
    this.writePkg(filePath, data)
    return data
  }

  /**
   * 获取缓存或执行刷新
   * @param type - 包类型
   * @param forceRefresh - 是否强制刷新缓存
   * @param refreshFn - 刷新函数
   */
  private getCacheOrRefresh<T extends PackageMetaInfoCache[]> (
    type: 'npm' | 'apps' | 'dev',
    forceRefresh: boolean,
    refreshFn: () => Promise<T>
  ): Promise<T> | T {
    if (forceRefresh) {
      return refreshFn()
    }

    const cache = packageList.get(type) as T
    if (cache.length > 0) {
      return cache
    }

    return refreshFn()
  }

  /**
   * 处理npm包项
   * @param item - npm包项信息
   */
  private async processNpmItem (item: { abs: string; name: string }): Promise<PackageMetaInfoCache | null> {
    const pkgPath = this.normPath(path.join(item.abs, 'package.json'))
    const pkg = await requireFile(pkgPath, { ex: 0, type: 'json' })

    if (!this.isKarinPlugin(pkg)) {
      return null
    }

    return { pkg: pkgPath, ...item }
  }

  /**
   * 获取npm插件包列表
   * @param forceRefresh - 是否强制刷新缓存，默认 false
   * @returns npm插件包列表
   */
  async getNpmPackages (forceRefresh = false): Promise<PackageMetaInfoCache[]> {
    return this.getCacheOrRefresh('npm', forceRefresh, async () => {
      const list = await npm.getNpmPackages({
        ignore: [...NPM_EXCLUDE_LIST, /^@types\//],
        fields: ['name', 'abs'],
      })

      const results = await Promise.all(list.map(item => this.processNpmItem(item)))
      const filtered = results.filter((item): item is PackageMetaInfoCache => item !== null)

      filtered.forEach(item => packageList.add('npm', item))
      return filtered
    })
  }

  /**
   * 设置缓存并返回结果
   */
  private setCacheAndReturn (type: 'npm' | 'apps' | 'dev', data: PackageMetaInfoCache[]): PackageMetaInfoCache[] {
    data.forEach(item => packageList.add(type, item))
    return data
  }

  /**
   * 处理开发环境包
   */
  private async processDevPkg (pkgPath: string): Promise<PackageMetaInfoCache[]> {
    const pkg = await requireFile(pkgPath, { ex: 0, type: 'json' })

    if (!this.isKarinPlugin(pkg)) {
      return []
    }

    return [{ pkg: pkgPath, name: pkg.name, abs: this.cwd }]
  }

  /**
   * 获取dev插件包列表
   * @description 温馨提示: 仅在开发环境下有效
   * @param forceRefresh - 是否强制刷新缓存，默认 false
   * @returns dev插件包列表
   */
  async getDevPackages (forceRefresh = false): Promise<PackageMetaInfoCache[]> {
    if (!isDev()) {
      return []
    }

    return this.getCacheOrRefresh('dev', forceRefresh, async () => {
      const pkgPath = this.normPath(path.join(this.cwd, 'package.json'))

      if (!fs.existsSync(pkgPath)) {
        return this.setCacheAndReturn('dev', [])
      }

      const result = await this.processDevPkg(pkgPath)
      return this.setCacheAndReturn('dev', result)
    })
  }

  /**
   * 获取缓存的plugins数据
   * @note v11 移除 git 类型，只返回 apps
   */
  private getCachedPlugins (): { apps: PackageMetaInfoCache[] } | null {
    const apps = packageList.get('apps')

    if (apps.length > 0) {
      return { apps }
    }

    return null
  }

  /**
   * 设置空的plugins缓存
   */
  private setEmptyPluginsCache () {
    return { apps: [] as PackageMetaInfoCache[] }
  }

  /**
   * 处理单个插件目录
   * @description v11 移除 git 类型，plugins 目录下所有包统一识别为 apps 类型
   * @param dirName - 目录名称
   * @param pluginsPath - 插件根目录路径
   */
  private async processPluginDir (
    dirName: string,
    pluginsPath: string
  ): Promise<PackageMetaInfoCache | null> {
    const dir = path.join(pluginsPath, dirName)
    const pkgPath = this.normPath(path.join(dir, 'package.json'))
    const pkg = await this.readPkg(pkgPath)

    return {
      pkg: pkgPath,
      name: pkg.name,
      abs: this.normPath(dir),
    }
  }

  /**
   * 获取plugins目录下的插件包列表
   * @description v11 移除 git 类型，plugins 目录下所有包统一识别为 apps 类型
   * @param forceRefresh - 是否强制刷新缓存，默认 false
   * @returns 包含 apps 插件包列表的对象
   */
  async getPluginsPackages (forceRefresh = false): Promise<{ apps: PackageMetaInfoCache[] }> {
    const pluginsPath = path.join(this.cwd, 'plugins')

    if (!fs.existsSync(pluginsPath)) {
      return this.setEmptyPluginsCache()
    }

    if (!forceRefresh) {
      const cached = this.getCachedPlugins()
      if (cached) {
        return cached
      }
    }

    const dirs = await getDirs(pluginsPath)
    const results = await Promise.all(
      dirs.map(dirName => this.processPluginDir(dirName, pluginsPath))
    )

    const apps = results.filter((item): item is PackageMetaInfoCache => item !== null)

    apps.forEach(item => packageList.add('apps', item))

    return { apps }
  }
}

export const packageFinder = new PackageFinder()
