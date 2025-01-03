import type chalk from 'chalk'
import type { Config } from '../config'
import type { Configuration, Logger as LoggerType } from 'log4js'

/**
 * 日志等级
 * - `all`：所有日志
 * - `trace`：追踪
 * - `debug`：调试
 * - `mark`：标记
 * - `info`：信息
 * - `warn`：警告
 * - `error`：错误
 * - `fatal`：致命
 * - `off`：关闭
 */
export type LoggerLevel = 'all'
  | 'trace'
  | 'debug'
  | 'mark'
  | 'info'
  | 'warn'
  | 'error'
  | 'fatal'
  | 'off'

/**
 * 创建日志模块配置
 */
export type LoggerOptions = { config?: Configuration, log4jsCfg?: Config['log4jsCfg'] }

/**
 * 拓展日志模块
 */
export interface LoggerExpand {
  /**
   * 颜色模块
   */
  chalk: typeof chalk
  /**
   * 构建红色文本
   * @param text - 文本
   */
  red: (text: string) => string
  /**
   * 构建绿色文本
   * @param text - 文本
   */
  green: (text: string) => string
  /**
   * 构建黄色文本
   * @param text - 文本
   */
  yellow: (text: string) => string
  /**
   * 构建蓝色文本
   * @param text - 文本
   */
  blue: (text: string) => string
  /**
   * 构建品红色文本
   * @param text - 文本
   */
  magenta: (text: string) => string
  /**
   * 构建青色文本
   * @param text - 文本
   */
  cyan: (text: string) => string
  /**
   * 构建白色文本
   * @param text - 文本
   */
  white: (text: string) => string
  /**
   * 构建灰色文本
   * @param text - 文本
   */
  gray: (text: string) => string
  /**
   * 构建紫色文本
   * @param text - 文本
   */
  violet: (text: string) => string
  /**
   * 构建函数文本
   * @param text - 文本
   */
  fnc: (text: string) => string
  /**
   * 专属Bot前缀日志模块
   * @param level 等级
   * @param id 机器人ID
   * @param args 参数
   */
  bot: (level: LoggerLevel, id: string, ...args: any[]) => void
}

/**
 * 日志模块
 */
export type Logger = LoggerType & LoggerExpand
