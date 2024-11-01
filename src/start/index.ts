import { Config } from '@/utils/config/config'
import { createLogger } from '@/utils/logger/logger'
export * as common from '@/utils/common'

/** 配置文件管理器 */
export const config = await new Config().init()
/** 日志管理器 */
export const logger = createLogger({ log4jsCfg: config.ConfigSync().log4jsCfg })
