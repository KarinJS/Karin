/**
 * 创建ws响应key 用于收到响应后发布事件
 * @param echo 请求唯一标识符
 */
export const createWsResponseKey = (echo: string) => {
  return `_response:${echo}`
}
