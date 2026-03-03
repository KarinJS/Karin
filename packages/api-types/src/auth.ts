/**
 * 认证相关 API 类型
 */

// ===================== 登录 =====================

/** 登录请求参数 */
export interface LoginRequest {
  /** 用户名 */
  username: string
  /** 密码 */
  password: string
}

/** 登录响应数据 */
export interface LoginResponse {
  /** 访问令牌（短期有效） */
  token: string
  /** 刷新令牌（长期有效，用于续期） */
  refreshToken?: string
}

// ===================== 令牌刷新 =====================

/** 刷新令牌请求参数 */
export interface RefreshTokenRequest {
  /** 刷新令牌 */
  refreshToken: string
}

/** 刷新令牌响应数据 */
export interface RefreshTokenResponse {
  /** 新的访问令牌 */
  token: string
  /** 新的刷新令牌（可选，轮换策略） */
  refreshToken?: string
}
