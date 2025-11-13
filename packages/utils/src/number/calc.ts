/**
 * 限制数值在指定范围内
 *
 * @param value - 数值
 * @param min - 最小值
 * @param max - 最大值
 * @returns 限制后的数值
 *
 * @example
 * ```typescript
 * clamp(5, 0, 10) // 5
 * clamp(-1, 0, 10) // 0
 * clamp(11, 0, 10) // 10
 * ```
 *
 * @public
 */
export const clamp = (value: number, min: number, max: number): number => {
  return Math.min(Math.max(value, min), max)
}

/**
 * 生成指定范围内的随机整数
 *
 * @param min - 最小值（包含）
 * @param max - 最大值（包含）
 * @returns 随机整数
 *
 * @example
 * ```typescript
 * random(1, 10) // 1-10 之间的随机整数
 * ```
 *
 * @public
 */
export const random = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

/**
 * 数字四舍五入到指定小数位
 *
 * @param num - 数字
 * @param decimals - 小数位数 @default 0
 * @returns 处理后的数字
 *
 * @example
 * ```typescript
 * round(1.234, 2) // 1.23
 * round(1.235, 2) // 1.24
 * ```
 *
 * @public
 */
export const round = (num: number, decimals = 0): number => {
  return Number(Math.round(Number(num + 'e' + decimals)) + 'e-' + decimals)
}

/**
 * 计算数组的平均值
 *
 * @param numbers - 数字数组
 * @returns 平均值
 *
 * @example
 * ```typescript
 * average([1, 2, 3, 4, 5]) // 3
 * ```
 *
 * @public
 */
export const average = (numbers: number[]): number => {
  if (numbers.length === 0) return 0
  return numbers.reduce((sum, num) => sum + num, 0) / numbers.length
}

/**
 * 判断是否为偶数
 *
 * @param num - 数字
 * @returns 是否为偶数
 *
 * @example
 * ```typescript
 * isEven(2) // true
 * isEven(3) // false
 * ```
 *
 * @public
 */
export const isEven = (num: number): boolean => {
  return num % 2 === 0
}

/**
 * 计算百分比
 *
 * @param value - 当前值
 * @param total - 总值
 * @param digits - 保留小数位数 @default 2
 * @returns 百分比值
 *
 * @example
 * ```typescript
 * percentage(75, 200) // 37.5
 * percentage(1, 3, 2) // 33.33
 * ```
 *
 * @public
 */
export const percentage = (value: number, total: number, digits = 2): number => {
  if (total === 0) return 0
  return Number(((value / total) * 100).toFixed(digits))
}
