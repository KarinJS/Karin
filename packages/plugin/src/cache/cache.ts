import type { CommandCache } from '../decorators/command'
import type { AcceptCache } from '../decorators/accept'
import type { HandlerCache } from '../decorators/handler'
import type { ButtonCache } from '../decorators/button'
import type { TaskCache } from '../decorators/task'
import type { PluginCacheKeyPkg } from '../decorators/base'

/** 插件包核心缓存 */
export interface PluginCoreCache {
  /** npm 类型插件包列表 */
  npm: string[]
  /** git 类型插件包列表 */
  git: string[]
  /** apps 类型插件包列表 */
  apps: string[]
  /** root 类型插件包列表 */
  root: string[]
}

/** 插件数量统计 */
export interface Count {
  pkg: number
  accept: number
  command: number
  task: number
  button: number
  handler: {
    /** 入口key */
    key: number
    /** handler处理函数 */
    fnc: number
  }
}

/** 插件缓存类型 */
export interface PluginsCache {
  /** 插件数量统计 */
  count: Count
  /** 全部插件包名称列表`(带前缀)` */
  plugins: PluginCoreCache
  /** 分类插件包缓存 */
  pluginsClassified: {
    npm: string[]
    git: string[]
    apps: string[]
    root: string[]
    /** 缓存全部列表避免重复计算 */
    _allCache?: string[]
  }
  /** 全部插件包详细信息`(key不带前缀)` */
  pluginsMap: Map<string, PluginCacheKeyPkg>
  /** command */
  command: CommandCache[]
  /** accept */
  accept: AcceptCache[]
  /** handler */
  handler: Record<string, HandlerCache[]>
  /** button */
  button: ButtonCache[]
  /** task */
  task: TaskCache[]
  /** 静态资源目录 */
  static: string[]
}

/**
 * @private
 * @description 插件分类缓存
 */
export const cache: PluginsCache = {
  plugins: {
    npm: [],
    git: [],
    apps: [],
    root: [],
  },
  count: {
    pkg: 0,
    accept: 0,
    command: 0,
    task: 0,
    button: 0,
    handler: {
      key: 0,
      fnc: 0,
    },
  },
  pluginsClassified: {
    npm: [],
    git: [],
    apps: [],
    root: [],
  },
  pluginsMap: new Map(),
  command: [],
  accept: [],
  handler: {},
  button: [],
  task: [],
  static: [],
}
