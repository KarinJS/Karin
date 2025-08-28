import { botManager } from '../bot'
import { EventEmitter } from '@karinjs/events'

import type { WebSocket } from 'ws'
import type { IncomingMessage } from 'node:http'
import type { Contact, Event, FriendSender, GroupSender, Scene } from '@karinjs/adapter'
import type {
  WS_CLOSE,
  WS_CONNECTION,
  WS_CLOSE_ONEBOT,
  WS_CLOSE_PUPPETEER,
  WS_CONNECTION_SNAPKA,
  WS_CONNECTION_ONEBOT,
  WS_CONNECTION_PUPPETEER,
  WS_CONNECTION_TERMINAL,
} from '@karinjs/envs'

/** 回调处理器 代表链接已被函数接收 5秒内如果这个回调没有触发 说明此ws链接无效 */
export type CallbackHandler = () => void

export interface SystemEventMap {
  /** 错误事件 */
  error: unknown[]
  /** ws:close 事件 */
  [WS_CLOSE]: [WebSocket, IncomingMessage, number, Buffer]
  /** ws:close:onebot 事件 */
  [WS_CLOSE_ONEBOT]: [WebSocket, IncomingMessage, number, Buffer]
  /** ws:close:puppeteer 事件 */
  [WS_CLOSE_PUPPETEER]: [WebSocket, IncomingMessage, number, Buffer]

  /** ws:connection 事件 */
  [WS_CONNECTION]: [WebSocket, IncomingMessage, CallbackHandler]
  /** ws:connection:snapka 连接事件 */
  [WS_CONNECTION_SNAPKA]: [WebSocket, IncomingMessage, CallbackHandler]
  /** ws:connection:terminal 事件 */
  [WS_CONNECTION_TERMINAL]: [WebSocket, IncomingMessage, CallbackHandler]
  /** ws:connection:onebot 事件 */
  [WS_CONNECTION_ONEBOT]: [WebSocket, IncomingMessage, CallbackHandler]
  /** ws:connection:puppeteer 事件 */
  [WS_CONNECTION_PUPPETEER]: [WebSocket, IncomingMessage, CallbackHandler]
  /** 上下文事件 */
  [key: `ctx:${string}`]: [Event]
  /** 请求关闭stdin的监听 */
  'process:stdin:close': [void]
  /** process:stdin:close发出后的回调 用于恢复stdin的监听 */
  'process:stdin:resume': [void]
}

class Emitter extends EventEmitter<SystemEventMap> {
  /** 框架名称 */
  public name: 'karin' = 'karin'

  /**
   * 构建好友contact
   * @deprecated 请使用 `contact.friend` 代替
   * @param scene `friend`
   * @param peer 用户id
   * @param name 昵称
   */
  contact (scene: 'friend', peer: string, name?: string): Contact<'friend'>
  /**
   * 构建群contact
   * @deprecated 请使用 `contact.friend` 代替
   * @param scene `group`
   * @param peer 群号
   * @param name 昵称
   */
  contact (scene: 'group', peer: string, name?: string): Contact<'group'>
  /**
   * 构建频道contact
   * @deprecated 请使用 `contact.guild` 代替
   * @param scene `guild`
   * @param peer 频道id
   * @param subPeer 子频道id
   * @param name 频道名称
   */
  contact (scene: 'guild', peer: string, subPeer: string, name?: string): Contact<'guild'>
  /**
   * 构建频道私信contact
   * @deprecated 请使用 `contact.direct` 代替
   * @param scene `direct`
   * @param peer 群号或者用户id
   * @param subPeer 子id
   */
  contact (scene: 'direct', peer: string, subPeer: string, name?: string): Contact<'direct'>
  /**
   * 构建临时群会话contact
   * @deprecated 请使用 `contact.groupTemp` 代替
   * @param scene `groupTemp`
   * @param peer 群号或者用户id
   * @param subPeer 子id
   */
  contact (scene: 'groupTemp', peer: string, subPeer: string, name?: string): Contact<'groupTemp'>
  /**
   * 构建contact
   * @deprecated 请直接导入 `contact` 代替
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
   * @deprecated 请使用 `contact.group` 替代
   * @param peer - 群号
   * @param name - 群名
   */
  contactGroup (peer: Contact['peer'], name?: string): Contact<'group'> {
    return { scene: 'group', peer, subPeer: undefined, name: name || '' }
  }

  /**
   * 构建好友contact
   * @deprecated 请使用 `contact.friend` 替代
   * @param peer - 用户id
   * @param name - 昵称
   */
  contactFriend (peer: Contact['peer'], name?: string): Contact<'friend'> {
    return { scene: 'friend', peer, subPeer: undefined, name: name || '' }
  }

  /**
   * 构建频道contact
   * @deprecated 请使用 `contact.guild` 替代
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
   * @deprecated 请使用 `contact.groupTemp` 替代
   * @param peer - 群号
   * @param subPeer - 子id
   * @param name - 群名
   */
  contactGroupTemp (peer: string, subPeer: string, name?: string): Contact<'groupTemp'> {
    return { scene: 'groupTemp', peer, subPeer, name: name || '' }
  }

  /**
   * 构建消息事件私聊发送者信息
   * @deprecated 请使用 `contact.friend` 替代
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
   * @deprecated 请使用 `sender.group` 替代
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
    return botManager.getBot(index)
  }

  /**
   * 获取注册的Bot数量
   * @returns Bot数量
   */
  getBotCount () {
    return botManager.getBotCount()
  }

  /**
   * 获取所有Bot列表
   * @param isIndex - 是否返回包含的索引列表 默认`false` 返回Bot列表
   */
  getBotAll<T extends boolean = false> (isIndex?: T): T extends true
    ? ReturnType<typeof botManager.getAllBotList>
    : ReturnType<typeof botManager.getAllBot> {
    if (isIndex) return botManager.getAllBotList() as any
    return botManager.getAllBot().map((item) => item) as any
  }
}

/**
 * 事件管理器
 */
export const emitter = new Emitter()

/**
 * 内部事件管理器
 */
export const coreEmitter = emitter.createEvent()

export * from './status_listener'
