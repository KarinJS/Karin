/**
 * @karinjs/api-types
 *
 * 前后端共用的 API 类型定义包。
 * 包含请求/响应类型、HTTP 状态码、认证类型、配置接口类型、插件接口类型等。
 */

// 标准响应格式
export type {
  ApiResponse,
  PaginationParams,
  PaginatedData,
  PaginatedResponse,
} from './response'

// HTTP 状态码
export { HTTPStatusCode } from './status'
export type { HTTPStatusCode as HTTPStatusCodeType } from './status'

// 认证相关
export type {
  LoginRequest,
  LoginResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
} from './auth'

// 配置相关
export type {
  SystemConfigType,
  GetSystemConfigRequest,
  SetSystemConfigRequest,
  GetPluginWebConfigRequest,
  SetPluginWebConfigRequest,
} from './config'

// 插件相关
export type {
  PluginType,
  PluginInfo,
  InstallPluginRequest,
  UninstallPluginRequest,
  PluginUpdateInfo,
  UpdatePluginRequest,
} from './plugin'
