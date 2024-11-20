import { isSubPath } from './path'
import { cache } from '@/plugin/cache/cache'

/**
 * @description 传入一个文件路径，检查是否是静态资源中的文件
 * @param filePath 文件路径
 * @returns 是否是静态资源中的文件
 */
export const isStatic = (filePath: string) => {
  try {
    for (const item of cache.static) {
      if (isSubPath(item, filePath)) {
        return true
      }
    }
    return false
  } catch (error) {
    logger.error('isStatic', error)
    return false
  }
}
