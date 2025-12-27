/**
 * HMR 配置类型定义
 * @module hmr/types
 */

/**
 * 模块热更新上下文
 * 当模块即将被热更新时，会收到此上下文
 */
export interface HMRContext {
  /** 当前被热更新的模块绝对路径 */
  file: string
  /** 模块的 file:// URL */
  fileUrl: string
  /** 此次热更新中所有受影响的模块路径列表 */
  affectedModules: string[]
  /** 热更新事件类型 */
  eventType: 'change' | 'unlink'
  /** 时间戳 */
  timestamp: number
}

/**
 * 清理函数类型
 * 用于在模块卸载前执行副作用清理
 */
export type CleanupFunction = () => void | Promise<void>

/**
 * 模块热更新钩子
 * 当指定模块被热更新时触发
 */
export type ModuleHotHandler = (ctx: HMRContext) => void | Promise<void>

/**
 * 副作用注册器
 * 允许模块注册需要在热更新时清理的副作用
 */
export interface EffectRegistry {
  /**
   * 注册清理函数
   * @param moduleFile 模块文件路径
   * @param cleanup 清理函数
   * @returns 取消注册的函数
   */
  register: (moduleFile: string, cleanup: CleanupFunction) => () => void

  /**
   * 执行指定模块的所有清理函数
   * @param moduleFile 模块文件路径
   */
  cleanup: (moduleFile: string) => Promise<void>

  /**
   * 清理所有注册的副作用
   */
  cleanupAll: () => Promise<void>
}

/**
 * HMR 配置文件定义
 */
export interface HMRConfig {
  /**
   * 受保护的模块路径（不清除缓存的模块）
   * 支持 glob 模式
   * @example ['node_modules/**', 'dist/**']
   */
  exclude?: string[]

  /**
   * 额外监听的路径
   * 默认情况下会监听 karin.config 中定义的 entry
   */
  watch?: string[]

  /**
   * 防抖延迟（毫秒）
   * @default 100
   */
  debounce?: number

  /**
   * 模块热更新前的钩子
   * 在清除缓存之前调用，用于清理副作用
   * @param ctx 热更新上下文
   */
  onBeforeHot?: (ctx: HMRContext) => void | Promise<void>

  /**
   * 模块热更新后的钩子
   * 在模块重新加载后调用
   * @param ctx 热更新上下文
   */
  onAfterHot?: (ctx: HMRContext) => void | Promise<void>

  /**
   * 特定模块的热更新处理器
   * key 为模块路径（支持 glob），value 为处理函数
   *
   * @example
   * ```ts
   * {
   *   modules: {
   *     'src/timer.ts': async (ctx) => {
   *       // 清理定时器
   *       clearInterval(myTimer)
   *     },
   *     'src/ws/**': async (ctx) => {
   *       // 关闭 WebSocket 连接
   *       wsConnection.close()
   *     }
   *   }
   * }
   * ```
   */
  modules?: Record<string, ModuleHotHandler>

  /**
   * 自定义副作用清理
   * 提供一个更细粒度的副作用管理方式
   *
   * @example
   * ```ts
   * effects: (registry) => {
   *   // 在模块加载时注册清理函数
   *   registry.register('src/timer.ts', () => {
   *     clearInterval(myTimer)
   *   })
   * }
   * ```
   */
  effects?: (registry: EffectRegistry) => void | Promise<void>

  /**
   * 是否启用详细日志
   * @default false
   */
  verbose?: boolean
}

/**
 * Karin 插件配置变更上下文
 */
export interface ConfigChangeContext {
  /** 配置文件路径 */
  file: string
  /** 旧配置（如果可用） */
  oldConfig?: Record<string, unknown>
  /** 新配置 */
  newConfig: Record<string, unknown>
  /** 变更的键列表 */
  changedKeys: string[]
}

/**
 * Karin 插件配置钩子
 */
export interface KarinConfigHooks {
  /**
   * 配置变更前的钩子
   */
  onBeforeChange?: (ctx: ConfigChangeContext) => void | Promise<void>

  /**
   * 配置变更后的钩子
   */
  onAfterChange?: (ctx: ConfigChangeContext) => void | Promise<void>

  /**
   * 是否需要完全重载插件
   * 返回 true 则重新加载整个插件，返回 false 则仅热更新配置
   * @default false (仅热更新配置)
   */
  requireFullReload?: (ctx: ConfigChangeContext) => boolean | Promise<boolean>
}

/**
 * 完整的 HMR 配置
 */
export interface DefineHMRConfig extends HMRConfig {
  /**
   * karin.config 文件的热更新配置
   */
  karinConfig?: KarinConfigHooks
}
