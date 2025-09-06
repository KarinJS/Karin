/**
 * 字符串工具
 */
export const strToBool = {
  /**
   * 将数组中的所有元素转换为字符串 使用`String`转换
   * @param arr 需要转换的数组
   * @returns 转换后的字符串
   * @example strToBool.array([1, '2']) // ['1', '2']
   *          strToBool.array(['3', null, undefined, NaN, '']) // ['3']
   */
  array: (arr: unknown[]): string[] => arr.map(String).filter(item => item.length > 0),
  /**
   * 排除数组中所有非字符串的元素
   * @param arr 需要转换的数组
   * @returns 转换后的字符串
   * @example strToBool.arrayExcludeNonString(['1', '2', '3']) // ['1', '2', '3']
   *          strToBool.arrayExcludeNonString(['1', '2', '3', null, undefined, NaN, '']) // ['1', '2', '3']
   */
  arrayExcludeNonString: (arr: unknown[]): string[] =>
    arr.filter(item => typeof item === 'string' && item.length > 0) as string[],
  /**
   * 将字符串转换为布尔值
   * @param str 需要转换的字符串
   * @returns 转换后的布尔值
   * @example strToBool.string('true') // true
   *          strToBool.string('1') // true
   *          strToBool.string('yes') // true
   *          strToBool.string('on') // true
   *          strToBool.string('false') // false
   *          strToBool.string('0') // false
   *          strToBool.string('no') // false
   */
  string: (str: string): boolean => str === 'true' || str === '1' || str === 'yes' || str === 'on',
  /**
   * 将字符串转换为数字
   * @param str 需要转换的字符串
   * @param defaultValue 默认值 如果非数字 返回默认值
   * @returns 转换后的数字
   * @example strToBool.number('1') // 1
   *          strToBool.number('2') // 2
   *          strToBool.number('3') // 3
   *          strToBool.number('abc', 123) // 123
   */

  number: (str: string, defaultValue: number = 0) => {
    const num = Number(str)
    if (typeof num === 'number') return num
    return defaultValue
  },
  /**
   * 将字符串数组转换为数字数组
   * @param arr 需要转换的数组
   * @returns 转换后的数字数组
   * @example strToBool.arrayNumber(['1', '2', '3']) // [1, 2, 3]
   */
  arrayNumber: (arr: string[]): number[] => {
    const list: number[] = []
    for (const str of arr) {
      const num = Number(str)
      if (typeof num === 'number') list.push(num)
    }

    return list
  },
  /**
   * 传入一个数组 按照索引返回数组 并且将这个数组转换为字符串数组 去掉重复、非字符串的元素
   * @param arr 需要转换的数组
   * @param index 需要返回的索引
   * @returns 转换后的字符串数组
   * @example strToBool.arrayString(['1', '2', '3'], 0) // ['1']
   */
  arrayString: (arr: unknown[]): string[] => {
    for (const item of arr) {
      if (!Array.isArray(item)) continue
      return strToBool.arrayExcludeNonString(item)
    }

    return []
  },
  /**
   * 合并多个数组为一个并去重 如果不是数组将会跳过
   * @param arr 需要合并的数组
   * @returns 合并后的数组
   * @example strToBool.mergeArray(['1', '2', '3'], ['4', '5', '6']) // ['1', '2', '3', '4', '5', '6']
   *          strToBool.mergeArray(['4', '5', '6'], ['4', '5', '6']) // ['4', '5', '6']
   */
  mergeArray: <T> (...arr: unknown[]): T[] => {
    const list: T[] = []
    for (const item of arr) {
      if (!Array.isArray(item)) continue
      list.push(...item)
    }

    return [...new Set(list)]
  },
}
