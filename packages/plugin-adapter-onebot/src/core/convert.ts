import fs from 'node:fs'
import { segment } from '@karinjs/adapter'
import { OneBotMessageType } from '@karinjs/onebot'

import type { AdapterOneBot } from './adapter'
import type { OneBotMessage } from '@karinjs/onebot'
import type { Elements, FileElement, SendElement } from '@karinjs/adapter'

/**
 * OneBot消息转换器类
 */
export class OneBotConverter {
  /** OneBot适配器实例 */
  core: AdapterOneBot

  constructor (onebot: AdapterOneBot) {
    this.core = onebot
  }

  /**
   * 处理日志中可能存在的base64字符串
   * @param str 需要处理的字符串
   * @returns 处理后的字符串
   */
  formatLogString (str: string): string {
    // 匹配 "base64://..." 或 "base://..." 开头的长字符串
    return str.replace(/(["']?(?:base64|base):\/\/)[^"',}\s]*["']?/g, '$1...')
  }

  /**
   * 构建错误信息
   * @param selfId 机器人ID
   * @param action 请求的action
   * @param request 请求的参数
   * @param error 错误信息
   */
  buildError (selfId: string, action: string, request: string, error?: unknown) {
    if (error) {
      const err = JSON.stringify(error, null, 2).replace(/\\n/g, '\n')
      return new Error(`[${selfId}][sendApi] 请求错误:\n  action: ${action}\n  params: ${this.formatLogString(request)}\n  error: ${err}}`)
    }

    logger.error(`[${selfId}][sendApi][请求错误]:\n  action: ${action}\n  params: ${this.formatLogString(request)}`)
  }

  /**
   * 转换单个onebot消息为karin格式
   * @param message onebot消息
   * @returns karin格式的消息元素
   */
  async convertOneBotMessageToKarin (message: OneBotMessage): Promise<Elements> {
    const handlers: Record<string, () => Elements | Promise<Elements>> = {
      text: () => segment.text(message.data.text),
      face: () => segment.face(Number(message.data.id)),
      image: () => segment.image(message.data.url || message.data.file, {
        ...message.data,
        fileType: message.data.type,
        fid: message.data.fid,
        md5: message.data.md5,
        size: message.data.size,
        summary: message.data.summary,
        width: message.data.width,
        height: message.data.height,
      }),
      record: () => segment.record(message.data.url || message.data.file, message.data.magic === 1),
      video: () => segment.video(message.data.url || message.data.file),
      at: () => segment.at(message.data.qq, message.data.name),
      contact: () => segment.contact(message.data.type === 'qq' ? 'friend' : 'group', message.data.id),
      location: () => segment.location(
        Number(message.data.lat),
        Number(message.data.lon),
        message.data.title || '',
        message.data.content || ''
      ),
      reply: () => segment.reply(message.data.id),
      json: () => segment.json(message.data.data),
      xml: () => segment.xml(message.data.data),
      file: async () => await this.getFileMessage(message.data),
    }

    const handler = handlers[message.type]
    return handler ? await handler() : segment.text(JSON.stringify(message))
  }

  /**
   * onebot11转karin
   * @param data onebot11格式消息
   * @return karin格式消息
   */
  async adapterConvertKarin (data: OneBotMessage[]): Promise<Array<Elements>> {
    if (!Array.isArray(data)) return []

    const elements: Array<Elements> = []
    try {
      await Promise.all(data.map(async (val, index) => {
        elements[index] = await this.convertOneBotMessageToKarin(val)
      }))
      return elements.filter(Boolean)
    } catch (error) {
      logger.error(new Error('[OneBot] 消息段转换错误:', { cause: error }))
      return elements.filter(Boolean)
    }
  }

  /**
   * 获取文件消息段
   * @param file 文件信息
   * @returns 文件消息段
   */
  async getFileMessage (file: any): Promise<FileElement> {
    // lgl
    if ('file_name' in file && 'file_hash' in file) {
      return segment.file(file.url, {
        name: file.file_name,
        hash: file.file_hash,
        fid: file.file_id,
      })
    }

    // napcat 需要手动获取url
    if (Object.keys(file).length === 3 && 'file_size' in file && 'file_id' in file) {
      const { url, file_size: fileSize } = await this.core.core.nc_getFile(file.file_id)
      return segment.file(url, {
        name: file.file,
        size: Number(fileSize),
        fid: file.file_id,
        hash: file.file_hash,
      })
    }

    return segment.file(file.file, { ...file })
  }

  /**
   * 处理非本地ws的文件
   * @param file 文件路径
   */
  fileToBase64 (file: string, url: string): string {
    if (typeof file !== 'string') {
      throw new TypeError('文件仅支持 file:// http(s):// base64:// 协议')
    }

    if (!url || !file.startsWith('file://')) return file
    const list = ['127.0.0.1', 'localhost']
    const link = new URL(url)
    return list.includes(link.hostname)
      ? file
      : `base64://${fs.readFileSync(file.replace('file://', '')).toString('base64')}`
  }

  /**
   * karin转onebot11
   * @param data karin格式消息
   */
  karinConvertAdapter (data: Array<SendElement>) {
    const elements: OneBotMessage[] = []

    for (const i of data) {
      switch (i.type) {
        case 'text':
          elements.push({ type: OneBotMessageType.Text, data: { text: i.text } })
          break
        case 'face':
          elements.push({ type: OneBotMessageType.Face, data: { id: i.id + '' } })
          break
        case 'at':
          elements.push({ type: OneBotMessageType.At, data: { qq: String(i.targetId), name: i.name } })
          break
        case 'reply':
          elements.push({ type: OneBotMessageType.Reply, data: { id: i.messageId } })
          break
        case 'image': {
          elements.push({
            type: OneBotMessageType.Image,
            data: {
              file: this.fileToBase64(i.file, this.core.adapter.address),
              md5: i.md5,
              size: i.size,
              width: i.width,
              height: i.height,
              fid: i.fid,
              summary: i.summary,
            },
          })
          break
        }
        case 'video': {
          elements.push({ type: OneBotMessageType.Video, data: { file: i.file } })
          break
        }
        case 'json': {
          elements.push({ type: OneBotMessageType.Json, data: { data: i.data } })
          break
        }
        case 'xml': {
          elements.push({ type: OneBotMessageType.Xml, data: { data: i.data } })
          break
        }
        case 'record': {
          elements.push({
            type: OneBotMessageType.Record,
            data: {
              file: this.fileToBase64(i.file, this.core.adapter.address),
              magic: (i.magic ?? false) ? 1 : 0,
            },
          })
          break
        }
        case 'music': {
          if (i.platform === 'custom') {
            const { url, audio, title, author, pic } = i
            elements.push({
              type: OneBotMessageType.Music,
              data: {
                type: 'custom',
                url,
                audio,
                title,
                content: author,
                image: pic,
              },
            })
          } else {
            elements.push({
              type: OneBotMessageType.Music,
              data: {
                type: i.platform as 'qq' | '163' | 'xm',
                id: i.id,
              },
            })
          }
          break
        }
        // case OB11MessageType.Contact: {
        //   elements.push({ type, data: { type: i.scene, id: i.peer } })
        //   break
        // }
        // case OB11MessageType.Location: {
        //   elements.push({ type, data: { lat: i.lat, lon: i.lon, title: i.title, content: i.address } })
        //   break
        // }
        // case 'longMsg':
        // case 'basketball':
        // case 'marketFace': {
        //   elements.push({ type: 'marketFace', data: { id: i.id + '' } })
        //   break
        // }
        // case 'gift': {
        //   elements.push({ type: 'gift', data: { qq: i.qq, id: i.id } })
        //   break
        // }
        // case 'weather': {
        //   elements.push({ type: 'weather', data: { city: i.city, type: i.type } })
        //   break
        // }
        case 'dice': {
          elements.push({ type: OneBotMessageType.Dice, data: { id: i.id } })
          break
        }
        case 'rps': {
          elements.push({ type: OneBotMessageType.Rps, data: {} })
          break
        }
        case 'share': {
          elements.push({ type: OneBotMessageType.Share, data: { url: i.url, title: i.title, content: i.content, image: i.image } })
          break
        }
        case 'raw':
          elements.push(i.data)
          break
        case 'node': {
          if (i.subType === 'messageID') {
            elements.push({ type: OneBotMessageType.Forward, data: { id: i.messageId } })
          } else {
            elements.push({
              type: OneBotMessageType.Node,
              data: {
                user_id: i.userId || this.core.selfId,
                nickname: i.nickname || this.core.selfName,
                content: this.karinConvertAdapter(i.message),
                // prompt: i?.options?.prompt,
                // summary: i?.options?.summary,
                // source: i?.options?.source,
              },
            })
          }
          break
        }
        case 'button':
        case 'markdown':
        case 'keyboard':
        default: {
          elements.push(i as any)
          break
        }
      }
    }
    return elements
  }
}
