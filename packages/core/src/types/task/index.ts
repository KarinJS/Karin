/**
 * 任务类型枚举
 * - install: 安装
 * - uninstall: 卸载
 * - update: 更新
 */
export type TaskType = 'install' | 'uninstall' | 'update'

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
 * Spawn命令配置接口
 */
export interface SpawnConfig {
  /** spawn命令 */
  cmd: string
  /** spawn参数数组 */
  args: string[]
  /** 工作目录 */
  cwd?: string
}

/**
 * 命令配置接口(内部使用)
 */
export interface CommandConfig {
  /** spawn命令 */
  command: string
  /** spawn参数 */
  args: string[]
  /** 工作目录 */
  cwd?: string
}

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
  /** 任务状态 */
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
  /** 命令配置(JSON) */
  command?: string
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
  /** 操作者IP */
  operatorIp: string
  /** 创建时间戳 */
  createTime?: number
  /** spawn命令配置 */
  spawn: SpawnConfig
  /** 工作目录(可选，也可以在spawn中指定) */
  cwd?: string
}

/**
 * 任务回调函数接口
 */
export interface TaskCallbacks {
  /** 状态变更回调 */
  onStatusChange?: (status: TaskStatus) => void
  /** 日志更新回调 */
  onLogUpdate?: (log: string) => void
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
