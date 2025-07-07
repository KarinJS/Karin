import { randomUUID } from 'node:crypto'

/**
 * 创建插件唯一ID
 * @returns 唯一ID
 */
export const createID = () => {
  return randomUUID()
}
