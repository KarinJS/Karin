/**
 * @karinjs/utils 2.0
 *
 * 统一的工具库，提供文件系统、路径处理、网络请求、进程管理等功能
 *
 * @example
 * ```typescript
 * // 方式 1: 默认导出（推荐用于大量使用）
 * import utils from '@karinjs/utils'
 *
 * await utils.fs.exists('/path')
 * await utils.file.download('url', 'path')
 * const module = await utils.module.imports('./plugin.js')
 * const config = await utils.module.requireFile('./config.json')
 *
 * // 方式 2: 直接导出高频 API（推荐用于少量使用）
 * import { exists, download, imports, requireFile, exec, request } from '@karinjs/utils'
 *
 * await exists('/path')
 * await download('url', 'path')
 * await imports('./plugin.js')
 * const config = await requireFile('./config.json')
 * ```
 *
 * @module @karinjs/utils
 * @version 2.0.0
 */

// ============================================================================
// 模块导入
// ============================================================================

import * as fs from './fs'
import * as path from './path'
import * as file from './file'
import * as module from './module'
import * as network from './network'
import * as time from './time'
import * as string from './string'
import * as number from './number'
import * as crypto from './crypto'
import * as media from './media'
import * as npm from './npm'
import * as data from './data'
import * as system from './system'

// ============================================================================
// 默认导出：统一的 utils 对象
// ============================================================================

/**
 * 统一的工具对象
 *
 * 包含所有功能模块的命名空间导出
 */
const utils = {
  /** 文件系统操作 */
  fs,
  /** 路径处理 */
  path,
  /** 高级文件操作（JSON/YAML/下载等） */
  file,
  /** 模块加载 */
  module,
  /** 网络相关（HTTP/IP/Port等） */
  network,
  /** 时间处理 */
  time,
  /** 进程管理 */
  process,
  /** 字符串工具 */
  string,
  /** 数字工具 */
  number,
  /** 加密相关 */
  crypto,
  /** 媒体处理 */
  media,
  /** NPM 相关 */
  npm,
  /** 数据处理 */
  data,
  /** 系统相关 */
  system,
}

export default utils

export { fs, path, file, module, network, time, string, number, crypto, media, npm, data, system }
export { imports } from './module/import'
export { importWithStatus } from './module/import'
export { requireFile, requireFileSync, clearRequire, writeFileSync, writeFile } from './require'
export { watch, watchs } from './file/watch'
export { buffer, base64 } from './data'
export { LRUCache } from './cache/LRU'
export { findFiles, findFilesSync, filesByExt } from './path'
export { exec } from './system/exec'
export { isClass } from './system/class'
export { relative as relativePath } from './path'
export { format as formatPath, findCmdPath } from './path'
export { request } from './network/http'
export { raceRequest } from './network'
export { download, copyConfigSync } from './file'
export { sleep } from './time/sleep'
export { formatTimeDiff as formatTime } from './time/format'
export * as types from './types'
export type { RequireOptions, WriteFileOptions, WriteFileOptionsSync } from './require'

// 保留部分常用的旧导出方式以确保平滑过渡
export * from './common/number'
export * from './common/string'
export * as common from './common'
export * from './changelog'

// ============================================================================
// 废弃的 API（向后兼容）
// ============================================================================

// 导出所有废弃的 API 映射
export * from './deprecated'
