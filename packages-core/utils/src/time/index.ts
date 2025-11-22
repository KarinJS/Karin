/**
 * Time Module
 *
 * 时间工具模块，提供延迟、时间格式化、运行时间等功能
 *
 * @module time
 */

// 新版 API - 规范化、统一的时间工具
export * from './sleep'
export * from './format'

// 兼容旧版命名
export { formatTimeDiff as format, getUptime as uptime } from './format'
