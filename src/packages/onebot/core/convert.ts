import fs from 'node:fs'
import type { OB11Segment } from '../types'
import type { AdapterOneBot } from './base'
import { Elements, SendElement } from '@/types/segment'
import { segment } from '@/utils/message'

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
    return new Error(`[${selfId}][sendApi] 请求错误:\n  action: ${action}\n  params: ${request}\n  error: ${err}}`)
  }

  logger.error(`[${selfId}][sendApi][请求错误]:\n  action: ${action}\n  params: ${request}`)
}

/**
   * onebot11转karin
   * @return karin格式消息
   */
export function AdapterConvertKarin (data: Array<OB11Segment>): Array<Elements> {
  const elements = []
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
      case 'poke':
        // TODO: 需要变成通知事件 但是貌似已经没有这个消息类型了
        // elements.push(segment.poke(Number(i.data.id), Number(i.data.type)))
        break
      case 'contact':
        elements.push(segment.contact(i.data.type === 'qq' ? 'friend' : 'group', i.data.id))
        break
      case 'location':
        elements.push(segment.location(Number(i.data.lat), Number(i.data.lon), i.data.title || '', i.data.content || ''))
        break
      case 'reply':
        elements.push(segment.reply(i.data.id))
        break
      case 'forward':
        // TODO: 需要变成通知事件
        // elements.push(segment.forward(i.data.id))
        break
      case 'json':
        elements.push(segment.json(i.data.data))
        break
      case 'xml':
        elements.push(segment.xml(i.data.data))
        break
      default: {
        elements.push(segment.text(JSON.stringify(i)))
      }
    }
  }
  return elements
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
export const KarinConvertAdapter = (data: Array<SendElement>, onebot: AdapterOneBot): Array<OB11Segment> => {
  const elements = []

  for (const i of data) {
    const type = i.type
    switch (i.type) {
      case 'text':
        elements.push({ type, data: { text: i.text } })
        break
      case 'face':
        elements.push({ type, data: { id: i.id } })
        break
      case 'at':
        elements.push({ type, data: { qq: String(i.targetId), name: i.name } })
        break
      case 'reply':
        elements.push({ type, data: { id: i.messageId } })
        break
      case 'image':
      case 'video': {
        elements.push({ type, data: { file: fileToBase64(i.file, onebot.adapter.address) } })
        break
      }
      case 'json':
      case 'xml': {
        elements.push({ type, data: { data: i.data } })
        break
      }
      case 'record': {
        elements.push({ type, data: { file: fileToBase64(i.file, onebot.adapter.address), magic: i.magic || false } })
        break
      }
      case 'music': {
        if (i.platform === 'custom') {
          const { url, audio, title, author, pic } = i
          elements.push({ type: 'music', data: { type: 'custom', url, audio, title, content: author, image: pic } })
        } else {
          elements.push({ type: 'music', data: { type: i.platform, id: i.id } })
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
      case 'longMsg':
      case 'basketball':
      case 'dice':
      case 'marketFace':
      case 'rps': {
        elements.push({ type: i.type, data: { id: i.id } })
        break
      }
      case 'gift': {
        elements.push({ type: 'gift', data: { qq: i.qq, id: i.id } })
        break
      }
      case 'share': {
        elements.push({ type: 'share', data: { url: i.url, title: i.title, content: i.content, image: i.image } })
        break
      }
      case 'weather': {
        elements.push({ type: 'weather', data: { city: i.city, type: i.type } })
        break
      }
      case 'raw':
        elements.push(i.data)
        break
      case 'node': {
        if (i.subType === 'messageID') {
          elements.push({ type: 'forward', data: { id: i.messageId } })
        } else {
          elements.push({
            type: 'node',
            data: {
              user_id: i.userId || onebot.selfId,
              nickname: i.nickname || onebot.selfName,
              content: KarinConvertAdapter(i.message, onebot),
              prompt: i?.options?.prompt,
              summary: i?.options?.summary,
              source: i?.options?.source,
            },
          })
        }
        break
      }
      case 'button':
      case 'markdown':
      case 'keyboard':
      default: {
        elements.push(i)
        break
      }
    }
  }
  return elements as Array<OB11Segment>
}
