import { Level } from 'level'
import { sandboxLevelPath } from '@/root'
import { router } from '@/server/api/router'
import { listeners } from '@/core/internal'
import { registerBot, unregisterBot } from '@/service/bot'
import { AdapterSandbox } from '@/adapter/sandbox/adapter'
import {
  createBadRequestResponse,
  createServerErrorResponse,
  createSuccessResponse
} from '@/server/utils/response'
import {
  deleteFriend,
  deleteGroup,
  deleteGroupMember,
  updateFriend,
  updateGroup,
  updateGroupMember,
  createFriend,
  createGroup,
  createGroupMember,
  createMsgSeq,
  createMessage,
  deleteMessage,
  updateMessageStatus,
  createEvent,
  updateBotName
} from '@/adapter/sandbox'

import type WebSocket from 'ws'
import type { RequestHandler } from 'express'
import type { IncomingMessage } from 'node:http'
import type { SandboxEvent } from '@/types/sandbox/event'
import type { SandboxMsgRecord } from '@/types/sandbox/db'
import { getHistory } from '@/adapter/sandbox/get'

let level: Level
/** 适配器状态 */
let adapter: AdapterSandbox | undefined

/**
 * 获取生成消息seq的键
 */
const getCreateSeqKey = async () => {
  const key = 'sandbox:create:index'
  const val = await level.get(key)

  if (!val) {
    const value = `sandbox:${Math.floor(Date.now() / 1000)}`
    await level.put(key, value)
    return value
  }

  return val
}

/**
 * 存储前缀 键值对存储
 * - `selfId`: Bot的userId
 * - `好友前缀:userId` 好友名称
 * - `群前缀:groupId` 群名称
 * - `群成员前缀:groupId:userId` {name: string, role: 'admin' | 'member' | 'owner'}
 * - `群头像: group_{groupId}.png`
 * - `好友头像: friend_{userId}.png`
 * - `好友消息记录: friendMsg:{messageId}` 消息记录
 * - `群消息记录: groupMsg:{messageId}` 消息记录
 * @description Bot也是属于好友，但是额外多一个`selfId`来存储识别哪个是Bot
 */
export const prefix = {
  /** 获取Bot userId */
  selfId: 'selfId',
  /** 好友前缀 */
  friend: 'friend:',
  /** 群前缀 */
  group: 'group:',
  /** 群成员前缀 */
  groupMember: 'groupMember:',
  /** 生成消息索引的键 */
  seq: '',
  /** 好友头像文件前缀 */
  friendAvatar: 'friend_',
  /** 群头像文件前缀 */
  groupAvatar: 'group_',
  /** 头像后缀 */
  avatarExt: '.png',
  /** 好友消息记录前缀 */
  friendMsg: 'friendMsg:',
  /** 群消息记录前缀 */
  groupMsg: 'groupMsg:',
}

/**
 * 获取Bot id
 */
const getBotId = async () => {
  const id = await level.get(prefix.selfId)
  if (!id) {
    const selfId = 'sandbox'
    await level.put(prefix.selfId, selfId)
    return selfId
  }

  return id
}

/**
 * 获取Bot自身用户信息
 */
const getSelfInfoRouter: RequestHandler = async (req, res) => {
  try {
    const selfId = await getBotId()
    const name = adapter!.account.name
    const avatar = adapter!.account.avatar
    createSuccessResponse(res, { id: selfId, name, avatar })
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
    const { id, name, avatar } = req.body as { id: string; name: string; avatar: string }
    const result = await createFriend(adapter!, id, name, avatar)
    createSuccessResponse(res, result)
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
    const { id, name, avatar } = req.body as { id: string; name: string; avatar: string }
    const result = await createGroup(adapter!, id, name, avatar)
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
    const { groupId, userId, name, avatar, role } = req.body as {
      groupId: string
      userId: string
      name: string
      avatar: string
      role: 'admin' | 'member' | 'owner'
    }
    const result = await createGroupMember(adapter!, groupId, userId, name, avatar, role)
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
    await deleteFriend(adapter!, id)
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
    await deleteGroup(adapter!, id)
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
    await deleteGroupMember(adapter!, groupId, userId)
    createSuccessResponse(res, '成功')
  } catch (error) {
    createServerErrorResponse(res, (error as Error).message)
    logger.error(error)
  }
}

