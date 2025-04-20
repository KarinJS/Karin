/**
 * 生成随机字母字符串
 * @param length - 字符串长度
 */
export const getStr = (length: number): string => {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

/**
 * 睡眠函数
 * @param ms - 毫秒
 * @description sleep
 * @example
 * ```ts
 * await sleep(1000)
 * console.log('1s后执行')
 * ```
 */
export const sleep = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms))
}
