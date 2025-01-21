import type { AdapterSandbox } from './adapter'

/**
 * 删除一个好友
 * @param bot bot实例
 * @param userId 好友id
 */
export const deleteFriend = async (
  bot: AdapterSandbox,
  userId: string,
) => {
  const key = `${bot.prefix.friend}${userId}`
  /** 检查是否存在 */
  if (!(await bot.level.get(key))) {
    throw new Error(`好友 ${userId} 不存在`)
  }

  await bot.level.del(key)
}

/**
 * 删除一个群
 * @param bot bot实例
 * @param groupId 群id
 */
export const deleteGroup = async (
  bot: AdapterSandbox,
  groupId: string,
) => {
  const key = `${bot.prefix.group}${groupId}`
  /** 检查是否存在 */
  if (!(await bot.level.get(key))) {
    throw new Error(`群 ${groupId} 不存在`)
  }

  const prefix = bot.prefix.groupMember + groupId

  /** 删除全部群成员 */
  const members = await bot.level.keys({
    gte: prefix,
    lt: `${prefix}\uffff`,
  }).all()

  if (members.length > 0) {
    await bot.level.batch(members.map(member => ({ type: 'del', key: member })))
  }
  await bot.level.del(key)
}

/**
 * 删除一个群成员
 * @param bot bot实例
 * @param groupId 群id
 * @param userId 成员id
 */
export const deleteGroupMember = async (
  bot: AdapterSandbox,
  groupId: string,
  userId: string,
) => {
  const key = `${bot.prefix.groupMember}${groupId}:${userId}`
  /** 检查是否存在 */
  if (!(await bot.level.get(key))) {
    throw new Error(`群成员 ${userId} 不存在`)
  }

  await bot.level.del(key)
}

/**
 * 删除一条消息记录
 * @param bot bot实例
 * @param messageId 消息id
 */
export const deleteMessage = async (bot: AdapterSandbox, messageId: string) => {
  await bot.level.del(`${bot.prefix.friendMsg}:${messageId}`)
}
