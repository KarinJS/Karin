import { stateArr } from '../plugin/base'
import onebot11 from 'karin/adapter/onebot/11'
import { render } from 'karin/render/app'
import { RenderServer } from 'karin/render/server'

import {
  Scene,
  Contact,
  KarinElement,
  KarinMessage,
  KarinRenderType,
  RenderResult,
  AllMessageSubType,
  CommandInfo,
  TaskInfo,
  HandlerInfo,
  UseInfo,
  UseMapType,
  AppType,
  ButtonInfo,
  Permission,
  AcceptDict,
  KarinAdapter,
} from 'karin/types'

import { pluginLoader } from '../plugin/loader'
import { common } from 'karin/utils/common/common'
import { logger } from 'karin/utils/core/logger'
import { Listeners } from '../listener/listener'

export type FncFunction = (e: KarinMessage) => Promise<boolean>
export type FncElement = string | KarinElement | Array<KarinElement>
export type UseFnType<K extends keyof UseMapType> = UseMapType[K]

export interface Options {
  /** 插件名称 不传则使用 插件名称:函数名 */
  name?: string
  /**
   * - 插件优先级 数字越小优先级越高
   * @default 10000
   */
  priority?: number
  /**
   * - 打印日志
   * @default false
   */
  log?: boolean | Function
  /** 只有对应的适配器才会生效 */
  adapter?: Array<KarinAdapter['adapter']['name']>
  /** 指定的适配器无效 */
  notAdapter?: Array<KarinAdapter['adapter']['name']>
}

export interface OptionsCommand extends Options {
  /** 监听事件 */
  event?: `${AllMessageSubType}`
  /**
   * - 权限
   * @default 'all'
   */
  permission?: `${Permission}`
}

export interface OptionsElement extends OptionsCommand {
  /**
   * - 是否加上at 仅在群聊中有效
   * @default false
   */
  at?: boolean
  /**
   * - 是否加上引用回复
   * @default false
   */
  reply?: boolean
  /** 延迟回复 单位毫秒 */
  delay?: number
  /**
   * - 发送是否撤回消息 单位秒
   * @default 0
   */
  recallMsg?: number
  /**
   * - 是否停止执行后续插件
   * @default true
   */
  stop?: boolean
}

export class Karin extends Listeners {
  /** 是否启动 */
  #start: boolean
  /** 存储器 由开发者自行调用 */
  store: Map<any, any>
  constructor () {
    super()

    this.#start = false
    this.store = new Map()
    this.run()
  }

  /**
  * @param reg - 正则表达式
  * @param fn - 函数
  * @param options - 选项
  */
  command (reg: string | RegExp, fn: FncFunction, options?: OptionsCommand): CommandInfo
  /**
   * @param reg - 正则表达式
   * @param element - 字符串或者KarinElement、KarinElement数组
   * @param options - 选项
   */
  command (reg: string | RegExp, element: FncElement, options?: OptionsElement): CommandInfo
  /**
   * - 快速构建命令
   * @param reg - 正则表达式
   * @param second - 函数或者字符串或者KarinElement、KarinElement数组
   * @param options - 选项
   * @returns - 返回插件对象
   */
  command (reg: string | RegExp, second: FncFunction | FncElement, options: OptionsCommand | OptionsElement = {}): CommandInfo {
    reg = typeof reg === 'string' ? new RegExp(reg) : reg
    const fn = typeof second === 'function'
      ? second
      : async (e: KarinMessage) => {
        const element = typeof second === 'number' ? String(second) : second
        if ('delay' in options && options.delay) await common.sleep(options.delay)
        await e.reply(element, {
          at: ('at' in options && options.at) || false,
          reply: ('reply' in options && options.reply) || false,
          recallMsg: ('recallMsg' in options && Number(options.recallMsg)) || 0,
        })
        return !('stop' in options && !options.stop)
      }

    const log = options.log === false
      ? (id: string, text: string) => logger.bot('debug', id, text)
      : (id: string, text: string) => logger.bot('info', id, text)

    return {
      data: '',
      event: options.event || 'message',
      fn,
      fnname: 'fnc',
      log,
      name: options.name || AppType.Command,
      perm: options.permission || 'all',
      rank: options.priority || 10000,
      reg,
      type: AppType.Command,
      adapter: options.adapter || [],
      notAdapter: options.notAdapter || [],
    }
  }

  /**
   * - 构建定时任务
   * @param name - 任务名称
   * @param cron - cron表达式
   * @param fn - 执行函数
   * @param options - 选项
   */
  task (name: string, cron: string, fn: Function, options?: Omit<Options, 'priority'>): TaskInfo {
    if (!name) throw new Error('[task]: 缺少参数[name]')
    if (!cron) throw new Error('[task]: 缺少参数[cron]')
    if (!fn) throw new Error('[task]: 缺少参数[fnc]')

    const log = options?.log === false ? (text: string) => logger.debug(text) : (text: string) => logger.info(text)
    return {
      cron,
      fn,
      log,
      name: options?.name || AppType.Task,
      fnname: name,
      type: AppType.Task,
    }
  }

