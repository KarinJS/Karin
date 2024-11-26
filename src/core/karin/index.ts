import path from 'node:path'
import { Message } from '@/event'
import { TypedListeners } from '@/internal/listeners'
import { context } from '@/event/handler/message/context'
import { cache, createLogger } from '@/plugin/cache/cache'
import { getAllBot, getAllBotList, getBot, getBotCount } from '@/service'
import { callRender, renderHtml, renderMultiHtml } from '@adapter/render/cache'
import { Contact, ContactWithoutSubPeer, ContactWithSubPeer, Scene } from '@/adapter/contact'
import type { ElementTypes } from '@/adapter/segment'
import type { MessageEventMap } from '@/event/types/types'
import type { GroupSender, FriendSender } from '@/adapter/sender'
import type { Options, RenderResult } from '@adapter/render/types'
import type {
  Accept,
  Task,
  Button,
  CommandFnc,
  MiddlewareMap,
  NoticeAndRequest,
} from '@/plugin/cache/types'
import { sendMsg } from './sendMsg'

export type FncElement = string | ElementTypes | ElementTypes[]
export type FncOptions = {
  /** 插件名称 */
  name?: string
  /** 是否启用日志 */
  log?: boolean
  /** 权限 默认`all` */
  perm?: CommandFnc['perm']
  /** 优先级 默认`10000` */
  rank?: CommandFnc['rank']
  /** 生效的适配器 */
  adapter?: CommandFnc['adapter']
  /** 禁用的适配器 */
  dsbAdapter?: CommandFnc['dsbAdapter']
  /**
   * 权限
   * @default 'all'
   * @deprecated 已废弃 请使用`perm`
   */
  permission?: CommandFnc['perm']
  /**
   * 插件优先级 数字越小优先级越高
   * @default 10000
   */
  priority?: CommandFnc['rank']
  /**
   * 禁用的适配器
   * @deprecated 已废弃 请使用`dsbAdapter`
   */
  notAdapter?: CommandFnc['dsbAdapter']
}

export type FncElemOptions = FncOptions & {
  /** 是否加上at 仅在群聊中有效 */
  at?: boolean
  /** 是否加上引用回复 */
  reply?: boolean
  /** 延迟回复 单位毫秒 */
  delay?: number
  /** 发送是否撤回消息 单位秒 */
  recallMsg?: number
  /** 是否停止执行后续插件 */
  stop?: boolean
}

export interface TaskOptions {
  /** 插件名称 */
  name?: string
  /** 是否启用日志 */
  log?: boolean
}

export interface ButtonOptions {
  /** 插件名称 */
  name?: string
  /** 优先级 */
  rank?: number
  /** 优先级 */
  priority?: number
}

export interface MiddlewareOptions {
  /** 插件名称 */
  name?: string
  /** 优先级 */
  priority?: number
  /** 优先级 */
  rank?: number
}

type Fnc<T extends keyof MessageEventMap> = FncElement | ((e: MessageEventMap[T]) => Promise<boolean> | boolean)
type ElemAndEvent<T extends keyof MessageEventMap> = FncElemOptions & { event: T }
type commandOptions<T extends keyof MessageEventMap> = (FncOptions & { event?: T }) | ElemAndEvent<T>

export class Karin extends TypedListeners {
  /** 框架名称 */
  public name: 'karin' = 'karin'
  /**
   * 获取适配器
   * @param id 适配器索引 | 适配器协议实现 | 机器人ID
   * @param isProtocol 此项是为了区分传入的是BotID还是协议实现
   * @returns 适配器
   */
  public getBot: typeof getBot
  /**
   * 发送主动消息
   * @param uid - Bot的uid
   * @param contact - 目标信息
   * @param elements - 消息内容
   * @param options - 消息选项
   * @param options.recallMsg - 发送成功后撤回消息时间
   * @param options.retryCount - 重试次数
   */
  public sendMsg: typeof sendMsg

