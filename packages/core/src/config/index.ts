import { Config } from '@karinjs/config'

/**
 * @public
 * 配置文件实例
*/
export let config: Config

/**
 * 初始化config
 * @param root 根目录
 */
export const createSystemConfig = async () => {
  config = new Config()
  await config.init()
}

export type { ConfigAdapter, ConfigConfig, ConfigEnv, ConfigFiles, ConfigFormatMap, ConfigGroups, ConfigGroupValue, ConfigMap, ConfigPM2, ConfigPrivates, ConfigPrivateValue, ConfigRedis, ConfigRender, ConfigTypes, EventMap as ConfigEventMap, Formatter, TypedEventMap } from '@karinjs/config'
