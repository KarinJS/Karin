/**
 * 静态目录管理器
 * @module store/public
 * @description 管理插件的 public 静态资源目录
 */

/**
 * 静态目录配置
 */
export interface PublicDir {
  /** 目录路径 */
  path: string
  /** 别名（可选） */
  alias?: string
}

/**
 * 静态目录管理器接口
 */
export interface PublicManager {
  /**
   * 设置插件的静态目录
   * @param pkgName 包名
   * @param dirs 目录路径或路径数组
   * @example
   * ```ts
   * // 单个目录
   * publicManager.set('my-plugin', './dist/public')
   *
   * // 多个目录
   * publicManager.set('my-plugin', ['./dist/public', './public'])
   * ```
   */
  set(pkgName: string, dirs?: string | string[]): void

  /**
   * 获取插件的静态目录
   * @param pkgName 包名
   * @returns 目录路径数组
   */
  get(pkgName: string): string[]

  /**
   * 获取所有插件的静态目录
   * @returns 所有包的静态目录映射
   */
  getAll(): Record<string, string[]>

  /**
   * 删除插件的静态目录记录
   * @param pkgName 包名
   */
  remove(pkgName: string): boolean

  /**
   * 清空所有静态目录记录
   */
  clear(): void

  /**
   * 获取统计信息
   */
  stats(): { packages: number, directories: number }
}

// ==================== 内部实现 ====================

function createPublicManager (): PublicManager {
  // 内部存储
  const storage: Record<string, string[]> = {}

  return {
    set (pkgName: string, dirs?: string | string[]): void {
      if (Array.isArray(dirs)) {
        if (dirs.length === 0) return
        // 过滤空字符串
        const validDirs = dirs.filter(d => typeof d === 'string' && d.length > 0)
        if (validDirs.length > 0) {
          storage[pkgName] = validDirs
        }
        return
      }

      if (typeof dirs !== 'string' || dirs.length === 0) return
      storage[pkgName] = [dirs]
    },

    get (pkgName: string): string[] {
      return storage[pkgName] ? [...storage[pkgName]] : []
    },

    getAll (): Record<string, string[]> {
      const result: Record<string, string[]> = {}
      for (const [pkg, dirs] of Object.entries(storage)) {
        result[pkg] = [...dirs]
      }
      return result
    },

    remove (pkgName: string): boolean {
      if (storage[pkgName]) {
        delete storage[pkgName]
        return true
      }
      return false
    },

    clear (): void {
      for (const key of Object.keys(storage)) {
        delete storage[key]
      }
    },

    stats (): { packages: number, directories: number } {
      let directories = 0
      for (const dirs of Object.values(storage)) {
        directories += dirs.length
      }
      return {
        packages: Object.keys(storage).length,
        directories,
      }
    },
  }
}

// ==================== 导出单例 ====================

/**
 * 静态目录管理器
 *
 * @example
 * ```ts
 * import { publicManager } from '@karinjs/plugin'
 *
 * // 设置静态目录
 * publicManager.set('my-plugin', ['./dist/public', './public'])
 *
 * // 获取
 * const dirs = publicManager.get('my-plugin')
 * // -> ['./dist/public', './public']
 *
 * // 获取所有
 * const all = publicManager.getAll()
 * // -> { 'my-plugin': ['./dist/public', './public'], ... }
 * ```
 */
export const publicManager = createPublicManager()
