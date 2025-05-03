import { promises as fs, createWriteStream } from 'node:fs'
import path from 'node:path'
import { sandboxDataPath } from '@/root'
import type {
  FriendMessageOptions,
  GroupMessageOptions,
  NoticeOptions,
  RequestOptions,
} from '@/types/event'
import type {
  FriendData,
  GroupData,
  GroupMemberData,
  DbStreams,
} from '@/types/sandbox/db'
import type { SandBoxAccountInfo } from '@/types/sandbox/account'

/** 默认用户、群成员头像 */
export const DEFAULT_USER_AVATAR = 'https://q1.qlogo.cn/g?b=qq&nk=1812868335&s=0'
/** 默认群头像 */
export const DEFAULT_GROUP_AVATAR = 'https://p.qlogo.cn/gh/967068507/967068507/0'

/** 沙盒db根目录 */
export const root = path.join(sandboxDataPath, 'db')

/** 登录号信息 */
export const selfInfo: SandBoxAccountInfo = {
  userId: 'sandbox',
  nick: '沙盒小助手',
  sex: 'unknown',
  avatar: DEFAULT_USER_AVATAR,
  sign: '沙盒小助手',
  status: 'online',
}

/** 沙盒db目录对象 */
export const dir = {
  /** 登录号信息 */
  account: path.join(root, 'account.db'),
  /** 好友列表 */
  frinendList: path.join(root, 'friend_list.db'),
  /** 好友消息记录 */
  friendHistory: path.join(root, 'friend_history.db'),
  /** 好友通知 */
  friendNotice: path.join(root, 'friend_notice.db'),

  /** 好友请求 */
  friendRequest: path.join(root, 'friend_request.db'),
  /** 群列表 */
  groupList: path.join(root, 'group_list.db'),
  /** 群成员列表 */
  groupMemberList: path.join(root, 'group_member_list.db'),
  /** 群消息记录 */
  groupHistory: path.join(root, 'group_history.db'),
  /** 群通知 */
  groupNotice: path.join(root, 'group_notice.db'),
  /** 群请求 */
  groupRequest: path.join(root, 'group_request.db'),
}

/**
 * 流式写入缓存
 */
const stream: DbStreams = {
  frinendList: {
    count: 0,
    stream: undefined,
  },
  friendHistory: {
    count: 0,
    stream: undefined,
  },
  friendNotice: {
    count: 0,
    stream: undefined,
  },
  friendRequest: {
    count: 0,
    stream: undefined,
  },
  groupList: {
    count: 0,
    stream: undefined,
  },
  groupMemberList: {
    count: 0,
    stream: undefined,
  },
  groupHistory: {
    count: 0,
    stream: undefined,
  },
  groupNotice: {
    count: 0,
    stream: undefined,
  },
  groupRequest: {
    count: 0,
    stream: undefined,
  },
}

/**
 * 追加一条数据
 * @param name 文件名称
 * @param file 写入文件路径
 * @param key 写入流key
 * @param value 写入数据
 */
const addWrite = <T> (
  name: keyof DbStreams,
  file: string,
  key: string,
  value: T
) => {
  if (!stream[name].stream) {
    stream[name].stream = createWriteStream(file, {
      flags: 'a+',

      encoding: 'utf-8',
    })
  }

  stream[name].count++
  stream[name].stream!.write(`${key}="${JSON.stringify(value)}\n`)
}

/**
 * 通用删除函数
 * @param file 文件路径
 * @param key 要删除的key
 */
const deleteData = async (file: string, key: string) => {
  try {
    await fs.access(file)
    const content = await fs.readFile(file, 'utf-8')
    if (!content) return

    const lines = content.split('\n').filter(Boolean)
    const newLines = lines.filter(line => !line.startsWith(`${key}=`))

    await fs.writeFile(file, newLines.join('\n') + '\n')
  } catch {

  }
}

/**
 * 获取登录号信息
 */
export const getAccountInfo = async (): Promise<SandBoxAccountInfo> => {
  await fs.access(dir.account)
  const content = await fs.readFile(dir.account, 'utf-8')
  return JSON.parse(content)
}

/**
 * 修改登录号信息
 * @param info 登录号信息
 */
