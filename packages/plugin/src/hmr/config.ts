/**
 * HMR 配置加载器
 * @module hmr/config
 *
 * 负责查找和加载 karin.hmr.config.ts/js/mjs/mts 文件
 */

import { formatPath } from '@karinjs/utils'
import type { DefineHMRConfig } from './types'
import { effectRegistry } from './effects'

/** HMR 配置文件名候选列表 */
const HMR_CONFIG_FILES = [
  'karin.hmr.config.ts',
  'karin.hmr.config.mts',
  'karin.hmr.config.js',
  'karin.hmr.config.mjs',
] as const

/** 是否为开发环境 */
const isDev = process.env.NODE_ENV === 'development' || process.env.KARIN_DEV === 'true'

/**
 * HMR 配置管理器
 */
class HMRConfigManager {
  /** 已加载的配置缓存 */
  private configCache = new Map<string, DefineHMRConfig>()
  /** 配置文件路径缓存 */
  private configPaths = new Map<string, string>()
  /** 配置版本（用于重载） */
  private configVersions = new Map<string, number>()
  /** 日志 */
  private logger = global.logger?.prefix?.('[hmr:config]') || console

  /**
   * 是否为开发环境
   */
  get isDev (): boolean {
    return isDev
  }

  /**
   * 查找 HMR 配置文件
   * @param pluginRoot 插件根目录
   * @returns 配置文件路径，如果不存在则返回 null
   */
  async findConfigFile (pluginRoot: string): Promise<string | null> {
    // 非开发环境不需要 HMR 配置
    if (!isDev) return null

    // 防御性检查
    if (typeof pluginRoot !== 'string' || !pluginRoot.trim()) {
      return null
    }

    const cached = this.configPaths.get(pluginRoot)
    if (cached) return cached

    const { existsSync } = await import('node:fs')
    const { join } = await import('node:path')

    for (const filename of HMR_CONFIG_FILES) {
      const configPath = join(pluginRoot, filename)
      if (existsSync(configPath)) {
        this.configPaths.set(pluginRoot, configPath)
        return configPath
      }
    }

    return null
  }

