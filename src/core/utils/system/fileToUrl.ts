import { handler } from '@/service/handler'
import type { Event } from '@/event/types/index'

/** fileToUrl Handler键 */
export const fileToUrlHandlerKey = 'fileToUrl'

type Args = { e?: Event } & Record<string, any>
type FileToUrlResult<T> = T extends 'image' ? { url: string, width: number, height: number } : { url: string }

export type FileToUrlHandler = {
  <T extends 'image' | 'video' | 'record' | 'file'> (
    /** 文件类型 */
    type: T,
    /** 文件数据 */
    file: string | Buffer | Uint8Array,
    /** 文件名名称: `image.jpg` */
    filename: string,
    /** 自定义参数 如果传e记得符合规范 */
    args?: Args
  ): Promise<FileToUrlResult<T>>
}

/**
 * 文件转换为url
 */
export const fileToUrl: FileToUrlHandler = async (type, file, filename, args) => {
  if (!handler.has(fileToUrlHandlerKey)) throw new Error('[Handler][Error]: 没有配置文件转换为url的处理器')

  return handler(fileToUrlHandlerKey, { file, type, filename, args })
}
