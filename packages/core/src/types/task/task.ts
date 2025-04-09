/**
 * 任务类型枚举
 * - install: 安装插件
 * - uninstall: 卸载插件
 * - update: 更新插件
 * - disable: 禁用插件
 * - enable: 启用插件
 */
export type TaskType = 'install' | 'uninstall' | 'update' | 'disable' | 'enable'

/**
 * 任务状态枚举
 * - pending: 待执行
 * - running: 执行中
 * - success: 成功
 * - failed: 失败
 * - canceled: 已取消
 * - timeout: 超时
 */
export type TaskStatus = 'pending' | 'running' | 'success' | 'failed' | 'canceled' | 'timeout'

/**
 * 任务执行器类型
 * @param task - 任务实体
 * @param log - 日志记录函数
 * @returns Promise<boolean> - 执行成功返回true，失败返回false
 */
export type TaskExecutor = (task: TaskEntity, log: (message: string) => void) => Promise<boolean>

/**
 * 任务实体接口
 */
export interface TaskEntity {
  /** 任务唯一标识 */
  id: string
  /** 任务类型 */
  type: TaskType
  /** 任务名称 */
  name: string
  /** 目标(插件名/包名/路径) */
  target: string
  /**
   * 任务状态
   * - pending: 待执行
   * - running: 执行中
   * - success: 成功
   * - failed: 失败
   * - canceled: 已取消
   * - timeout: 超时
   */
  status: TaskStatus
  /** 完整执行日志 */
  logs: string
  /** 操作者IP */
  operatorIp: string
  /** 创建时间戳 */
  createTime: number
  /** 更新时间戳 */
  updateTime: number
  /** 结束时间戳(可选) */
  endTime?: number
}

/**
 * 创建任务参数接口
 */
export interface CreateTaskParams {
  /** 任务类型 */
  type: TaskType
  /** 任务名称 */
  name: string
  /** 目标(插件名/包名/路径) */
  target: string
  /** 操作者IP 无需指定，自动获取 */
  operatorIp: string
  /** 创建时间戳 无需指定，自动获取 */
  createTime?: number
}

/**
 * 任务回调函数接口
 */
export interface TaskCallbacks {
  /** 状态变更回调 */
  onStatusChange?: (status: TaskStatus) => void
}

/**
 * 添加任务返回结果接口
 */
export interface AddTaskResult {
  /** 操作是否成功 */
  success: boolean
  /** 任务ID(成功时返回) */
  taskId?: string
  /** 错误信息(失败时返回) */
  message?: string
  /** 取消订阅函数 */
  unsubscribe?: () => void
}

/**
 * 任务查询过滤器接口
 */
export interface TaskFilter {
  /** 任务类型过滤 */
  type?: TaskType
  /** 任务状态过滤 */
  status?: TaskStatus | TaskStatus[]
  /** 任务名称过滤 */
  name?: string
  /** 操作者IP过滤 */
  operatorIp?: string
  /** 限制获取数量，返回最新的N条记录 */
  limit?: number
}

/**
 * 前端请求插件安装参数接口
 */
export type CreateTask = Omit<CreateTaskParams, 'createTime' | 'operatorIp'>
