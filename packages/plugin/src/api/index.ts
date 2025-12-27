/**
 * API 模块统一导出
 * @module api
 */

export { event, type EventAPI } from './event'
export { cache, type CacheAPI } from './cache'
export { registry, type RegistryAPI } from './registry'
export { moduleApi, moduleApi as module, type ModuleAPI } from './module'
export { loader, type LoaderAPI } from './loader'
export { lifecycle, type LifecycleAPI } from './lifecycle'
