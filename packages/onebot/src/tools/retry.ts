/**
 * 通用的重试工具
 * @param fn - 需要重试的异步函数
 * @param maxRetries - 最大重试次数
 * @param retryInterval - 重试间隔(毫秒)
 * @returns 函数执行结果
 * @throws 如果所有尝试均失败，则抛出最后一次错误
 */
export const retry = async <T> (
  fn: () => Promise<T>,
  maxRetries: number,
  retryInterval: number
): Promise<T> => {
  let lastError: unknown

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn()
    } catch (err) {
      lastError = err
      if (attempt < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, retryInterval))
      }
    }
  }

  throw lastError
}
