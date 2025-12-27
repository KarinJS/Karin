/**
 * 插件包查找器
 * @module package/find
 */

import fs from 'node:fs'
import path from 'node:path'
import type { PackageMetaInfoCache, PluginsTypes } from './types'

/**
 * 判断是否为开发环境
 */
const isDev = (): boolean => {
  return process.env.NODE_ENV === 'development' || process.env.KARIN_DEV === 'true'
}

/**
 * npm 排除列表
 */
const NPM_EXCLUDE_LIST = [
  /^@types\//,
  /^typescript$/,
  /^eslint/,
  /^prettier/,
  /^vitest/,
  /^vite$/,
]

/**
 * 规范化路径
 */
function normPath (filePath: string): string {
  return filePath.replaceAll('\\', '/')
}

/**
 * 获取目录下的子目录列表
 */
async function getDirs (dirPath: string): Promise<string[]> {
  const entries = await fs.promises.readdir(dirPath, { withFileTypes: true })
  return entries
    .filter(entry => entry.isDirectory())
    .map(entry => entry.name)
}

/**
 * 安全读取并解析 JSON 文件
 */
async function readJsonFile (filePath: string): Promise<Record<string, any> | null> {
  try {
    const content = await fs.promises.readFile(filePath, 'utf-8')
    return JSON.parse(content)
  } catch {
    return null
  }
}

/**
 * 插件包查找器
 * @class PackageFinder
 */
class PackageFinder {
  cwd = process.cwd().replaceAll('\\', '/')

  /** 包列表缓存 */
  private listCache: Record<PluginsTypes, PackageMetaInfoCache[]> = {
    npm: [],
    git: [],
    apps: [],
    dev: [],
  }

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
   * 读取package.json信息
   * @param filePath - package.json文件路径
   * @returns package.json内容对象
   */
  async readPkg (filePath: string): Promise<Record<string, any>> {
    const pkg = await readJsonFile(filePath)
    if (pkg) return pkg

    const data = this.createDefaultPkg(filePath)
    await this.writePkg(filePath, data)
    return data
  }

  /**
   * 获取缓存或执行刷新
   */
  private async getCacheOrRefresh<T extends PackageMetaInfoCache[]> (
    type: PluginsTypes,
    forceRefresh: boolean,
    refreshFn: () => Promise<T>
  ): Promise<T> {
    if (forceRefresh) {
      return refreshFn()
    }

    const cached = this.listCache[type] as T
    if (cached.length > 0) {
      return cached
    }

    return refreshFn()
  }

  /**
   * 设置缓存
   */
  private setCache (type: PluginsTypes, data: PackageMetaInfoCache[]): void {
    this.listCache[type] = data
  }

  /**
   * 获取缓存
   */
  getCache (type: PluginsTypes): PackageMetaInfoCache[] {
    return [...this.listCache[type]]
  }

  /**
   * 处理npm包项
   */
  private async processNpmItem (item: { abs: string; name: string }): Promise<PackageMetaInfoCache | null> {
    const pkgPath = normPath(path.join(item.abs, 'package.json'))
    const pkg = await readJsonFile(pkgPath)

    if (!pkg || !this.isKarinPlugin(pkg)) {
      return null
    }

    return { pkg: pkgPath, ...item }
  }

  /**
   * 获取 node_modules 下的包列表
   */
  private async getNodeModulesPackages (): Promise<Array<{ name: string, abs: string }>> {
    const nodeModulesPath = path.join(this.cwd, 'node_modules')
    if (!fs.existsSync(nodeModulesPath)) return []

    const result: Array<{ name: string, abs: string }> = []
    const entries = await fs.promises.readdir(nodeModulesPath, { withFileTypes: true })

    for (const entry of entries) {
      if (!entry.isDirectory()) continue
      const name = entry.name

      // 跳过隐藏目录和排除的包
      if (name.startsWith('.')) continue
      if (NPM_EXCLUDE_LIST.some(pattern => pattern.test(name))) continue

      // 处理 scope 包
      if (name.startsWith('@')) {
        const scopePath = path.join(nodeModulesPath, name)
        const scopeEntries = await fs.promises.readdir(scopePath, { withFileTypes: true })
        for (const scopeEntry of scopeEntries) {
          if (!scopeEntry.isDirectory()) continue
          const fullName = `${name}/${scopeEntry.name}`
          if (NPM_EXCLUDE_LIST.some(pattern => pattern.test(fullName))) continue
          result.push({
            name: fullName,
            abs: normPath(path.join(scopePath, scopeEntry.name)),
          })
        }
      } else {
        result.push({
          name,
          abs: normPath(path.join(nodeModulesPath, name)),
        })
      }
    }

    return result
  }

