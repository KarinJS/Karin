/**
 * 管理功能
 * 包含插件列表管理、升级管理、热重载、生命周期管理、插件市场、Web配置等
 */

// 插件管理功能
export * from './list'
export * from './upgrade'
export * from './lifecycle'

// 加载和注册（显式导出避免冲突）
export { getPluginLoader as pluginLoader } from './load'
export { register as registerManager } from './register'

// 热重载功能
export * from './hmr'
export * from './core'
export * from './simple'
export * from './internal'

// 插件市场和Web配置
export * from './market'
export * from './web'

// 重新导出核心管理器（向后兼容）
export { core } from '../core/core'
