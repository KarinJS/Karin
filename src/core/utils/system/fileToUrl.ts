import { handler } from '@/service/handler'
import type { Event } from '@/event'

/** fileToUrl Handler键 */
export const fileToUrlHandlerKey = 'fileToUrl'

type Args = { e?: Event } & Record<string, any>
type FileToUrlResult<T> = T extends 'image' ? { url: string, width: number, height: number } : { url: string }

export type FileToUrlHandler = {
  <T extends 'image' | 'video' | 'record' | 'file'> (
    type: T,
    file: string,
    filename: string,
    args?: Args
  ): Promise<FileToUrlResult<T>>
}

/**
 * 文件转换为url
 * @param file 文件路径
 * @param type 文件类型
 * @param filename 文件名名称: `image.jpg`
 * @param args 自定义参数
 */
export const fileToUrl: FileToUrlHandler = async (type, file, filename, args) => {
  if (!handler.has(fileToUrlHandlerKey)) throw new Error('[Handler][Error]: 没有配置文件转换为url的处理器')

  return handler(fileToUrlHandlerKey, { file, type, filename, args })
}
