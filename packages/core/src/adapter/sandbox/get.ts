import type { AdapterSandbox } from './adapter'
import type { SandboxMsgRecord } from '@/types/sandbox/db'

/**
 * 获取历史记录
 * @param bot bot实例
 * @param type 类型
 * @param targetId 目标id
 * @param count 数量
 */
export const getHistory = async (
  bot: AdapterSandbox,
  type: 'friend' | 'group',
  targetId: string,
  count: number = 10
) => {
  if (!targetId) {
    throw new Error('targetId 不能为空')
  }
  if (!type) {
    throw new Error('type 不能为空')
  }

  if (count > 20) count = 20

  const prefix = type === 'friend' ? bot.prefix.friendMsg : bot.prefix.groupMsg
  const keys = await bot.level.keys({
    gt: `${prefix}${type}:${targetId}`,
    lt: `${prefix}${type}:${targetId}\uffff`,
  }).all()

  /** 排除掉 */

  const list = (await Promise.all(keys.map(key => bot.level.get(key))))
    .map(item => JSON.parse(item)) as SandboxMsgRecord[]

  const obj: Record<string, SandboxMsgRecord[]> = {}

  list.forEach(item => {
    const key = `${item.type}:${item.targetId}`
    if (!obj[key]) {
      obj[key] = []
    }
    obj[key].push(item)
  })

  /** 按照seq进行排序 越小越靠前 */
  Object.keys(obj).forEach(key => {
    obj[key].sort((a, b) => a.seq - b.seq)
  })

  /** 如果有超过20条的 删除掉超出部分 从小开始删 */
  Object.keys(obj).forEach(key => {
    if (obj[key].length > 20) {
      obj[key].splice(0, obj[key].length - 20)
    }
  })

  /** 返回结果 按照seq排序 越小越靠前 */
  return Object.values(obj).flat().sort((a, b) => a.seq - b.seq)
}
