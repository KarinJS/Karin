import callsites from 'callsites'
import { fileURLToPath } from 'node:url'
import { types } from '@karinjs/utils'
import { core, register } from '../manager'
import { formatReg, createID, createLogger } from './util'

import type { PluginRegisterCache } from './base'
import type { OptionsBase } from './options'
import type { Elements, MessageEventMap } from '@karinjs/adapter'
import type { AddRuleItemType, FormatOptions as ClassFormatOptions, Plugin, RuleItemBase } from './class'

/**
 * 命令选项
 */
export interface Options<T extends keyof MessageEventMap> extends OptionsBase {
  /** 监听事件 */
  event?: T
  /**
   * 如果无权触发插件 是否打印日志
   * - `true`: `暂无权限，只有主人才能操作`
   * - `false`: ``
   * - `string`: `自定义提示`
   */
  authFailMsg?: boolean | string
}

/** 参数二为消息段时的类型 */
type MessageSegment = string | Elements | Elements[]

/** 参数二为函数时的类型 */
export type MessageCallback<T extends keyof MessageEventMap> = (
  /** 消息事件上下文 */
  event: MessageEventMap[T],
  /** 调用后将继续匹配下一个插件 */
  next: () => unknown
) => Promise<unknown> | unknown

/**
 * 参数二非函数时的命令选项
 */
interface StringOptions<T extends keyof MessageEventMap> extends Options<T> {
  /** 延迟回复 单位毫秒 */
  delay?: number
  /** 是否停止执行后续插件 */
  stop?: boolean
  /** 是否加上at 仅在群聊中有效 */
  at?: boolean
  /** 是否加上引用回复 */
  reply?: boolean
  /** 发送是否撤回消息 单位秒 */
  recallMsg?: number
}

/**
 * 回调参数类型
 */
export interface Callbacks {
  /**
  * @param reg 正则表达式
  * @param fnc 函数
  * @param options 选项
  */
  <T extends keyof MessageEventMap> (reg: string | RegExp, fnc: MessageCallback<T>, options?: Options<T>): CommandCache
  /**
   * @param reg 正则表达式
   * @param element 字符串或者KarinElement、KarinElement数组
   * @param options 选项
   */
  <T extends keyof MessageEventMap> (reg: string | RegExp, element: MessageSegment, options?: StringOptions<T>): CommandCache
}

/** 格式化后的参数选项类型 */
type FormatOptions<T extends keyof MessageEventMap> = Required<Omit<
  Options<T>,
  'notAdapter' | 'perm' | 'rank'
>>

/** command 插件缓存对象 */
export interface CommandPluginCache extends PluginRegisterCache {
  type: 'command'
  /** 注册的信息 */
  register: {
    /** 插件注册的正则 */
    reg: RegExp
    /** 回调函数 */
    fnc: MessageCallback<keyof MessageEventMap>
    /** 插件选项 */
    options: FormatOptions<keyof MessageEventMap>
  }
  /** 插件控制接口 */
  control: {
    /** 更新reg */
    setReg: (reg: RegExp) => void
    /** 更新fnc */
    setFnc: (fnc: MessageCallback<keyof MessageEventMap>) => void
    /** 更新options */
    setOptions: (options: Options<keyof MessageEventMap>) => void
    /** 卸载当前插件 */
    remove: () => void
  }
}

/** class 插件缓存对象 */
export interface ClassPluginCache extends PluginRegisterCache {
  type: 'class'
  /** 注册的信息 */
  register: {
    /** 插件注册的正则 */
    reg: RegExp
    /** 回调函数 */
    fnc: MessageCallback<keyof MessageEventMap>
    /** 整个类选项 */
    get _options (): ClassFormatOptions
    /** 当前rule规则 */
    get options (): ClassFormatOptions['rule'][number]
    /** new之后的class */
    get instance (): Plugin
    /** 注册的插件ID组 */
    get ids (): string[]
  }
  /** 插件控制接口 */
  control: {
    /** 更新当前reg */
    setReg: (reg: RegExp) => void
    /** 更新当前fnc */
    setFnc: (fnc: MessageCallback<keyof MessageEventMap>) => void
    /** 更新当前rule参数 */
    setRule: (options: RuleItemBase) => void
    /** 卸载当前rule对应的单个插件 */
    remove: () => void
    /** 在当前rule组新增一个rule */
    addRule: <T extends keyof MessageEventMap> (options: AddRuleItemType<T> & { event?: T }) => void
    /** 卸载当前rule组 */
    removeRule: () => void
  }
}

