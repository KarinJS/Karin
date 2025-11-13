/**
 * 插件包管理器
 * @description 提供插件包信息的管理方法
 */
import path from 'node:path'
import { createInstances } from './default'
import type { PluginCacheStorage, PackageInfo, PluginFileInfo } from './default'

/**
 * 创建插件包管理器
 * @param cache - 插件缓存存储对象
 * @returns 插件包管理器对象
 */
export const createPackage = (cache: PluginCacheStorage) => {
  return {
    /**
     * 添加插件包信息
     * @param packageName - 插件包名称
     * @param options - 插件包配置项
     * @example
     * ```ts
     * package.add('karin-plugin-example', {
     *   type: 'git',
     *   abs: 'd:/path/to/plugin',
     *   pkg: 'd:/path/to/package.json',
     *   context: { name: 'karin-plugin-example', version: '1.0.0' }
     * })
     * ```
     */
    add: (packageName: string, info: PackageInfo) => {
      cache.package.info[packageName] = info
      cache.package.index.packageToFiles[packageName] = []
      cache.stats.pkg++
    },

    /**
     * 获取插件包信息
     * @param packageName - 插件包名称
     * @returns 插件包信息，不存在则返回 null
     * @example
     * ```ts
     * const info = package.get('karin-plugin-example')
     * // -> { name: '...', type: 'git', abs: '...', ... }
     * ```
     */
    get: (packageName: string): PackageInfo | null => {
      return cache.package.info[packageName] || null
    },

    /**
     * 删除插件包
     * @param packageName - 插件包名称
     */
    remove: (packageName: string) => {
      if (!cache.package.info[packageName]) return
      delete cache.package.info[packageName]
      cache.stats.pkg--
    },

    /**
     * 添加主文件到插件包
     * @param packageName - 插件包名称
     * @param filePath - 主文件绝对路径
     * @example
     * ```ts
     * package.addMainFile('karin-plugin-example', 'd:/path/to/main.ts')
     * ```
     */
    addMainFile: (packageName: string, filePath: string) => {
      cache.package.index.fileToPackage[filePath] = packageName
    },

    /**
     * 添加文件到插件包
     * @param packageName - 插件包名称
     * @param filePath - 文件绝对路径
     * @example
     * ```ts
     * package.addFile('karin-plugin-example', 'd:/path/to/file.ts')
     * ```
     */
    addFile: (packageName: string, filePath: string) => {
      const info = cache.package.info[packageName]
      if (!info) throw new Error(`插件包 ${packageName} 不存在`)

      info.files[filePath] = {
        path: filePath,
        filename: path.basename(filePath),
        instances: createInstances.normal,
      }

      cache.package.index.packageToFiles[packageName].push(filePath)
      cache.package.index.fileToPackage[filePath] = packageName
    },

    /**
     * 获取文件信息
     * @param filePath - 文件绝对路径
     * @returns 文件信息，不存在则返回 null
     * @example
     * ```ts
     * const fileInfo = package.getFile('d:/path/to/file.ts')
     * // -> { path: '...', filename: 'test.ts', instances: {...} }
     * ```
     */
    getFile: (filePath: string): PluginFileInfo | null => {
      const packageName = cache.package.index.fileToPackage[filePath]
      if (!packageName) return null

      const packageInfo = cache.package.info[packageName]
      if (!packageInfo) return null

      return packageInfo.files[filePath] || null
    },

    /**
     * 通过文件路径获取包名
     * @param filePath - 文件绝对路径
     * @returns 包名，不存在则返回 null
     * @example
     * ```ts
     * const packageName = package.getPackageNameByFile('d:/path/to/file.ts')
     * // -> 'karin-plugin-example'
     * ```
     */
    getPackageNameByFile: (filePath: string): string | null => {
      return cache.package.index.fileToPackage[filePath] || null
    },

    /**
     * 通过包名获取所有文件路径
     * @param packageName - 插件包名称
     * @returns 文件路径数组
     * @example
     * ```ts
     * const files = package.getFilesByPackageName('karin-plugin-example')
     * // -> ['d:/path/to/file1.ts', 'd:/path/to/file2.ts']
     * ```
     */
    getFilesByPackageName: (packageName: string): string[] => {
      return cache.package.index.packageToFiles[packageName] || []
    },

    /**
     * 通过包名获取插件包绝对路径
     * @param packageName - 插件包名称
     * @returns 插件包根目录绝对路径，不存在则返回 null
     * @example
     * ```ts
     * const absPath = package.getAbsPath('karin-plugin-example')
     * // -> 'd:/Github/Karin/plugins/karin-plugin-example'
     * ```
     */
    getAbsPath: (packageName: string): string => {
      return cache.package.info[packageName]?.abs
    },
  }
}
