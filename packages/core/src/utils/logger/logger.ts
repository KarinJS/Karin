import { createLogger } from '@/service/logger'
import type { LoggerLevel } from '@/service/logger/types'

/**
 * @description 日志管理器
 */
export let logger: ReturnType<typeof createLogger>

/**
 * @public
 * @description 创建内部日志管理器
 * @param dir - 日志文件夹
 */
export const createInnerLogger = (dir: string) => {
  const maxFileSize = Number(process.env.LOG_MAX_LOG_SIZE) || 0
  logger = createLogger({
    prefix: '[karin]',
    level: process.env.LOG_LEVEL as LoggerLevel || 'info',
    file: {
      dir,
      enabled: true,
      enableWholeMode: true,
      enableFragmentMode: maxFileSize > 0,
      maxFileSize,
      daysToKeep: Number(process.env.LOG_DAYS_TO_KEEP) || 1,
      separateErrorLog: true,
    },
  })
  // logger = createLogger(dir, {
  //   log4jsCfg: {
  //     level: process.env.LOG_LEVEL as LoggerLevel || 'info',
  //     daysToKeep: Number(process.env.LOG_DAYS_TO_KEEP) || 30,
  //     maxLogSize: Number(process.env.LOG_MAX_LOG_SIZE) || 0,
  //     logColor: process.env.LOG_FNC_COLOR || '#E1D919',
  //   },
  // })

  global.logger = logger
  return logger
}
