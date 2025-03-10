import { createFile, createLogger, createPkg } from '@/plugin/tools'
import type { MessageEventMap } from '@/types/event'
import type { CmdFnc, Command } from '@/types/plugin'
import type { Elements } from '@/types/segment'
import type { Options } from './base'

/**
 * 命令选项
 */
export interface CommandOptions<T extends keyof MessageEventMap> extends Options {
  /** 监听事件 */
  event?: T
  notAdapter?: Command['dsbAdapter'],
  /** 是否加上at 仅在群聊中有效 */
  at?: boolean
  /** 是否加上引用回复 */
  reply?: boolean
  /** 发送是否撤回消息 单位秒 */
  recallMsg?: number
  /**
   * 如果无权触发插件 是否打印日志
   * - `true`: `暂无权限，只有主人才能操作`
   * - `false`: ``
   * - `string`: `自定义提示`
   */
  authFailMsg?: boolean | string
}

/**
 * 字符串命令选项
 */
export interface StrCommandOptions<T extends keyof MessageEventMap> extends CommandOptions<T> {
  /** 延迟回复 单位毫秒 */
  delay?: number
  /** 是否停止执行后续插件 */
  stop?: boolean
}

/**
 * 命令类型
 */
export interface CommandType {
  /**
  * @param reg 正则表达式
  * @param fnc 函数
  * @param options 选项
  */
  <T extends keyof MessageEventMap = keyof MessageEventMap> (
    reg: string | RegExp,
    fnc: CmdFnc<T>,
    options?: CommandOptions<T>
  ): Command<T>
  /**
   * @param reg 正则表达式
   * @param element 字符串或者KarinElement、KarinElement数组
   * @param options 选项
   */
  <T extends keyof MessageEventMap = keyof MessageEventMap> (
    reg: string | RegExp,
    element: string | Elements | Elements[],
    options?: StrCommandOptions<T>
  ): Command<T>
}

/**
 * 快速构建命令
 * @param reg 正则表达式
 * @param second 函数或者字符串或者KarinElement、KarinElement数组
 * @param options 选项
 * @returns 返回插件对象
 */
export const command: CommandType = <T extends keyof MessageEventMap = keyof MessageEventMap> (
  reg: string | RegExp,
  second: string | Elements | Elements[] | CmdFnc<T>,
  options: CommandOptions<T> | StrCommandOptions<T> = {}
): Command<T> => {
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
    type: 'fnc',
    event: options.event || ('message' as T),
    fnc,
    log: createLogger(options.log, true),
    permission: options.perm || options.permission || 'all',
    priority: isNaN(rank) ? 10000 : rank,
    reg,
    adapter: Array.isArray(options.adapter) ? options.adapter : [],
    dsbAdapter: Array.isArray(dsbAdapter) ? dsbAdapter : [],
    authFailMsg: options.authFailMsg || true,
    file: createFile('command', options.name || 'command'),
    pkg: createPkg(),
  }
}
