import fs from 'node:fs'
import chalk from 'chalk'
import log4js, { type Configuration, type Logger as Log4jsLogger } from 'log4js'
import { karinPathLogs } from '@/root'
import type { Logger, LoggerLevel } from '@/types/system/logger'

/**
 * 创建日志记录器
 * @param options - 配置项
 */
const initLogger = () => {
  const level = process.env.LOG_LEVEL as LoggerLevel || 'info'
  const daysToKeep = Number(process.env.LOG_DAYS_TO_KEEP) || 30
  // const maxFileSize = Number(process.env.LOG_MAX_LOG_SIZE) || 0

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
        type: 'dateFile',
        /** 日志文件名 */
        filename: '@karinjs/logs/logger',
        /** 日期后缀 */
        pattern: 'yyyy-MM-dd.log',
        /** 日期后缀 */
        keepFileExt: true,
        /** 日志文件名中包含日期模式 */
        alwaysIncludePattern: true,
        /** 日志文件保留天数 */
        numBackups: daysToKeep || 14,
        /** 日期后缀分隔符 */
        fileNameSep: '.',
        /** 压缩 */
        // compress: true,
        /** 日志输出格式 */
        layout: {
          type: 'pattern',
          pattern: '[%d{hh:mm:ss.SSS}][%4.4p] %m',
        },
      },
      errorFile: {
        /** 输出到文件 */
        type: 'dateFile',
        /** 日志文件名 */
        filename: '@karinjs/logs/error/logger',
        /** 日期后缀 */
        pattern: 'yyyy-MM-dd.log',
        /** 日期后缀 */
        alwaysIncludePattern: true,
        /** 日志文件保留天数 */
        numBackups: daysToKeep || 14,
        /** 压缩 */
        // compress: true,
        /** 保留文件扩展名 */
        keepFileExt: true,
        /** 日期后缀分隔符 */
        fileNameSep: '.',
        /** 日志输出格式 */
        layout: {
          type: 'pattern',
          pattern: '[%d{hh:mm:ss.SSS}][%4.4p] %m',
        },
      },
      errors: {
        /** 错误日志过滤器 */
        type: 'logLevelFilter',
        /** 目标appender */
        appender: 'errorFile',
        /** 只记录错误级别及以上的日志 */
        level: 'error',
      },
    },
    categories: {
      default: {
        appenders: ['console', 'overall', 'errors'],
        level,
        enableCallStack: process.env.RUNTIME === 'tsx',
      },
    },
    levels: {
      handler: { value: 15000, colour: 'cyan' },
    },
  }

  /** 碎片化: 将日志分片，达到指定大小后自动切割 日志较多的情况下不建议与整体化同时开启 */
  // if (maxFileSize > 0) {
  //   config.categories.default.appenders.unshift('fragments')
  //   config.appenders.fragments = {
  //     type: 'file',
  //     filename: '@karinjs/logs/app.log',
  //     pattern: 'MM-dd.log',
  //     keepFileExt: true,
  //     alwaysIncludePattern: true,
  //     daysToKeep: daysToKeep || 14,
  //     maxLogSize: (maxFileSize || 30) * 1024 * 1024,
  //     /** 最大文件数 */
  //     numBackups: 9999999,
  //     /** 日志输出格式 */
  //     layout: {
  //       type: 'pattern',
  //       pattern: '[%d{hh:mm:ss.SSS}][%4.4p] %m',
  //     },
  //   }
  // }
  return log4js.configure(config)
}

/**
 * 为logger添加自定义颜色
 * @param logger - 日志记录器
 */
const addColor = (Logger: Log4jsLogger, color?: string) => {
  const logger = Logger as unknown as Logger
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

  logger.setContextLayouts('pattern', {
    type: 'pattern',
    pattern: '[%d{hh:mm:ss.SSS}][%4.4p] %m',
  })

  return logger
}

/**
 * 创建日志记录器
 * @param dir - 日志文件夹
 * @param options - 配置项
 * @returns 日志记录器
 */
const createLogger = () => {
  const dir = karinPathLogs
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })

  initLogger()
  const logger = addColor(log4js.getLogger('default'))

  global.logger = logger
  return logger
}

/**
 * @public
 * @description 日志管理器
 */
export const logger: Logger = createLogger()
