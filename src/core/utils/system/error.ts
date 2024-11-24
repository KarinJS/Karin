/**
 * @description 拆解错误对象 用于`JSON`序列化
 * @param error 错误对象
 * @returns 拆解后的错误对象
 */
export const stringifyError = (error?: Error | null) => {
  const { name, message, stack } = error || {}
  return { name, message, stack }
}
