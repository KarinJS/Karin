/** JWT验证基础接口 */
export interface JwtVerifyBase {
  /** 状态码 */
  status: number
  /** 返回数据 */
  data: string
}

/** 鉴权成功 */
export interface JwtVerifySuccess extends JwtVerifyBase {
  status: 200
  /** 用户id */
  data: string
}

/** 鉴权失败 */
export interface JwtVerifyUnauthorized extends JwtVerifyBase {
  status: 401
  /** 错误信息 */
  data: string
}

/** 令牌过期 */
export interface JwtVerifyExpired extends JwtVerifyBase {
  status: 419
  /** 错误信息 */
  data: string
}

/** 服务器错误 */
export interface JwtVerifyError extends JwtVerifyBase {
  status: 500
  /** 错误信息 */
  data: string
}

/** JWT验证返回类型 */
export type JwtVerifyResult =
  | JwtVerifySuccess
  | JwtVerifyUnauthorized
  | JwtVerifyExpired
  | JwtVerifyError
