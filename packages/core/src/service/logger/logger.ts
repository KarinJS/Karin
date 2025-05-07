import chalk from 'chalk'
import util from 'node:util'
import { LoggerLevelPriority } from './types'
import { normalizeConfig } from './utils'
import { createFileWriter } from './file'
import type { Logger, LoggerLevel, LoggerConfig, LogMethodsOnly, LogMethodNames } from './types'

/**
 * @description Logger内部状态
 */
interface LoggerState {
  level: LoggerLevel
  config: LoggerConfig
  fileWriter: ReturnType<typeof createFileWriter> | null
}

/**
 * @description 创建日志记录器
 * @param config - 配置选项
 */
export const createLogger = (config?: Partial<LoggerConfig>): Logger => {
  /** 归一化配置 */
  const normalizedConfig = normalizeConfig(config)

  /** 内部状态 */
  const state: LoggerState = {
    level: normalizedConfig.level,
    config: normalizedConfig,
    fileWriter: null,
  }

  /** 初始化输出器 */
  const setupWriters = () => {
    /** 设置文件输出 */
    if (state.fileWriter) {
      state.fileWriter.close?.()
      state.fileWriter = null
    }

    if (state.config.file.enabled &&
      (state.config.file.enableWholeMode || state.config.file.enableFragmentMode)) {
      state.fileWriter = createFileWriter(state.config.file)
    }
  }

  /**
   * @description 配置Logger
   * @param newConfig - 更新的配置
   */
  const configure = (newConfig: Partial<LoggerConfig>): void => {
    /** 保存旧配置的日志级别 */
    const oldLevel = state.config.level

    /** 更新并归一化配置 */
    state.config = normalizeConfig({
      ...state.config,
      ...newConfig,
    })

    /** 更新日志级别 */
    if (state.config.level !== oldLevel) {
      state.level = state.config.level
    }

    /** 重新设置输出器 */
    setupWriters()
  }

  /**
   * @description 创建日志函数
   * @param level - 日志级别
   */
  const createLogFunction = (level: LogMethodNames) => {
    const levelText = level.toUpperCase().slice(0, 4)
    const colorMap = {
      trace: chalk.cyan,
      debug: chalk.blue,
      info: chalk.green,
      warn: chalk.yellow,
      error: chalk.red,
      fatal: chalk.magenta,
      mark: chalk.gray,
    }

    return (...args: any[]): void => {
      /** 构建前缀和消息 */
      const now = new Date()
      const timestamp = now.toLocaleTimeString(undefined, { hour12: false }) + '.' + now.getMilliseconds().toString().padStart(3, '0')
      const prefixText = colorMap[level](`${state.config.prefix}[${timestamp}][${levelText}]`)
      const message = util.format(...args)

      /** 输出到控制台 */
      if (LoggerLevelPriority[level] >= LoggerLevelPriority[state.level]) {
        process.stdout.write(`${prefixText} ${message}\n`)
      }

      /** 输出到文件 */
      state.fileWriter?.write(level, `[${timestamp}][${levelText}] ${message}\n`)
    }
  }

  setupWriters()

  /** 创建日志实例 */
  const logger: Logger = {
    chalk,
    red: chalk.red,
    green: chalk.green,
    yellow: chalk.yellow,
    blue: chalk.blue,
    magenta: chalk.magenta,
    cyan: chalk.cyan,
    white: chalk.white,
    gray: chalk.gray,
    violet: chalk.hex('#868ECC'),
    get fnc () {
      return chalk.hex(state.config.color || '#FFFF00')
    },

    get level (): LoggerLevel {
      return state.level
    },
    set level (value: LoggerLevel) {
      state.level = value
    },

    get config (): LoggerConfig {
      return { ...state.config }
    },

    configure,
    close: (): void => {
      state.fileWriter?.close?.()
      state.fileWriter = null
    },
    off: (): void => {
      state.level = 'off'
    },
    trace: createLogFunction('trace'),
    debug: createLogFunction('debug'),
    info: createLogFunction('info'),
    warn: createLogFunction('warn'),
    error: createLogFunction('error'),
    fatal: createLogFunction('fatal'),
    mark: createLogFunction('mark'),
    log: createLogFunction('info'),

    bot: (level: LogMethodNames, id: string, ...args: any[]): void => {
      logger[level as keyof LogMethodsOnly](logger.violet(`[Bot:${id}]`), ...args)
    },
    prefix: (prefixStr: string) => {
      return (level: LogMethodNames, ...args: any[]): void => {
        logger[level as keyof LogMethodsOnly](prefixStr, ...args)
      }
    },
  }

  return logger
}
