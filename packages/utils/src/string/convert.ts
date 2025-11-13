/**
 * 字符串转布尔值
 *
 * @param str - 字符串
 * @returns 布尔值
 *
 * @example
 * ```typescript
 * toBoolean('true') // true
 * toBoolean('1') // true
 * toBoolean('yes') // true
 * toBoolean('on') // true
 * toBoolean('false') // false
 * toBoolean('0') // false
 * ```
 *
 * @public
 */
export const toBoolean = (str: string): boolean => {
  return str === 'true' || str === '1' || str === 'yes' || str === 'on'
}

/**
 * 字符串转数字
 *
 * @param str - 字符串
 * @param defaultValue - 默认值 @default 0
 * @returns 数字
 *
 * @example
 * ```typescript
 * toNumber('123') // 123
 * toNumber('abc', 0) // 0
 * ```
 *
 * @public
 */
export const toNumber = (str: string, defaultValue = 0): number => {
  const num = Number(str)
  return isNaN(num) ? defaultValue : num
}

/**
 * 数组元素转字符串
 *
 * @param arr - 数组
 * @returns 字符串数组
 *
 * @example
 * ```typescript
 * toStringArray([1, 2, 3]) // ['1', '2', '3']
 * toStringArray([1, null, undefined, 'test']) // ['1', 'test']
 * ```
 *
 * @public
 */
export const toStringArray = (arr: unknown[]): string[] => {
  return arr
    .map(item => String(item))
    .filter(item => item && item !== 'null' && item !== 'undefined')
}

/**
 * 过滤非字符串元素
 *
 * @param arr - 数组
 * @returns 字符串数组
 *
 * @example
 * ```typescript
 * filterStrings([1, 'hello', null, 'world']) // ['hello', 'world']
 * ```
 *
 * @public
 */
export const filterStrings = (arr: unknown[]): string[] => {
  return arr.filter(
    item => typeof item === 'string' && item.length > 0
  ) as string[]
}
