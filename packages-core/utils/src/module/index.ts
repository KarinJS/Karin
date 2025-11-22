/**
 * 模块加载模块
 *
 * 提供模块的动态导入和 require 功能
 *
 * @module module
 * @example
 * ```typescript
 * import utils from '@karinjs/utils'
 *
 * // 动态导入模块（注意：函数名是 imports）
 * const module = await utils.module.imports('./plugin.js', {
 *   import: 'default',
 *   eager: true
 * })
 *
 * // 带状态的导入
 * const result = await utils.module.importWithStatus('./config.js')
 * if (result.status) {
 *   console.log(result.data)
 * }
 *
 * // require 方式加载
 * const data = utils.module.require('./data.json')
 * ```
 */

export * from './import'

// 从 require 模块导出（保持兼容性）
export * from '../require'
