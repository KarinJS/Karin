import { DEFAULT_LOGGER_CONFIG } from './types'
import type { LoggerLevel, LoggerConfig } from './types'

/**
 * @description 格式化时间戳
 * @returns 格式化后的时间戳
 */
export const getTimestamp = (): string =>
  new Date().toISOString().slice(11, 23)

/**
 * @description 格式化日志级别文本
 * @param level - 日志级别
 * @returns 格式化后的日志级别文本
 */
export const formatLevelText = (level: LoggerLevel): string =>
  `[${level.toUpperCase().slice(0, 4)}]`

/**
 * @description 归一化配置参数
 * @param config - 用户传入配置
 * @returns 归一化后的配置
 */
export const normalizeConfig = (config?: Partial<LoggerConfig>): LoggerConfig => {
  const result: LoggerConfig = {
    prefix: config?.prefix ?? DEFAULT_LOGGER_CONFIG.prefix,
    color: config?.color ?? DEFAULT_LOGGER_CONFIG.color,
    level: config?.level ?? DEFAULT_LOGGER_CONFIG.level,
    file: {
      enabled: config?.file?.enabled ?? DEFAULT_LOGGER_CONFIG.file.enabled,
      dir: config?.file?.dir ?? DEFAULT_LOGGER_CONFIG.file.dir,
      level: config?.file?.level ?? DEFAULT_LOGGER_CONFIG.file.level,
      daysToKeep: config?.file?.daysToKeep ?? DEFAULT_LOGGER_CONFIG.file.daysToKeep,
      enableWholeMode: config?.file?.enableWholeMode ?? DEFAULT_LOGGER_CONFIG.file.enableWholeMode,
      enableFragmentMode: config?.file?.enableFragmentMode ?? DEFAULT_LOGGER_CONFIG.file.enableFragmentMode,
      maxFileSize: config?.file?.maxFileSize ?? DEFAULT_LOGGER_CONFIG.file.maxFileSize,
      separateErrorLog: config?.file?.separateErrorLog ?? DEFAULT_LOGGER_CONFIG.file.separateErrorLog,
    },
  }

  return result
}
