/**
 * 格式化数字，添加千位分隔符
 *
 * @param num - 数字
 * @param digits - 保留小数位数 @default 0
 * @returns 格式化后的字符串
 *
 * @example
 * ```typescript
 * formatNumber(1234567) // '1,234,567'
 * formatNumber(1234.567, 2) // '1,234.57'
 * ```
 *
 * @public
 */
export const formatNumber = (num: number, digits = 0): string => {
  return num.toLocaleString('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  })
}

/**
 * 将数字转换为带单位的字符串（K, M, B）
 *
 * @param num - 数字
 * @param digits - 保留小数位数 @default 1
 * @returns 带单位的字符串
 *
 * @example
 * ```typescript
 * formatUnit(1234) // '1.2K'
 * formatUnit(1234567) // '1.2M'
 * formatUnit(1234567890) // '1.2B'
 * ```
 *
 * @public
 */
export const formatUnit = (num: number, digits = 1): string => {
  const units = ['', 'K', 'M', 'B']
  const order = Math.floor(Math.log10(Math.abs(num)) / 3)
  if (order === 0) return num.toString()
  const unit = units[order] || ''
  const value = (num / Math.pow(1000, order)).toFixed(digits)
  return `${value}${unit}`
}
