/** 登录路由 */
export const LOGIN_ROUTER = '/login'
/** 刷新令牌路由 */
export const REFRESH_ROUTER = '/refresh'
/** 获取系统配置路由 */
export const GET_CONFIG_ROUTER = '/config/new/get'
/** 保存系统配置路由 */
export const SAVE_CONFIG_ROUTER = '/config/new/save'
/** 获取日志路由 */
export const GET_LOG_ROUTER = '/log'
/** 设置日志等级路由 */
export const SET_LOG_LEVEL_ROUTER = '/logs/level'
/** 获取日志文件列表路由 */
export const GET_LOG_FILE_LIST_ROUTER = '/logs/list'
/** 获取指定日志文件路由 */
export const GET_LOG_FILE_ROUTER = '/logs/file'
/** 退出karin路由 */
export const EXIT_ROUTER = '/exit'
/** 重启karin路由 */
export const RESTART_ROUTER = '/restart'
/** 获取网络状态路由 */
export const GET_NETWORK_STATUS_ROUTER = '/system/get/network'
/** 更新karin路由 */
export const UPDATE_CORE_ROUTER = '/system/update'
/** 获取所有bot列表路由 */
export const GET_BOTS_ROUTER = '/system/get/bots'
/** console适配器路由 */
export const CONSOLE_ROUTER = '/console/*'
/** ping路由 */
export const PING_ROUTER = '/ping'
/** 系统状态路由 */
export const SYSTEM_STATUS_ROUTER = '/status/system'
/** 系统信息路由 */
export const SYSTEM_INFO_ROUTER = '/info'
/** 系统ws连接 */
export const SYSTEM_STATUS_WS_ROUTER = '/status/ws'
/** karin状态 */
export const SYSTEM_STATUS_KARIN_ROUTER = '/status/karin'
/** 获取在线插件列表 */
export const GET_ONLINE_PLUGIN_LIST_ROUTER = '/plugin/index'
/** 获取插件列表 */
export const GET_PLUGIN_LIST_ROUTER = '/plugin/list'
/** 获取插件应用 */
export const GET_PLUGIN_APPS_ROUTER = '/plugin/apps'
/** 获取插件文件 */
export const GET_PLUGIN_FILE_ROUTER = '/plugin/file'
/** 获取可更新插件 */
export const GET_UPDATABLE_PLUGINS_ROUTER = '/plugin/updates'
/** 批量更新插件 */
export const BATCH_UPDATE_PLUGINS_ROUTER = '/plugin/update/batch'
/** 获取插件配置 */
export const GET_PLUGIN_CONFIG_ROUTER = '/plugin/config/get'
/** 保存插件配置 */
export const SAVE_PLUGIN_CONFIG_ROUTER = '/plugin/config/save'
/** 判断插件配置是否存在 */
export const IS_PLUGIN_CONFIG_EXIST_ROUTER = '/plugin/config/is-exist'
/** 更新插件 */
export const UPDATE_PLUGIN_ROUTER = '/plugin/update'
/** 安装插件 */
export const INSTALL_PLUGIN_ROUTER = '/plugin/install'
/** 卸载插件 */
export const UNINSTALL_PLUGIN_ROUTER = '/plugin/uninstall'
/** 获取任务状态 */
export const GET_TASK_STATUS_ROUTER = '/plugin/task'
/** 获取任务列表 */
export const GET_TASK_LIST_ROUTER = '/plugin/task/list'
/** 更新任务状态 */
export const UPDATE_TASK_STATUS_ROUTER = '/plugin/task/status'
/** 获取本地插件列表 */
export const GET_LOCAL_PLUGIN_LIST_ROUTER = '/plugin/local'
