/**
 * 传入一个时间戳
 * 返回距今已过去的时间
 * @param time - 时间戳
 * @example
 * common.formatTime(1620000000)
 * // -> '18天'
 */
export const formatTime = (time: number): string => {
  time = time.toString().length === 10 ? time * 1000 : time
  time = Math.floor((Date.now() - time) / 1000)

  const day = Math.floor(time / 86400)
  const hour = Math.floor((time % 86400) / 3600)
  const min = Math.floor((time % 3600) / 60)
  const sec = Math.floor(time % 60)

  return `${day}天${hour}小时${min}分钟${sec}秒`.replace(/0[天时分秒]/g, '')
}