/** 命令缓存对象 */
export type CommandCache = CommandPluginCache | ClassPluginCache

/**
 * 格式化命令选项
 * @param options 选项
 * @returns 返回命令选项
 */
const formatOptions = <T extends keyof MessageEventMap> (
  options: Options<T>
): Required<FormatOptions<T>> => {
  return {
    authFailMsg: types.string(options.authFailMsg, true),
    name: types.string(options.name, 'command'),
    log: types.bool(options.log, true),
    event: types.string(options.event, 'message') as T,
    permission: types.string(options.permission, types.string(options.perm, 'all')),
    priority: types.number(options.priority, types.number(options.rank, 10000)),
    adapter: types.array(options.adapter, []),
    dsbAdapter: types.array(options.dsbAdapter, types.array(options.notAdapter, [])),
  }
}

/**
 * 格式化回调函数
 * @param fnc 回调函数
 * @param options 选项
 * @returns 返回回调函数
 */
const formatFnc = <T extends keyof MessageEventMap> (
  fnc: MessageCallback<T> | MessageSegment,
  options: Options<T> | StringOptions<T>
): MessageCallback<T> => {
  if (typeof fnc === 'function') return fnc

  return async (event: MessageEventMap[T], next: () => void) => {
    const element = typeof fnc === 'number' ? String(fnc) : fnc
    if ('delay' in options && typeof options.delay === 'number' && options.delay > 0) {
      await new Promise(resolve => setTimeout(resolve, options.delay))
    }

    const at = ('at' in options && typeof options.at === 'boolean' && options.at) || false
    const reply = ('reply' in options && typeof options.reply === 'boolean' && options.reply) || false
    const recallMsg = ('recallMsg' in options && typeof options.recallMsg === 'number' && options.recallMsg) || 0

    await event.reply(element, { at, reply, recallMsg })

    if ('stop' in options && !options.stop) return
    next()
  }
}

/**
 * 快速构建命令
 * @param reg 正则表达式
 * @param second 函数或者字符串或者KarinElement、KarinElement数组
 * @param options 选项
 * @returns 返回插件对象
 */
export const command: Callbacks = <T extends keyof MessageEventMap = keyof MessageEventMap> (
  reg: string | RegExp,
  second: MessageCallback<T> | MessageSegment,
  options: Options<T> | StringOptions<T> = {}
): CommandCache => {
  const file = callsites()
  const filename = file[1].getFileName()!
  const caller = fileURLToPath(filename)
  const pkgName = core.getPackageName(caller)

  const id = createID()
  const type = 'command'
  let regCache = formatReg(reg)
  let optCache = formatOptions(options)
  let logCache = createLogger(options.log, true)
  let fncCache = formatFnc<T>(second, options) as MessageCallback<keyof MessageEventMap>

  const result: CommandCache = {
    get type (): typeof type {
      return type
    },
    get pkg () {
      if (!pkgName) {
        throw new Error(`请在符合标准规范的文件中使用此方法: ${caller}`)
      }
      return core.getPluginPackageDetail(pkgName)!
    },
    get file () {
      return core.getFileCache(caller)
    },
    get app () {
      return {
        get id () {
          return id
        },
        get log () {
          return logCache
        },
        get name () {
          return optCache.name
        },
      }
    },
    get register () {
      return {
        get reg () {
          /** 这里重新赋值是防止lastIndex错误 */
          const r = regCache
          return r
        },
        get fnc () {
          return fncCache
        },
        get options () {
          return optCache
        },
      }
    },
    get control () {
      return {
        setReg: (reg: string | RegExp) => {
          regCache = formatReg(reg)
        },
        setFnc: (fnc: MessageCallback<keyof MessageEventMap>) => {
          fncCache = fnc
        },
        setOptions: (options: Options<keyof MessageEventMap>) => {
          optCache = formatOptions(options as Options<T>)
          logCache = createLogger(options.log, true)
          fncCache = formatFnc<T>(second, options as Options<T>) as MessageCallback<keyof MessageEventMap>
        },
        remove: () => {
          register.unregisterCommand(result.app.id)
        },
      }
    },
  }

  register.registerCommand(result)

  return result
}
