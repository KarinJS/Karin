/**
 * Karin 插件系统
 * @module plugin
 *
 * 高性能、高可用、高维护性的插件系统
 */

// ============================================================================
// 兼容层 - 从旧 API 导出以保持向后兼容
// ============================================================================

export {
  Plugin,
  accept as acceptOld,
  button as buttonOld,
  command as commandOld,
  handler as handlerOld,
  task as taskOld,
  ctx,
} from '../src_old/create'

export { pluginCache } from '../src_old/cache'
export { parsePluginMetadata } from '../src_old/core/metadata'
export { defineKarinConfig, defineWebConfig } from '../src_old/config'
export { packageFinder } from '../src_old/package'

export type { DefineConfigWeb, DefineConfig, PluginMeta } from '../src_old/config'
export type { PluginsTypes, PkgEnv, Package, PackageKarin, PkgData } from '../src_old/package'
export type { CreateAccept, CreateButton, CreateCommand, CreateHandler, CreateTask, CreateClassPlugin } from '../src_old/create'

// ============================================================================
// 内部 API（供 HMR、CLI、WebUI 等消费）
// ============================================================================

export * as api from './api'

export {
  event,
  cache,
  registry,
  module,
  loader,
  lifecycle,
} from './api'

export type {
  EventAPI,
  CacheAPI,
  RegistryAPI,
  ModuleAPI,
  LoaderAPI,
  LifecycleAPI,
} from './api'

// ============================================================================
// 插件开发 DSL（新 API）
// ============================================================================

export {
  command,
  accept,
  handler,
  button,
  task,
  setContext,
  getContext,
  clearContext,
  withContext,
} from './create'

export type {
  CommandInstance,
  AcceptInstance,
  HandlerInstance,
  ButtonInstance,
  TaskInstance,
} from './create'

// ============================================================================
// HMR 热重载
// ============================================================================

export {
  HotModuleReloader,
  HMRManager,
  createHMR,
  startHMR,
  // 增强型 HMR
  EnhancedHMR,
  createEnhancedHMR,
  // 副作用管理
  effectRegistry,
  registerEffect,
  createEffect,
  // HMR 配置
  hmrConfigManager,
  defineHMRConfig,
  HMR_CONFIG_FILES,
} from './hmr'

export type {
  HMROptions,
  HMRReloadResult,
  EventContext,
  // 增强型 HMR 类型
  EnhancedHMROptions,
  HMRConfig,
  DefineHMRConfig,
  HMRContext,
  CleanupFunction,
  ModuleHotHandler,
  EffectRegistry,
  ConfigChangeContext,
  KarinConfigHooks,
} from './hmr'

// ============================================================================
// 类型导出
// ============================================================================

export type {
  // 基础类型
  PluginType,
  PluginStatus,
  PluginSource,
  // Registry
  RegistryItem,
  RegisterOptions,
  // Loader
  LoadFileOptions,
  LoadResult,
  // Package
  PackageCache,
  PackageInfo,
  // DSL
  CommandCallback,
  CommandContext,
  CommandOptions,
  AcceptCallback,
  AcceptContext,
  AcceptOptions,
  HandlerCallback,
  HandlerContext,
  HandlerOptions,
  ButtonCallback,
  ButtonContext,
  ButtonOptions,
  TaskCallback,
  TaskOptions,
} from './types'