  constructor () {
    super()
    this.getBot = getBot
    this.sendMsg = sendMsg
  }

  /**
  * @param reg 正则表达式
  * @param fnc 函数
  * @param options 选项
  */
  command<T extends keyof MessageEventMap = keyof MessageEventMap> (
    reg: string | RegExp,
    fnc: (e: MessageEventMap[T]) => Promise<boolean> | boolean,
    options?: FncOptions & {
      /** 监听事件 */
      event: T
    }): CommandFnc<T>
  /**
   * @param reg 正则表达式
   * @param element 字符串或者KarinElement、KarinElement数组
   * @param options 选项
   */
  command<T extends keyof MessageEventMap = keyof MessageEventMap> (reg: string | RegExp, element: FncElement, options?: ElemAndEvent<T>): CommandFnc<T>
  /**
   * 快速构建命令
   * @param reg 正则表达式
   * @param second 函数或者字符串或者KarinElement、KarinElement数组
   * @param options 选项
   * @returns 返回插件对象
   */
  command<T extends keyof MessageEventMap = keyof MessageEventMap> (reg: string | RegExp, second: Fnc<T>, options: commandOptions<T> = {}): CommandFnc<T> {
    reg = typeof reg === 'string' ? new RegExp(reg) : reg
    /** 参数归一化 */
    const fnc = typeof second === 'function'
      ? second
      : async (e: MessageEventMap[T]) => {
        const element = typeof second === 'number' ? String(second) : second
        await e.reply(element, {
          at: ('at' in options && options.at) || false,
          reply: ('reply' in options && options.reply) || false,
          recallMsg: ('recallMsg' in options && Number(options.recallMsg)) || 0,
        })
        return !('stop' in options && !options.stop)
      }

    const dsbAdapter = options.dsbAdapter || options.notAdapter || []
    const rank = Number(options.rank ?? options.priority)
    return {
      index: 0,
      type: 'fnc',
      name: options.name || 'command',
      event: options.event || ('message' as T),
      fnc,
      log: createLogger(options.log),
      perm: options.perm || options.permission || 'all',
      rank: isNaN(rank) ? 10000 : rank,
      reg,
      adapter: Array.isArray(options.adapter) ? options.adapter : [],
      dsbAdapter: Array.isArray(dsbAdapter) ? dsbAdapter : [],
      file: {
        basename: '',
        dirname: '',
        method: '',
        type: 'command',
        get path () {
          return path.join(this.dirname, this.basename)
        },
      },
      get info () {
        return cache.index[this.index]
      },
    }
  }

  /**
   * accept
   * @param event 监听事件
   * @param fnc 实现函数
   */
  accept<T extends keyof NoticeAndRequest = keyof NoticeAndRequest> (event: T, fnc: (e: NoticeAndRequest[T]) => Promise<boolean> | boolean, options: Omit<FncOptions, 'perm' | 'permission'> = {}): Accept<T> {
    const dsbAdapter = options.dsbAdapter || options.notAdapter || []
    const rank = Number(options.rank ?? options.priority)
    return {
      index: 0,
      event,
      fnc,
      log: createLogger(options.log),
      name: options?.name || '',
      rank: isNaN(rank) ? 10000 : rank,
      adapter: Array.isArray(options.adapter) ? options.adapter : [],
      dsbAdapter: Array.isArray(dsbAdapter) ? dsbAdapter : [],
      file: {
        basename: '',
        dirname: '',
        method: '',
        type: 'accept',
        get path () {
          return path.join(this.dirname, this.basename)
        },
      },
      get info () {
        return cache.index[this.index]
      },
    }
  }

