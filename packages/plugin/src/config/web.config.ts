/**
 * web.config 配置定义
 * @module config/web.config
 */

import type { ComponentConfig } from '@karinjs/components'
import type { PluginMeta, WebConfigSaveResponse } from './types'

/**
 * @types web.config
 * webui配置函数类型
 * @template T 自定义配置类型，默认为 unknown
 */
export interface DefineConfigWeb<T = any> {
  /** 插件信息 */
  info: PluginMeta
  /**
   * 忽略引擎版本检查
   * @default false
   */
  ignoreEngines?: boolean
  /** 模板组件配置参数 */
  components?: () => ComponentConfig[] | Promise<ComponentConfig[]>
  /**
   * 保存配置
   * @param config 配置
   * @returns 保存结果
   */
  save?: (config: T) => WebConfigSaveResponse | Promise<WebConfigSaveResponse>
  /**
   * 自定义组件配置
   * @description 未完成
   */
  customComponent?: () => unknown
}

/**
 * webui 配置
 * @param config 配置
 * @returns 配置
 */
export const defineWebConfig = <T> (
  config: DefineConfigWeb<T>
): DefineConfigWeb<T> => {
  return config
}
