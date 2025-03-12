const createRouter = (path: string) => {
  return `/api/v1${path}`
}

/** 获取系统状态 */
export const GET_SYSTEM_STATUS_ROUTER = createRouter('/status/karin')
/** 检查是否安装了指定的npm包 */
export const CHECK_PLUGIN_ROUTER = createRouter('/system/check/plugin')

/** 创建终端路由 */
export const CREATE_TERMINAL_ROUTER = createRouter('/terminal/create')
/** 获取终端列表路由 */
export const GET_TERMINAL_LIST_ROUTER = createRouter('/terminal/list')
/** 关闭终端路由 */
export const CLOSE_TERMINAL_ROUTER = createRouter('/terminal/close/')

/** 获取webui插件列表路由 */
export const GET_WEBUI_PLUGIN_LIST_ROUTER = createRouter('/plugin/webui/list')
/** 安装webui插件路由 */
export const INSTALL_WEBUI_PLUGIN_ROUTER = createRouter('/plugin/webui/install')
/** 卸载webui插件路由 */
export const UNINSTALL_WEBUI_PLUGIN_ROUTER = createRouter('/plugin/webui/uninstall')

/** 获取webui插件版本列表路由 */
export const GET_WEBUI_PLUGIN_VERSIONS_ROUTER = createRouter('/plugin/webui/versions')
/** 更新webui插件到指定版本路由 */
export const UPDATE_WEBUI_PLUGIN_VERSION_ROUTER = createRouter('/plugin/webui/update-version')
