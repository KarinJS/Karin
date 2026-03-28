import express, { Router } from 'express'
import {
  LOGIN_ROUTER,
  REFRESH_ROUTER,
  GET_CONFIG_ROUTER,
  SAVE_CONFIG_ROUTER,
  GET_LOG_ROUTER,
  SET_LOG_LEVEL_ROUTER,
  GET_LOG_FILE_LIST_ROUTER,
  GET_LOG_FILE_ROUTER,
  EXIT_ROUTER,
  RESTART_ROUTER,
  GET_NETWORK_STATUS_ROUTER,
  UPDATE_CORE_ROUTER,
  GET_BOTS_ROUTER,
  CONSOLE_ROUTER,
  SYSTEM_STATUS_WS_ROUTER,
  PING_ROUTER,
  SYSTEM_STATUS_KARIN_ROUTER,
  SYSTEM_STATUS_ROUTER,
  GET_PLUGIN_CONFIG_ROUTER,
  SAVE_PLUGIN_CONFIG_ROUTER,
  IS_PLUGIN_CONFIG_EXIST_ROUTER,
  PLUGIN_ADMIN_ROUTER,
  INSTALL_PLUGIN_ROUTER,
  UNINSTALL_PLUGIN_ROUTER,
  GET_TASK_STATUS_ROUTER,
  GET_TASK_LIST_ROUTER,
  UPDATE_TASK_STATUS_ROUTER,
  GET_LOCAL_PLUGIN_LIST_ROUTER,
  CREATE_TERMINAL_ROUTER,
  GET_TERMINAL_LIST_ROUTER,
  CLOSE_TERMINAL_ROUTER,
  CHECK_PLUGIN_ROUTER,
  INSTALL_WEBUI_PLUGIN_ROUTER,
  GET_WEBUI_PLUGIN_LIST_ROUTER,
  UNINSTALL_WEBUI_PLUGIN_ROUTER,
  GET_WEBUI_PLUGIN_VERSIONS_ROUTER,
  UPDATE_WEBUI_PLUGIN_VERSION_ROUTER,
  GET_DEPENDENCIES_LIST_ROUTER,
  MANAGE_DEPENDENCIES_ROUTER,
  TASK_LIST_ROUTER,
  TASK_RUN_ROUTER,
  TASK_LOGS_ROUTER,
  TASK_DELETE_ROUTER,
  GET_NPMRC_LIST_ROUTER,
  GET_NPM_CONFIG_ROUTER,
  GET_NPM_BASE_CONFIG_ROUTER,
  SAVE_NPMRC_ROUTER,
  GET_PLUGIN_LIST_PLUGIN_ADMIN_ROUTER,
  GET_LOADED_COMMAND_PLUGIN_CACHE_LIST_ROUTER,
  GET_PLUGIN_MARKET_LIST_ROUTER,
  GET_LOCAL_PLUGIN_FRONTEND_LIST_ROUTER,
  // 2.0 WebUI 路由
  WEBUI2_LOGIN_ROUTER,
  WEBUI2_REFRESH_TOKEN_ROUTER,
  WEBUI2_DASHBOARD_TREND_ROUTER,
  WEBUI2_DASHBOARD_REALTIME_STREAM_ROUTER,
  WEBUI2_LOGS_STREAM_ROUTER,
  WEBUI2_FILES_LIST_ROUTER,
  WEBUI2_FILES_CONTENT_ROUTER,
  WEBUI2_FILES_DELETE_ROUTER,
  WEBUI2_FILES_SAVE_ROUTER,
  WEBUI2_FILES_DIRECTORY_SIZE_ROUTER,
  WEBUI2_FILES_SELECTION_SIZE_ROUTER,
  WEBUI2_FILES_DELETE_SELECTION_ROUTER,
  WEBUI2_FILES_RENAME_ROUTER,
  WEBUI2_FILES_COPY_ROUTER,
  WEBUI2_FILES_PASTE_ROUTER,
  WEBUI2_PLUGINS_STORE_LIST_ROUTER,
  WEBUI2_PLUGINS_STORE_DETAIL_ROUTER,
} from './router'
import { logMiddleware } from '../log'
import { authMiddleware } from '../auth/middleware'
import { loginRouter } from '../auth/login'
import { refreshRouter } from '../auth/refresh'
import { getConfig, saveConfig } from '../config'
import { pingRouter } from '../system/ping'
import { pluginGetLocalList } from '../plugins/local'
import { consoleRouter } from '../console'
import { getBotsRouter } from '../system/botList'
import { updateCoreRouter } from '../system/update'
import { networkStatusRouter } from '../system/network'
import { exitRouter, restartRouter } from '../system/manage'
import {
  infoRouter,
  statusRouter,
  systemStatusRealTimeHandler,
} from '../system/info'
import {
  getLogFileListRouter,
  getLogFileRouter,
  getLogRouter, logLevelRouter,
} from '../log/getLog'
import {
  pluginGetConfig,
  pluginIsConfigExist,
  pluginSaveConfig,
} from '../plugins/config'
import {
  pluginGetTaskList,
  pluginGetTaskStatus,
  pluginInstall,
  pluginUninstall,
  pluginUpdateTaskStatus,
} from '../plugins/install'
import {
  createTerminalHandler,
  getTerminalListHandler,
  closeTerminalHandler,
} from '../pty'
import { checkPlugin } from '../system/check'
import {
  getWebuiPluginList,
  installWebui,
  uninstallWebui,
  getWebuiPluginVersions,
  updateWebuiPluginVersion,
} from '../plugins/webui'
import { pluginAdminRouter } from '../plugins/admin/router'
import { getDependenciesListRouter } from '../dependencies/list'
import { manageDependenciesRouter } from '../dependencies/manage'
import { taskListRouter, taskRunRouter, taskLogsRouter, taskDeleteRouter } from '../task/list'
import { getNpmBaseConfigRouter, getNpmrcContentRouter, getNpmrcListRouter, saveNpmrcRouter } from '../dependencies/config'
import { getFrontendInstalledPluginList, getLoadedCommandPluginCacheList, getPluginListPluginAdmin } from '../plugins/detail'
import { getPluginMarketList } from '../plugins/market'
// 2.0 WebUI 兼容接口
import {
  loginRouter as webui2LoginRouter,
  refreshTokenRouter as webui2RefreshTokenRouter,
  verifyTokenMiddleware as webui2VerifyTokenMiddleware,
} from '../webui2/auth'
import {
  getDashboardTrendRouter,
  getDashboardRealtimeStreamRouter,
} from '../webui2/dashboard'
import {
  getLogsStreamRouter,
} from '../webui2/logs'
import {
  getFilesListRouter,
  getFilesContentRouter,
  deleteFileRouter,
  saveFileRouter,
  getDirectorySizeRouter,
  getSelectionSizeRouter,
  deleteSelectionRouter,
  renameFileRouter,
  copyFileRouter,
  pasteFileRouter,
} from '../webui2/files'
import {
  getPluginStoreListRouter,
  getPluginStoreDetailRouter,
} from '../webui2/plugins'

