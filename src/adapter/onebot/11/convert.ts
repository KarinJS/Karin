import fs from 'fs'
import { AdapterOneBot11 } from '.'
import { segment } from 'karin/utils'
import { CustomMusicElemen, KarinElement, OB11Segment, OB11SegmentType } from 'karin/types'

/**
   * onebot11转karin
   * @return karin格式消息
   */
export function AdapterConvertKarin (data: Array<OB11Segment>): Array<KarinElement> {
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
        elements.push(segment.image(i.data.url || i.data.file, { file_type: i.data.type }))
        break
      case 'record':
        elements.push(segment.record(i.data.url || i.data.file, i.data.magic === 1))
        break
      case 'video':
        elements.push(segment.video(i.data.url || i.data.file))
        break
      case 'at':
        elements.push(segment.at(i.data.qq, i.data.qq))
        break
      case 'poke':
        elements.push(segment.poke(Number(i.data.id), Number(i.data.type)))
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
        elements.push(segment.forward(i.data.id))
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
function fileToBase64 (file: string, bot: AdapterOneBot11): string {
  if (!bot || !file.startsWith('file://') || !bot.adapter.connect) return file
  const list = ['127.0.0.1', 'localhost']
  const url = new URL(bot.adapter.connect)
  return list.includes(url.hostname) ? `base64://${fs.readFileSync(file.replace(/^file:\/\//, '')).toString('base64')}` : file
}

/**
   * karin转onebot11
   * @param data karin格式消息
   */
export function KarinConvertAdapter (data: Array<KarinElement>, bot: AdapterOneBot11): Array<OB11Segment> {
  const elements = []

  for (const i of data) {
    const type = i.type
    switch (i.type) {
      case OB11SegmentType.Text:
        elements.push({ type, data: { text: i.text } })
        break
      case OB11SegmentType.Face:
        elements.push({ type, data: { id: i.id } })
        break
      case OB11SegmentType.At:
        elements.push({ type, data: { qq: String(i.uid || i.uin) } })
        break
      case OB11SegmentType.Reply:
        elements.push({ type, data: { id: i.message_id } })
        break
      case OB11SegmentType.Image:
      case OB11SegmentType.Video:
      case OB11SegmentType.File: {
        elements.push({ type, data: { file: fileToBase64(i.file, bot) } })
        break
      }
      case OB11SegmentType.Xml: {
        elements.push({ type, data: { data: i.data } })
        break
      }
      case OB11SegmentType.Json: {
        elements.push({ type, data: { data: i.data } })
        break
      }
      case OB11SegmentType.Forward: {
        elements.push({ type, data: { id: i.res_id } })
        break
      }
      case OB11SegmentType.Record: {
        elements.push({ type, data: { file: fileToBase64(i.file, bot), magic: i.magic || false } })
        break
      }
      case OB11SegmentType.Music: {
        if (i.id) {
          elements.push({ type: 'music', data: { type: i.platform, id: i.id } })
        } else {
          const { url, audio, title, author, pic } = i as unknown as CustomMusicElemen
          elements.push({ type: 'music', data: { type: 'custom', url, audio, title, content: author, image: pic } })
        }
        break
      }
      case OB11SegmentType.Poke: {
        elements.push({ type, data: { type: i.poke_type, id: i.id } })
        break
      }
      case 'bubble_face': {
        elements.push({ type: 'bubble_face', data: { id: i.id, count: i.count } })
        break
      }
      case OB11SegmentType.Contact: {
        elements.push({ type, data: { type: i.scene, id: i.peer } })
        break
      }
      case OB11SegmentType.Location: {
        elements.push({ type, data: { lat: i.lat, lon: i.lon, title: i.title, content: i.address } })
        break
      }
      case 'long_msg':
      case 'basketball':
      case 'dice':
      case 'market_face':
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
