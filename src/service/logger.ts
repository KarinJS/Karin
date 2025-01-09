// tips: 请先调用
import { createLogger } from '@/utils/logger'
import type { LoggerLevel } from '@/types/system'

debug('debug: init logger')

/**
 * @public
 * @description 日志管理器
 */
export const logger = createLogger({
  log4jsCfg: {
    level: process.env.LOG_LEVEL as LoggerLevel || 'info',
    daysToKeep: Number(process.env.LOG_DAYS_TO_KEEP) || 30,
    maxLogSize: Number(process.env.LOG_MAX_LOG_SIZE) || 0,
    logColor: process.env.LOG_FORMAT || '#E1D919',
  },
})
