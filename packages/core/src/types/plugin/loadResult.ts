import { AllPluginMethods } from './all'

/**
 * 加载插件缓存类型
 */
export type LoadPluginResult = Record<string, AllPluginMethods | AllPluginMethods[]>
