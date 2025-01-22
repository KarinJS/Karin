import { uploadAvatar } from './upload'
import type { AdapterSandbox } from './adapter'

/**
 * 检查是否符合创建条件
 * @param avatar 头像
 * @param userId 用户id
 * @param groupId 群id
 */
const checkCreateCondition = (
  avatar: string,
  userId: string,
  groupId?: string
) => {
  if (!avatar || typeof avatar !== 'string') {
    throw new TypeError('头像仅支持string类型')
  }

  if (!userId || typeof userId !== 'string') {
    throw new TypeError('用户id必须为字符串')
  }

  if (!/^[a-zA-Z0-9]{1,12}$/.test(userId)) {
    throw new TypeError('用户id仅允许字母和数字的组合 并且不超过12位')
  }

  if (groupId) {
    if (typeof groupId !== 'string') {
      throw new TypeError('群id必须为字符串')
    }

    if (!/^[a-zA-Z0-9]{1,12}$/.test(groupId)) {
      throw new TypeError('群id仅允许字母和数字的组合 并且不超过12位')
    }
  }
}

/**
 * 更新Bot名称
 * @param bot bot实例
 * @param options 更新选项
 */
export const updateBotName = async (bot: AdapterSandbox, options: { name: string, avatar: string }) => {
  if (!options.name && !options.avatar) {
    throw new Error('name 和 avatar 不能同时为空')
  }

  const key = `${bot.prefix.friend}${bot.account.selfId}`
  const data = JSON.parse(await bot.level.get(key))

  if (options.name) {
    data.name = options.name
  }

  if (options.avatar) {
    data.avatar = options.avatar
  }

  await bot.level.put(key, JSON.stringify(data))
}

/**
 * 更新好友信息
 * @param bot bot实例
 * @param userId 好友id
 * @param name 好友新名称
 * @param avatar 好友新头像
 */
export const updateFriend = async (
  bot: AdapterSandbox,
  userId: string,
  name?: string,
  avatar?: string
) => {
  if (userId === bot.account.selfId) {
    throw new Error('Bot自身信息请通过 /sandbox/self/update 接口更新')
  }

  const key = `${bot.prefix.friend}${userId}`

  /** 检查好友是否存在 */
  const existingName = await bot.level.get(key).catch(() => null)
  if (!existingName) {
    throw new Error(`好友 ${userId} 不存在`)
  }

  /** 更新名称 */
  if (name) {
    await bot.level.put(key, name)
  }

  /** 更新头像 */
  let avatarUrl
  if (avatar) {
    checkCreateCondition(avatar, userId)
    avatarUrl = await uploadAvatar(bot, 'friend', userId, avatar)
  }

  return {
    userId,
    name: name || existingName,
    avatar: avatarUrl
  }
}

/**
 * 更新群信息
 * @param bot bot实例
 * @param groupId 群id
 * @param name 群新名称
 * @param avatar 群新头像
 */
export const updateGroup = async (
  bot: AdapterSandbox,
  groupId: string,
  name?: string,
  avatar?: string
) => {
  const key = `${bot.prefix.group}${groupId}`

  /** 检查群是否存在 */
  const existingName = await bot.level.get(key).catch(() => null)
  if (!existingName) {
    throw new Error(`群 ${groupId} 不存在`)
  }

  /** 更新名称 */
  if (name) {
    await bot.level.put(key, name)
  }

  /** 更新头像 */
  let avatarUrl
  if (avatar) {
    checkCreateCondition(avatar, groupId)
    avatarUrl = await uploadAvatar(bot, 'group', groupId, avatar)
  }

  return {
    groupId,
    name: name || existingName,
    avatar: avatarUrl
  }
}

/**
 * 更新群成员信息
 * @param bot bot实例
 * @param groupId 群id
 * @param userId 成员id
 * @param name 成员新名称
 * @param avatar 成员新头像
 * @param role 成员新角色
 */
export const updateGroupMember = async (
  bot: AdapterSandbox,
  groupId: string,
  userId: string,
  name?: string,
  avatar?: string,
  role?: 'admin' | 'member' | 'owner'
) => {
  const key = `${bot.prefix.groupMember}${groupId}:${userId}`

  /** 检查群成员是否存在 */
  const existingData = await bot.level.get(key).catch(() => null)
  if (!existingData) {
    throw new Error(`群成员 ${userId} 不存在于群 ${groupId}`)
  }

  const existingInfo = JSON.parse(existingData)

  /** 更新群成员身份 */
  if (role && role !== 'admin' && role !== 'member' && role !== 'owner') {
    throw new TypeError('成员角色错误，可选值: admin, member, owner')
  }

  const newInfo = {
    name: name || existingInfo.name,
    role: role || existingInfo.role
  }

  await bot.level.put(key, JSON.stringify(newInfo))

  /** 更新头像 */
  let avatarUrl
  if (avatar) {
    checkCreateCondition(avatar, userId, groupId)
    avatarUrl = await uploadAvatar(bot, 'group', groupId, avatar)
  }

  return {
    groupId,
    userId,
    name: newInfo.name,
    avatar: avatarUrl,
    role: newInfo.role
  }
}

/**
 * 更新消息记录的状态
 * @param bot bot实例
 * @param messageId 消息id
 * @param status 消息状态
 */
export const updateMessageStatus = async (
  bot: AdapterSandbox,
  messageId: string,
  status: 'normal' | 'recall'
) => {
  await bot.level.put(`${bot.prefix.friendMsg}:${messageId}`, JSON.stringify({ status }))
}
