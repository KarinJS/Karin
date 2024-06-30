import PluginApp from './plugin.app'
import { common } from 'karin/utils'
import { KarinMessage } from 'karin/event/message'
import { Permission, PluginApps, KarinElement } from 'karin/types'

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
  permission?: Permission
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
  // eslint-disable-next-line no-dupe-class-members
  command (reg: string | RegExp, element: FncElement, options?: OptionsElement): PluginApps
  /**
   * - 快速构建命令
   * @param reg - 正则表达式
   * @param second - 函数或者字符串或者KarinElement、KarinElement数组
   * @param options - 选项
   * @returns - 返回插件对象
   */
  // eslint-disable-next-line no-dupe-class-members
  command (reg: string | RegExp, second: FncFunction | FncElement, options: OptionsCommand | OptionsElement = {}): PluginApps {
    const Reg = typeof reg === 'string' ? new RegExp(reg) : reg

    const data = {
      name: options.name || 'function',
      priority: options.priority,
      rule: [
        {
          reg: Reg,
          fnc: second as FncFunction,
          permission: options.permission || 'all',
          log: options.log ?? true,
        },
      ],
    }

    switch (typeof second) {
      case 'function': {
        return PluginApp(data)
      }
      case 'string':
      case 'number':
      case 'object': {
        const element = common.makeMessage(typeof second === 'number' ? String(second) : second)
        const fnc = async (e: KarinMessage) => {
          if ('delay' in options && options.delay) await common.sleep(options.delay)

          await e.reply(element, {
            at: ('at' in options && options.at) || false,
            reply: ('reply' in options && options.reply) || false,
            recallMsg: ('recallMsg' in options && Number(options.recallMsg)) || 0,
          })
          if ('stop' in options && !options.stop) return false
          return true
        }
        data.rule[0].fnc = fnc
        return PluginApp(data)
      }
      default: {
        throw new Error('command: second argument must be a function or string')
      }
    }
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
    reject: (msg?: string) => void
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
}
