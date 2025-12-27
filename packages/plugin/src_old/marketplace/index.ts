/**
 * 插件市场模块
 * @description 提供插件市场、升级和列表管理功能
 */

import { getPluginMarket } from './market'
import { isNpmPlugin } from './list'
import {
  checkNpmUpdate,
  getNpmPackageVersion,
  updateNpmPackage,
  updateNpmPackages,
} from './upgrade'

/**
 * 插件市场管理器 - 统一的市场 API
 */
export const MarketManager = {
  /**
   * 获取插件市场信息
   */
  getMarket: getPluginMarket,

  /**
   * 检查是否为 npm 插件
   * @param pkgName - 包名
   */
  isNpmPlugin,

  /**
   * 检查 npm 更新
   * @param pkgName - 包名
   */
  checkUpdate: checkNpmUpdate,

  /**
   * 获取 npm 包版本
   * @param pkgName - 包名
   */
  getVersion: getNpmPackageVersion,

  /**
   * 更新单个 npm 包
   * @param pkgName - 包名
   */
  updatePackage: updateNpmPackage,

  /**
   * 批量更新 npm 包
   * @param pkgNames - 包名数组
   */
  updatePackages: updateNpmPackages,
}
