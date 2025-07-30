import lodash from 'node-karin/lodash'
import * as segment from '../../segment/create'
import type { CustomNodeElement, Elements, SendMessage } from '../../segment/types'

export { segment }

/**
 * 将消息元素转换为字符串
 * @param data 消息元素
 * @returns 消息字符串和原始字符串
 */
export const createRawMessage = (data: Elements[]) => {
  if (!Array.isArray(data)) data = [data]
  const msg: string[] = []

  const rawStr = data.map(v => {
    switch (v.type) {
      case 'text': {
        msg.push(v.text)
        return v.text
      }
      case 'image':
      case 'video':
      case 'record': {
        if (Buffer.isBuffer(v.file)) return `[${v.type}:Buffer://...]`
        if (/^http|^file/.test(v.file)) return `[${v.type}:${v.file}]`
        return `[${v.type}:base64://...]`
      }
      case 'file': {
        if (Buffer.isBuffer(v.file)) return `[file:Buffer://..., fid:${v.fid}, hash:${v.hash}]`
        if (/^http|^file/.test(v.file)) return `[file:${v.file}, fid:${v.fid}, hash:${v.hash}]`
        return `[file:base64://..., fid:${v.fid}, hash:${v.hash}]`
      }
      case 'json':
      case 'xml': {
        msg.push(v.data)
        return `[${v.type}:${v.data}]`
      }
      case 'at': return `[at:${v.targetId}]`
      case 'face': return `[face:${v.id}]`
      case 'reply': return `[reply:${v.messageId}]`
      case 'rps': return `[rps:${v.id}]`
      case 'dice': return `[dice:${v.id}]`
      case 'share': return `[share:${JSON.stringify(v)}]`
      case 'contact': return `[contact:${JSON.stringify(v)}]`
      case 'location': return `[location:${JSON.stringify(v)}]`
      case 'music': return `[music:${JSON.stringify(v)}]`
      case 'markdown': return `[markdown:${v.markdown}]`
      case 'button': return `[button:${JSON.stringify(v.data)}]`
      case 'keyboard': return `[rows:${JSON.stringify(v.rows)}]`
      case 'longMsg': return `[longmsg:${v.id}]`
      case 'pasmsg': return `[pasmsg:${v.id}]`
      case 'markdownTpl': return `[markdowntpl:${JSON.stringify({ templateId: v.templateId, ...v.params })}]`
      case 'raw': return `[raw:${JSON.stringify(v.data)}]`
      default: return `[未知:${lodash.truncate(JSON.stringify(v), { length: 200 })}]`
    }
  }).join('')
  return {
    /** 原始消息字符串: `[at:10001]这是一条测试的文本消息` */
    raw: rawStr,
    /**
     * - 经过处理的纯文本
     * - 可用于正则匹配
     * - tips: 此时还没有处理bot前缀
     */
    msg: msg.join('').trim(),
  }
}

/**
 * 消息元素归一化 主要处理字符串文本
 * @param elements 消息
 */
export const makeMessage = (
  elements: SendMessage
): Array<Elements> => {
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
  elements: SendMessage | Array<Elements[]>,
  fakeId?: string,
  fakeName?: string
): Array<CustomNodeElement> => {
  if (!Array.isArray(elements)) elements = [elements]
  return elements.map(v => segment.node(fakeId || '', fakeName || '', makeMessage(v)))
}
