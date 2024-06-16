import chalk from 'chalk'
import log4js from 'log4js'

export default class Logger {
  constructor () {
    this.log_color = '#FFFF00'
    this.options = {}
    process.env.KarinMode = process.argv[2]?.includes('dev') ? 'dev' : 'prod'
  }

  /**
   * 默认配置
   * @param {Object} Config
   * @returns {Logger}
   */
  config (Config) {
    this.log_color = Config.Config.log_color
    this.options = {
      appenders: {
        console: {
          type: 'console',
          layout: {
            type: 'pattern',
            pattern: `%[[Karin][%d{hh:mm:ss.SSS}][%4.4p]%] ${process.env.KarinMode === 'dev' ? '[%f{3}:%l] ' : ''}%m`,
          },
        },
        out: {
          /** 输出到文件 */
          type: 'file',
          filename: 'logs/logger',
          pattern: 'yyyy-MM-dd.log',
          /** 日期后缀 */
          keepFileExt: true,
          /** 日志文件名中包含日期模式 */
          alwaysIncludePattern: true,
          /** 日志文件保留天数 */
          daysToKeep: Config.Config.log_days_Keep,
          /** 日志输出格式 */
          layout: {
            type: 'pattern',
            pattern: '[%d{hh:mm:ss.SSS}][%4.4p] %m',
          },
        },
      },
      categories: {
        default: {
          appenders: ['out', 'console'],
          level: Config.Config.log_level,
          enableCallStack: process.env.KarinMode === 'dev',
        },
      },
    }
    return this
  }

  /**
   * CLI 配置
   * @returns {Logger}
   */
  cli () {
    this.options = {
      appenders: {
        console: {
          type: 'console',
          layout: {
            type: 'pattern',
            pattern: '%[[Karin-cli][%d{hh:mm:ss.SSS}][%4.4p]%] %m',
          },
        },
      },
      categories: {
        default: {
          appenders: ['console'],
          level: 'info',
        },
      },
    }
    return this
  }

  /**
   * 日志模块
   * @returns {LoggerType}
   */
  logger () {
    log4js.configure(this.options)
    const logger = log4js.getLogger('default')
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
    logger.fnc = chalk.hex(this.log_color || '#FFFF00')
    logger.bot = (level, id, ...args) => logger[level](logger.violet(`[Bot:${id}] `) + args.join(' '))

    return Object.freeze(logger)
  }
}

/**
 * @type {LoggerType}
 */
export const LoggerType = {}

/**
 * @typedef {log4js.Logger & {
 *  chalk: import('chalk').default,
 *  red: (text: string) => string,
 *  green: (text: string) => string,
 *  yellow: (text: string) => string,
 *  blue: (text: string) => string,
 *  magenta: (text: string) => string,
 *  cyan: (text: string) => string,
 *  white: (text: string) => string,
 *  gray: (text: string) => string,
 *  violet: (text: string) => string,
 *  fnc: (text: string) => string,
 *  bot: (level: 'trace'|'debug'|'mark'|'info'|'warn'|'error'|'fatal', id: string, ...args: string[]) => void
 *  }} LoggerType
 */
