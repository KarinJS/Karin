/**
 * 时间单位
 */
export interface TimeUnits {
  /** 天数 */
  days: number
  /** 小时数 */
  hours: number
  /** 分钟数 */
  minutes: number
  /** 秒数 */
  seconds: number
}

/**
 * 格式化选项
 */
export interface FormatOptions {
  /** 是否显示零值单位 @default false */
  showZero?: boolean
  /** 自定义单位文本 */
  units?: {
    day?: string
    hour?: string
    minute?: string
    second?: string
  }
  /** 分隔符 @default '' */
  separator?: string
}

/**
 * 将秒数转换为时间单位对象
 *
 * @param seconds - 秒数
 * @returns 时间单位对象
 *
 * @example
 * ```typescript
 * const units = toTimeUnits(90061)
 * // { days: 1, hours: 1, minutes: 1, seconds: 1 }
 * ```
 *
 * @public
 */
export const toTimeUnits = (seconds: number): TimeUnits => {
  const days = Math.floor(seconds / 86400)
  const hours = Math.floor((seconds % 86400) / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = Math.floor(seconds % 60)

  return {
    days,
    hours,
    minutes,
    seconds: secs,
  }
}

/**
 * 格式化时间差
 *
 * @param startTime - 开始时间戳（秒或毫秒）
 * @param endTime - 结束时间戳（秒或毫秒） @default Date.now()
 * @param options - 格式化选项
 * @returns 格式化的时间字符串
 *
 * @example
 * ```typescript
 * // 格式化时间差
 * const formatted = formatTimeDiff(1620000000000, 1620090000000)
 * // "1天1小时"
 *
 * // 显示所有单位
 * const formatted = formatTimeDiff(1620000000000, 1620090000000, {
 *   showZero: true
 * })
 * // "1天1小时0分钟0秒"
 *
 * // 自定义单位和分隔符
 * const formatted = formatTimeDiff(1620000000000, 1620090000000, {
 *   units: { day: 'd', hour: 'h', minute: 'm', second: 's' },
 *   separator: ' '
 * })
 * // "1d 1h"
 * ```
 *
 * @public
 */
export const formatTimeDiff = (
  startTime: number,
  endTime: number = Date.now(),
  options: FormatOptions = {}
): string => {
  const {
    showZero = false,
    units = {
      day: '天',
      hour: '小时',
      minute: '分钟',
      second: '秒',
    },
    separator = '',
  } = options

  // 标准化时间戳为毫秒
  const start = startTime.toString().length === 10 ? startTime * 1000 : startTime
  const end = endTime.toString().length === 10 ? endTime * 1000 : endTime

  // 计算时间差（秒）
  const diffSeconds = Math.floor((end - start) / 1000)
  const timeUnits = toTimeUnits(diffSeconds)

  // 构建格式化字符串
  const parts: string[] = []

  if (timeUnits.days > 0 || showZero) {
    parts.push(`${timeUnits.days}${units.day}`)
  }

  if (timeUnits.hours > 0 || showZero) {
    parts.push(`${timeUnits.hours}${units.hour}`)
  }

  if (timeUnits.minutes > 0 || showZero) {
    parts.push(`${timeUnits.minutes}${units.minute}`)
  }

  if ((timeUnits.seconds > 0 || showZero) && timeUnits.days === 0) {
    parts.push(`${timeUnits.seconds}${units.second}`)
  }

  return parts.join(separator) || `0${units.second}`
}

/**
 * 获取进程运行时间
 *
 * @param options - 格式化选项
 * @returns 格式化的运行时间字符串
 *
 * @example
 * ```typescript
 * // 获取运行时间
 * const uptime = getUptime()
 * // "1天2小时30分钟"
 *
 * // 自定义格式
 * const uptime = getUptime({
 *   units: { day: 'd', hour: 'h', minute: 'm' },
 *   separator: ' '
 * })
 * // "1d 2h 30m"
 * ```
 *
 * @public
 */
export const getUptime = (options: FormatOptions = {}): string => {
  const seconds = process.uptime()
  const timeUnits = toTimeUnits(seconds)

  const {
    units = {
      day: '天',
      hour: '小时',
      minute: '分钟',
      second: '秒',
    },
    separator = '',
  } = options

  const parts: string[] = []

  if (timeUnits.days > 0) {
    parts.push(`${timeUnits.days}${units.day}`)
  }

  if (timeUnits.hours > 0) {
    parts.push(`${timeUnits.hours}${units.hour}`)
  }

  if (timeUnits.minutes > 0) {
    parts.push(`${timeUnits.minutes}${units.minute}`)
  }

  if (timeUnits.seconds > 0 && timeUnits.days === 0) {
    parts.push(`${timeUnits.seconds}${units.second}`)
  }

  return parts.join(separator) || `0${units.second}`
}
