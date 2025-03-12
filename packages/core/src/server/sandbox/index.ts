import { listeners } from '@/core/internal'
import { registerBot, unregisterBot } from '@/service/bot'
import { AdapterSandbox } from '@/adapter/sandbox/adapter'
import {
  createBadRequestResponse,
  createServerErrorResponse,
  createSuccessResponse
} from '@/server/utils/response'
import { FriendMessageOptions, GroupMessageOptions, Sex } from '@/types/event'
import { createFriendMessage, createGroupMessage } from '@/event/create'
import { uploadAvatar } from '@/service/sandbox/avatar'
import {
  addFriend,
  addFriendHistory,
  addGroup,
  addGroupHistory,
  addGroupMember,
  buildMessageId,
  deleteFriend,
  deleteGroup,
  deleteGroupMember,
  getAccountInfo,
  getFriendHistory,
  getGroupHistory,
  recallMessage,
  updateAccountInfo,
  updateFriend,
  updateGroup,
  updateGroupMember
} from '@/service/sandbox/db'
import { WS_CONNECTION_SANDBOX } from '@/utils/fs/key'

import type WebSocket from 'ws'
import type { RequestHandler } from 'express'
import type { IncomingMessage } from 'node:http'

/** 适配器状态 */
let adapter: AdapterSandbox | undefined

/**
 * 获取Bot自身用户信息
 */
const getSelfInfoRouter: RequestHandler = async (req, res) => {
  try {
    const info = await getAccountInfo()
    createSuccessResponse(res, info)
  } catch (error) {
    createServerErrorResponse(res, (error as Error).message)
    logger.error(error)
  }
}

/**
 * 创建一个好友
 */
const createFriendRouter: RequestHandler = async (req, res) => {
  try {
    const { id, nick, avatar, sex } = req.body
    if (!id || !nick || !avatar) {
      createBadRequestResponse(res, 'id, nick, avatar 不能为空')
      return
    }

    await addFriend({
      userId: id,
      nick,
      avatar,
      sex: sex || 'unknown',
    }, true)

    createSuccessResponse(res, '成功')
  } catch (error) {
    createServerErrorResponse(res, (error as Error).message)
    logger.error(error)
  }
}

/**
 * 创建一个群
 */
const createGroupRouter: RequestHandler = async (req, res) => {
  try {
    const { groupId, name, avatar, member } = req.body
    if (!groupId || !name || !avatar || !member) {
      createBadRequestResponse(res, 'groupId, name, avatar 不能为空')
      return
    }

    const result = addGroup({
      groupId,
      name,
      avatar,
    })

    /** 第一个群成员 */
    addGroupMember({
      groupId,
      userId: member.userId,
      role: member.role,
      joinTime: Date.now(),
      lastSpeakTime: 0,
      muteTime: 0,
      card: member.card,
      title: member.title,
    }, {
      userId: member.userId,
      nick: member.name,
      sex: member.sex,
      avatar: member.avatar,

    })

    const botInfo = await getAccountInfo()

    /** 将Bot添加为群成员 */
    addGroupMember({
      groupId,
      userId: botInfo.userId,
      role: 'owner',
      joinTime: Date.now(),
      lastSpeakTime: 0,
      muteTime: 0,
      card: botInfo.nick,
      title: '群主',
    }, {
      userId: botInfo.userId,
      nick: botInfo.nick,
      sex: botInfo.sex,
      avatar: botInfo.avatar,
    })

    createSuccessResponse(res, result)
  } catch (error) {
    createServerErrorResponse(res, (error as Error).message)
    logger.error(error)
  }
}

/**
 * 创建一个群成员
 */
