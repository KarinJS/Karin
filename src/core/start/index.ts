import { Config } from '@/utils/config/config'
import { createLogger } from '@/utils/logger/logger'

/** 配置文件管理器 */
export const config = await new Config().init()
/** 日志管理器 */
export const logger = createLogger({ log4jsCfg: config.ConfigSync().log4jsCfg })
