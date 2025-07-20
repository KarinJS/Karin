import { PkgData } from '@/utils/fs/pkg'
import type { AdapterProtocol } from '../adapter'
import type { PluginPackageType } from '@/core/karin/base'

export { PluginPackageType }
/** 获取插件的方式 */
export type GetPluginType = PluginPackageType | 'all'

/**
 * 插件方法类型
 * - `command` 命令
 * - `accept` 接受通知请求
 * - `task` 定时任务
 * - `button` 按钮
 * - `handler` 处理器
 */
export type PluginFncTypes = 'command' | 'accept' | 'task' | 'button' | 'handler'

/** 单个方法基本属性 */
export interface PluginFile<T extends PluginFncTypes> {
  /** app绝对路径 */
  absPath: string
  /** app目录：`/root/karin/plugins/karin-plugin-example` */
  get dirname (): string
  /** app文件名：`index.ts` `index.js` */
  get basename (): string
  /**
   * 插件方法类型
   * - `accept`
   * - `command`
   * - `task`
   * - `button`
   * - `handler`
   * - `middleware` */
  type: T,
  /**
   * 插件方法名称
   * @example
   * ```ts
   * import karin from 'node-karin'
   *
   * export const fnc = karin.command('你好', 'hello', { name: 'demo插件' })
   * // 此时`method`为`fnc` 也就是导出的方法名称
   * ```
   */
  method: string
  /**
   * app名称
   * @example
   * ```ts
   * import karin from 'node-karin'
   *
   * export const fnc = karin.command('你好', 'hello', { name: 'demo插件' })
   * // 此时`name`为`demo插件` 如果没有，则是`this.method`
   * ```
   */
  name: string
}

/** 适配器参数 */
export interface AdapterOptions {
  /** 适配器 */
  adapter: AdapterProtocol[]
  /** 禁用的适配器 */
  dsbAdapter: AdapterProtocol[]
}

/**
 * 日志方法
 * @param T 是否为bot专属日志方法
 */
export type Log<T extends boolean> = T extends true
  ? (id: string, log: string) => void
  : (log: string) => void
