/**
 * 配置相关 API 类型
 *
 * 定义配置接口的请求/响应类型。
 * 具体的配置数据结构（如 ConfigServer、ConfigLogger 等）
 * 由 @karinjs/config 包提供，此处仅定义 API 层的类型。
 */

// ===================== 配置读取 =====================

/**
 * 系统配置类型标识
 *
 * 用于 /v2/config/system 接口的 type 参数。
 */
export type SystemConfigType =
  | 'config'
  | 'adapter'
  | 'groups'
  | 'privates'
  | 'render'
  | 'redis'
  | 'pm2'
  | 'env'

/** 获取系统配置请求参数 */
export interface GetSystemConfigRequest {
  /** 配置类型 */
  type: SystemConfigType
}

/** 设置系统配置请求参数 */
export interface SetSystemConfigRequest {
  /** 配置类型 */
  type: SystemConfigType
  /** 配置数据 */
  data: unknown
}

// ===================== 插件配置 =====================

/** 获取插件 web 配置请求参数 */
export interface GetPluginWebConfigRequest {
  /** 插件名称 */
  name: string
}

/** 设置插件 web 配置请求参数 */
export interface SetPluginWebConfigRequest {
  /** 插件名称 */
  name: string
  /** 配置数据 */
  data: unknown
}
