import { createLogger } from '@/service/logger'
import type { LoggerLevel } from '@/service/logger/types'

/**
 * @description 日志管理器
 */
export const logger = createLogger({ prefix: '[karin]', level: 'info' })

/**
 * @public
 * @description 创建内部日志管理器
 * @param dir - 日志文件夹
 */
export const createInnerLogger = (dir: string) => {
  global.logger = logger
  logger.level = process.env.LOG_LEVEL as LoggerLevel || 'info'
  const maxFileSize = Number(process.env.LOG_MAX_LOG_SIZE) || 0
  logger.configure({
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

  return logger
}
