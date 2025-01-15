import type { PkgInfo, PluginFile } from './base'

/** handler类型 */
export interface Handler {
  /** 插件包基本属性 */
  pkg: PkgInfo
  /** 插件方法基本属性 */
  file: PluginFile<'handler'>
  /** 优先级 */
  priority: number
  /** 入口key */
  key: string
  /** handler的处理方法 */
  fnc: (
    /** 自定义参数 由调用方传递 */
    args: { [key: string]: any },
    /** 调用后将继续执行下一个handler */
    next: (msg?: string) => void,
  ) => unknown
}
