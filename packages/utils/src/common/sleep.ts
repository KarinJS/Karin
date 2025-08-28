/**
 * 休眠函数
 * @param ms 毫秒
 * @example
 * ```ts
 * await sleep(1000)
 * ```
 */
export const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))
