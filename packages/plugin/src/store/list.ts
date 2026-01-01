/**
 * 包列表管理器
 * @module store/list
 * @description 管理 npm/dev/apps 三种类型的包列表
 *
 * 注意：v11 移除了 git 类型
 */

/**
 * 包类型（v11 简化版，移除 git）
 */
export type PkgType = 'npm' | 'dev' | 'apps'

/**
 * 包元信息
 */
export interface PackageListItem {
  /**
   * 包名
   * @example 'karin-plugin-example'
   */
  name: string

  /**
   * 包绝对路径
   * @example 'd:/Github/Karin/plugins/karin-plugin-example'
   */
  abs: string

  /**
   * package.json 绝对路径
   * @example 'd:/Github/Karin/plugins/karin-plugin-example/package.json'
   */
  pkg: string
}

/**
 * 带类型的包元信息（用于 all 查询）
 */
export interface PackageListItemWithType extends PackageListItem {
  type: PkgType
}

/**
 * 包列表管理器接口
 */
export interface PackageListManager {
  /**
   * 设置包列表
   * @param type 包类型
   * @param list 包列表
   * @example
   * ```ts
   * packageList.set('npm', [
   *   { name: 'plugin1', abs: '/path/to/plugin1', pkg: '/path/to/plugin1/package.json' }
   * ])
   * ```
   */
  set(type: PkgType, list: PackageListItem[]): void

  /**
   * 添加单个包到列表
   * @param type 包类型
   * @param item 包信息
   */
  add(type: PkgType, item: PackageListItem): void

  /**
   * 获取指定类型的包列表
   * @param type 包类型
   * @returns 包列表副本
   */
  get(type: PkgType): PackageListItem[]

  /**
   * 获取所有类型的包列表
   * @returns 带类型标记的包列表
   */
  getAll(): PackageListItemWithType[]

  /**
   * 获取包名列表
   * @param type 包类型，'all' 返回格式为 'type:name'
   */
  names(type: PkgType | 'all'): string[]

  /**
   * 按名称查找包
   * @param name 包名
   * @returns 包信息及其类型，未找到返回 null
   */
  findByName(name: string): { type: PkgType, item: PackageListItem } | null

  /**
   * 按类型删除包
   * @param type 包类型
   * @param name 包名
   * @returns 是否成功删除
   */
  remove(type: PkgType, name: string): boolean

  /**
   * 清空包列表
   * @param type 可选，指定类型；不传则清空全部
   */
  clear(type?: PkgType): void

  /**
   * 获取统计信息
   */
  stats(): { npm: number, dev: number, apps: number, total: number }
}

// ==================== 内部实现 ====================

function createPackageList (): PackageListManager {
  // 内部存储
  const lists: Record<PkgType, PackageListItem[]> = {
    npm: [],
    dev: [],
    apps: [],
  }

  return {
    set (type: PkgType, list: PackageListItem[]): void {
      lists[type] = [...list]
    },

    add (type: PkgType, item: PackageListItem): void {
      // 检查是否已存在
      const exists = lists[type].some(p => p.name === item.name)
      if (!exists) {
        lists[type].push(item)
      }
    },

    get (type: PkgType): PackageListItem[] {
      return [...lists[type]]
    },

    getAll (): PackageListItemWithType[] {
      const result: PackageListItemWithType[] = []

      for (const type of ['npm', 'dev', 'apps'] as const) {
        for (const item of lists[type]) {
          result.push({ type, ...item })
        }
      }

      return result
    },

    names (type: PkgType | 'all'): string[] {
      if (type === 'all') {
        return this.getAll().map(item => `${item.type}:${item.name}`)
      }
      return lists[type].map(item => item.name)
    },

    findByName (name: string): { type: PkgType, item: PackageListItem } | null {
      for (const type of ['npm', 'dev', 'apps'] as const) {
        const item = lists[type].find(p => p.name === name)
        if (item) {
          return { type, item: { ...item } }
        }
      }
      return null
    },

    remove (type: PkgType, name: string): boolean {
      const index = lists[type].findIndex(p => p.name === name)
      if (index !== -1) {
        lists[type].splice(index, 1)
        return true
      }
      return false
    },

    clear (type?: PkgType): void {
      if (type) {
        lists[type] = []
      } else {
        lists.npm = []
        lists.dev = []
        lists.apps = []
      }
    },

    stats (): { npm: number, dev: number, apps: number, total: number } {
      return {
        npm: lists.npm.length,
        dev: lists.dev.length,
        apps: lists.apps.length,
        total: lists.npm.length + lists.dev.length + lists.apps.length,
      }
    },
  }
}

// ==================== 导出单例 ====================

/**
 * 包列表管理器
 *
 * @example
 * ```ts
 * import { packageList } from '@karinjs/plugin'
 *
 * // 设置包列表
 * packageList.set('npm', npmPackages)
 *
 * // 获取包列表
 * const devPackages = packageList.get('dev')
 *
 * // 查找包
 * const found = packageList.findByName('karin-plugin-example')
 * if (found) {
 *   console.log(`Found in ${found.type}: ${found.item.abs}`)
 * }
 *
 * // 统计
 * const stats = packageList.stats()
 * console.log(`Total packages: ${stats.total}`)
 * ```
 */
export const packageList = createPackageList()
