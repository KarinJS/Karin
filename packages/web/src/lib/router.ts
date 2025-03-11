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
