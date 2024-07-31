import { server } from './server'
import { stateArr } from './plugin'
import PluginApp from './plugin.app'
import { common } from 'karin/utils'
import { listener } from './listener'
import onebot11 from 'karin/adapter/onebot/11'
import { render, RenderServer } from 'karin/render'
import {
  Scene,
  Contact,
  Permission,
  PluginApps,
  KarinElement,
  KarinMessage,
  KarinRenderType,
  PermissionType,
  RenderResult,
  NoticeListenEvent,
  RequestListenEvent,
  KarinNoticeType,
  KarinRequestType,
} from 'karin/types'

type FncFunction = (e: KarinMessage) => Promise<boolean>
type FncElement = string | KarinElement | Array<KarinElement>

export interface OptionsCommand {
  /**
   * - 插件名称 不传则使用 插件名称:函数名
   */
  name?: string
  /**
   * - 插件优先级 数字越小优先级越高
   * @default 10000
   */
  priority?: number
  /**
   * - 权限
   * @default 'all'
   */
  permission?: PermissionType
  /**
   * - 打印日志
   * @default false
   */
  log?: boolean | Function
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
  /**
   * - 延迟回复 单位毫秒
   */
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

export class Karin {
  start: boolean
  constructor () {
    this.start = false
    this.run()
  }

  /**
  * @param reg - 正则表达式
  * @param fnc - 函数
  * @param options - 选项
  */
  command (reg: string | RegExp, fnc: FncFunction, options?: OptionsCommand): PluginApps
  /**
   * @param reg - 正则表达式
   * @param element - 字符串或者KarinElement、KarinElement数组
   * @param options - 选项
   */
  command (reg: string | RegExp, element: FncElement, options?: OptionsElement): PluginApps
  /**
   * - 快速构建命令
   * @param reg - 正则表达式
   * @param second - 函数或者字符串或者KarinElement、KarinElement数组
   * @param options - 选项
   * @returns - 返回插件对象
   */
  command (reg: string | RegExp, second: FncFunction | FncElement, options: OptionsCommand | OptionsElement = {}): PluginApps {
    reg = typeof reg === 'string' ? new RegExp(reg) : reg
    const fnc = typeof second === 'function'
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
    const data = {
      name: options.name || 'function',
      priority: options.priority,
      rule: [
        {
          reg,
          fnc,
          permission: options.permission || 'all' as Permission,
          log: options.log ?? true,
        },
      ],
    }
    return PluginApp(data)
  }

  /**
   * - 构建定时任务
   * @param name - 任务名称
   * @param cron - cron表达式
   * @param fnc - 执行函数
   * @param options - 选项
   */
  task (name: string, cron: string, fnc: Function, options?: {
    /**
     * - 任务插件名称
     */
    name?: string
    /**
     * - 任务优先级
     */
    priority?: number
    /**
     * - 是否打印日志 传递布尔值
     */
    log?: boolean | Function
  }) {
    if (!name) throw new Error('[task]: 缺少参数[name]')
    if (!cron) throw new Error('[task]: 缺少参数[cron]')
    if (!fnc) throw new Error('[task]: 缺少参数[fnc]')

    const data = {
      name: options?.name || 'task',
      priority: options?.priority,
      task: [
        {
          name,
          cron,
          fnc,
          log: options?.log ?? true,
        },
      ],
    }

    return PluginApp(data)
  }

  /**
   * - 构建handler
   * @param key - 事件key
   * @param fnc - 函数实现
   * @param options - 选项
   */
  handler (key: string, fnc: (
    /**
     * - 自定义参数 由调用方传递
     */
    args: any,
    /**
     * - 拒绝处理器 调用后则不再继续执行下一个处理器
     */
    reject: (msg?: string) => void,
  ) => Promise<any>, options?: {
    /**
     * - 插件名称
     */
    name?: string
    /**
     * - handler优先级
     */
    priority?: number
  }) {
    if (!key) throw new Error('[handler]: 缺少参数[key]')
    if (!fnc) throw new Error('[handler]: 缺少参数[fnc]')

    const priority = options?.priority || 10000

    const data = {
      name: options?.name || 'handler',
      priority,
      handler: [
        {
          key,
          fnc,
          priority,
        },
      ],
    }

    return PluginApp(data)
  }

  /**
   * 构建contact
   * @param peer - 群号或者id
   * @param isGroup - 是否是群聊
   * @param sub_peer - 子id
   */
  contact (peer: string, isGroup: boolean = true, sub_peer?: string): Contact {
    if (isGroup) {
      return {
        scene: Scene.Group,
        peer,
        sub_peer: sub_peer || '',
      }
    }

    return {
      scene: Scene.Private,
      peer,
      sub_peer: sub_peer || '',
    }
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
      if (typeof multiPage === 'number' || multiPage === true) {
        return render.renderMultiHtml(data, multiPage)
      }

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
    /**
     * - 指定用户id触发下文 不指定则使用默认e.user_id
     */
    userId?: string
    /**
     * - 超时时间 默认120秒
     */
    time?: number
    /**
     * - 超时后是否回复
     */
    reply?: boolean
    /**
     * - 超时回复文本 默认为'操作超时已取消'
     */
    replyMsg?: string
  }): Promise<KarinMessage> {
    const time = options?.time || 120
    const userId = options?.userId || e.user_id
    const key = e.group_id ? `${e.group_id}.${userId}` : userId
    stateArr[key] = { type: 'ctx' }
    // 返回promise 设置超时时间
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (stateArr[key]) {
          delete stateArr[key]
          if (options?.reply) e.reply(options.replyMsg || '操作超时已取消')
          reject(new Error('操作超时已取消'))
          return true
        }
      }, time * 1000)

      listener.once(`ctx:${key}`, (e: KarinMessage) => resolve(e))
    })
  }

  /**
   * accept
   * @param event - 监听事件
   * @param fnc - 实现函数
   */
  accept (event: NoticeListenEvent | RequestListenEvent, fnc: (e: KarinNoticeType | KarinRequestType) => boolean, options?: {
    /**
     * - 插件名称
     */
    name?: string
    /**
     * - 优先级
     */
    priority?: number
    /**
     * - 触发函数是否打印日志
     */
    log?: boolean
  }) {
    const data = {
      name: options?.name || 'accept',
      priority: options?.priority,
      event,
      accept: fnc,
      log: options?.log,
    }
    return PluginApp(data)
  }

  /**
   * - 启动
   */
  run () {
    if (this.start) return
    this.start = true
    server.init()
    listener.emit('load.plugin')
    listener.emit('adapter', RenderServer)
    listener.emit('adapter', onebot11)
  }
}

export const karin = new Karin()
export default karin
