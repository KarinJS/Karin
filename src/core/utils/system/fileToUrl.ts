import { handler } from '@/service/handler'
import type { Event } from '@/event'

/** fileToUrl Handler键 */
export const fileToUrlHandlerKey = 'fileToUrl'

/**
 * 文件转换为url
 * @param file 文件路径
 * @param type 文件类型
 * @param args 自定义参数
 */
export const fileToUrl = async (
  file: string,
  type: 'image' | 'video' | 'record' | 'file',
  args?: { e?: Event } & Record<string, any>
): Promise<{
  /** 文件链接 */
  url: string
  /** 此参数为图片类型专属 */
}> => {
  if (!handler.has(fileToUrlHandlerKey)) throw new Error('[Handler][Error]: 没有配置文件转换为url的处理器')

  return handler(fileToUrlHandlerKey, { file, type, args })
}
