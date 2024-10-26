import fs from 'node:fs'
import chalk from 'chalk'
import log4js from 'log4js'
import { config } from '../../core/utils/config/config'

const logsDir = './logs'
if (!fs.existsSync(logsDir)) fs.mkdirSync(logsDir)

const { log_level: logLevel, log_days_Keep: logDaysKeep, log4jsCfg } = config.Config
const level = logLevel || log4jsCfg.level || 'info'
const daysToKeep = logDaysKeep || log4jsCfg.daysToKeep || 7
const { overall, fragments, maxLogSize } = log4jsCfg
const defaultOptions = { appenders: ['console'], level, enableCallStack: process.env.karin_app_mode === 'dev' }

const options: {
  appenders: {
    console: {
      type: string
      layout: {
        type: string
        pattern: string
      }
    }
    overall?: {
      type: string
      filename: string
      pattern: string
      keepFileExt: boolean
      alwaysIncludePattern: boolean
      daysToKeep: number
      layout: {
        type: string
        pattern: string
      }
    }
    fragments?: {
      type: string
      filename: string
      pattern: string
      keepFileExt: boolean
      alwaysIncludePattern: boolean
      daysToKeep: number
      numBackups: number
      layout: {
        type: string
        pattern: string
      }
      maxLogSize: number
    }
  }
  categories: {
    default: {
      appenders: string[]
      level: string
      enableCallStack: boolean
    }
  }
} = {
  appenders: {
    console: {
      type: 'console',
      layout: {
        type: 'pattern',
        pattern: `%[[Karin][%d{hh:mm:ss.SSS}][%4.4p]%] ${process.env.karin_app_mode === 'dev' ? '[%f{3}:%l] ' : ''}%m`,
      },
    },
  },
  categories: { default: defaultOptions },
}

if (overall) {
  defaultOptions.appenders.unshift('overall')
  options.appenders.overall = {
    /** 输出到文件 */
    type: 'file',
    filename: 'logs/logger',
    pattern: 'yyyy-MM-dd.log',
    /** 日期后缀 */
    keepFileExt: true,
    /** 日志文件名中包含日期模式 */
    alwaysIncludePattern: true,
    /** 日志文件保留天数 */
    daysToKeep,
    /** 日志输出格式 */
    layout: {
      type: 'pattern',
      pattern: '[%d{hh:mm:ss.SSS}][%4.4p] %m',
    },
  }
}

if (fragments) {
  defaultOptions.appenders.unshift('fragments')
  options.appenders.fragments = {
    type: 'file',
    filename: 'logs/app.log',
    pattern: 'MM-dd.log',
    keepFileExt: true,
    alwaysIncludePattern: true,
    daysToKeep,
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

log4js.configure(options)

export const logger = log4js.getLogger('default')
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
logger.fnc = chalk.hex(config.Config.log_color || '#FFFF00')
logger.bot = (level, id, ...args) => {
  switch (level) {
    case 'trace':
      logger.trace(logger.violet(`[Bot:${id}]`), ...args)
      break
    case 'debug':
      logger.debug(logger.violet(`[Bot:${id}]`), ...args)
      break
    case 'mark':
      logger.mark(logger.violet(`[Bot:${id}]`), ...args)
      break
    case 'info':
      logger.info(logger.violet(`[Bot:${id}]`), ...args)
      break
    case 'warn':
      logger.warn(logger.violet(`[Bot:${id}]`), ...args)
      break
    case 'error':
      logger.error(logger.violet(`[Bot:${id}]`), ...args)
      break
    case 'fatal':
      logger.fatal(logger.violet(`[Bot:${id}]`), ...args)
      break
    default:
      logger.info(logger.violet(`[Bot:${id}]`), ...args)
  }
}

global.logger = logger
export default logger