const createGroupMemberRouter: RequestHandler = async (req, res) => {
  try {
    const { groupId, userId, role, card, title, name, avatar, sex } = req.body
    if (!groupId || !userId || !role || !card || !title || !name || !avatar || !sex) {
      createBadRequestResponse(res, 'groupId, userId, role, card, title, name, avatar, sex 不能为空')
      return
    }

    const result = await addGroupMember({
      groupId,
      userId,
      role,
      joinTime: Date.now(),
      lastSpeakTime: 0,

      muteTime: 0,
      card,
      title,
    }, {
      userId,
      nick: name,
      sex,
      avatar,
    })
    createSuccessResponse(res, result)
  } catch (error) {
    createServerErrorResponse(res, (error as Error).message)
    logger.error(error)
  }
}

/**
 * 获取好友列表
 */
const getFriendListRouter: RequestHandler = async (req, res) => {
  try {
    /** 判断适配器是否初始化完毕 */
    if (!adapter) await new Promise(resolve => setTimeout(resolve, 500))

    const friendList = await adapter!.getFriendList()
    createSuccessResponse(res, friendList)
  } catch (error) {
    createServerErrorResponse(res, (error as Error).message)
    logger.error(error)
  }
}

/**
 * 获取群列表
 */
const getGroupListRouter: RequestHandler = async (req, res) => {
  try {
    if (!adapter) await new Promise(resolve => setTimeout(resolve, 500))
    const groupList = await adapter!.getGroupList()
    createSuccessResponse(res, groupList)
  } catch (error) {
    createServerErrorResponse(res, (error as Error).message)
    logger.error(error)
  }
}

/**
 * 获取群成员列表
 */
const getGroupMemberListRouter: RequestHandler = async (req, res) => {
  try {
    const { groupId } = req.body as { groupId: string }
    const result = await adapter!.getGroupMemberList(groupId)
    createSuccessResponse(res, result)
  } catch (error) {
    createServerErrorResponse(res, (error as Error).message)
    logger.error(error)
  }
}

/**
 * 删除一个好友
 */
const deleteFriendRouter: RequestHandler = async (req, res) => {
  try {
    const { id } = req.body as { id: string }
    await deleteFriend(id)
    createSuccessResponse(res, '成功')
  } catch (error) {
    createServerErrorResponse(res, (error as Error).message)
    logger.error(error)
  }
}

/**
 * 删除一个群
 */
const deleteGroupRouter: RequestHandler = async (req, res) => {
  try {
    const { id } = req.body as { id: string }
    await deleteGroup(id)
    createSuccessResponse(res, '成功')
  } catch (error) {
    createServerErrorResponse(res, (error as Error).message)
    logger.error(error)
  }
}

/**
 * 删除一个群成员
 */
const deleteGroupMemberRouter: RequestHandler = async (req, res) => {
  try {
    const { groupId, userId } = req.body as { groupId: string; userId: string }
    await deleteGroupMember(groupId, userId)
    createSuccessResponse(res, '成功')
  } catch (error) {
    createServerErrorResponse(res, (error as Error).message)
    logger.error(error)
  }
}

/**
 * 更新好友信息
 */
const updateFriendRouter: RequestHandler = async (req, res) => {
  try {
    const { userId, ...info } = req.body
    updateFriend(userId, info)
    createSuccessResponse(res, '成功')
  } catch (error) {
    createServerErrorResponse(res, (error as Error).message)
    logger.error(error)
  }
}

/**
 * 更新群信息
 */
const updateGroupRouter: RequestHandler = async (req, res) => {
  try {
    const { groupId, ...info } = req.body
    updateGroup(groupId, info)
    createSuccessResponse(res, '成功')
  } catch (error) {
    createServerErrorResponse(res, (error as Error).message)
    logger.error(error)
  }
}

/**
 * 更新群成员信息
 */
const updateGroupMemberRouter: RequestHandler = async (req, res) => {
  try {
    const { groupId, userId, ...info } = req.body
    const result = await updateGroupMember(groupId, userId, info || {})
    createSuccessResponse(res, result)
  } catch (error) {
    createServerErrorResponse(res, (error as Error).message)
    logger.error(error)
  }
}

