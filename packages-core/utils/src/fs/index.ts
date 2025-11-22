/**
 * 文件系统操作模块
 *
 * 提供文件和目录的基础操作功能
 *
 * @module fs
 * @example
 * ```typescript
 * import utils from '@karinjs/utils'
 *
 * // 检查文件是否存在
 * const exists = await utils.fs.exists('/path/to/file')
 *
 * // 创建目录
 * await utils.fs.mkdir('/path/to/dir')
 *
 * // 递归读取目录
 * const files = await utils.fs.readDirRecursive('./src', {
 *   suffixs: ['ts', 'js']
 * })
 * ```
 */

export * from './check'
export * from './dir'
export * from './file'

// 保留旧的导出以兼容
export * from './sync'
export * as promises from './promises'

// watch 模块暂时保留原样，后续可能需要重构
export * from '../file/watch'
