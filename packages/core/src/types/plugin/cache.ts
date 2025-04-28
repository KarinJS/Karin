import type { FSWatcher } from 'chokidar'
import type { Accept, NoticeAndRequest } from './accept'
import type { PkgInfo } from './base'
import type { Button } from './button'
import type { Command, CommandClass } from './command'
import type { Task } from './task'
import type { Handler } from './handler'
import type { MessageEventMap } from '../event'

export interface Count {
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

/** 缓存 */
export interface Cache {
  /** 插件索引 */
  index: Record<number, PkgInfo>
  /** accept */
  accept: Accept<keyof NoticeAndRequest>[],
  /** command */
  command: Array<CommandClass<keyof MessageEventMap> | Command<keyof MessageEventMap>>,
  /** 定时任务 */
  task: Array<Task>,
  /** 按钮 */
  button: Button[],
  /** 插件数量统计 */
  count: Count
  /** 插件名称:缺失的依赖 */
  missing: Map<string, string>
  /** apps监听 */
  watcher: Map<string, FSWatcher>
  /** handler */
  handler: Record<string, Handler[]>
  /** 静态资源目录 */
  static: string[]
}

/**
 * 已加载插件缓存信息列表
 */
export interface LoadedPluginCacheList {
  /** 插件名称 */
  name: string
  /** 插件文件列表 */
  files: {
    /** 文件名称 */
    fileName: string
    /** 该文件下所有的command函数名称 */
    command: string[]
  }[]
}
