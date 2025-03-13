import lodash from 'lodash'

/**
 * 比较两个对象数组，找出它们之间的差异
 * @description 使用深度比较方式，返回在旧数组中被移除的对象和在新数组中新增的对象
 * @param old 旧数组 - 作为比较基准的原始数组
 * @param data 新数组 - 需要与基准数组进行比较的目标数组
 * @returns 包含差异的对象
 *          - removed: 在旧数组中存在但在新数组中不存在的对象集合
 *          - added: 在新数组中存在但在旧数组中不存在的对象集合
 *          - common: 在两个数组中都存在的对象集合
 * @example
 * const diff = diffArray(
 *   [{ self_id: 123, token: '123' }, { self_id: 222, token: '123' }],
 *   [{ self_id: 123, token: '123' }, { self_id: 333, token: '123' }]
 * )
 * // 结果: {
 * //   removed: [{ self_id: 222, token: '123' }],
 * //   added: [{ self_id: 333, token: '123' }],
 * //   common: [{ self_id: 123, token: '123' }]
 * // }
 */
export const diffArray = <T extends Record<string, any>, K extends Record<string, any>> (
  old: T[],
  data: K[]
) => {
  const removed = lodash.differenceWith(old, data, lodash.isEqual)
  const added = lodash.differenceWith(data, old, lodash.isEqual)
  const common = lodash.intersectionWith(old, data, lodash.isEqual)

  return { removed, added, common }
}

/**
 * 比较两个单维数组，找出它们之间的差异
 * @description 返回在旧数组中被移除的元素和在新数组中新增的元素
 * @param old 旧数组 - 作为比较基准的原始数组
 * @param data 新数组 - 需要与基准数组进行比较的目标数组
 * @returns 包含差异的对象
 *          - removed: 在旧数组中存在但在新数组中不存在的元素集合
 *          - added: 在新数组中存在但在旧数组中不存在的元素集合
 *          - common: 在两个数组中都存在的元素集合
 * @example
 * const result = diffSimpleArray([1, 2, 3], [2, 3, 4])
 * // 结果: {
 * //   removed: [1],
 * //   added: [4],
 * //   common: [2, 3]
 * // }
 */
export const diffSimpleArray = <T> (old: T[], data: T[]) => {
  const removed = lodash.difference(old, data)
  const added = lodash.difference(data, old)
  const common = lodash.intersection(old, data)

  return { removed, added, common }
}

/**
 * 确保数值在指定范围内
 * @param value 需要限制的数值
 * @param min 最小值
 * @param max 最大值
 * @returns 限制在范围内的数值
 * @example clamp(5, 0, 10) // 返回 5
 *          clamp(-1, 0, 10) // 返回 0
 *          clamp(11, 0, 10) // 返回 10
 */
export const clamp = (value: number, min: number, max: number): number => {
  return Math.min(Math.max(value, min), max)
}

/**
 * 生成指定范围内的随机整数
 * @param min 最小值（包含）
 * @param max 最大值（包含）
 * @returns 随机整数
 * @example random(1, 10) // 返回 1-10 之间的随机整数
 */
export const random = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

/**
 * 格式化数字，添加千位分隔符
 * @param num 需要格式化的数字
 * @param digits 保留小数位数，默认为 0
 * @returns 格式化后的字符串
 * @example formatNumber(1234567) // 返回 "1,234,567"
 *          formatNumber(1234.567, 2) // 返回 "1,234.57"
 */
export const formatNumber = (num: number, digits: number = 0): string => {
  return num.toLocaleString('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  })
}

/**
 * 计算百分比
 * @param value 当前值
 * @param total 总值
 * @param digits 保留小数位数，默认为 2
 * @returns 百分比值
 * @example percentage(75, 200) // 返回 37.5
 */
export const percentage = (value: number, total: number, digits: number = 2): number => {
  if (total === 0) return 0
  return Number(((value / total) * 100).toFixed(digits))
}

/**
 * 将数字转换为带单位的字符串（K, M, B）
 * @param num 需要转换的数字
 * @param digits 保留小数位数，默认为 1
 * @returns 带单位的字符串
 * @example formatUnit(1234) // 返回 "1.2K"
 *          formatUnit(1234567) // 返回 "1.2M"
 *          formatUnit(1234567890) // 返回 "1.2B"
 */
export const formatUnit = (num: number, digits: number = 1): string => {
  const units = ['', 'K', 'M', 'B']
  const order = Math.floor(Math.log10(Math.abs(num)) / 3)
  if (order === 0) return num.toString()
  const unit = units[order] || ''
  const value = (num / Math.pow(1000, order)).toFixed(digits)
  return `${value}${unit}`
}

/**
 * 判断一个数是否为偶数
 * @param num 需要判断的数字
 * @returns 是否为偶数
 * @example isEven(2) // 返回 true
 *          isEven(3) // 返回 false
 */
export const isEven = (num: number): boolean => {
  return num % 2 === 0
}

/**
 * 计算数组的平均值
 * @param numbers 数字数组
 * @returns 平均值
 * @example average([1, 2, 3, 4, 5]) // 返回 3
 */
export const average = (numbers: number[]): number => {
  if (numbers.length === 0) return 0
  return numbers.reduce((sum, num) => sum + num, 0) / numbers.length
}

/**
 * 将数字四舍五入到指定小数位
 * @param num 需要处理的数字
 * @param decimals 小数位数，默认为 0
 * @returns 处理后的数字
 * @example round(1.234, 2) // 返回 1.23
 *          round(1.235, 2) // 返回 1.24
 */
export const round = (num: number, decimals: number = 0): number => {
  return Number(Math.round(Number(num + 'e' + decimals)) + 'e-' + decimals)
}
