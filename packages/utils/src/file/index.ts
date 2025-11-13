/**
 * File Module
 *
 * 文件操作模块，提供文件下载、JSON/YAML 读写、配置文件操作等功能
 *
 * @module file
 */

// 新版 API - 规范化、统一的文件操作
export * from './download'
export * from './json'
export * from './yaml-helper'
export * from './config'

// 旧版兼容 - 待迁移
export * from './watch'
export * from './file'
