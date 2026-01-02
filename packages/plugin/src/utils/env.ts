/**
 * 插件环境变量管理器
 * @description 使用新的 store API 重构
 * @note v2.0 移除了 v1 兼容逻辑
 */
import { envManager } from '../store'
import type { DefineConfig } from '../config'

/**
 * 插件环境变量管理器
 * @description v2.0 版本，只支持新格式
 */
export const pluginEnv = {
  /**
   * 创建插件环境变量
   * @param packageName - 插件包名称
   * @param envs - 环境变量对象
   * @example
   * ```ts
   * pluginEnv.create('my-plugin', {
   *   API_KEY: 'xxx',
   *   DEBUG: { value: 'true', comment: '调试模式' }
   * })
   * ```
   */
  create: (packageName: string, envs: DefineConfig['env']) => {
    envManager.create(packageName, envs)
  },
}