/**
 * 生成消息索引 消息id 时间
 */
const createMsgRouter: RequestHandler = async (req, res) => {
  const { type, targetId } = req.body as { type: 'friend' | 'group'; targetId: string }

  if (type !== 'friend' && type !== 'group') {
    createBadRequestResponse(res, 'type 错误，请检查type是否为friend或group')
    return
  }

  if (!targetId || typeof targetId !== 'string') {
    createBadRequestResponse(res, 'targetId 错误，请检查 targetId 是否为字符串')
    return
  }

  const result = await createMsgSeq(adapter!, type, targetId)
  createSuccessResponse(res, result)
}

/**
 * 更新好友信息
 */
const updateFriendRouter: RequestHandler = async (req, res) => {
  try {
    const { id, name, avatar } = req.body as {
      id: string
      name?: string
      avatar?: string
    }
    const result = await updateFriend(adapter!, id, name, avatar)
    createSuccessResponse(res, result)
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
    const { id, name, avatar } = req.body as {
      id: string
      name?: string
      avatar?: string
    }
    const result = await updateGroup(adapter!, id, name, avatar)
    createSuccessResponse(res, result)
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
    const { groupId, userId, name, avatar, role } = req.body as {
      groupId: string
      userId: string
      name?: string
      avatar?: string
      role?: 'admin' | 'member' | 'owner'
    }
    const result = await updateGroupMember(adapter!, groupId, userId, name, avatar, role)
    createSuccessResponse(res, result)
  } catch (error) {
    createServerErrorResponse(res, (error as Error).message)
    logger.error(error)
  }
}

/**
 * 创建消息记录
 */
const createMessageRouter: RequestHandler = async (req, res) => {
  try {
    const { type, seq, targetId, elements, messageId, time, status } = req.body as SandboxMsgRecord
    const result = await createMessage(adapter!, { type, seq, targetId, elements, messageId, time, status })
    createSuccessResponse(res, result)
  } catch (error) {
    createServerErrorResponse(res, (error as Error).message)
    logger.error(error)
  }
}

/**
 * 删除消息记录
 */
const deleteMessageRouter: RequestHandler = async (req, res) => {
  try {
    const { messageId } = req.body as { messageId: string }
    await deleteMessage(adapter!, messageId)
    createSuccessResponse(res, '成功')
  } catch (error) {
    createServerErrorResponse(res, (error as Error).message)
    logger.error(error)
  }
}

/**
 * 更新消息记录的状态
 */
const updateMessageStatusRouter: RequestHandler = async (req, res) => {
  try {
    const { messageId, status } = req.body as { messageId: string; status: 'normal' | 'recall' }
    await updateMessageStatus(adapter!, messageId, status)
    createSuccessResponse(res, '成功')
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
      createBadRequestResponse(res, 'messageId 错误，请检查 messageId 是否为字符串')
      return
    }

    await updateMessageStatus(adapter!, messageId, 'recall')
    createSuccessResponse(res, '成功')
  } catch (error) {
    createServerErrorResponse(res, (error as Error).message)
    logger.error(error)
  }
}

/**
 * 上报
 */
const webhookRouter: RequestHandler = async (req, res) => {
  /**
   * @example
   * ```json
   * {
   *  "type": "group",
   *  "seq": 1,
   *  "messageId": "1234567890",
   *  "time": 1716489600,
   *  "sender": {
   *    "id": "1234567890",
   *    "name": "test"
   *  },
   *  "elements": [
   *    {
   *      "type": "text",
   *      "text": "Hello, world!"
   *    }
   *  ]
   * }
   * ```
   */
  const data = req.body as SandboxEvent
  if (data.type !== 'friend' && data.type !== 'group') {
    createBadRequestResponse(res, 'type 错误，请检查type是否为friend或group')
    return
  }

  await createEvent(adapter!, data)
  createSuccessResponse(res, '成功')
}

/**
 * 检查Bot name
 */
const checkBotName = async () => {
  const name = await level.get(await getBotId())
  if (!name) {
    await level.put(prefix.selfId, 'karin')
  }
}

/**
 * 初始化getCreateSeqKey
 */
const initSeq = async () => {
  prefix.seq = await getCreateSeqKey()
}

/**
 * 检查好友列表中是否存在Bot自身
 */
