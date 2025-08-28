import type { AdapterProtocol } from '../../adapter/types'
import type { ConfigPrivateValue, ConfigGroupValue } from '@karinjs/config'

/**
 * 插件和适配器检查工具
 */
export const checker = {
  /**
   * 检查触发事件的适配器是否收到限制
   * @param adapter 插件指定只允许特定适配器使用
   * @param dsbAdapter 插件禁止适配器使用
   * @param protocol 适配器协议实现名称
   * @returns `true` 表示通过
   */
  adapterEnabled: (
    adapter: AdapterProtocol[],
    dsbAdapter: AdapterProtocol[],
    protocol: AdapterProtocol
  ): boolean => {
    /** 插件指定只允许特定适配器使用 */
    if (adapter.length && !adapter.includes(protocol)) {
      return false
    }

    /** 插件禁止适配器使用 */
    if (dsbAdapter.length && dsbAdapter.includes(protocol)) {
      return false
    }

    return true
  },

  /**
   * 检查当前插件是否通过插件白名单
   * @param pkgName 插件包名
   * @param fileBasename 插件文件名
   * @param appName app 导出的名称
   * @param config 当前群、好友的配置对象
   * @returns `true` 表示通过
   */
  pluginWhitelisted: (
    pkgName: string,
    fileBasename: string,
    appName: string,
    config: ConfigPrivateValue | ConfigGroupValue
  ): boolean => {
    /** 未设置白名单 */
    if (!config.enable.length) return true

    /**
     * 编写规则:
     * - `karin-plugin-example`: 插件包名
     * - `karin-plugin-example:index.ts`: 插件包名:文件名
     * - `karin-plugin-example:fnc`: 插件包名:导出的方法名
     */
    const list = [
      pkgName,
      `${pkgName}:${fileBasename}`,
      `${pkgName}:${appName}`,
    ]

    for (const item of list) {
      if (config.enable.includes(item)) {
        return true
      }
    }

    return false
  },

  /**
   * 检查当前插件是否通过插件黑名单
   * @param pkgName 插件包名
   * @param fileBasename 插件文件名
   * @param appName app 导出的名称
   * @param config 当前群、好友的配置对象
   * @returns `true` 表示通过
   */
  pluginNotBlacklisted: (
    pkgName: string,
    fileBasename: string,
    appName: string,
    config: ConfigPrivateValue | ConfigGroupValue
  ): boolean => {
    /** 未设置黑名单 */
    if (!config.disable.length) return true

    /**
     * 规则同`pluginWhitelisted`
     */
    const list = [
      pkgName,
      `${pkgName}:${fileBasename}`,
      `${pkgName}:${appName}`,
    ]

    for (const item of list) {
      if (config.disable.includes(item)) {
        return false
      }
    }

    return true
  },
}
