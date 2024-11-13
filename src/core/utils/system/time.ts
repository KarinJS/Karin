/**
 * 获取kairn运行时间
 * @example
 * ```ts
 * uptime()
 * ```
 */
export const uptime = (): string => {
  const time = process.uptime()
  const day = Math.floor(time / 86400)
  const hour = Math.floor((time % 86400) / 3600)
  const min = Math.floor((time % 3600) / 60)
  const sec = Math.floor(time % 60)

  const parts = [
    day ? `${day}天` : '',
    hour ? `${hour}小时` : '',
    min ? `${min}分钟` : '',
    !day && sec ? `${sec}秒` : '',
  ]

  return parts.filter(Boolean).join('')
}

/**
 * @description 传入一个或两个时间戳
 * @description 传入一个返回当前时间 - 时间1
 * @description 传入两个返回时间2 - 时间1
 * @param time - 时间戳
 * @example
 * common.formatTime(1620000000)
 * // -> '18天'
 * common.formatTime(1620000000, 1620000000)
 * // -> '18天'
 */
export const formatTime = (time: number, time2: number = Date.now()): string => {
  time2 = time2 || Date.now()
  time = time.toString().length === 10 ? time * 1000 : time
  time = Math.floor((time2 - time) / 1000)
  time2 = time2.toString().length === 10 ? time2 * 1000 : time2
  time2 = Math.floor((time2 - time) / 1000)

  const day = Math.floor(time / 86400)
  const hour = Math.floor((time % 86400) / 3600)
  const min = Math.floor((time % 3600) / 60)
  const sec = Math.floor(time % 60)

  return `${day}天${hour}小时${min}分钟${sec}秒`.replace(/0[天时分秒]/g, '')
}