/**
 * 撤回消息
 */
const recallMessageRouter: RequestHandler = async (req, res) => {
  try {
    const { messageId } = req.body as { messageId: string }
    if (!messageId || typeof messageId !== 'string') {
      createBadRequestResponse(res, 'messageId 错误，请检查 messageId 是否正确')
      return
    }

    await recallMessage(messageId)
    createSuccessResponse(res, '成功')
  } catch (error) {
    createServerErrorResponse(res, (error as Error).message)
    logger.error(error)
  }
}

/**
 * 判断是否为好友消息
 */
const isFriendMessage = (
  data: Record<string, unknown>
): data is Omit<FriendMessageOptions, 'bot' | 'srcReply' | 'messageId' | 'eventId' | 'messageSeq'> => {
  if (data.event === 'message' && data.subEvent === 'friend') {
    return true
  }

  return false
}

/**
 * 判断是否为群消息
 */
const isGroupMessage = (
  data: Record<string, unknown>
): data is Omit<GroupMessageOptions, 'bot' | 'srcReply' | 'messageId' | 'eventId' | 'messageSeq'> => {
  if (data.event === 'message' && data.subEvent === 'group') {
    return true
  }

  return false
}

/**
 * 上报
 */
const webhookRouter: RequestHandler = async (req, res) => {
  if (typeof adapter === 'undefined') {
    createBadRequestResponse(res, '适配器未初始化')
    return
  }

  const data = req.body
  if (isFriendMessage(data)) {
    const seq = Date.now()
    const messageId = buildMessageId('friend', data.contact.peer)
    const result = {
      messageId,
      messageSeq: seq,
      time: seq,
      eventId: `message:${messageId}`,
    }

    addFriendHistory({
      ...result,
      elements: data.elements,
      rawEvent: data,
      contact: data.contact,
      sender: data.sender,
    })

    createFriendMessage({
      ...data,
      ...result,
      bot: adapter,
      srcReply: elements => adapter!.sendMsg(data.contact, elements),
      rawEvent: data,
    })
    return createSuccessResponse(res, result)
  }

  if (isGroupMessage(data)) {
    const seq = Date.now()
    const messageId = buildMessageId('group', data.contact.peer)
    const result = {
      messageId,
      messageSeq: seq,
      time: seq,
      eventId: `message:${messageId}`,
    }

    addGroupHistory({
      ...result,
      elements: data.elements,
      rawEvent: data,
      contact: data.contact,
      sender: data.sender,
    })

    createGroupMessage({
      ...data,
      ...result,
      bot: adapter,
      srcReply: elements => adapter!.sendMsg(data.contact, elements),
      rawEvent: data,
    })

    return createSuccessResponse(res, result)
  }

  createBadRequestResponse(res, '仅支持好友消息和群消息')
  logger.error('仅支持好友消息和群消息:', JSON.stringify(data))
}

/**
 * 更新Bot信息
 */
const updateBotInfoRouter: RequestHandler = async (req, res) => {
  try {
    let { avatar, nick, sex, sign, status } = req.body as {
      avatar: string
      nick: string
      sex: Sex
      sign: string
      status: 'online' | 'offline' | 'hidden'
    }

    if (avatar && typeof avatar === 'string') {
      avatar = await uploadAvatar('self', '', avatar)
    }

    const result = await updateAccountInfo({ avatar, nick, sex, sign, status })
    createSuccessResponse(res, result)
  } catch (error) {
    createServerErrorResponse(res, (error as Error).message)
    logger.error(error)
  }
}

/**
 * 获取消息列表
 */