  /**
   * 构建定时任务
   * @param name 任务名称
   * @param cron cron表达式
   * @param fnc 执行函数
   * @param options 选项
   */
  task (name: string, cron: string, fnc: Function, options: TaskOptions = {}): Task {
    if (!name) throw new Error('[task]: 缺少参数[name]')
    if (!cron) throw new Error('[task]: 缺少参数[cron]')
    if (!fnc || typeof fnc !== 'function') throw new Error('[task]: 缺少参数或类型错误[fnc]')

    return {
      index: 0,
      name: options?.name || 'task',
      cron,
      fnc,
      log: createLogger(options.log, false),
      schedule: undefined,
      file: {
        basename: '',
        dirname: '',
        method: '',
        type: 'task',
        get path () {
          return path.join(this.dirname, this.basename)
        },
      },
      get info () {
        return cache.index[this.index]
      },
    }
  }

  /**
   * 按钮
   * @param reg - 正则表达式
   * @param fnc - 函数
   */
  button (reg: RegExp | string, fnc: Button['fnc'], options: ButtonOptions = {}): Button {
    const rank = Number(options.rank ?? options.priority)
    return {
      index: 0,
      fnc,
      reg: reg instanceof RegExp ? reg : new RegExp(reg),
      name: options?.name || 'button',
      rank: isNaN(rank) ? 10000 : rank,
      file: {
        basename: '',
        dirname: '',
        method: '',
        type: 'button',
        get path () {
          return path.join(this.dirname, this.basename)
        },
      },
      get info () {
        return cache.index[this.index]
      },
    }
  }

  /**
   * 中间件
   * @param type 中间件类型
   * @param fn 中间件函数
   * @param options 选项配置
   */
  use<T extends keyof MiddlewareMap> (
    type: `${T}`,
    fnc: MiddlewareMap[T]['fnc'],
    options: MiddlewareOptions = {}
  ): MiddlewareMap[T] {
    const rank = Number(options.rank ?? options.priority)
    return {
      index: 0,
      type,
      fnc,
      name: options?.name || 'use',
      rank: isNaN(rank) ? 10000 : rank,
      file: {
        basename: '',
        dirname: '',
        method: '',
        type: 'middleware',
        get path () {
          return path.join(this.dirname, this.basename)
        },
      },
      get info () {
        return cache.index[this.index]
      },
    } as MiddlewareMap[T]
  }

  /**
   * 构建好友contact
   * @param scene `friend`
   * @param peer 群号或者用户id
   */
  contact (scene: 'friend', peer: string): Contact<'friend'>
  /**
   * 构建群contact
   * @param scene `group`
   * @param peer 群号或者用户id
   */
  contact (scene: 'group', peer: string): Contact<'group'>
  /**
   * 构建频道contact
   * @param scene `guild`
   * @param peer 群号或者用户id
   * @param subPeer 子id
   */
  contact (scene: 'guild', peer: string, subPeer: string): Contact<'guild'>
  /**
   * 构建频道私信contact
   * @param scene `direct`
   * @param peer 群号或者用户id
   * @param subPeer 子id
   */
  contact (scene: 'direct', peer: string, subPeer: string): Contact<'direct'>
  /**
   * 构建临时群会话contact
   * @param scene `groupTemp`
   * @param peer 群号或者用户id
   * @param subPeer 子id
   */
  contact (scene: 'groupTemp', peer: string, subPeer: string): Contact<'groupTemp'>
  /**
   * 构建contact
   * @param scene 场景
   * @param peer 群号或者用户id
   * @param subPeer 子id
   */
  contact (scene: Scene, peer: string, subPeer?: string): ContactWithSubPeer | ContactWithoutSubPeer {
    if (scene === 'guild' || scene === 'direct' || scene === 'groupTemp') {
      return { scene, peer, subPeer, sub_peer: subPeer } as ContactWithSubPeer
    } else {
      return { scene, peer, subPeer: null, sub_peer: null } as ContactWithoutSubPeer
    }
  }

  /**
   * 构建群contact
   * @param peer - 群号
   */
  contactGroup (peer: Contact['peer']): Contact<'group'> {
    return { scene: 'group', peer, subPeer: null, sub_peer: null }
  }

