/**
 * HTTP 状态码常量
 *
 * 前后端共用，用于统一判断响应状态。
 */
export const HTTPStatusCode = {
  /** 成功 */
  OK: 200,
  /** 请求参数错误 */
  BadRequest: 400,
  /** 未授权（未登录或凭证无效） */
  Unauthorized: 401,
  /** 禁止访问（权限不足） */
  Forbidden: 403,
  /** 资源不存在 */
  NotFound: 404,
  /** 请求方法不允许 */
  MethodNotAllowed: 405,
  /** 请求体过大 */
  PayloadTooLarge: 413,
  /** 访问令牌已过期 */
  AccessTokenExpired: 419,
  /** 刷新令牌已过期，需要重新登录 */
  RefreshTokenExpired: 420,
  /** 服务器内部错误 */
  InternalServerError: 500,
} as const

/** HTTP 状态码类型 */
export type HTTPStatusCode = typeof HTTPStatusCode[keyof typeof HTTPStatusCode]