/**
 * karin内部路由
 */
export const router: Router = Router()

/** 日志 */
router.use(logMiddleware)
/** 鉴权 */
router.use(authMiddleware)
/** 解析json */
router.use(express.json())
/** 登录 */
router.post(LOGIN_ROUTER, loginRouter)
/** 刷新令牌 */
router.post(REFRESH_ROUTER, refreshRouter)

/** 获取系统配置 */
router.post(GET_CONFIG_ROUTER, getConfig)
/** 保存系统配置 */
router.post(SAVE_CONFIG_ROUTER, saveConfig)

/** 获取日志 */
router.get(GET_LOG_ROUTER, getLogRouter)
/** 设置日志等级 */
router.get(SET_LOG_LEVEL_ROUTER, logLevelRouter)
/** 获取日志文件列表 */
router.get(GET_LOG_FILE_LIST_ROUTER, getLogFileListRouter)
/** 获取指定日志文件 */
router.get(GET_LOG_FILE_ROUTER, getLogFileRouter)

/** 退出karin */
router.post(EXIT_ROUTER, exitRouter)
/** 重启karin */
router.post(RESTART_ROUTER, restartRouter)

/** 获取网络状态 */
router.get(GET_NETWORK_STATUS_ROUTER, networkStatusRouter)
/** 更新karin */
router.get(UPDATE_CORE_ROUTER, updateCoreRouter)
/** 获取所有bot列表 */
router.get(GET_BOTS_ROUTER, getBotsRouter)

