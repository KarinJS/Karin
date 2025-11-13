/**
 * 热重载模块
 * @description 提供插件热重载和文件监听功能
 */

import { initPluginHmr, reloadApp, reloadPackage } from './hmr'
import { HMRModule, hmr } from './core'
import { hmrProduction } from './watcher'
import { clearModuleCaches, findDependentModules } from './internal'

/**
 * 热重载管理器 - 统一的 HMR API
 */
export const HMRManager = {
  /**
   * 初始化插件热重载
   */
  init: initPluginHmr,

  /**
   * 重载单个应用文件
   * @param filePath - 文件路径
   */
  reloadApp,

  /**
   * 重载整个插件包
   * @param pkgName - 包名
   */
  reloadPackage,

  /**
   * 生产环境热重载
   */
  production: hmrProduction,

  /**
   * 清除模块缓存
   * @param filePath - 文件路径
   */
  clearModuleCaches,

  /**
   * 查找依赖模块
   * @param filePath - 文件路径
   */
  findDependentModules,

  /**
   * HMR 核心实例
   */
  core: hmr,

  /**
   * HMR 模块类
   */
  Module: HMRModule,
}

/** 导出 HMR 类型 */
export type { HMROptions, EventContext } from './core'