  /**
   * 加载 HMR 配置
   * @param pluginRoot 插件根目录
   * @param force 是否强制重新加载
   * @returns 配置对象，如果不存在则返回默认配置
   */
  async loadConfig (pluginRoot: string, force = false): Promise<DefineHMRConfig> {
    // 非开发环境返回空配置
    if (!isDev) {
      return {}
    }

    // 防御性检查
    if (typeof pluginRoot !== 'string' || !pluginRoot.trim()) {
      return {}
    }

    const configPath = await this.findConfigFile(pluginRoot)

    // 没有配置文件，返回默认配置
    if (!configPath) {
      return {}
    }

    // 检查缓存
    if (!force && this.configCache.has(configPath)) {
      return this.configCache.get(configPath)!
    }

    try {
      // 增加版本号
      const version = (this.configVersions.get(configPath) ?? 0) + 1
      this.configVersions.set(configPath, version)

      // 动态导入配置
      const importUrl = `${formatPath(configPath, { type: 'fileURL' })}?v=${version}`
      const mod = await import(importUrl)

      // 获取配置（支持 default 或命名导出）
      const rawConfig = mod.default ?? mod.config ?? mod

      // 防御性检查：配置必须是对象
      let config: DefineHMRConfig = {}
      if (
        rawConfig !== null &&
        typeof rawConfig === 'object' &&
        !Array.isArray(rawConfig)
      ) {
        config = rawConfig
      }

      // 验证配置字段类型
      this.validateConfig(config)

      // 初始化副作用注册器
      if (config.effects && typeof config.effects === 'function') {
        await config.effects(effectRegistry)
      }

      // 缓存配置
      this.configCache.set(configPath, config)

      this.log('info', `loaded config from ${configPath}`)
      return config
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error))
      this.log('error', `failed to load config: ${err.message}`)
      return {}
    }
  }

  /**
   * 验证配置对象
   * 不报错，只警告并修复无效字段
   */
  private validateConfig (config: DefineHMRConfig): void {
    // 验证 debounce
    if (config.debounce !== undefined) {
      if (typeof config.debounce !== 'number' || config.debounce < 0 || !Number.isFinite(config.debounce)) {
        this.log('warn', 'invalid debounce value, must be a non-negative number')
        config.debounce = 100
      }
    }

    // 验证 exclude
    if (config.exclude !== undefined && !Array.isArray(config.exclude)) {
      this.log('warn', 'invalid exclude value, must be an array')
      config.exclude = undefined
    }

    // 验证 watch
    if (config.watch !== undefined && !Array.isArray(config.watch)) {
      this.log('warn', 'invalid watch value, must be an array')
      config.watch = undefined
    }

    // 验证 modules
    if (config.modules !== undefined) {
      if (typeof config.modules !== 'object' || config.modules === null || Array.isArray(config.modules)) {
        this.log('warn', 'invalid modules value, must be an object')
        config.modules = undefined
      } else {
        // 检查每个 handler 是否是函数
        for (const [pattern, handler] of Object.entries(config.modules)) {
          if (typeof handler !== 'function') {
            this.log('warn', `invalid handler for module pattern '${pattern}', must be a function`)
            delete config.modules[pattern]
          }
        }
      }
    }

    // 验证钩子函数
    if (config.onBeforeHot !== undefined && typeof config.onBeforeHot !== 'function') {
      this.log('warn', 'invalid onBeforeHot, must be a function')
      config.onBeforeHot = undefined
    }

    if (config.onAfterHot !== undefined && typeof config.onAfterHot !== 'function') {
      this.log('warn', 'invalid onAfterHot, must be a function')
      config.onAfterHot = undefined
    }

    // 验证 karinConfig 钩子
    if (config.karinConfig !== undefined) {
      if (typeof config.karinConfig !== 'object' || config.karinConfig === null) {
        this.log('warn', 'invalid karinConfig, must be an object')
        config.karinConfig = undefined
      } else {
        const kc = config.karinConfig
        if (kc.onBeforeChange !== undefined && typeof kc.onBeforeChange !== 'function') {
          this.log('warn', 'invalid karinConfig.onBeforeChange, must be a function')
          kc.onBeforeChange = undefined
        }
        if (kc.onAfterChange !== undefined && typeof kc.onAfterChange !== 'function') {
          this.log('warn', 'invalid karinConfig.onAfterChange, must be a function')
          kc.onAfterChange = undefined
        }
        if (kc.requireFullReload !== undefined && typeof kc.requireFullReload !== 'function') {
          this.log('warn', 'invalid karinConfig.requireFullReload, must be a function')
          kc.requireFullReload = undefined
        }
      }
    }
  }

  /**
   * 重新加载指定插件的 HMR 配置
   * @param pluginRoot 插件根目录
   */
  async reloadConfig (pluginRoot: string): Promise<DefineHMRConfig> {
    const configPath = await this.findConfigFile(pluginRoot)

    if (configPath) {
      // 清除旧缓存
      this.configCache.delete(configPath)
    }

    return this.loadConfig(pluginRoot, true)
  }

  /**
   * 获取已加载的配置
   * @param pluginRoot 插件根目录
   */
  getConfig (pluginRoot: string): DefineHMRConfig | null {
    const configPath = this.configPaths.get(pluginRoot)
    if (!configPath) return null
    return this.configCache.get(configPath) ?? null
  }

  /**
   * 检查文件是否是 HMR 配置文件
   * @param filePath 文件路径
   */
  isHMRConfigFile (filePath: string): boolean {
    // 防御性检查
    if (typeof filePath !== 'string' || !filePath) {
      return false
    }
    const { basename } = require('node:path')
    const filename = basename(filePath)
    return HMR_CONFIG_FILES.includes(filename as typeof HMR_CONFIG_FILES[number])
  }

  /**
   * 清除所有缓存
   */
  clear (): void {
    this.configCache.clear()
    this.configPaths.clear()
    this.configVersions.clear()
  }

  /**
   * 日志输出
   */
  private log (level: 'info' | 'debug' | 'warn' | 'error', message: string): void {
    if (this.logger[level]) {
      this.logger[level](message)
    } else {
      console.log(`[hmr:config] ${message}`)
    }
  }
}

// 单例
const hmrConfigManager = new HMRConfigManager()

export { hmrConfigManager }

/**
 * 创建 HMR 配置的辅助函数
 *
 * @example
 * ```ts
 * // karin.hmr.config.ts
 * import { defineHMRConfig } from '@karinjs/plugin'
 *
 * export default defineHMRConfig({
 *   debounce: 200,
 *
 *   // 全局热更新钩子
 *   onBeforeHot: async (ctx) => {
 *     console.log(`热更新: ${ctx.file}`)
 *   },
 *
 *   // 特定模块的处理
 *   modules: {
 *     'src/timer.ts': async (ctx) => {
 *       // 清理定时器
 *       global.myTimer && clearInterval(global.myTimer)
 *     }
 *   },
 *
 *   // 副作用注册
 *   effects: (registry) => {
 *     // 动态注册副作用
 *   },
 *
 *   // karin.config 热更新配置
 *   karinConfig: {
 *     onAfterChange: (ctx) => {
 *       console.log('配置已更新:', ctx.changedKeys)
 *     },
 *     requireFullReload: (ctx) => {
 *       // entry 变更需要完全重载
 *       return ctx.changedKeys.includes('entry')
 *     }
 *   }
 * })
 * ```
 */
export function defineHMRConfig (config: DefineHMRConfig): DefineHMRConfig {
  return config
}

/**
 * HMR 配置文件名列表
 */
export { HMR_CONFIG_FILES }
