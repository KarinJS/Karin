/**
 * 环境变量管理器
 * @module store/envs
 * @description 管理插件的环境变量注入
 * @note v2.0 移除了 v1 兼容逻辑
 */

/**
 * 环境变量项
 */
export interface EnvItem {
  /** 环境变量值 */
  value: string
  /** 注释说明 */
  comment: string
}

/**
 * 包的环境变量集合
 */
export type PackageEnv = Record<string, EnvItem>

/**
 * 环境变量配置
 */
export type EnvConfig = Record<string, string | { value: string, comment?: string }>

/**
 * 环境变量管理器接口
 */
export interface EnvManager {
  /**
   * 创建插件环境变量
   * @param pkgName 包名
   * @param env 环境变量配置
   * @example
   * ```ts
   * envManager.create('my-plugin', {
   *   API_KEY: 'xxx',
   *   DEBUG: { value: 'true', comment: '调试模式' }
   * })
   * ```
   */
  create(pkgName: string, env?: EnvConfig): void

  /**
   * 获取插件环境变量
   * @param pkgName 包名
   * @returns 环境变量对象，不存在返回 null
   */
  get(pkgName: string): PackageEnv | null

  /**
   * 获取所有插件环境变量
   * @returns 所有包的环境变量
   */
  getAll(): Record<string, PackageEnv>

  /**
   * 删除插件环境变量记录
   * @param pkgName 包名
   */
  remove(pkgName: string): boolean

  /**
   * 清空所有环境变量记录
   */
  clear(): void

  /**
   * 获取统计信息
   */
  stats(): { packages: number, variables: number }
}

// ==================== 内部实现 ====================

/**
 * 注入环境变量到 process.env
 */
function injectEnvVariable (
  _pkgName: string,
  key: string,
  value: string | null | undefined,
  comment: string
): EnvItem | null {
  // 如果已存在则跳过
  if (process.env[key]) {
    return null
  }

  if (typeof value !== 'string') {
    // 静默跳过无效值
    return null
  }

  process.env[key] = value
  return { value, comment }
}

/**
 * 解析环境变量值
 */
function parseEnvValue (value: string | { value: string, comment?: string }): {
  value: string
  comment: string
} {
  if (typeof value === 'string') {
    return { value, comment: '' }
  }
  return {
    value: value.value,
    comment: value.comment || '',
  }
}

function createEnvManager (): EnvManager {
  // 内部存储
  const storage: Record<string, PackageEnv> = {}

  return {
    create (pkgName: string, env?: EnvConfig): void {
      if (!env) return

      const result: PackageEnv = {}

      for (const [key, value] of Object.entries(env)) {
        const parsed = parseEnvValue(value)
        const injected = injectEnvVariable(pkgName, key, parsed.value, parsed.comment)

        if (injected) {
          result[key] = injected
        }
      }

      if (Object.keys(result).length > 0) {
        storage[pkgName] = result
      }
    },

    get (pkgName: string): PackageEnv | null {
      return storage[pkgName] ? { ...storage[pkgName] } : null
    },

    getAll (): Record<string, PackageEnv> {
      const result: Record<string, PackageEnv> = {}
      for (const [pkg, envs] of Object.entries(storage)) {
        result[pkg] = { ...envs }
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

    stats (): { packages: number, variables: number } {
      let variables = 0
      for (const envs of Object.values(storage)) {
        variables += Object.keys(envs).length
      }
      return {
        packages: Object.keys(storage).length,
        variables,
      }
    },
  }
}

// ==================== 导出单例 ====================

/**
 * 环境变量管理器
 *
 * @example
 * ```ts
 * import { envManager } from '@karinjs/plugin'
 *
 * // 创建
 * envManager.create('my-plugin', {
 *   API_KEY: 'your-api-key',
 *   DEBUG: { value: 'true', comment: '调试模式' }
 * })
 *
 * // 获取
 * const envs = envManager.get('my-plugin')
 * console.log(envs?.API_KEY.value)
 *
 * // 统计
 * const stats = envManager.stats()
 * console.log(`${stats.packages} packages, ${stats.variables} variables`)
 * ```
 */
export const envManager = createEnvManager()
