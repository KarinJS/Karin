/**
 * 插件加载器模块
 * @description 统一导出所有类型的插件加载器
 */
import { store, missingDeps, packageList } from './store'
import { emitter } from '@karinjs/events'
import { PluginsLoaderNpm, PluginsLoaderDev, PluginsLoaderApps, printRegistryStatus, engines } from './core'
import { createAppsHMR } from './hot'

import type { AppsHMROptions } from './hot'

/** apps 热更新实例 */
let appsHMRInstance: ReturnType<typeof createAppsHMR> | null = null

/**
 * 插件加载器工厂
 * @note git 类型已在 v11 移除，HMR 复杂度过高
 */
export const pluginLoader = {
  /**
   * 运行所有插件加载器
   */
  run: async () => {
    return Promise.all([
      new PluginsLoaderNpm().init(),
      new PluginsLoaderDev().init(),
      new PluginsLoaderApps().init(),
    ]).finally(() => {
      emitter.emit('plugin:load:done')
      pluginLoader.sort()
      printRegistryStatus()
      engines.print()
      missingDeps.printReport()
    })
  },
  /**
   * 排序 - 标记所有类型需要重新排序
   */
  sort: async () => {
    store.markDirty('accept')
    store.markDirty('button')
    store.markDirty('command')
    store.markDirty('handler')
    store.markDirty('task')
  },
  /**
   * 启动 apps 类型热更新
   * @description 监听 apps 插件目录变化，自动重载
   * @param options - 热更新选项（可选，默认监听所有 apps 包目录）
   * @returns apps 热更新管理器实例
   *
   * @example
   * ```ts
   * // 使用默认配置（监听所有 apps 包）
   * const hmr = pluginLoader.startAppsHMR()
   *
   * // 自定义配置
   * const hmr = pluginLoader.startAppsHMR({
   *   paths: ['./plugins/my-plugin'],
   *   debounce: 200
   * })
   *
   * // 监听事件
   * hmr.on('reload', ({ file }) => console.log('Reloaded:', file))
   * ```
   */
  startAppsHMR: (options?: Partial<AppsHMROptions>) => {
    // 如果已有实例，先停止
    if (appsHMRInstance?.isRunning) {
      appsHMRInstance.stop()
    }

    // 获取所有 apps 包的目录
    const appsPaths = options?.paths ?? packageList.get('apps').map(pkg => pkg.abs)

    if (appsPaths.length === 0) {
      if (typeof logger !== 'undefined') {
        logger.warn('[pluginLoader] 没有找到 apps 包，无法启动热更新')
      }
      return null
    }

    appsHMRInstance = createAppsHMR({
      paths: appsPaths,
      debounce: options?.debounce ?? 100,
      logLevel: options?.logLevel ?? 'info',
      cwd: options?.cwd,
      ignored: options?.ignored,
    })

    // 监听重载事件，自动排序
    appsHMRInstance.on('reload', () => {
      pluginLoader.sort()
    })

    appsHMRInstance.start()
    return appsHMRInstance
  },
  /**
   * 停止 apps 类型热更新
   */
  stopAppsHMR: async () => {
    if (appsHMRInstance) {
      await appsHMRInstance.stop()
      appsHMRInstance = null
    }
  },
  /**
   * 获取当前 apps 热更新实例
   */
  getAppsHMR: () => appsHMRInstance,
}

// ==================== 创建插件 API ====================

export {
  accept,
  button,
  command,
  handler,
  task,
  cmd,
  ctx,
} from './create'

// ==================== 核心模块 ====================

/** 统一存储 */
export {
  store,
  hotCache,
  missingDeps,
  packageList,
  envManager,
  engineSettings,
  publicManager,
} from './store'

/** 包注册表 */
export { pkgRegistry } from './pkg'

/** 热重载 */
export { hmr, clearModuleCaches, findDependentModules, createAppsHMR, reloadAppsFile } from './hot'

// ==================== 响应式插件 ====================

/** 响应式命令插件 */
export { ref, isRef, unref } from './reactive'

// ==================== 生命周期 ====================

export { onLoad, onUnload, onReload } from './lifecycle'

// ==================== 开发工具 ====================

export { dev, snapshot, printReport, listPlugins } from './dev'

// ==================== 配置 ====================

export { defineKarinConfig, defineWebConfig } from './config'

// ==================== 包查找 ====================

export { packageFinder } from './package'
export { parsePluginMetadata } from './core/metadata'

// ==================== 类型导出 ====================

export type {
  PluginType,
  Store,
  StoreEvents,
  AnyPlugin,
  HotCacheStats,
  DedupedMissingDeps,
  PkgType,
  PackageListItem,
  PackageListManager,
  EnvItem,
  PackageEnv,
  EnvConfig,
  EnvManager,
  PluginEngines,
  EngineSettingsManager,
  PublicDir,
  PublicManager,
} from './store'
export type { HMROptions, HMREvents, FileChangeEvent, AppsHMROptions, AppsHMREvents } from './hot'
export type { RefPlugin, RefCommand } from './reactive'
export type { LifecycleHook } from './lifecycle'
export type { DefineConfigWeb, DefineConfig, PluginMeta } from './config'
export type { PluginsTypes, PkgEnv, Package, PackageKarin, PkgData } from './package'
export type { CreateAccept, CreateButton, CreateCommand, CreateHandler, CreateTask, CmdBuilder } from './create'
