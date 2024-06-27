/* eslint-disable no-dupe-class-members */
import PluginApp from './plugin.app'
import { common } from 'karin/utils/index'
import { KarinMessage } from 'karin/event/message'
import { Permission, PluginApps, KarinElement } from 'karin/types/index'

type FncFunction = (e: KarinMessage) => Promise<boolean>
type FncElement = string | KarinElement | Array<KarinElement>

export interface OptionsCommand {
  /**
   * - 插件名称 不传则使用 插件名称:函数名
   */
  name?: string
  /**
   * - 插件描述
   */
  desc?: string
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
  command (reg: string | RegExp, element: FncElement, options?: OptionsElement): PluginApps
  /**
   * - 快速构建命令
   * @param reg - 正则表达式
   * @param second - 函数或者字符串或者KarinElement、KarinElement数组
   * @param options - 选项
   * @returns - 返回插件对象
   */
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
        const element = common.makeMessage(typeof second === 'function' ? second : String(second))
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
}
