/**
 * Karin 插件系统 - 高性能极简版
 * @module plugin
 */

// ============================================================================
// 兼容层 - 从旧 API 导出
// ============================================================================

export {
  Plugin as PluginOld,
  accept as acceptOld,
  button as buttonOld,
  command as commandOld,
  handler as handlerOld,
  task as taskOld,
  ctx,
} from '../src_old/create'

export { pluginCache } from '../src_old/cache'
export { parsePluginMetadata } from '../src_old/core/metadata'

export type { CreateAccept, CreateButton, CreateCommand, CreateHandler, CreateTask, CreateClassPlugin as CreateClassPluginOld } from '../src_old/create'

// ============================================================================
// 配置模块
// ============================================================================

export { defineKarinConfig, defineWebConfig, defineConfig } from './config'
export type { DefineConfigWeb, DefineConfig, PackageEnv, PluginMeta, WebConfigAuthor, WebConfigSaveResponse, WebConfigIcon } from './config'

// ============================================================================
// 插件包模块
// ============================================================================

export { packageFinder } from './package'
export type { PluginsTypes, PkgEnv, Package, PackageKarin, PkgData, PackageMetaInfoCache } from './package'

// ============================================================================
// 插件市场模块
// ============================================================================

export { MarketManager, getPluginMarket, isNpmPlugin, checkNpmUpdate, getNpmPackageVersion, updateNpmPackage, updateNpmPackages } from './marketplace'
export type { KarinPluginBase, KarinPluginType, KarinNpmPlugin, KarinGitPlugin, KarinAppPlugin, NpmUpdateOptions, GitRemoteBranches } from './marketplace'

// ============================================================================
// 核心模块
// ============================================================================

export { engines } from './core'

// ============================================================================
// 内部 API
// ============================================================================

export * as api from './api'
export { event, cache, registry, module, loader, lifecycle, CommandHotCache } from './api'
export type { EventAPI, CacheAPI, RegistryAPI, ModuleAPI, LoaderAPI, LifecycleAPI, HotCacheStats } from './api'

// ============================================================================
// 插件开发 DSL
// ============================================================================

export { command, accept, handler, button, task, setContext, getContext, clearContext, withContext, BuilderBase, createPluginId, Plugin, CreateClassPlugin, registerClassPlugin, registerModuleClassPlugins } from './create'
export type { CommandInstance, AcceptInstance, HandlerInstance, ButtonInstance, TaskInstance, PluginCacheFile, PluginOptions, PluginRuleItem, FormattedRuleItem, ClassPluginOptions } from './create'

// ============================================================================
// HMR 热重载
// ============================================================================

export { HotModuleReloader, HMRManager, createHMR, startHMR, EnhancedHMR, createEnhancedHMR, effectRegistry, registerEffect, createEffect, hmrConfigManager, defineHMRConfig, HMR_CONFIG_FILES } from './hmr'
export type { HMROptions, HMRReloadResult, EventContext, EnhancedHMROptions, HMRConfig, DefineHMRConfig, HMRContext, CleanupFunction, ModuleHotHandler, EffectRegistry, ConfigChangeContext, KarinConfigHooks } from './hmr'

// ============================================================================
// 类型导出
// ============================================================================

export type {
  PluginType, PluginStatus, PluginSource,
  RegistryItem, RegisterOptions,
  LoadFileOptions, LoadResult,
  PackageCache, PackageInfo,
  CommandCallback, CommandContext, CommandOptions,
  AcceptCallback, AcceptContext, AcceptOptions,
  HandlerCallback, HandlerContext, HandlerOptions,
  ButtonCallback, ButtonContext, ButtonOptions,
  TaskCallback, TaskOptions,
} from './types'
