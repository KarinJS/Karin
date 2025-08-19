import { PluginInstaller } from './install'
import { PluginUpdater } from './updater'
import { PluginUninstaller } from './uninstall'
import { handleReturn } from './utils'

import type { RequestHandler } from 'express'
import type { PluginAdminParams } from './types'

/**
 * 插件管理路由
 *
 * 处理插件相关的API请求，包括：
 * - 更新插件：更新已安装的插件到最新版本
 * - 卸载插件：移除指定的插件
 * - 安装插件：安装新的插件
 *
 * @param req - 请求对象，包含插件操作类型和相关参数
 * @param res - 响应对象，用于返回操作结果
 * @returns 响应结果
 */
export const pluginAdminRouter: RequestHandler<null, null, PluginAdminParams> = async (req, res) => {
  if (req.body.type === 'uninstall') {
    /**
     * @description 此处的所有api都必须给予响应并且符合以下格式
     * @example
     * ```json
     * {
     *   "success": true,
     *   "message": "卸载成功"
     * }
     *
     * {
     *   "success": false,
     *   "message": "卸载失败"
     * }
     * ```
     */
    await PluginUninstaller.uninstall(res, req.body.name, req.body.target, req.ip!)
    return
  }

  if (req.body.type === 'update') {
    /**
     * @description 此处的所有api都必须给予响应并且符合以下格式
     * @example
     * ```json
     * {
     *   "success": true,
     *   "message": "更新任务已创建",
     *   "taskId": "1234567890"
     * }
     *
     * {
     *   "success": false,
     *   "message": "更新失败"
     * }
     * ```
     */
    await PluginUpdater.update(res, req.body, req.ip!)
    return
  }

  if (req.body.type !== 'install') {
    handleReturn(res, false, '无效请求: 插件类型错误')
    return
  }

  /**
   * @description 此处的所有api都必须给予响应并且符合以下格式
   * @example
   * ```json
   * {
   *   "success": true,
   *   "message": "安装成功"
   * }
   *
   * {
   *   "success": false,
   *   "message": "安装失败"
   * }
   *
   * {
   *   "success": true,
   *   "message": "安装任务已创建",
   *   "taskId": "1234567890"
   * }
   * ```
   */
  await PluginInstaller.install(res, req.body, req.ip!)
}
