/**
 * Create DSL 统一导出
 * @module create
 */

export { command, type CommandInstance } from './command'
export { accept, type AcceptInstance } from './accept'
export { handler, type HandlerInstance } from './handler'
export { button, type ButtonInstance } from './button'
export { task, type TaskInstance } from './task'
export { setContext, getContext, clearContext, withContext } from './context'

// 基础类
export { BuilderBase, createPluginId, type PluginCacheFile } from './base'

// 类式插件
export {
  Plugin,
  CreateClassPlugin,
  registerClassPlugin,
  registerModuleClassPlugins,
  type PluginOptions,
  type PluginRuleItem,
  type FormattedRuleItem,
  type ClassPluginOptions,
} from './class'
