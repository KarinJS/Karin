import path from 'node:path'
import { formatPath } from '@karinjs/utils'

import type { Package, PackageEnv, PluginPackageType } from '../core'
import type { DefineConfig } from '@karinjs/core'

/** 插件 app 方法类型 */
export type pluginTypes = 'command' | 'accept' | 'task' | 'button' | 'handler' | 'class'

/** 插件缓存 app 属性类型 */
export interface PluginCacheKeyApp {
  /** 当前 app 的唯一索引 */
  id: string
  /** app 被触发的日志处理 */
  log: (...args: any[]) => void
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

/** 插件缓存文件属性类型 */
export interface PluginCacheKeyFile {
  /** 绝对路径 */
  absPath: string
  /** 目录 */
  get dirname (): string
  /** 文件名 */
  get basename (): string
}

export interface KarinConfigType extends DefineConfig {
  /**
   * 入口文件
   * @description 优先加载入口文件 其次轮到apps
   */
  entry?: string | string[] | { type: 'dev' | 'prod', path: string | string[] }[]
  /**
   * app路径
   * @description 适用于不想创建目录 但是想加载单个、多个app文件
   */
  app?: string | string[]
  /**
   * apps 目录
   * @description 此项配置会要求为必须是目录 将会循环读取加载目录下的所有符合标准的文件
   */
  apps?: string | string[]
  /**
   * 静态资源目录
   */
  static?: string | string[]
  /**
   * 在初始化的时候需要创建的文件夹结构
   * @default ['config', 'data', 'resources']
   */
  files?: string[]
  /** 环境变量配置 */
  env?: PackageEnv[]
}

/** 插件缓存包属性类型 */
export interface PluginCacheKeyPkg {
  /** 插件包名称 */
  name: string
  /** 插件包类型 */
  type: PluginPackageType
  /** 插件包根目录 */
  dir: string
  /** 所有app绝对路径列表 */
  get apps (): string[]
  /** 所有apps目录列表 */
  get appsDirs (): string[]
  /** 获取入口文件 */
  get getMain (): string | null
  /** 获取`package.json`绝对路径 */
  get path (): string
  /** 读取`package.json`文件 */
  get data (): Package
  /** 读取`web.config`路径 */
  get webConfigPath (): string | null
  /**
   * 加载`web.config`文件
   * @param isRefresh 是否重新载入
   */
  loadWebConfig (isRefresh?: boolean): Promise<DefineConfig | null>
  /**
   * 加载`karin.config.mjs`文件
   * @param isRefresh 是否重新载入
   */
  loadKarinConfig (isRefresh?: boolean): Promise<DefineConfig | null>
}

/** 插件缓存对象基类 */
export interface PluginRegisterCache {
  /** app类型 必须要在顶部，否则自动推导是联合类型 */
  type: pluginTypes
  /** 当前 app 基本属性 */
  app: PluginCacheKeyApp
  /** 当前文件信息 */
  get file (): PluginCacheKeyFile
  /** 隶属插件包 */
  get pkg (): PluginCacheKeyPkg
  /** 注册的信息 */
  register: unknown
  /** 插件控制接口 */
  control: unknown
}

/**
 * 创建插件文件属性
 * @param absPath 调用者
 * @returns 返回插件文件属性
 */
export const createPluginFileProperties = (absPath: string): PluginCacheKeyFile => {
  return {
    absPath: formatPath(absPath),
    get basename () {
      return path.basename(absPath)
    },
    get dirname () {
      return formatPath(path.dirname(absPath))
    },
  }
}