/** console适配器路由 */
router.get(CONSOLE_ROUTER, consoleRouter)
/** 系统ws连接 */
router.get(SYSTEM_STATUS_WS_ROUTER, infoRouter)
/** ping路由 */
router.get(PING_ROUTER, pingRouter)
/** karin状态 */
router.get(SYSTEM_STATUS_KARIN_ROUTER, statusRouter)
/** 系统状态 */
router.get(SYSTEM_STATUS_ROUTER, systemStatusRealTimeHandler)
/** 检查是否安装了指定的npm包 */
router.post(CHECK_PLUGIN_ROUTER, checkPlugin)

/** 获取插件配置 */
router.post(GET_PLUGIN_CONFIG_ROUTER, pluginGetConfig)
/** 保存插件配置 */
router.post(SAVE_PLUGIN_CONFIG_ROUTER, pluginSaveConfig)
/** 判断插件web.config是否存在 */
router.post(IS_PLUGIN_CONFIG_EXIST_ROUTER, pluginIsConfigExist)

/** 插件管理 */
router.post(PLUGIN_ADMIN_ROUTER, pluginAdminRouter)
/** 安装插件 */
router.post(INSTALL_PLUGIN_ROUTER, pluginInstall)
/** 卸载插件 */
router.post(UNINSTALL_PLUGIN_ROUTER, pluginUninstall)
/** 获取任务状态 */
router.post(GET_TASK_STATUS_ROUTER, pluginGetTaskStatus)
/** 获取任务列表 */
router.post(GET_TASK_LIST_ROUTER, pluginGetTaskList)
/** 更新任务状态 */
router.post(UPDATE_TASK_STATUS_ROUTER, pluginUpdateTaskStatus)
/** 获取已安装插件详情 */
router.post(GET_LOCAL_PLUGIN_LIST_ROUTER, pluginGetLocalList)
/** @version 1.8.0 获取已安装插件名称列表 */
router.post(GET_PLUGIN_LIST_PLUGIN_ADMIN_ROUTER, getPluginListPluginAdmin)

/** 创建终端 */
router.post(CREATE_TERMINAL_ROUTER, createTerminalHandler)
/** 获取终端列表 */
router.get(GET_TERMINAL_LIST_ROUTER, getTerminalListHandler)
/** 关闭终端 */
router.post(CLOSE_TERMINAL_ROUTER, closeTerminalHandler)

/** 获取webui插件列表 */
router.get(GET_WEBUI_PLUGIN_LIST_ROUTER, getWebuiPluginList)
/** 安装webui插件 */
router.post(INSTALL_WEBUI_PLUGIN_ROUTER, installWebui)
/** 卸载webui插件 */
router.post(UNINSTALL_WEBUI_PLUGIN_ROUTER, uninstallWebui)

/** 获取webui插件版本 */
router.post(GET_WEBUI_PLUGIN_VERSIONS_ROUTER, getWebuiPluginVersions)
/** 更新webui插件到指定版本 */
router.post(UPDATE_WEBUI_PLUGIN_VERSION_ROUTER, updateWebuiPluginVersion)

/** 获取依赖列表 */
router.post(GET_DEPENDENCIES_LIST_ROUTER, getDependenciesListRouter)
/** 依赖管理（安装/删除） */
router.post(MANAGE_DEPENDENCIES_ROUTER, manageDependenciesRouter)
/** 获取.npmrc文件列表 */
router.post(GET_NPMRC_LIST_ROUTER, getNpmrcListRouter)
/** 获取npm config文件内容 */
router.post(GET_NPM_CONFIG_ROUTER, getNpmrcContentRouter)
/** 获取npm registry、proxy、https-proxy配置 */
router.post(GET_NPM_BASE_CONFIG_ROUTER, getNpmBaseConfigRouter)
/** 保存npmrc文件 */
router.post(SAVE_NPMRC_ROUTER, saveNpmrcRouter)

