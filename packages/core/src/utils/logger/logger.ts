import fs from 'node:fs'
import chalk from 'chalk'
import { logsPath } from '@/root'
import log4js, { type Configuration } from 'log4js'
import type { Logger, LoggerOptions } from '@/types/system'

if (!fs.existsSync(logsPath)) fs.mkdirSync(logsPath)

/**
 * 创建日志记录器
 * @param options - 配置项
 */
const initLogger = (options: LoggerOptions = {}) => {
  /** 如果有传参直接用 无传参走默认 */
  if (options.config) return log4js.configure(options.config)

  const {
    level = 'info',
    daysToKeep = 14,
    maxLogSize = 0,
  } = options.log4jsCfg || {}

  const config: Configuration = {
    appenders: {
      console: {
        type: 'console',
        layout: {
          type: 'pattern',
          pattern: `%[[Karin][%d{hh:mm:ss.SSS}][%4.4p]%] ${process.env.RUNTIME === 'tsx' ? '[%f{3}:%l] ' : ''}%m`,
        },
      },
      overall: {
        /** 输出到文件 */
        type: 'file',
        /** 日志文件名 */
        filename: 'logs/logger',
        /** 日期后缀 */
        pattern: 'yyyy-MM-dd.log',
        /** 日期后缀 */
        keepFileExt: true,
        /** 日志文件名中包含日期模式 */
        alwaysIncludePattern: true,
        /** 日志文件保留天数 */
        daysToKeep: daysToKeep || 14,
        /** 日志输出格式 */
        layout: {
          type: 'pattern',
          pattern: '[%d{hh:mm:ss.SSS}][%4.4p] %m',
        },
      },
    },
    categories: {
      default: {
        appenders: ['overall', 'console'],
        level,
        enableCallStack: process.env.RUNTIME === 'tsx',
      },
    },
    levels: {
      handler: { value: 15000, colour: 'cyan' },
    },
  }

  /** 碎片化: 将日志分片，达到指定大小后自动切割 日志较多的情况下不建议与整体化同时开启 */
  if (maxLogSize > 0) {
    config.categories.default.appenders.unshift('fragments')
    config.appenders.fragments = {
      type: 'file',
      filename: 'logs/app.log',
      pattern: 'MM-dd.log',
      keepFileExt: true,
      alwaysIncludePattern: true,
      daysToKeep: daysToKeep || 14,
      maxLogSize: (maxLogSize || 30) * 1024 * 1024,
      /** 最大文件数 */
      numBackups: 9999999,
      /** 日志输出格式 */
      layout: {
        type: 'pattern',
        pattern: '[%d{hh:mm:ss.SSS}][%4.4p] %m',
      },
    }
  }
  return log4js.configure(config)
}

/**
 * 为logger添加自定义颜色
 * @param logger - 日志记录器
 */
const addColor = (Logger: log4js.Logger, color?: string) => {
  const logger = Logger as Logger
  logger.chalk = chalk
  logger.red = chalk.red
  logger.green = chalk.green
  logger.yellow = chalk.yellow
  logger.blue = chalk.blue
  logger.magenta = chalk.magenta
  logger.cyan = chalk.cyan
  logger.white = chalk.white
  logger.gray = chalk.gray
  logger.violet = chalk.hex('#868ECC')
  logger.fnc = chalk.hex(color || '#FFFF00')
  logger.bot = (level, id, ...args) => {
    switch (level) {
      case 'trace':
        return logger.trace(logger.violet(`[Bot:${id}]`), ...args)
      case 'debug':
        return logger.debug(logger.violet(`[Bot:${id}]`), ...args)
      case 'mark':
        return logger.mark(logger.violet(`[Bot:${id}]`), ...args)
      case 'info':
        return logger.info(logger.violet(`[Bot:${id}]`), ...args)
      case 'warn':
        return logger.warn(logger.violet(`[Bot:${id}]`), ...args)
      case 'error':
        return logger.error(logger.violet(`[Bot:${id}]`), ...args)
      case 'fatal':
        return logger.fatal(logger.violet(`[Bot:${id}]`), ...args)
      default:
        return logger.info(logger.violet(`[Bot:${id}]`), ...args)
    }
  }
  return logger
}

/**
 * 创建日志记录器
 * @param options - 配置项
 * @returns 日志记录器
 */
export const createLogger = (options: LoggerOptions = {}) => {
  initLogger(options)
  const logger = addColor(log4js.getLogger('default'))

  global.logger = logger
  return logger
}