  /**
   * - 构建handler
   * @param key - 事件key
   * @param fn - 函数实现
   * @param options - 选项
   */
  handler (key: string, fn: HandlerInfo['fn'], options?: Omit<Options, 'log'>): HandlerInfo {
    if (!key) throw new Error('[handler]: 缺少参数[key]')
    if (!fn) throw new Error('[handler]: 缺少参数[fnc]')

    return {
      fn,
      key,
      name: options?.name || AppType.Handler,
      rank: options?.priority || 10000,
      type: AppType.Handler,
    }
  }

  /**
   * 构建contact
   * @param scene - 场景
   * @param peer - 群号或者用户id
   * @param subPeer - 子id
   */
  contact (scene: Contact['scene'], peer: Contact['peer'], subPeer: Contact['sub_peer'] = null): Contact {
    return { scene, peer, sub_peer: subPeer }
  }

  /**
   * 构建group_contact
   * @param peer - 群号
   */
  contactGroup (peer: Contact['peer']): Contact {
    return { scene: Scene.Group, peer, sub_peer: null }
  }

  /**
   * 构建friend_contact
   * @param peer - 用户id
   */
  contactFriend (peer: Contact['peer']): Contact {
    return { scene: Scene.Private, peer, sub_peer: null }
  }

  /**
   * 构建guild_contact
   * @param peer - 频道id
   * @param subPeer - 子频道id
   */
  contactGuild (peer: string, subPeer: string): Contact<Scene.Guild> {
    return { scene: Scene.Guild, peer, sub_peer: subPeer }
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
  render (file: string, multiPage: number | true): Promise<Array<string>>
  /**
   * 正常渲染
   * @param options - 渲染参数
   */
  render<T extends KarinRenderType> (options: T): Promise<RenderResult<T>>
  /**
   * - 渲染
   * @param data - 渲染参数
   * @param multiPage - 分片高度
   * @returns - 返回图片base64或数组
   */
  render<T extends KarinRenderType> (data: string | T, multiPage?: number | true): Promise<string | Array<string> | RenderResult<T>> {
    if (typeof data === 'string') {
      /** 分片 */
      if (typeof multiPage === 'number' || multiPage === true) return render.renderMultiHtml(data, multiPage)
      /** 快速渲染 */
      return render.renderHtml(data)
    }

    /** 正常渲染 */
    return render.render(data)
  }

  /**
   * 上下文
   * @param e - 消息事件
   * @param options - 上下文选项
   */
  async ctx (e: KarinMessage, options?: {
    /** 指定用户id触发下文 不指定则使用默认e.user_id */
    userId?: string
    /** 超时时间 默认120秒 */
    time?: number
    /** 超时后是否回复 */
    reply?: boolean
    /** 超时回复文本 默认为'操作超时已取消' */
    replyMsg?: string
  }): Promise<KarinMessage> {
    const time = options?.time || 120
    const userId = options?.userId || e.user_id
    const key = e.group_id ? `${e.group_id}.${userId}` : userId
    stateArr[key] = { type: 'ctx' }

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (stateArr[key]) {
          delete stateArr[key]
          if (options?.reply) e.reply(options.replyMsg || '操作超时已取消')
          reject(new Error('操作超时已取消'))
          return true
        }
      }, time * 1000)

      this.once(`ctx:${key}`, (e: KarinMessage) => resolve(e))
    })
  }

  /**
   * accept
   * @param event - 监听事件
   * @param fn - 实现函数
   */
  accept<T extends keyof AcceptDict> (event: T, fn: (e: AcceptDict[T]) => Promise＜boolean＞, options?: Options) {
    const log = options?.log === false
      ? (id: string, text: string) => logger.bot('debug', id, text)
      : (id: string, text: string) => logger.bot('info', id, text)

    return {
      event,
      fn,
      log,
      name: options?.name || AppType.Accept,
      rank: options?.priority || 10000,
      type: AppType.Accept,
      adapter: options?.adapter || [],
      notAdapter: options?.notAdapter || [],
    }
  }

  /**
   * 中间件
   * @param type 中间件类型
   * @param fn 中间件函数
   * @param options 选项配置
   */
  use<T extends keyof UseMapType> (
    type: `${T}`,
    fn: UseMapType[T][number]['fn'],
    options?: Omit<Options, 'log'>
  ): UseInfo {
    return {
      fn,
      key: type,
      name: options?.name || AppType.Use,
      rank: options?.priority || 10000,
      type: AppType.Use,
    }
  }

  /**
   * 按钮
   * @param reg - 正则表达式
   * @param fn - 函数
   */
  button (reg: RegExp | string, fn: ButtonInfo['fn'], options?: Omit<Options, 'log'>): ButtonInfo {
    return {
      fn,
      reg: reg instanceof RegExp ? reg : new RegExp(reg),
      name: options?.name || AppType.Button,
      rank: options?.priority || 10000,
      type: AppType.Button,
    }
  }

  /** 启动 */
  async run () {
    if (this.#start) return
    this.#start = true
    const { server } = await import('../server/server')
    server.init()
    pluginLoader.load()
    this.emit('adapter', RenderServer)
    this.emit('adapter', onebot11)
  }
}

export const karin = new Karin()
/**
 * 即将废弃 请使用karin
 * @deprecated
 */
export const listener = karin
/**
 * 即将废弃 请使用karin
 * @deprecated
 */
export const Bot = karin
export default karin