export const updateAccountInfo = async (info: Partial<SandBoxAccountInfo>) => {
  const current = await getAccountInfo()
  /** 登录号ID不能修改 */
  const newInfo: SandBoxAccountInfo = {
    userId: current.userId,
    nick: info?.nick || current.nick,
    sex: info?.sex || current.sex,
    avatar: info?.avatar || current.avatar,
    sign: info?.sign || current.sign,
    status: info?.status || current.status,
  }

  await fs.writeFile(dir.account, JSON.stringify(newInfo, null, 2))
  return newInfo
}

/**
 * 新增一个好友
 * @param data 好友数据
 */
export const addFriend = async (data: FriendData, isFriend: boolean) => {
  /** 检查是否存在 */
  const friend = await getFriend(data.userId) as FriendData & { isFriend: boolean }
  if (!friend) {
    return addWrite('frinendList', dir.frinendList, data.userId, { ...data, isFriend })
  }

  /** 看下是否是好友 */
  if (friend.isFriend) return

  /** 更新好友状态 */
  await deleteData(dir.frinendList, data.userId)
  return addWrite('frinendList', dir.frinendList, data.userId, { ...data, isFriend })
}

/**
 * 新增一个群

 * @param data 群数据
 */
export const addGroup = (data: GroupData) => {
  addWrite('groupList', dir.groupList, data.groupId, data)
}

/**
 * 新增一个群成员
 * @param data 群成员数据
 */
export const addGroupMember = async (data: GroupMemberData, info: FriendData) => {
  /** 如果群不存在 则抛出错误 */
  const group = await getGroup(data.groupId)
  if (!group) {
    throw new Error(`群 ${data.groupId} 不存在`)
  }

  /** 检查是否存在好友列表 */
  const friend = await getFriend(data.userId)
  if (!friend) addFriend(info, false)

  addWrite('groupMemberList', dir.groupMemberList, `${data.groupId}:${data.userId}`, data)
}

/**
 * 新增一条好友消息
 * @param data 好友消息数据
 */
export const addFriendHistory = (
  data: Omit<FriendMessageOptions, 'bot' | 'srcReply'>
) => {
  addWrite('friendHistory', dir.friendHistory, data.messageId, data)
}

/**
 * 新增一条群消息
 * @param data 群消息数据
 */
export const addGroupHistory = (data: Omit<GroupMessageOptions, 'bot' | 'srcReply'>) => {
  addWrite('groupHistory', dir.groupHistory, data.messageId, data)
}

/**
 * 新增一条好友通知
 * @param data 好友通知数据
 */
export const addFriendNotice = (data: Omit<NoticeOptions, 'bot' | 'srcReply'>) => {
  addWrite('friendNotice', dir.friendNotice, data.eventId, data)
}

/**
 * 新增一条群通知
 * @param data 群通知数据
 */
export const addGroupNotice = (data: Omit<NoticeOptions, 'bot' | 'srcReply'>) => {
  addWrite('groupNotice', dir.groupNotice, data.eventId, data)
}

/**
 * 新增一条好友请求
 * @param data 好友请求数据
 */
export const addFriendRequest = (data: Omit<RequestOptions, 'bot' | 'srcReply'>) => {
  addWrite('friendRequest', dir.friendRequest, data.eventId, data)
}

/**
 * 新增一条群请求
 * @param data 群请求数据
 */
export const addGroupRequest = (data: Omit<RequestOptions, 'bot' | 'srcReply'>) => {
  addWrite('groupRequest', dir.groupRequest, data.eventId, data)
}

/**
 * 读取好友列表
 */
export const getFriendList = async (): Promise<(FriendData & { isFriend: boolean })[]> => {
  const content = await fs.readFile(dir.frinendList, 'utf-8')
  if (!content) return []
  return content.split('\n').filter(Boolean).map(line => JSON.parse(line.split('="')[1]))
}

/**
 * 读取群列表
 */
export const getGroupList = async (): Promise<GroupData[]> => {
  const content = await fs.readFile(dir.groupList, 'utf-8')
  if (!content) return []
  return content.split('\n').filter(Boolean).map(line => JSON.parse(line.split('="')[1]))
}

/**
 * 读取指定群信息
 * @param groupId 群ID
 */