  /**
   * 构建好友contact
   * @param peer - 用户id
   */
  contactFriend (peer: Contact['peer']): Contact<'friend'> {
    return { scene: 'friend', peer, subPeer: null, sub_peer: null }
  }

  /**
   * 构建频道contact
   * @param peer - 频道id
   * @param subPeer - 子频道id
   */
  contactGuild (peer: string, subPeer: string): Contact<'guild'> {
    return { scene: 'guild', peer, subPeer, sub_peer: subPeer }
  }

  /**
   * 构建临时群会话contact
   * @param peer - 群号
   * @param subPeer - 子id
   */
  contactGroupTemp (peer: string, subPeer: string): Contact<'groupTemp'> {
    return { scene: 'groupTemp', peer, subPeer, sub_peer: subPeer }
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
    return { userId: String(userId), nick, sex, age, uid, uin }
  }

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
    /** 发送者昵称 */
    nick: string,
    /** 发送者在群的角色身份 非群、频道场景为`unknown` */
    role: GroupSender['role'] = 'unknown',
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
    return { userId: String(userId), nick, role, sex, age, card, area, level, title, uid, uin }
  }

  /**
   * 上下文
   * @param e - 消息事件
   * @param options - 上下文选项
   * @returns 返回下文消息事件 如果超时则返回null
   */
  async ctx (e: Message, options?: {
    /** 指定用户id触发下文 不指定则使用默认e.user_id */
    userId?: string
    /** 超时时间 默认120秒 */
    time?: number
    /** 超时后是否回复 */
    reply?: boolean
    /** 超时回复文本 默认为'操作超时已取消' */
    replyMsg?: string
  }): Promise<Message | null> {
    const time = options?.time || 120
    const userId = options?.userId || e.userId || e.user_id
    const key = e.contact.subPeer ? `${e.contact.peer}:${e.contact.subPeer}:${userId}` : `${e.contact.peer}:${userId}`
    context.set(key, e)

    return new Promise((resolve) => {
      const timeout = setTimeout(() => {
        const data = context.get(key)
        if (data?.eventId === e.eventId) {
          context.delete(key)
          if (options?.reply) e.reply(options.replyMsg || '操作超时已取消')
          /** 移除监听器 */
          this.removeAllListeners(`ctx:${key}`)
          logger.bot('error', e.selfId, `接收下文事件超时，已取消下文监听: ${key}`)
          resolve(null)
          return true
        }
      }, time * 1000)

      this.once(`ctx:${key}`, (e: Message) => {
        clearTimeout(timeout)
        resolve(e)
      })
    })
  }

  /**
   * 快速渲染
   * @param file - 文件路径、http地址
   */
  render (file: string): Promise<string>
  /**
   * 分片渲染
   * @param options - 渲染参数
   */
  render (file: string, multiPage: number | boolean): Promise<Array<string>>
  /**
   * 自定义渲染
   * @param options - 渲染参数
   */
  render<T extends Options> (options: T, id?: string): Promise<RenderResult<T>>

  render<T extends Options> (
    options: string | T,
    multiPageOrId?: string | number | boolean
  ): Promise<RenderResult<T> | string | Array<string>> {
    if (typeof options === 'string') {
      if (!multiPageOrId) {
        return renderHtml(options)
      }

      return renderMultiHtml(options, multiPageOrId as number | boolean)
    }

    return callRender(options, multiPageOrId as string)
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
   * @param isIndex - 是否返回包含的索引列表 默认返回Bot实例列表
   */
  getBotAll<T extends boolean> (isIndex?: T): T extends true ? ReturnType<typeof getAllBotList> : ReturnType<typeof getAllBot> {
    if (isIndex) return getAllBotList() as any
    return getAllBot().map((item) => item) as any
  }
}

export const karin = new Karin()
