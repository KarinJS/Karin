/**
 * 数字工具模块
 *
 * 提供数字处理相关功能
 *
 * @module number
 */

// 新版 API - 规范化、统一的数字工具
export * from './calc'
export * from './format'

// 旧版兼容 - 仅导出不冲突的函数
export { diffArray, diffSimpleArray, isNumber, isNumberInArray } from '../common/number'
export * from '../system/range'
