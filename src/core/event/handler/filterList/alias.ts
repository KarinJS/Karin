import type { Message } from '@/event'

/**
 * 处理Bot别名
 * @param event 消息事件
 * @param alias Bot别名列表
 * @returns 是否匹配到Bot别名
 */
export const alias = (event: Message, alias: string[]): boolean => {
  const aliasRegex = new RegExp(`^(${alias.join('|')})`)
  const match = event.msg.match(aliasRegex)
  if (match) {
    event.msg = event.msg.replace(aliasRegex, '').trim()
    event.alias = match[1]
    return true
  }
  return false
}
