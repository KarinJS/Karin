import chalk from 'chalk'
import util from 'node:util'

/** 时间 */
const time = Date.now()

/** debug模式状态 */
let debugEnabled = false

/**
 * 检查是否开启debug模式
 */
const isDebugMode = () => {
  return debugEnabled || typeof process.env.DEBUG === 'string' || process.argv.some(arg => arg.includes('debug'))
}

/**
 * 创建调试函数
 * @param prefix 前缀
 */
export const createDebug = (prefix: string): {
  /** 颜色库 */
  chalk: typeof chalk,
  /** 设置前缀、时间颜色 */
  setColor: (fnc: (text: string) => string) => void,
  /** 修改debug模式 */
  enable: (bool: boolean) => void,
} & ((...args: any[]) => void) => {
  /** 颜色 */
  let color = (text: string) => chalk.hex('#0cafff')(text)

  /**
   * 设置颜色
   * @param fnc 颜色函数
   */
  const setColor = (fnc: (text: string) => string) => {
    color = fnc
  }

  const debugFn = (...args: any[]) => {
    process.stderr.write(`${color(prefix)} ${util.format(...args)} ${color(`+${Date.now() - time}ms`)}\n`)
  }

  const noop = () => { }
  let debug = isDebugMode() ? debugFn : noop

  return Object.assign(debug, {
    chalk,
    setColor,
    enable: (bool: boolean) => {
      debugEnabled = bool
      debug = isDebugMode() ? debugFn : noop
    },
  })
}