export const getGroup = async (groupId: string): Promise<GroupData | null> => {
  const list = await getGroupList()
  return list.find(item => item.groupId === groupId) ?? null
}

/**
 * 读取群成员列表
 * @param groupId 群ID
 */
export const getGroupMemberList = async (
  groupId: string
): Promise<(GroupMemberData & FriendData)[]> => {
  const content = await fs.readFile(dir.groupMemberList, 'utf-8')
  if (!content) return []
  const list = (await Promise.all(

    content.split('\n').filter(Boolean).map(async line => {
      const [k, v] = line.split('="')
      const [groupId, userId] = k.split(':')
      /** 获取这个群成员的信息 从好友列表中获取 */
      const friend = (await getFriend(userId)) || {}
      return {

        groupId,
        userId,
        value: {
          ...JSON.parse(v),
          ...friend,
          userId,
        },
      }
    })

  )) || []

  return list?.filter(item => item.groupId === groupId)?.map(item => item.value) || []
}

/**
 * 读取指定群成员信息
 * @param groupId 群ID
 * @param userId 成员ID
 */
export const getGroupMember = async (groupId: string, userId: string): Promise<GroupMemberData | null> => {
  const list = await getGroupMemberList(groupId)
  return list.find(item => item.userId === userId) ?? null
}

/**
 * 读取指定好友信息
 * @param userId 好友ID
 */
export const getFriend = async (userId: string): Promise<FriendData | null> => {
  const list = await getFriendList()
  return list.find(item => item.userId === userId) ?? null
}

/**
 * 读取指定好友消息记录
 * @param selfId 登录号ID
 * @param userId 好友ID
 */
export const getFriendHistory = async (
  selfId: string,
  userId: string
): Promise<Omit<FriendMessageOptions, 'bot' | 'srcReply'>[]> => {
  /** 好友消息ID的构成: history_friend_${userId} */
  const content = await fs.readFile(dir.friendHistory, 'utf-8')
  if (!content) return []

  const list: Omit<FriendMessageOptions, 'bot' | 'srcReply'>[] = []
  content.split('\n').forEach(line => {
    const [k, v] = line.split('="')
    if (k && v && (k === buildMessageId('friend', userId) || k === buildMessageId('bot_send', selfId, userId))) {
      list.push(JSON.parse(v))
    }
  })

  return list
}

/**
 * 读取指定群消息记录
 * @param selfId 登录号ID
 * @param groupId 群ID
 */
export const getGroupHistory = async (
  selfId: string,
  groupId: string
): Promise<Omit<GroupMessageOptions, 'bot' | 'srcReply'>[]> => {
  const content = await fs.readFile(dir.groupHistory, 'utf-8')
  if (!content) return []

  const list: Omit<GroupMessageOptions, 'bot' | 'srcReply'>[] = []
  content.split('\n').forEach(line => {
    const [k, v] = line.split('="')
    if (k && v && k === buildMessageId('bot_send', selfId, groupId)) {
      list.push(JSON.parse(v))
    }
  })

  return list
}

/**
 * 删除一个好友
 * @param userId 好友ID
 */
export const deleteFriend = (userId: string) => {
  return deleteData(dir.frinendList, userId)
}

/**
 * 删除一个群
 * @param groupId 群ID
 */
export const deleteGroup = async (groupId: string) => {
  /** 检查群是否存在 */
  const group = await getGroup(groupId)
  if (!group) throw new Error(`群 ${groupId} 不存在`)
  deleteData(dir.groupList, groupId)
  /** 删除群成员 */
  const memberList = await getGroupMemberList(groupId)
  memberList.forEach(item => deleteGroupMember(groupId, item.userId))
}

/**
 * 删除一个群成员
 * @param groupId 群ID
 * @param userId 成员ID
 */
export const deleteGroupMember = (groupId: string, userId: string) => {
  return deleteData(dir.groupMemberList, `${groupId}:${userId}`)
}

/**
 * 撤回一条消息
 * @param messageId 消息ID
 */
export const recallMessage = (messageId: string) => {
  /** 消息ID的构成: history_friend_${userId}_${messageId} */
  const type = messageId.startsWith('history_friend_') ? 'friend' : 'group'
  if (type === 'friend') {
    return deleteData(dir.friendHistory, messageId)
  }

  return deleteData(dir.groupHistory, messageId)
}