/** 获取任务列表 */
router.post(TASK_LIST_ROUTER, taskListRouter)
/** 执行任务 */
router.get(TASK_RUN_ROUTER, taskRunRouter)
/** 获取任务日志 */
router.post(TASK_LOGS_ROUTER, taskLogsRouter)
/** 删除任务记录 */
router.post(TASK_DELETE_ROUTER, taskDeleteRouter)

/** @version 1.8.0 获取已加载命令插件缓存信息列表 */
router.post(GET_LOADED_COMMAND_PLUGIN_CACHE_LIST_ROUTER, getLoadedCommandPluginCacheList)
/** @version 1.8.0 获取插件市场列表 */
router.post(GET_PLUGIN_MARKET_LIST_ROUTER, getPluginMarketList)
/** @version 1.8.0 获取本地插件列表 用于插件索引页面渲染简约列表 */
router.post(GET_LOCAL_PLUGIN_FRONTEND_LIST_ROUTER, getFrontendInstalledPluginList)

/**
 * 2.0 WebUI 兼容接口路由注册
 * 这些接口用于支持 2.0 WebUI 的前端设计验证
 * 所有接口都在 /api/v2 路径下
 */

export const v2Router: Router = Router()

// 添加 JSON 中间件，用于解析请求体
v2Router.use(express.json())

/** 2.0 WebUI - 登录 */
v2Router.post(WEBUI2_LOGIN_ROUTER, webui2LoginRouter)
/** 2.0 WebUI - 刷新 Token */
v2Router.post(WEBUI2_REFRESH_TOKEN_ROUTER, webui2RefreshTokenRouter)

/** 2.0 WebUI - 仪表盘趋势 */
v2Router.get(WEBUI2_DASHBOARD_TREND_ROUTER, webui2VerifyTokenMiddleware, getDashboardTrendRouter)
/** 2.0 WebUI - 仪表盘实时流 */
v2Router.get(WEBUI2_DASHBOARD_REALTIME_STREAM_ROUTER, webui2VerifyTokenMiddleware, getDashboardRealtimeStreamRouter)

/** 2.0 WebUI - 日志流 */
v2Router.get(WEBUI2_LOGS_STREAM_ROUTER, webui2VerifyTokenMiddleware, getLogsStreamRouter)

/** 2.0 WebUI - 文件管理 */
const fileBaseDir = process.cwd() // 使用当前工作目录作为文件根目录
v2Router.get(WEBUI2_FILES_LIST_ROUTER, webui2VerifyTokenMiddleware, getFilesListRouter(fileBaseDir))
v2Router.get(WEBUI2_FILES_CONTENT_ROUTER, webui2VerifyTokenMiddleware, getFilesContentRouter(fileBaseDir))
v2Router.post(WEBUI2_FILES_DELETE_ROUTER, webui2VerifyTokenMiddleware, deleteFileRouter())
v2Router.post(WEBUI2_FILES_SAVE_ROUTER, webui2VerifyTokenMiddleware, saveFileRouter())
v2Router.get(WEBUI2_FILES_DIRECTORY_SIZE_ROUTER, webui2VerifyTokenMiddleware, getDirectorySizeRouter(fileBaseDir))
v2Router.post(WEBUI2_FILES_SELECTION_SIZE_ROUTER, webui2VerifyTokenMiddleware, getSelectionSizeRouter(fileBaseDir))
v2Router.post(WEBUI2_FILES_DELETE_SELECTION_ROUTER, webui2VerifyTokenMiddleware, deleteSelectionRouter())
v2Router.post(WEBUI2_FILES_RENAME_ROUTER, webui2VerifyTokenMiddleware, renameFileRouter())
v2Router.post(WEBUI2_FILES_COPY_ROUTER, webui2VerifyTokenMiddleware, copyFileRouter())
v2Router.post(WEBUI2_FILES_PASTE_ROUTER, webui2VerifyTokenMiddleware, pasteFileRouter())

/** 2.0 WebUI - 插件商店 */
v2Router.get(WEBUI2_PLUGINS_STORE_LIST_ROUTER, webui2VerifyTokenMiddleware, getPluginStoreListRouter)
v2Router.get(WEBUI2_PLUGINS_STORE_DETAIL_ROUTER, webui2VerifyTokenMiddleware, getPluginStoreDetailRouter)
