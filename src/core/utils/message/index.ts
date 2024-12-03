import lodash from 'lodash'
import { ElementTypeEnum, ElementTypes, CustomNodeElementType, segment, SendElementTypes, NodeElementType } from '@/adapter/segment'

/**
 * 将消息元素转换为字符串
 * @param data 消息元素
 * @returns 消息字符串和原始字符串
 */
export const createRawMessage = (data: Array<SendElementTypes>) => {
  if (!Array.isArray(data)) data = [data]
  const msg: string[] = []

  const rawStr = data.map(v => {
    switch (v.type) {
      case ElementTypeEnum.TEXT: {
        msg.push(v.text)
        return v.text
      }
      case ElementTypeEnum.IMAGE:
      case ElementTypeEnum.VIDEO:
      case ElementTypeEnum.RECORD: {
        if (Buffer.isBuffer(v.file)) return `[${v.type}:Buffer://...]`
        if (/^http|^file/.test(v.file)) return `[${v.type}:${v.file}]`
        return `[${v.type}:base64://...]`
      }
      case ElementTypeEnum.JSON:
      case ElementTypeEnum.XML: {
        msg.push(v.data)
        return `[${v.type}:${v.data}]`
      }
      case ElementTypeEnum.AT: return `[at:${v.targetId}]`
      case ElementTypeEnum.FACE: return `[face:${v.id}]`
      case ElementTypeEnum.REPLY: return `[reply:${v.messageId}]`
      case ElementTypeEnum.RPS: return `[rps:${v.id}]`
      case ElementTypeEnum.DICE: return `[dice:${v.id}]`
      case ElementTypeEnum.SHARE: return `[share:${JSON.stringify(v)}]`
      case ElementTypeEnum.CONTACT: return `[contact:${JSON.stringify(v)}]`
      case ElementTypeEnum.LOCATION: return `[location:${JSON.stringify(v)}]`
      case ElementTypeEnum.MUSIC: return `[music:${JSON.stringify(v)}]`
      case ElementTypeEnum.MARKDOWN: return `[markdown:${v.markdown}]`
      case ElementTypeEnum.BUTTON: return `[button:${JSON.stringify(v.data)}]`
      case ElementTypeEnum.KEYBOARD: return `[rows:${JSON.stringify(v.rows)}]`
      case ElementTypeEnum.LONG_MSG: return `[longmsg:${v.id}]`
      case ElementTypeEnum.PASMSG: return `[pasmsg:${v.id}]`
      case ElementTypeEnum.MARKDOWN_TPL: return `[markdowntpl:${JSON.stringify({ templateId: v.templateId, ...v.params })}]`
      default: return `[未知:${lodash.truncate(JSON.stringify(v), { length: 200 })}]`
    }
  }).join('')
  return { msg: msg.join('').trim(), raw: rawStr }
}

/**
 * 消息元素归一化 主要处理字符串文本
 * @param elements 消息
 */
export const makeMessage = (
  elements: string | ElementTypes | SendElementTypes | Array<string | SendElementTypes>
): Array<SendElementTypes> => {
  if (typeof elements === 'string') return [segment.text(elements)]
  if (!Array.isArray(elements)) return [elements]
  return elements.map(v => typeof v === 'string' ? segment.text(v) : v)
}

/**
 * 制作简单转发，返回segment.node[]。仅简单包装node，也可以自己组装
 * @param elements
 * @param fakeId 转发用户的QQ号 必填
 * @param fakeName 转发用户显示的昵称 必填
 */
export const makeForward = (
  elements: string | ElementTypes | Array<string | SendElementTypes> | Array<NodeElementType>,
  fakeId: string,
  fakeName: string
): Array<CustomNodeElementType> => {
  if (!Array.isArray(elements)) elements = [elements]
  return elements.map(v => segment.node(fakeId, fakeName, makeMessage(v)))
}
