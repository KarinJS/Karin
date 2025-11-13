/**
 * 休眠（延迟执行）
 *
 * @param ms - 延迟时间（毫秒）
 * @returns Promise<void>
 *
 * @example
 * ```typescript
 * // 延迟 1 秒
 * await sleep(1000)
 * console.log('1 second later')
 *
 * // 在循环中使用
 * for (let i = 0; i < 5; i++) {
 *   console.log(i)
 *   await sleep(500)
 * }
 * ```
 *
 * @public
 */
export const sleep = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms))
}
