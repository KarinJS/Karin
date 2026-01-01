/**
 * 包注册表 - 管理插件包和文件的映射关系
 *
 * 职责：
 * - 文件路径 -> 包名 的映射
 * - 包名 -> 包信息 的映射
 * - 包名 -> 文件列表 的映射
 *
 * @module pkg
 */

/** 包类型 */
export type PkgType = 'npm' | 'apps' | 'dev'

/** 包信息 */
export interface PkgInfo {
  /** 包名 */
  name: string
  /** 包绝对路径 */
  abs: string
  /** package.json 路径 */
  pkgPath: string
  /** 包类型 */
  type: PkgType
  /** 主入口文件路径（可选） */
  main?: string | null
}

function createPkgRegistry () {
  // 包名 -> 包信息
  const packages = new Map<string, PkgInfo>()

  // 文件 -> 包名
  const fileToPackage = new Map<string, string>()

  // 包名 -> 文件列表
  const packageToFiles = new Map<string, Set<string>>()

  return {
    /**
     * 注册包
     */
    register (info: PkgInfo): void {
      packages.set(info.name, info)
      if (!packageToFiles.has(info.name)) {
        packageToFiles.set(info.name, new Set())
      }
    },

    /**
     * 添加文件到包
     */
    addFile (pkgName: string, filePath: string): void {
      const normalPath = filePath.replaceAll('\\', '/')
      fileToPackage.set(normalPath, pkgName)

      const files = packageToFiles.get(pkgName)
      if (files) {
        files.add(normalPath)
      }
    },

    /**
     * 移除文件
     */
    removeFile (filePath: string): void {
      const normalPath = filePath.replaceAll('\\', '/')
      const pkgName = fileToPackage.get(normalPath)
      if (pkgName) {
        fileToPackage.delete(normalPath)
        packageToFiles.get(pkgName)?.delete(normalPath)
      }
    },

    /**
     * 移除包
     */
    remove (pkgName: string): void {
      packages.delete(pkgName)

      // 清理该包的所有文件映射
      const files = packageToFiles.get(pkgName)
      if (files) {
        for (const f of files) {
          fileToPackage.delete(f)
        }
        packageToFiles.delete(pkgName)
      }
    },

    /**
     * 通过文件路径获取包名
     */
    getPackageNameByFile (filePath: string): string | null {
      const normalPath = filePath.replaceAll('\\', '/')
      return fileToPackage.get(normalPath) ?? null
    },

    /**
     * 获取包信息
     */
    get (pkgName: string): PkgInfo | undefined {
      return packages.get(pkgName)
    },

    /**
     * 获取包的绝对路径
     */
    getAbsPath (pkgName: string): string {
      return packages.get(pkgName)?.abs ?? ''
    },

    /**
     * 获取包的所有文件
     */
    getFiles (pkgName: string): string[] {
      return [...(packageToFiles.get(pkgName) ?? [])]
    },

    /**
     * 获取所有包名
     */
    list (): string[] {
      return [...packages.keys()]
    },

    /**
     * 清空
     */
    clear (): void {
      packages.clear()
      fileToPackage.clear()
      packageToFiles.clear()
    },

    /**
     * 统计
     */
    stats (): { packages: number; files: number } {
      return {
        packages: packages.size,
        files: fileToPackage.size,
      }
    },
  }
}

/** 全局包注册表 */
export const pkgRegistry = createPkgRegistry()
