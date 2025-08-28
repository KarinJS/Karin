import { core } from '../manager'
import type { DefineConfig } from '@karinjs/core'

/**
 * web.config 管理实例
 */
class WebConfigManager {
  /**
  * 获取 `web.config` 路径
  * @param name 插件名称
  */
  getWebConfigPath (name: string): string | null {
    const info = core.getPluginPackageDetail(name)
    if (!info) return null

    return info.webConfigPath
  }

  /**
   * 获取 `web.config` 内容
   * @param name 插件名称
   */
  async getWebConfig<T = any> (name: string): Promise<DefineConfig<T> | null> {
    const info = core.getPluginPackageDetail(name)
    if (!info) return null

    return info.loadWebConfig()
  }
}

/**
 * web.config 管理实例
 */
export const webConfig = new WebConfigManager()
