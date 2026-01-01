/**
 * Store 类型定义
 * @module store/types
 */

import type {
  CreateAccept,
  CreateButton,
  CreateCommand,
  CreateHandler,
  CreateTask,
} from '../create'

// ==================== 插件类型 ====================

/** 插件类型枚举 */
export type PluginType = 'command' | 'accept' | 'handler' | 'button' | 'task'

/** 插件类型到实例类型的映射 */
export interface PluginTypeMap {
  command: CreateCommand<any>
  accept: CreateAccept
  handler: CreateHandler
  button: CreateButton
  task: CreateTask
}

/** 任意插件类型 */
export type AnyPlugin = PluginTypeMap[PluginType]

// ==================== 事件类型 ====================

/** Store 事件定义 */
export interface StoreEvents {
  /** 插件添加事件 */
  add: [type: PluginType, plugin: AnyPlugin]
  /** 插件删除事件 */
  del: [type: PluginType, id: string, plugin: AnyPlugin]
  /** 插件更新事件 */
  update: [type: PluginType, id: string, key: string, newVal: unknown, oldVal: unknown]
  /** 排序完成事件 */
  sort: [type: PluginType]
  /** 清空事件 */
  clear: [type: PluginType | 'all']
}

/** 事件监听器类型 */
export type StoreEventListener<K extends keyof StoreEvents> = (...args: StoreEvents[K]) => void

// ==================== 统计类型 ====================

/** 插件统计信息 */
export interface PluginStats {
  /** 插件总数 */
  total: number
  /** 启用的插件数 */
  active: number
  /** 禁用的插件数 */
  disabled: number
}

/** 全局统计信息 */
export interface GlobalStats {
  command: PluginStats
  accept: PluginStats
  handler: { keys: number; total: number; active: number }
  button: PluginStats
  task: PluginStats
  /** 文件数量 */
  files: number
  /** 包数量 */
  packages: number
}

// ==================== 索引类型 ====================

/** 文件信息 */
export interface FileInfo {
  /** 文件路径 */
  path: string
  /** 所属包名 */
  pkg: string
  /** 该文件的插件 ID 列表 */
  pluginIds: Set<string>
}

/** 包信息 */
export interface PackageInfo {
  /** 包名 */
  name: string
  /** 包绝对路径 */
  abs: string
  /** package.json 路径 */
  pkgPath: string
  /** 包类型 */
  type: 'npm' | 'apps' | 'dev'
  /** 该包的文件列表 */
  files: Set<string>
  /** 该包的插件 ID 列表 */
  pluginIds: Set<string>
}

// ==================== Store 接口 ====================

/** Store 公开接口 */
export interface Store {
  // ===== 添加 =====
  add<T extends PluginType>(type: T, plugin: PluginTypeMap[T]): void

  // ===== 删除 =====
  del(id: string): boolean
  delByFile(file: string): number
  delByPkg(pkg: string): number

  // ===== 查询 =====
  get<T extends PluginType>(type: T): PluginTypeMap[T][]
  getAll<T extends PluginType>(type: T): PluginTypeMap[T][]
  getById(id: string): AnyPlugin | undefined
  getByFile(file: string): AnyPlugin[]
  getByPkg(pkg: string): AnyPlugin[]
  has(id: string): boolean

  // ===== 更新 =====
  update(id: string, key: string, value: unknown): boolean
  disable(id: string): boolean
  enable(id: string): boolean

  // ===== Handler 特殊操作 =====
  getHandler(key: string): CreateHandler[]

  // ===== 批量操作 =====
  clear(type?: PluginType): void
  markDirty(type: PluginType): void

  // ===== 统计 =====
  stats(): GlobalStats

  // ===== 事件 =====
  on<K extends keyof StoreEvents>(event: K, listener: StoreEventListener<K>): void
  off<K extends keyof StoreEvents>(event: K, listener: StoreEventListener<K>): void
  once<K extends keyof StoreEvents>(event: K, listener: StoreEventListener<K>): void

  // ===== 索引管理 =====
  registerFile(file: string, pkg: string): void
  registerPackage(info: Omit<PackageInfo, 'files' | 'pluginIds'>): void
  getFileInfo(file: string): FileInfo | undefined
  getPackageInfo(pkg: string): PackageInfo | undefined

  // ===== 调试 =====
  dump(): unknown
}
