import { URL } from 'node:url'
import { EventEmitter } from 'node:events'
import { listeners } from '../internal'
import { WS_CONNECTION } from '@/utils/fs/key'
import { getAllBot, getAllBotList, getBot, getBotCount } from '@/service/bot'

import type { WebSocket } from 'ws'
import type { IncomingMessage } from 'http'
import type { Contact, FriendSender, GroupSender, Scene } from '@/types/event'

class Other extends EventEmitter {
  /** 框架名称 */
  public name: 'karin' = 'karin'

  /**
   * 构建好友contact
   * @param scene `friend`
   * @param peer 用户id
   * @param name 昵称
   */
  contact (scene: 'friend', peer: string, name?: string): Contact<'friend'>
  /**
   * 构建群contact
   * @param scene `group`
   * @param peer 群号
   * @param name 昵称
   */
  contact (scene: 'group', peer: string, name?: string): Contact<'group'>
  /**
   * 构建频道contact
   * @param scene `guild`
   * @param peer 频道id
   * @param subPeer 子频道id
   * @param name 频道名称
   */
  contact (scene: 'guild', peer: string, subPeer: string, name?: string): Contact<'guild'>
  /**
   * 构建频道私信contact
   * @param scene `direct`
   * @param peer 群号或者用户id
   * @param subPeer 子id
   */
  contact (scene: 'direct', peer: string, subPeer: string, name?: string): Contact<'direct'>
  /**
   * 构建临时群会话contact
   * @param scene `groupTemp`
   * @param peer 群号或者用户id
   * @param subPeer 子id
   */
  contact (scene: 'groupTemp', peer: string, subPeer: string, name?: string): Contact<'groupTemp'>
  /**
   * 构建contact
   * @param scene 场景
   * @param peer 群号或者用户id
   * @param subPeer 子id
   */
  contact (scene: Scene, peer: string, subPeer?: string, name?: string): Contact {
    if (scene === 'guild' || scene === 'direct' || scene === 'groupTemp') {
      return { scene, peer, subPeer, name } as Contact
    } else {
      return { scene, peer, subPeer: undefined, name } as Contact
    }
  }

  /**
   * 构建群contact
   * @param peer - 群号
   * @param name - 群名
   */
  contactGroup (peer: Contact['peer'], name?: string): Contact<'group'> {
    return { scene: 'group', peer, subPeer: undefined, name: name || '' }
  }

  /**
   * 构建好友contact
   * @param peer - 用户id
   * @param name - 昵称
   */
  contactFriend (peer: Contact['peer'], name?: string): Contact<'friend'> {
    return { scene: 'friend', peer, subPeer: undefined, name: name || '' }
  }

  /**
   * 构建频道contact
   * @param peer - 频道id
   * @param subPeer - 子频道id
   * @param name - 频道名称
   * @param subName - 子频道名称
   * @returns 频道contact
   */
  contactGuild (peer: string, subPeer: string, name?: string, subName?: string): Contact<'guild'> {
    return { scene: 'guild', peer, subPeer, name: name || '', subName: subName || '' }
  }

  /**
   * 构建临时群会话contact
   * @param peer - 群号
   * @param subPeer - 子id
   * @param name - 群名
   */
  contactGroupTemp (peer: string, subPeer: string, name?: string): Contact<'groupTemp'> {
    return { scene: 'groupTemp', peer, subPeer, name: name || '' }
  }

  /**
   * 构建消息事件私聊发送者信息
   * @param userId 发送者ID
   * @param nick 昵称
   * @param sex 性别
   * @param age 年龄
   * @param uid 隐藏字段 uid
   * @param uin 隐藏字段 uin
   */
  friendSender (
    userId: number | string,
    nick: string,
    sex: FriendSender['sex'] = 'unknown',
    age?: number,
    uid?: string,
    uin?: number
  ): FriendSender {
    return { userId: String(userId), nick, sex, age, uid, uin, name: nick }
  }

  groupSender (
    /** 发送者QQ号 */
    userId: number | string,
    /** 发送者在群的角色身份 非群、频道场景为`unknown` */
    role: GroupSender['role'],
    /** 发送者昵称 */
    nick?: string,
    /** 发送者性别 */
    sex?: GroupSender['sex'],
    /** 发送者年龄 */
    age?: number,
    /** 群名片/备注 */
    card?: string,
    /** 地区 */
    area?: string,
    /** 成员等级 */
    level?: number,
    /** 专属头衔 */
    title?: string,
    /** 发送者uid */
    uid?: string,
    /** 发送者uin */
    uin?: number
  ): GroupSender

  /**
   * 构建消息事件群聊发送者信息
   * @param userId 发送者ID
   * @param nick 昵称
   * @param role 角色
   * @param sex 性别
   * @param age 年龄
   * @param card 群名片/备注
   * @param area 地区
   * @param level 成员等级
   * @param title 专属头衔
   * @param uid 隐藏字段 uid
   * @param uin 隐藏字段 uin
   */
  groupSender (
    /** 发送者QQ号 */
    userId: number | string,
    /** 发送者在群的角色身份 非群、频道场景为`unknown` */
    role?: GroupSender['role'],
    /** 发送者昵称 */
    nick?: string,
    /** 发送者性别 */
    sex?: GroupSender['sex'],
    /** 发送者年龄 */
    age?: number,
    /** 群名片/备注 */
    card?: string,
    /** 地区 */
    area?: string,
    /** 成员等级 */
    level?: number,
    /** 专属头衔 */
    title?: string,
    /** 发送者uid */
    uid?: string,
    /** 发送者uin */
    uin?: number
  ): GroupSender {
    return {
      userId: String(userId),
      role: role || 'unknown',
      nick: nick || '',
      sex,
      age,
      card,
      area,
      level,
      title,
      uid,
      uin,
      name: nick || '',
    }
  }

  /**
   * 根据索引获取Bot
   * @param index - Bot的索引id
   */
  getBotByIndex (index: number) {
    return getBot(index)
  }

  /**
   * 获取注册的Bot数量
   * @returns Bot数量
   */
  getBotCount () {
    return getBotCount()
  }

  /**
   * 获取所有Bot列表
   * @param isIndex - 是否返回包含的索引列表 默认`false` 返回Bot列表
   */
  getBotAll<T extends boolean = false> (isIndex?: T): T extends true ? ReturnType<typeof getAllBotList> : ReturnType<typeof getAllBot> {
    if (isIndex) return getAllBotList() as any
    return getAllBot().map((item) => item) as any
  }
}

/**
 * 将部分事件暴露到外部
 */
const events = () => {
  /** ws建立新链接 */
  listeners.on(WS_CONNECTION, (
    socket: WebSocket,
    request: IncomingMessage,
    call: () => void
  ) => {
    other.emit(WS_CONNECTION, socket, request, call)
    const url = new URL(request.url || '', 'ws://localhost')
    other.emit(`${WS_CONNECTION}:${url.pathname}`, socket, request, call)
  })

  /** 文件发送变动 */
  listeners.on('file:change', (type: unknown, old: unknown, data: unknown) => {
    other.emit('file:change', type, old, data)
  })

  /** Bot上线事件 */
  listeners.on('online', (event: Record<string, never>) => {
    other.emit('online', event)
  })
}

export const other = new Other()
events()
