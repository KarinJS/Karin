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
  /** 执行任务 GET */
  runTask: `${BASE_ROUTER}/task/run`,
  /** 获取任务列表 POST */
  getTaskList: `${BASE_ROUTER}/task/list`,
  /** 获取任务日志 POST */
  getTaskLogs: `${BASE_ROUTER}/task/logs`,
  /** 删除任务记录 POST */
  deleteTaskRecord: `${BASE_ROUTER}/task/delete_record`,
}
