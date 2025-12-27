/**
 * 插件系统类型定义
 * @module types
 */

// ============================================================================
// 基础类型
// ============================================================================

/** 插件组件类型 */
export type PluginType = 'command' | 'accept' | 'handler' | 'button' | 'task'

/** 插件状态 */
export type PluginStatus = 'loading' | 'loaded' | 'enabled' | 'disabled' | 'error' | 'unloaded'

/** 插件来源类型 */
export type PluginSource = 'npm' | 'git' | 'dev' | 'apps'

// ============================================================================
// Registry 相关类型
// ============================================================================

/** 注册项基础结构 */
export interface RegistryItem<T = unknown> {
  /** 唯一标识 */
  id: string
  /** 组件类型 */
  type: PluginType
  /** 所属包名 */
  pkg: string
  /** 来源文件路径 */
  file: string
  /** 优先级（越大越先执行） */
  priority: number
  /** 是否启用 */
  enabled: boolean
  /** 实际实例 */
  instance: T
  /** 元数据 */
  metadata?: Record<string, unknown>
}

/** 注册选项 */
export interface RegisterOptions {
  /** 优先级 */
  priority?: number
  /** 元数据 */
  metadata?: Record<string, unknown>
}

// ============================================================================
// Loader 相关类型
// ============================================================================

/** 加载文件选项 */
export interface LoadFileOptions {
  /** 是否强制重新加载（清除缓存） */
  force?: boolean
  /** 所属包名（可选，自动推断） */
  pkg?: string
  /** 是否静默（不打印日志） */
  silent?: boolean
}

/** 加载结果 */
export interface LoadResult {
  /** 是否成功 */
  success: boolean
  /** 文件路径 */
  file: string
  /** 包名 */
  pkg?: string
  /** 注册的组件数量 */
  registered: number
  /** 错误信息 */
  error?: Error
}

// ============================================================================
// Package 相关类型
// ============================================================================

/** 包缓存信息 */
export interface PackageCache {
  /** 包名 */
  name: string
  /** 版本 */
  version: string
  /** 绝对路径 */
  path: string
  /** 来源类型 */
  source: PluginSource
  /** 状态 */
  status: PluginStatus
  /** 入口文件列表 */
  files: Set<string>
  /** package.json 内容 */
  pkg?: Record<string, unknown>
  /** 配置信息 */
  config?: Record<string, unknown>
}

/** 包信息（对外） */
export interface PackageInfo {
  /** 包名 */
  name: string
  /** 版本 */
  version: string
  /** 状态 */
  status: PluginStatus
  /** 路径 */
  path: string
  /** 文件列表 */
  files: string[]
  /** 组件数量 */
  components: number
}

// ============================================================================
// Event 相关类型
// ============================================================================

/** 插件事件类型 */
export type PluginEvent =
  | 'plugin:load:start'
  | 'plugin:load:done'
  | 'plugin:load:error'
  | 'plugin:unload'
  | 'plugin:reload'
  | 'plugin:enable'
  | 'plugin:disable'
  | 'file:change'
  | 'file:add'
  | 'file:remove'
  | 'registry:add'
  | 'registry:remove'
  | 'registry:sort'
  | 'hmr:start'
  | 'hmr:stop'

/** 事件处理器 */
export type EventHandler<T = unknown> = (data: T) => void | Promise<void>

/** 事件数据映射 */
export interface EventDataMap {
  'plugin:load:start': { pkg: string }
  'plugin:load:done': { pkg: string; registered: number }
  'plugin:load:error': { pkg: string; error: Error }
  'plugin:unload': { pkg: string }
  'plugin:reload': { pkg: string; result: LoadResult }
  'plugin:enable': { pkg: string }
  'plugin:disable': { pkg: string }
  'file:change': { file: string; result: LoadResult }
  'file:add': { file: string; registered: number }
  'file:remove': { file: string; unregistered: number }
  'registry:add': { type: PluginType; id: string; item: RegistryItem }
  'registry:remove': { type: PluginType; id: string }
  'registry:sort': { type?: PluginType }
  'hmr:start': { paths: string[] }
  'hmr:stop': Record<string, never>
}

// ============================================================================
// DSL 相关类型（create）
// ============================================================================

/** Command 回调 */
export type CommandCallback = (ctx: CommandContext) => void | Promise<void>

/** Command 上下文（简化版，后续扩展） */
export interface CommandContext {
  /** 消息内容 */
  msg: string
  /** 回复函数 */
  reply: (content: string) => Promise<void>
  /** 其他上下文数据 */
  [key: string]: unknown
}

/** Command 选项 */
export interface CommandOptions {
  /** 规则（正则或字符串） */
  rule: string | RegExp
  /** 优先级 */
  priority?: number
  /** 权限 */
  permission?: string
  /** 描述 */
  desc?: string
}

/** Accept 回调 */
export type AcceptCallback = (ctx: AcceptContext) => void | Promise<void>

/** Accept 上下文 */
export interface AcceptContext {
  /** 事件类型 */
  event: string
  /** 事件数据 */
  data: unknown
  [key: string]: unknown
}

/** Accept 选项 */
export interface AcceptOptions {
  /** 事件类型 */
  event: string
  /** 优先级 */
  priority?: number
}

/** Handler 回调 */
export type HandlerCallback = (ctx: HandlerContext) => unknown | Promise<unknown>

/** Handler 上下文 */
export interface HandlerContext {
  /** 调用参数 */
  args: unknown[]
  [key: string]: unknown
}

/** Handler 选项 */
export interface HandlerOptions {
  /** 处理器键名 */
  key: string
  /** 优先级 */
  priority?: number
}

/** Button 回调 */
export type ButtonCallback = (ctx: ButtonContext) => void | Promise<void>

/** Button 上下文 */
export interface ButtonContext {
  /** 按钮 ID */
  id: string
  /** 按钮数据 */
  data?: unknown
  [key: string]: unknown
}

/** Button 选项 */
export interface ButtonOptions {
  /** 按钮 ID */
  id: string
  /** 优先级 */
  priority?: number
}

/** Task 回调 */
export type TaskCallback = () => void | Promise<void>

/** Task 选项 */
export interface TaskOptions {
  /** Cron 表达式 */
  cron: string
  /** 任务名称 */
  name?: string
  /** 是否立即执行一次 */
  immediate?: boolean
}
