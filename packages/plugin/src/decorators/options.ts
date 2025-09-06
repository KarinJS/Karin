import type { Permission, AdapterProtocol } from '@karinjs/adapter'

/**
 * 快速构建选项父类
 */
export interface OptionsBase {
  /** 插件名称 */
  name?: string
  /** 是否启用日志 */
  log?: boolean
  /** 权限 默认`all` */
  perm?: Permission
  /** 优先级 默认`10000` */
  rank?: number
  /** 生效的适配器 */
  adapter?: AdapterProtocol[]
  /** 禁用的适配器 */
  dsbAdapter?: AdapterProtocol[]
  /**
   * 权限
   * @default 'all'
   */
  permission?: Permission
  /**
   * 插件优先级 数字越小优先级越高
   * @default 10000
   */
  priority?: number
  /**
   * 禁用的适配器
   * @deprecated 已废弃 请使用`dsbAdapter`
   */
  notAdapter?: AdapterProtocol[]
}
