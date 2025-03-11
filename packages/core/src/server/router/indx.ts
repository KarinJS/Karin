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
  GET_ONLINE_PLUGIN_LIST_ROUTER,
  GET_PLUGIN_LIST_ROUTER,
  GET_PLUGIN_APPS_ROUTER,
  GET_PLUGIN_FILE_ROUTER,
  GET_UPDATABLE_PLUGINS_ROUTER,
  BATCH_UPDATE_PLUGINS_ROUTER,
  GET_PLUGIN_CONFIG_ROUTER,
  SAVE_PLUGIN_CONFIG_ROUTER,
  IS_PLUGIN_CONFIG_EXIST_ROUTER,
  UPDATE_PLUGIN_ROUTER,
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
} from './router'
import { logMiddleware } from '../log'
import { authMiddleware } from '../auth/middleware'
import { loginRouter } from '../auth/login'
import { refreshRouter } from '../auth/refresh'
import { getConfig, saveConfig } from '../config'
import { pingRouter } from '../system/ping'
import { pluginUpdate } from '../plugins/admin'
import { handlePluginFile } from '../plugins/file'
import { pluginGetLocalList } from '../plugins/local'
import { consoleRouter } from '../console'
import { getBotsRouter } from '../system/botList'
import { updateCoreRouter } from '../system/update'
import { networkStatusRouter } from '../system/network'
import { exitRouter, restartRouter } from '../system/manage'
import {
  infoRouter,
  statusRouter,
  systemStatusRealTimeHandler
} from '../system/info'
import {
  getLogFileListRouter,
  getLogFileRouter,
  getLogRouter, logLevelRouter
} from '../log/getLog'
import {
  getOnlinePluginList,
  getPluginListRouter,
  getPluginApps,
  getUpdatablePlugins,
  batchUpdatePlugins,
} from '../plugins'
import {
  pluginGetConfig,
  pluginIsConfigExist,
  pluginSaveConfig
} from '../plugins/config'
import {
  pluginGetTaskList,
  pluginGetTaskStatus,
  pluginInstall,
  pluginUninstall,
  pluginUpdateTaskStatus
} from '../plugins/install'
import {
  createTerminalHandler,
  getTerminalListHandler,
  closeTerminalHandler
} from '../pty'
import { checkPlugin } from '../system/check'
import { getWebuiPluginList, installWebui, uninstallWebui } from '../plugins/webui'

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

/** 获取在线插件列表 */
router.post(GET_ONLINE_PLUGIN_LIST_ROUTER, getOnlinePluginList)
/** 获取插件列表 */
router.post(GET_PLUGIN_LIST_ROUTER, getPluginListRouter)
/** 获取插件应用 */
router.post(GET_PLUGIN_APPS_ROUTER, getPluginApps)
/** 获取插件文件 */
router.post(GET_PLUGIN_FILE_ROUTER, handlePluginFile)
/** 获取可更新插件 */
router.post(GET_UPDATABLE_PLUGINS_ROUTER, getUpdatablePlugins)
/** 批量更新插件 */
router.post(BATCH_UPDATE_PLUGINS_ROUTER, batchUpdatePlugins)
/** 获取插件配置 */
router.post(GET_PLUGIN_CONFIG_ROUTER, pluginGetConfig)
/** 保存插件配置 */
router.post(SAVE_PLUGIN_CONFIG_ROUTER, pluginSaveConfig)
/** 判断插件配置是否存在 */
router.post(IS_PLUGIN_CONFIG_EXIST_ROUTER, pluginIsConfigExist)
/** 更新插件 */
router.post(UPDATE_PLUGIN_ROUTER, pluginUpdate)
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
/** 获取本地插件列表 */
router.post(GET_LOCAL_PLUGIN_LIST_ROUTER, pluginGetLocalList)

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
