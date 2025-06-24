import fs from 'node:fs'
import { segment } from '@/utils/message'
import type { AdapterOneBot } from './core'
import type { Elements, FileElement, SendElement } from '@/types/segment'
import { OneBotMessage, OneBotSegmentType } from '@karinjs/onebot'

/**
 * 处理日志中可能存在的base64字符串
 * @param str 需要处理的字符串
 * @returns 处理后的字符串
 */
export const formatLogString = (str: string): string => {
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
export const buildError = (selfId: string, action: string, request: string, error?: unknown) => {
  if (error) {
    const err = JSON.stringify(error, null, 2).replace(/\\n/g, '\n')
    return new Error(`[${selfId}][sendApi] 请求错误:\n  action: ${action}\n  params: ${formatLogString(request)}\n  error: ${err}}`)
  }

  logger.error(`[${selfId}][sendApi][请求错误]:\n  action: ${action}\n  params: ${formatLogString(request)}`)
}

/**
   * onebot11转karin
   * @param data onebot11格式消息
   * @param onebot 机器人实例
   * @return karin格式消息
   */
export const AdapterConvertKarin = async (
  data: OneBotMessage[],
  onebot: AdapterOneBot
): Promise<Array<Elements>> => {
  if (!Array.isArray(data)) return []

  const elements = []
  try {
    for (const i of data) {
      switch (i.type) {
        case 'text':
          elements.push(segment.text(i.data.text))
          break
        case 'face':
          elements.push(segment.face(Number(i.data.id)))
          break
        case 'image':
          elements.push(segment.image(i.data.url || i.data.file, { fileType: i.data.type }))
          break
        case 'record':
          elements.push(segment.record(i.data.url || i.data.file, i.data.magic === 1))
          break
        case 'video':
          elements.push(segment.video(i.data.url || i.data.file))
          break
        case 'at':
          elements.push(segment.at(i.data.qq, i.data.name))
          break
        case 'contact':
          elements.push(segment.contact(i.data.type === 'qq' ? 'friend' : 'group', i.data.id))
          break
        case 'location':
          elements.push(segment.location(
            Number(i.data.lat),
            Number(i.data.lon),
            i.data.title || '',
            i.data.content || ''
          ))
          break
        case 'reply':
          elements.push(segment.reply(i.data.id))
          break
        case 'json':
          elements.push(segment.json(i.data.data))
          break
        case 'xml':
          elements.push(segment.xml(i.data.data))
          break
        case 'file':
          elements.push(await getFileSegment(i.data, onebot))
          break
        default: {
          elements.push(segment.text(JSON.stringify(i)))
        }
      }
    }
  } catch (error) {
    logger.error('[AdapterConvertKarin] 转换错误')
    logger.error(error)
    return elements
  }
  return elements
}

/**
 * 获取文件消息段
 * @param file 文件信息
 * @param adapter 机器人实例
 * @param contact 联系人信息
 * @returns 文件消息段
 */
export const getFileSegment = async (
  file: any,
  adapter: AdapterOneBot
): Promise<FileElement> => {
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
    const { url, file_size } = await adapter._onebot.nc_getFile(file.file_id)
    return segment.file(url, {
      name: file.file,
      size: Number(file_size),
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
export const fileToBase64 = (file: string, url: string): string => {
  if (!url || !file.startsWith('file://')) return file
  const list = ['127.0.0.1', 'localhost']
  const link = new URL(url)
  return list.includes(link.hostname) ? file : `base64://${fs.readFileSync(file.replace('file://', '')).toString('base64')}`
}

/**
   * karin转onebot11
   * @param data karin格式消息
   */
export const KarinConvertAdapter = (data: Array<SendElement>, onebot: AdapterOneBot) => {
  const elements: OneBotMessage[] = []

  for (const i of data) {
    switch (i.type) {
      case 'text':
        elements.push({ type: OneBotSegmentType.Text, data: { text: i.text } })
        break
      case 'face':
        elements.push({ type: OneBotSegmentType.Face, data: { id: i.id + '' } })
        break
      case 'at':
        elements.push({ type: OneBotSegmentType.At, data: { qq: String(i.targetId), name: i.name } })
        break
      case 'reply':
        elements.push({ type: OneBotSegmentType.Reply, data: { id: i.messageId } })
        break
      case 'image': {
        elements.push({ type: OneBotSegmentType.Image, data: { file: fileToBase64(i.file, onebot.adapter.address) } })
        break
      }
      case 'video': {
        elements.push({ type: OneBotSegmentType.Video, data: { file: i.file } })
        break
      }
      case 'json': {
        elements.push({ type: OneBotSegmentType.Json, data: { data: i.data } })
        break
      }
      case 'xml': {
        elements.push({ type: OneBotSegmentType.Xml, data: { data: i.data } })
        break
      }
      case 'record': {
        elements.push({
          type: OneBotSegmentType.Record,
          data: {
            file: fileToBase64(i.file, onebot.adapter.address),
            magic: (i.magic ?? false) ? 1 : 0,
          },
        })
        break
      }
      case 'music': {
        if (i.platform === 'custom') {
          const { url, audio, title, author, pic } = i
          elements.push({
            type: OneBotSegmentType.Music,
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
            type: OneBotSegmentType.Music,
            data: {
              type: i.platform as 'qq' | '163' | 'xm',
              id: i.id,
            },
          })
        }
        break
      }
      // case OB11SegmentType.Contact: {
      //   elements.push({ type, data: { type: i.scene, id: i.peer } })
      //   break
      // }
      // case OB11SegmentType.Location: {
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
        elements.push({ type: OneBotSegmentType.Dice, data: { id: i.id } })
        break
      }
      case 'rps': {
        elements.push({ type: OneBotSegmentType.Rps, data: {} })
        break
      }
      case 'share': {
        elements.push({ type: OneBotSegmentType.Share, data: { url: i.url, title: i.title, content: i.content, image: i.image } })
        break
      }
      case 'raw':
        elements.push(i.data)
        break
      case 'node': {
        if (i.subType === 'messageID') {
          elements.push({ type: OneBotSegmentType.Forward, data: { id: i.messageId } })
        } else {
          elements.push({
            type: OneBotSegmentType.Node,
            data: {
              user_id: i.userId || onebot.selfId,
              nickname: i.nickname || onebot.selfName,
              content: KarinConvertAdapter(i.message, onebot),
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
