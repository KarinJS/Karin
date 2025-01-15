import { PkgData } from '@/utils/fs/pkg'
import type { AdapterProtocol } from '../adapter'

/** 插件类型 */
export type Apps = 'app' | 'git' | 'npm'
/** 获取插件的方式 */
export type GetPluginType = 'app' | 'git' | 'npm' | 'all'

/**
 * 插件方法类型
 * - `command` 命令
 * - `accept` 接受通知请求
 * - `task` 定时任务
 * - `button` 按钮
 * - `handler` 处理器
 * - `use` 中间件
 */
export type PluginFncTypes = 'command' | 'accept' | 'task' | 'button' | 'handler' | 'use'

/** 插件包基本属性 */
export interface PkgInfo {
  /**
   * 插件包唯一标识
   */
  id: number
  /**
   * 插件包类型
   * - `app`: 单app
   * - `git`: git仓库
   * - `npm`: npm包
   */
  type: Apps
  /**
   * 插件包名称
   * - `app`: `karin-plugin-example`
   * - `git`: `karin-plugin-memes`
   * - `npm`: `@karinjs/adapter-qqbot`
   */
  name: string
  /**
   * 插件根目录
   * - `app`: `/root/karin/plugins/karin-plugin-example`
   * - `git`: `/root/karin/plugins/karin-plugin-memes`
   * - `npm`: `/root/karin/node_modules/@karinjs/adapter-qqbot`
   */
  dir: string
  /**
   * apps绝对路径列表
   */
  apps: string[]
  /**
   * 所有可能包含apps的目录列表
   */
  allApps: string[]
  /**
  * 获取`package.json`绝对路径
  */
  get pkgPath (): string
  /**
   * 读取`package.json`文件
   */
  get pkgData (): PkgData
}

/** 获取插件返回 */
export type GetPluginReturn<T extends boolean> = T extends true ? PkgInfo[] : string[]

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
   * // 此时`name`为`demo插件` 如果没有，则是`this.type`
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
