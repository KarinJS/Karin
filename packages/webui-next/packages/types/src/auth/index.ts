/**
 * 登录请求负载。
 */
export interface LoginRequest {
  /**
   * 后端配置的共享 HTTP 认证密钥。
   */
  key: string;
}

/**
 * 登录响应负载。
 */
export interface LoginResponse {
  /**
   * 后续请求使用的访问令牌。
   */
  token: string;
  /**
   * 令牌过期时间，单位为秒。
   */
  expiresIn: number;
}

/**
 * 刷新令牌请求负载。
 */
export interface RefreshTokenRequest {
  /**
   * 当前的访问令牌。
   */
  token: string;
}

/**
 * 刷新令牌响应负载。
 */
export interface RefreshTokenResponse {
  /**
   * 新签发的访问令牌。
   */
  token: string;
  /**
   * 令牌过期时间，单位为秒。
   */
  expiresIn: number;
}

/**
 * 可用的用户角色。
 */
export type UserRole = 'admin' | 'user' | 'guest';

/**
 * 已认证的用户信息。
 */
export interface UserInfo {
  /**
   * 唯一用户标识符。
   */
  id: string;
  /**
   * 在 UI 中显示的用户名。
   */
  username: string;
  /**
   * 用户电子邮箱地址。
   */
  email: string;
  /**
   * 头像 URL。
   */
  avatarUrl: string;
  /**
   * 用户角色。
   */
  role: UserRole;
  /**
   * 用户创建时间戳，单位为毫秒。
   */
  createdAt: number;
}