  /**
   * 获取npm插件包列表
   * @param forceRefresh - 是否强制刷新缓存，默认 false
   * @returns npm插件包列表
   */
  async getNpmPackages (forceRefresh = false): Promise<PackageMetaInfoCache[]> {
    return this.getCacheOrRefresh('npm', forceRefresh, async () => {
      const list = await this.getNodeModulesPackages()

      const results = await Promise.all(list.map(item => this.processNpmItem(item)))
      const filtered = results.filter((item): item is PackageMetaInfoCache => item !== null)

      this.setCache('npm', filtered)
      return filtered
    })
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
      const pkgPath = normPath(path.join(this.cwd, 'package.json'))

      if (!fs.existsSync(pkgPath)) {
        this.setCache('dev', [])
        return []
      }

      const pkg = await readJsonFile(pkgPath)
      if (!pkg || !this.isKarinPlugin(pkg)) {
        this.setCache('dev', [])
        return []
      }

      const result = [{ pkg: pkgPath, name: pkg.name, abs: this.cwd }]
      this.setCache('dev', result)
      return result
    })
  }

  /**
   * 处理单个插件目录
   */
  private async processPluginDir (
    dirName: string,
    pluginsPath: string
  ): Promise<{ type: 'git' | 'apps'; data: PackageMetaInfoCache } | null> {
    const dir = path.join(pluginsPath, dirName)
    const pkgPath = normPath(path.join(dir, 'package.json'))
    const pkg = await this.readPkg(pkgPath)

    const item: PackageMetaInfoCache = {
      pkg: pkgPath,
      name: pkg.name,
      abs: normPath(dir),
    }

    if (this.isKarinPlugin(pkg)) {
      return { type: 'git', data: item }
    } else {
      // 暴力识别为apps类型插件
      return { type: 'apps', data: item }
    }
  }

  /**
   * 分类插件结果
   */
  private categorizePlugins (
    results: Array<{ type: 'git' | 'apps'; data: PackageMetaInfoCache } | null>
  ) {
    const git: PackageMetaInfoCache[] = []
    const apps: PackageMetaInfoCache[] = []

    for (const result of results) {
      if (!result) continue

      if (result.type === 'apps') {
        apps.push(result.data)
      } else {
        git.push(result.data)
      }
    }

    return { git, apps }
  }

  /**
   * 获取plugins目录下的插件包列表
   * @description 同时返回git/apps类型的插件包，对于apps类型的插件包，统一创建package.json文件
   * @param forceRefresh - 是否强制刷新缓存，默认 false
   * @returns 包含git和apps插件包列表的对象
   */
  async getPluginsPackages (forceRefresh = false): Promise<{ git: PackageMetaInfoCache[]; apps: PackageMetaInfoCache[] }> {
    const pluginsPath = path.join(this.cwd, 'plugins')

    if (!fs.existsSync(pluginsPath)) {
      this.setCache('git', [])
      this.setCache('apps', [])
      return { git: [], apps: [] }
    }

    if (!forceRefresh) {
      const git = this.listCache.git
      const apps = this.listCache.apps
      if (git.length > 0 || apps.length > 0) {
        return { git: [...git], apps: [...apps] }
      }
    }

    const dirs = await getDirs(pluginsPath)
    const results = await Promise.all(
      dirs.map(dirName => this.processPluginDir(dirName, pluginsPath))
    )

    const categorized = this.categorizePlugins(results)

    this.setCache('git', categorized.git)
    this.setCache('apps', categorized.apps)

    return categorized
  }

  /**
   * 获取所有包列表
   * @param forceRefresh - 是否强制刷新
   */
  async getAllPackages (forceRefresh = false): Promise<{
    npm: PackageMetaInfoCache[]
    git: PackageMetaInfoCache[]
    apps: PackageMetaInfoCache[]
    dev: PackageMetaInfoCache[]
  }> {
    const [npm, plugins, dev] = await Promise.all([
      this.getNpmPackages(forceRefresh),
      this.getPluginsPackages(forceRefresh),
      this.getDevPackages(forceRefresh),
    ])

    return {
      npm,
      git: plugins.git,
      apps: plugins.apps,
      dev,
    }
  }
}

export const packageFinder = new PackageFinder()
