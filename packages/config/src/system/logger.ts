import { checkType } from '../utils'

export interface ConfigLogger {
  /**
   * 日志级别
   * @default info
   */
  level: string,
  /**
   * 日志保留天数
   * @default 7
   */
  days_to_keep: number,
  /**
   * 最大日志大小
   * @default 0
   */
  max_log_size: number,
  /**
   * 指令触发函数颜色
   * @default #E1D919
   */
  fnc_color: string,
}

/**
 * 默认日志配置
 */
export const configDefaultLogger: ConfigLogger = {
  level: 'info',
  days_to_keep: 7,
  max_log_size: 0,
  fnc_color: '#E1D919',
}

/**
 * 兼容性处理
 * @param config 日志配置
 */
export const configLoggerCompat = (config: Partial<ConfigLogger>): ConfigLogger => {
  return {
    level: checkType('string', config.level, configDefaultLogger.level),
    days_to_keep: checkType('number', config.days_to_keep, configDefaultLogger.days_to_keep),
    max_log_size: checkType('number', config.max_log_size, configDefaultLogger.max_log_size),
    fnc_color: checkType('string', config.fnc_color, configDefaultLogger.fnc_color),
  }
}

/**
 * 日志配置 API
 */
export const logger = {
  /**
   * 默认日志配置
   */
  default: configDefaultLogger,
  /**
   * 兼容性处理日志配置
   */
  compat: configLoggerCompat,
  /**
   * 清空缓存（空函数）
   */
  clearCache: () => { },
}
