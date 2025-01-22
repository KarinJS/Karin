import { redis } from '@/service/db'
import { uploadAvatar } from './upload'
import { contactGroup } from '@/event/contact'
import { contactFriend } from '@/event/contact'
import { senderFriend, senderGroup } from '@/event/sender'
import { createFriendMessage, createGroupMessage } from '@/event/create'

import type { AdapterSandbox } from './adapter'
import type { SandboxEvent } from '@/types/sandbox/event'
import type { SandboxMsgRecord } from '@/types/sandbox/db'

/**
 * 创建一个事件
 */
export const createEvent = async (bot: AdapterSandbox, data: SandboxEvent) => {
  if (data.type === 'group') {
    const contact = contactGroup(data.groupId, data.groupName)
    createGroupMessage({
      bot,
      contact,
      elements: data.elements,
      eventId: `message:${data.messageId}`,
      messageId: data.messageId,
      messageSeq: data.seq,
      rawEvent: { data },
      sender: senderGroup(data.sender.id, data.sender.role, data.sender.name),
      time: data.time,
      srcReply: elements => bot.sendMsg(contact, elements),
    })

    createMessage(bot, {
      type: 'group',
      targetId: data.groupId,
      seq: data.seq,
      messageId: data.messageId,
      time: data.time,
      elements: data.elements,
      status: 'normal',
    })

    return
  }

  if (data.type === 'friend') {
    const contact = contactFriend(data.sender.id)
    createFriendMessage({
      bot,
      contact,
      elements: data.elements,
      eventId: `message:${data.messageId}`,
      messageId: data.messageId,
      messageSeq: data.seq,
      rawEvent: { data },
      sender: senderFriend(data.sender.id, data.sender.name),
      time: data.time,
      srcReply: elements => bot.sendMsg(contact, elements),
    })

    createMessage(bot, {
      type: 'friend',
      targetId: data.sender.id,
      seq: data.seq,
      messageId: data.messageId,
      time: data.time,
      elements: data.elements,
      status: 'normal',
    })
    return
  }

  throw new Error(`事件类型错误: ${JSON.stringify(data)}`)
}

/**
 * 创建一条消息的索引、消息id、时间
 * @param bot bot实例
 * @param type 类型
 * @param targetId 目标id
 * @returns 返回消息索引
 */
export const createMsgSeq = async (
  bot: AdapterSandbox,
  type: 'friend' | 'group',
  targetId: string
) => {
  const time = Date.now()
  const seq = await redis.incr(bot.prefix.seq)
  const messageId = `${type}:${targetId}:${time.toString()}`
  return {
    seq,
    time,
    messageId,
  }
}

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
 * 创建一个好友
 * @param bot bot实例
 * @param userId 好友id
 * @param name 好友名称
 * @param avatar 好友头像
 */
export const createFriend = async (
  bot: AdapterSandbox,
  userId: string,
  name: string,
  avatar: string
) => {
  checkCreateCondition(avatar, userId)
  const key = `${bot.prefix.friend}${userId}`
  await bot.level.put(key, name)
  const url = await uploadAvatar(bot, 'friend', userId, avatar)
  return {
    userId,
    name,
    avatar: url,
  }
}

/**
 * 创建一个群
 */
export const createGroup = async (
  bot: AdapterSandbox,
  groupId: string,
  name: string,
  avatar: string
) => {
  checkCreateCondition(avatar, groupId)
  const key = `${bot.prefix.group}${groupId}`
  await bot.level.put(key, name)
  const url = await uploadAvatar(bot, 'group', groupId, avatar)

  /** 初始化群的时候创建Bot为第一个群成员 */
  await bot.level.put(
    `${bot.prefix.groupMember}${groupId}:${bot.selfId}`,
    JSON.stringify({ name, role: 'member' })
  )

  return {
    groupId,
    name,
    avatar: url,
  }
}

/**
 * 创建一个群成员
 * @param bot bot实例
 * @param groupId 群id
 * @param userId 成员id
 * @param name 成员名称
 * @param avatar 成员头像
 * @param role 成员角色
 */
export const createGroupMember = async (
  bot: AdapterSandbox,
  groupId: string,
  userId: string,
  name: string,
  avatar: string,
  role: 'admin' | 'member' | 'owner'
) => {
  if (role !== 'admin' && role !== 'member' && role !== 'owner') {
    throw new TypeError('成员角色错误，可选值: admin, member, owner')
  }

  checkCreateCondition(avatar, userId, groupId)

  /** 检查群是否存在 */
  if (!(await bot.level.get(`${bot.prefix.group}${groupId}`))) {
    throw new Error(`群 ${groupId} 不存在，请先创建群`)
  }

  const key = `${bot.prefix.groupMember}${groupId}:${userId}`
  await bot.level.put(key, JSON.stringify({ name, role }))
  const url = await uploadAvatar(bot, 'group', groupId, avatar)

  return {
    groupId,
    userId,
    name,
    avatar: url,
    role,
  }
}

/**
 * 创建一条消息记录
 * @param bot bot实例
 * @param data 消息数据
 */
export const createMessage = async (
  bot: AdapterSandbox,
  options: SandboxMsgRecord
) => {
  if (options.type !== 'friend' && options.type !== 'group') {
    throw new Error('消息类型错误，可选值: friend, group')
  }

  if (!options.seq || !options.messageId || !options.time) {
    throw new Error('seq、messageId、time 不能为空')
  }

  if (!options.targetId || !options.elements) {
    throw new Error('targetId、elements 不能为空')
  }

  if (!options.status) {
    options.status = 'normal'
  } else if (options.status !== 'normal' && options.status !== 'recall') {
    throw new Error('消息状态错误，可选值: normal, recall')
  }

  const key = options.type === 'friend' ? bot.prefix.friendMsg : bot.prefix.groupMsg
  await bot.level.put(`${key}${options.messageId}`, JSON.stringify(options))
}