const getMsgListRouter: RequestHandler = async (req, res) => {
  try {
    if (!adapter) throw new Error('适配器未初始化')

    let { type, targetId, count } = req.body as { type: 'friend' | 'group'; targetId: string; count: number }
    if (type !== 'friend' && type !== 'group') {
      createBadRequestResponse(res, 'type 错误，请检查type是否为friend或group')
      return
    }

    if (!targetId || typeof targetId !== 'string') {
      createBadRequestResponse(res, 'targetId 错误，请检查 targetId 是否为字符串')
      return
    }

    if (!Number(count)) count = 20

    if (type === 'friend') {
      const result = await getFriendHistory(adapter!.account.selfId, targetId)
      return createSuccessResponse(res, result.slice(-count))
    }

    if (type === 'group') {
      const result = await getGroupHistory(adapter!.account.selfId, targetId)
      return createSuccessResponse(res, result.slice(-count))
    }

    throw new Error('type 错误，请检查type是否为friend或group')
  } catch (error) {
    createServerErrorResponse(res, (error as Error).message)
    logger.error(error)
  }
}

/**
 * 获取沙盒连接地址
 */
const getSandboxUrlRouter: RequestHandler = async (req, res) => {
  try {
    const port = process.env.HTTP_PORT
    const authKey = process.env.WS_SERVER_AUTH_KEY || ''

    const url = `ws://127.0.0.1:${port}/sandbox`
    createSuccessResponse(res, { url, authKey })
  } catch (error) {
    createServerErrorResponse(res, (error as Error).message)
    logger.error(error)
  }
}

const main = () => {
  listeners.on(WS_CONNECTION_SANDBOX, async (
    socket: WebSocket,
    request: IncomingMessage,
    call: () => void
  ) => {
    call()
    try {
      /** 鉴权 */
      const url = new URL(request.url || '', `http://${request.headers.host}`)
      const authFromUrl = url.searchParams.get('authorization')
      const authFromHeader = request.headers.authorization
      const authKey = process.env.WS_SERVER_AUTH_KEY

      if (authKey && authFromUrl !== authKey && authFromHeader !== authKey) {
        logger.error(`[Sandbox] 鉴权失败: URL Auth: ${authFromUrl}, Header Auth: ${authFromHeader}`)
        socket.close(1008, '鉴权失败')
        return
      }

      logger.info(`[Sandbox] 连接成功: ${request.url?.split('?')[0] || request.url}`)

      const info = await getAccountInfo()
      if (!adapter) {
        adapter = new AdapterSandbox(socket, request)
        adapter.account.selfId = info.userId
        adapter.account.name = info.nick
        adapter.account.avatar = info.avatar
      }

      socket.once('close', async () => {
        logger.warn('[Sandbox] 连接关闭')
        unregisterBot('selfId', info.userId)
      })

      /** 发送初始化完成事件 */
      adapter._pushWeb('init', info)

      registerBot('webSocketServer', adapter)
    } catch (error) {
      socket.close(1008, '初始化失败')
      logger.error(error)
    }
  })
}

// main()
// router.post('/sandbox/self', getSelfInfoRouter)
// router.post('/sandbox/msg/recall', recallMessageRouter)
// router.post('/sandbox/webhook', webhookRouter)
// router.post('/sandbox/self/update', updateBotInfoRouter)
// router.post('/sandbox/msg/list', getMsgListRouter)
// router.post('/sandbox/url', getSandboxUrlRouter)

// router.post('/sandbox/friend/create', createFriendRouter)
// router.post('/sandbox/friend/list', getFriendListRouter)
// router.post('/sandbox/friend/delete', deleteFriendRouter)
// router.post('/sandbox/friend/update', updateFriendRouter)

// router.post('/sandbox/group/create', createGroupRouter)
// router.post('/sandbox/group/list', getGroupListRouter)
// router.post('/sandbox/group/delete', deleteGroupRouter)
// router.post('/sandbox/group/update', updateGroupRouter)

// router.post('/sandbox/group/member/list', getGroupMemberListRouter)
// router.post('/sandbox/group/member/create', createGroupMemberRouter)
// router.post('/sandbox/group/member/delete', deleteGroupMemberRouter)
// router.post('/sandbox/group/member/update', updateGroupMemberRouter)
