/**
 * 获取运行时间
 * @example
 * ```ts
 * uptime()
 * // -> '1天2小时3分钟4秒'
 * // -> '2小时3分钟4秒'
 * // -> '3分钟4秒'
 * // -> '4秒'
 * ```
 */
export const uptime = () => {
  const time = process.uptime()
  const day = Math.floor(time / 86400)
  const hour = Math.floor((time % 86400) / 3600)
  const min = Math.floor((time % 3600) / 60)
  const sec = Math.floor(time % 60)

  const parts = [day ? `${day}天` : '', hour ? `${hour}小时` : '', min ? `${min}分钟` : '', !day && sec ? `${sec}秒` : '']

  return parts.filter(Boolean).join('')
}
