import type { Permission, AdapterProtocol } from '@karinjs/adapter'

/**
 * 格式化正则表达式
 * @param reg 正则表达式
 * @returns 格式化后的正则表达式
 */
export const formatReg = (reg: string | RegExp): RegExp => {
  return reg instanceof RegExp ? reg : new RegExp(reg)
}

/**
 * 快速构建选项父类
 */
export interface OptionsBase {
  /** 插件名称 */
  name?: string
  /**
   * 是否启用日志
   * @description 在2.0开始 将强制启用日志
   * @deprecated 此字段废弃
   */
  log?: boolean
  /** 权限 默认`all` */
  perm?: Permission
  /**
   * 优先级
   * - 数字越小优先级越高
   * - 默认值：`10000`
   *
   * @description `priority` 别名
   * @default 10000
   */
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
   * 插件优先级
   * - 数字越小优先级越高
   * - 默认值：`10000`
   * - 高优先级：`1-1000`
   * - 中优先级：`1000-10000`
   * - 低优先级：`10000+`
   *
   * @default 10000
   *
   * @example
   * ```ts
   * // 高优先级插件（优先执行）
   * { priority: 100 }
   *
   * // 默认优先级
   * { priority: 10000 }
   * // 或不指定
   * { }
   *
   * // 低优先级插件（最后执行）
   * { priority: 20000 }
   * ```
   */
  priority?: number
  /**
   * 禁用的适配器
   * @deprecated 已废弃 请使用`dsbAdapter`
   */
  notAdapter?: AdapterProtocol[]
}
