/** 基本路由 */
const BASE_ROUTER = '/api/v1'

/** 请求api */
export const api = {
  /** 基本路由 */
  base: BASE_ROUTER,
  /** 获取依赖列表 POST */
  getDependencies: `${BASE_ROUTER}/dependencies/list`,
  /** 依赖管理 POST */
  manageDependencies: `${BASE_ROUTER}/dependencies/manage`,
  /** 获取.npmrc文件列表 POST */
  getNpmrcList: `${BASE_ROUTER}/dependencies/npmrc/list`,
  /** 获取.npmrc文件内容 POST */
  getNpmrcContent: `${BASE_ROUTER}/dependencies/npmrc/get`,
  /** 获取npm registry、proxy、https-proxy配置 POST */
  getNpmBaseConfig: `${BASE_ROUTER}/dependencies/npm/base`,
  /** 保存npmrc文件 POST */
  saveNpmrc: `${BASE_ROUTER}/dependencies/npmrc/save`,
  /** 执行任务 GET */
  runTask: `${BASE_ROUTER}/task/run`,
  /** 获取任务列表 POST */
  getTaskList: `${BASE_ROUTER}/task/list`,
  /** 获取任务日志 POST */
  getTaskLogs: `${BASE_ROUTER}/task/logs`,
  /** 删除任务记录 POST */
  deleteTaskRecord: `${BASE_ROUTER}/task/delete_record`,

  /** 插件管理 POST */
  pluginAdmin: `${BASE_ROUTER}/plugin/admin`,
  /** 获取插件管理所需的插件信息列表 POST */
  getPluginListPluginAdmin: `${BASE_ROUTER}/plugin/detail/list`,

  /** 获取karin状态 */
  getKarinStatus: `${BASE_ROUTER}/status/karin`,

  /** @version 1.8.0 获取已加载命令插件缓存信息列表 */
  getLoadedCommandPluginCacheList: `${BASE_ROUTER}/plugin/loaded/command`,
  /** @version 1.8.0 获取插件市场列表 */
  getPluginMarketList: `${BASE_ROUTER}/plugin/market`,

  /** 重启karin */
  restartKarin: `${BASE_ROUTER}/restart`,
  /** @version 1.10.0+ 获取前端已安装插件简约列表 */
  getFrontendInstalledPluginList: `${BASE_ROUTER}/plugin/local/frontend`,
}
