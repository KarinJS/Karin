/**
 * API 响应通用格式
 */
export interface ApiResponse<T = unknown> {
  /** 请求是否成功 */
  ok: boolean
  /** HTTP 状态码 */
  code: number
  /** 响应数据 */
  data: T | null
  /** 响应消息 */
  message: string
}

/**
 * HTTP 状态码
 */
export const HTTPStatusCode = {
  /** 成功 */
  OK: 200,
  /** 请求错误 */
  BadRequest: 400,
  /** 未授权 */
  Unauthorized: 401,
  /** 禁止访问 */
  Forbidden: 403,
  /** 未找到 */
  NotFound: 404,
  /** 方法不允许 */
  MethodNotAllowed: 405,
  /** 请求体过大 */
  PayloadTooLarge: 413,
  /** 服务器错误 */
  InternalServerError: 500,
  /** 访问令牌已过期 */
  AccessTokenExpired: 419,
  /** 刷新令牌已过期 */
  RefreshTokenExpired: 420,
} as const

export type HTTPStatusCode = typeof HTTPStatusCode[keyof typeof HTTPStatusCode]

// ============== 从后端包导入配置类型 ==============
// 利用 pnpm 工作区优势，直接从 @karinjs/config 导入类型
export type {
  ConfigPermissions,
  ConfigServer,
  ConfigServerHttp,
  ConfigServerWs,
  ConfigServerFfmpeg,
  ConfigLogger,
  ConfigRedis,
  ConfigPm2,
  ConfigFilter,
  ConfigGroup,
  ConfigFriend,
  ConfigDirect,
  ConfigGuild,
} from '@karinjs/config'

// ============== 统计相关类型 ==============

/**
 * 统计数据项
 */
export interface StatItem {
  title: string
  value: string
  change: string
  trend: 'up' | 'down'
}

// ============== 日志相关类型 ==============

/**
 * 日志条目
 */
export interface LogEntry {
  id: number
  level: 'info' | 'warn' | 'error' | 'debug'
  message: string
  timestamp: string
}
