import type { Event } from '../event'

type Args = { e?: Event } & Record<string, any>
export type FileToUrlResult<T> = T extends 'image'
  ? { url: string, width: number, height: number }
  : { url: string }

/**
 * 文件转换为url类型
 */
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
