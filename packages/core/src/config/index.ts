import { Config } from '@karinjs/config'
export * from '@karinjs/config'

/**
 * @public
 * 配置文件实例
*/
export const config: Config = new Config('./@karinjs/config')
export type { ConfigAdapter, ConfigConfig, ConfigEnv, ConfigFiles, ConfigFormatMap, ConfigGroups, ConfigGroupValue, ConfigMap, ConfigPM2, ConfigPrivates, ConfigPrivateValue, ConfigRedis, ConfigRender, ConfigTypes, EventMap, Formatter, TypedEventMap } from '@karinjs/config'