const checkSelfInFriendList = async () => {
  const friendList = await adapter!.getFriendList()
  if (!friendList.some(item => item.userId === adapter!.account.selfId)) {
    await createFriend(
      adapter!,
      adapter!.account.selfId,
      adapter!.account.name,
      adapter!.account.avatar
    )
  }
}

/**
 * 更新Bot名称
 */
const updateBotNameRouter: RequestHandler = async (req, res) => {
  try {
    const { name, avatar } = req.body as { name: string; avatar: string }
    await updateBotName(adapter!, { name, avatar })
    createSuccessResponse(res, '成功')
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
    const { type, targetId, count } = req.body as { type: 'friend' | 'group'; targetId: string; count: number }
    const result = await getHistory(adapter!, type, targetId, count)
    createSuccessResponse(res, result)
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
    const port = process.env.WS_SERVER_PORT
    const authKey = process.env.WS_SERVER_AUTH_KEY || ''

    const url = `ws://127.0.0.1:${port}/sandbox`
    createSuccessResponse(res, { url, authKey })
  } catch (error) {
    createServerErrorResponse(res, (error as Error).message)
    logger.error(error)
  }
}

const main = () => {
  listeners.on('ws:connection:sandbox', async (socket: WebSocket, request: IncomingMessage) => {
    try {
      /** 鉴权 */
      if (process.env.WS_SERVER_AUTH_KEY && request.headers.authorization !== process.env.WS_SERVER_AUTH_KEY) {
        logger.error(`[Sandbox] 鉴权失败: ${request.headers.authorization}`)
        socket.close(1008, '鉴权失败')
        return
      }

      logger.info(`[Sandbox] 连接成功: ${request.url}`)

      if (!level) {
        level = new Level(sandboxLevelPath)

        await Promise.all([checkBotName(), initSeq(),])
      }

      if (!adapter) {
        adapter = new AdapterSandbox(socket, request, level, prefix)
        adapter.account.selfId = await getBotId()
        adapter.account.name = await level.get(prefix.selfId) || 'karin'
        adapter.account.avatar = await adapter.getAvatarUrl(adapter.account.selfId)
      }

      await checkSelfInFriendList()

      socket.once('close', async () => {
        logger.warn('[Sandbox] 连接关闭')
        unregisterBot('selfId', await getBotId())
      })

      /** 发送初始化完成事件 */
      adapter._pushWeb('init', {
        id: adapter.account.selfId,
        name: adapter.account.name,
        avatar: adapter.account.avatar,
      })

      registerBot('webSocketServer', adapter)
    } catch (error) {
      socket.close(1008, '初始化失败')
      logger.error(error)
    }
  })
}

main()
router.post('/sandbox/self', getSelfInfoRouter)
router.post('/sandbox/msg/create', createMsgRouter)
router.post('/sandbox/msg/recall', recallMessageRouter)
router.post('/sandbox/webhook', webhookRouter)
router.post('/sandbox/self/update', updateBotNameRouter)
router.post('/sandbox/msg/list', getMsgListRouter)
router.post('/sandbox/url', getSandboxUrlRouter)

router.post('/sandbox/friend/create', createFriendRouter)
router.post('/sandbox/friend/list', getFriendListRouter)
router.post('/sandbox/friend/delete', deleteFriendRouter)
router.post('/sandbox/friend/update', updateFriendRouter)
router.post('/sandbox/friend/msg/create', createMessageRouter)
router.post('/sandbox/friend/msg/delete', deleteMessageRouter)
router.post('/sandbox/friend/msg/update', updateMessageStatusRouter)

router.post('/sandbox/group/create', createGroupRouter)
router.post('/sandbox/group/list', getGroupListRouter)
router.post('/sandbox/group/delete', deleteGroupRouter)
router.post('/sandbox/group/update', updateGroupRouter)
router.post('/sandbox/group/msg/create', createMessageRouter)
router.post('/sandbox/group/msg/delete', deleteMessageRouter)
router.post('/sandbox/group/msg/update', updateMessageStatusRouter)

router.post('/sandbox/group/member/list', getGroupMemberListRouter)
router.post('/sandbox/group/member/create', createGroupMemberRouter)
router.post('/sandbox/group/member/delete', deleteGroupMemberRouter)
router.post('/sandbox/group/member/update', updateGroupMemberRouter)
