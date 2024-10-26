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