/**
 * 更新好友信息
 * @param userId 好友ID
 * @param info 好友信息
 */
export const updateFriend = async (userId: string, info: Partial<FriendData>) => {
  /** 检查好友是否存在 */
  const friend = await getFriend(userId)
  if (!friend) throw new Error(`好友 ${userId} 不存在`)

  /** 合并新旧数据 */
  const updatedFriend: FriendData = {
    ...friend,
    ...info,
    userId: friend.userId, // 确保 userId 不被修改
  }

  await deleteData(dir.frinendList, userId)
  return addFriend(updatedFriend, true)
}

/**
 * 更新群信息
 * @param groupId 群ID
 * @param info 群信息
 */
export const updateGroup = async (groupId: string, info: Partial<GroupData>) => {
  /** 检查群是否存在 */
  const group = await getGroup(groupId)
  if (!group) throw new Error(`群 ${groupId} 不存在`)

  /** 合并新旧数据 */
  const updatedGroup: GroupData = {
    ...group,
    ...info,
    groupId: group.groupId, // 确保 groupId 不被修改
  }

  await deleteData(dir.groupList, groupId)
  return addGroup(updatedGroup)
}

/**
 * 更新群成员信息
 * @param groupId 群ID
 * @param userId 成员ID
 * @param info 成员信息
 */
export const updateGroupMember = async (groupId: string, userId: string, info: Partial<GroupMemberData>) => {
  /** 检查群成员是否存在 */
  const member = await getGroupMember(groupId, userId)
  if (!member) throw new Error(`群成员 ${userId} 不存在`)

  /** 获取成员的好友信息 */
  const friend = await getFriend(userId)
  if (!friend) throw new Error(`用户 ${userId} 的信息不存在`)

  /** 合并新旧数据 */
  const updatedMember: GroupMemberData = {
    ...member,
    ...info,
    groupId: member.groupId, // 确保 groupId 不被修改
    userId: member.userId,   // 确保 userId 不被修改
  }

  await deleteData(dir.groupMemberList, `${groupId}:${userId}`)
  return addGroupMember(updatedMember, friend)
}

interface BuildMessageIdOptions {
  (type: 'friend', userId: string): string
  (type: 'group', groupId: string): string
  (type: 'bot_send', selfId: string, targetId: string): string
}

/**
 * 构建消息ID
 * @param type 类型
 * @param userId 用户ID
 * @param groupId 群ID
 * @returns 消息ID
 */
export const buildMessageId: BuildMessageIdOptions = (
  type: 'friend' | 'group' | 'bot_send',
  userId: string,
  groupId?: string
) => {
  if (type === 'friend') {
    return `history_friend_${userId}`
  }

  if (type === 'group') {
    return `history_group_${groupId}`
  }

  return `history_bot_send_${userId}_${groupId}`
}

/**
 * 好友列表写入登录号
 */
const writeAccountToFriendList = async () => {
  const friendList = await getFriendList()
  if (!friendList.some(item => item.userId === selfInfo.userId)) {
    addFriend(selfInfo, true)
  }
}

const main = async () => {
  /**
   * 初始化数据库目录和文件
   */
  Object.values(dir).forEach(async file => {
    /** 登录号特殊处理 */
    if (file === dir.account) {
      try {
        await fs.access(dir.account)
      } catch {
        await fs.mkdir(path.dirname(dir.account), { recursive: true })
        await fs.writeFile(dir.account, JSON.stringify(selfInfo, null, 2))
      }
      return
    }

    try {
      await fs.access(file)
      if (file === dir.frinendList) writeAccountToFriendList()
    } catch {
      await fs.mkdir(path.dirname(file), { recursive: true })
      await fs.writeFile(file, '')
    }
  })

  /**
   * 每5分钟查看流式写入次数 低于10次则关闭流式写入
   */
  setInterval(() => {
    Object.values(stream).forEach(item => {
      if (item.stream && item.count < 10) {
        item.stream.end()
        item.stream = undefined
      }

      item.count = 0
    })
  }, 5 * 60 * 1000)
}

main()
