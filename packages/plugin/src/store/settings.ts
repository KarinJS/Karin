/**
 * 引擎设置管理器
 * @module store/settings
 * @description 管理插件的 engines 版本兼容性检查
 */

import semver from 'semver'

/**
 * 插件引擎配置
 */
export interface PluginEngines {
  /** 要求的 karin 版本 */
  version: string
  /** 是否忽略引擎检查 */
  ignoreEngines: boolean
}

/**
 * 引擎设置管理器接口
 */
export interface EngineSettingsManager {
  /**
   * 记录不兼容的插件
   * @param name 包名
   * @param settings 引擎配置
   */
  set(name: string, settings: PluginEngines): void

  /**
   * 获取插件的引擎配置
   * @param name 包名
   */
  get(name: string): PluginEngines | null

  /**
   * 获取所有引擎配置
   */
  getAll(): Record<string, PluginEngines>

  /**
   * 检查版本兼容性
   * @param name 包名
   * @param requiredVersion 要求的版本
   * @param ignoreEngines 是否忽略检查
   * @returns 是否兼容
   */
  check(name: string, requiredVersion?: string, ignoreEngines?: boolean): boolean

  /**
   * 删除记录
   * @param name 包名
   */
  remove(name: string): boolean

  /**
   * 清空所有记录
   */
  clear(): void

  /**
   * 打印不兼容的插件警告
   */
  print(): void

  /**
   * 获取不兼容插件数量
   */
  count(): number
}

// ==================== 内部实现 ====================

function createEngineSettings (): EngineSettingsManager {
  // 内部存储
  const storage: Record<string, PluginEngines> = {}

  return {
    set (name: string, settings: PluginEngines): void {
      storage[name] = { ...settings }
    },

    get (name: string): PluginEngines | null {
      return storage[name] ? { ...storage[name] } : null
    },

    getAll (): Record<string, PluginEngines> {
      const result: Record<string, PluginEngines> = {}
      for (const [name, settings] of Object.entries(storage)) {
        result[name] = { ...settings }
      }
      return result
    },

    check (name: string, requiredVersion?: string, ignoreEngines: boolean = false): boolean {
      if (!requiredVersion || ignoreEngines) {
        return true
      }

      const karinVersion = process.env.KARIN_VERSION
      if (!karinVersion) return true

      try {
        const matches = semver.satisfies(karinVersion, requiredVersion, {
          includePrerelease: true,
          loose: true,
        })

        if (!matches) {
          // 记录不兼容的插件
          this.set(name, { version: requiredVersion, ignoreEngines })
        }

        return matches
      } catch {
        // semver 解析失败，默认兼容
        return true
      }
    },

    remove (name: string): boolean {
      if (storage[name]) {
        delete storage[name]
        return true
      }
      return false
    },

    clear (): void {
      for (const key of Object.keys(storage)) {
        delete storage[key]
      }
    },

    print (): void {
      const keys = Object.keys(storage)
      if (keys.length === 0) return

      const karinVersion = process.env.KARIN_VERSION || 'unknown'

      // 使用 global.logger（如果存在）
      const log = typeof global !== 'undefined' && global.logger ? global.logger : console

      if ('warn' in log && 'chalk' in log) {
        const { chalk } = log as { chalk: any }

        log.warn('')
        log.warn(chalk.yellow.bold('⚠️  插件兼容性警告'))
        log.warn(chalk.gray('─'.repeat(50)))
        log.warn(chalk.cyan(`当前 Karin 版本: ${chalk.bold(karinVersion)}`))
        log.warn(chalk.gray('─'.repeat(50)))
        log.warn(chalk.yellow('以下插件包不符合 engines 版本要求:\n'))

        keys.forEach((pluginName, index) => {
          const info = storage[pluginName]
          const count = chalk.gray(`[${index + 1}/${keys.length}]`)
          log.warn(`  ${count} ${chalk.red('✗')} ${chalk.white.bold(pluginName)}`)
          if (info?.version) {
            log.warn(chalk.gray(`      要求版本: ${info.version}`))
          }
        })

        log.warn('')
        log.warn(chalk.gray('提示: 这些插件可能无法正常工作，请更新插件或升级 Karin 版本'))
        log.warn(chalk.gray('─'.repeat(50)))
        log.warn('')
      } else {
        // fallback to console
        console.warn('')
        console.warn('⚠️  插件兼容性警告')
        console.warn(`当前 Karin 版本: ${karinVersion}`)
        console.warn('以下插件包不符合 engines 版本要求:')

        keys.forEach((pluginName) => {
          const info = storage[pluginName]
          console.warn(`  ✗ ${pluginName} (要求: ${info?.version || '未知'})`)
        })

        console.warn('')
      }
    },

    count (): number {
      return Object.keys(storage).length
    },
  }
}

// ==================== 导出单例 ====================

/**
 * 引擎设置管理器
 *
 * @example
 * ```ts
 * import { engineSettings } from '@karinjs/plugin'
 *
 * // 检查版本兼容性
 * const compatible = engineSettings.check('my-plugin', '>=1.0.0')
 *
 * // 打印警告
 * engineSettings.print()
 * ```
 */
export const engineSettings = createEngineSettings()
