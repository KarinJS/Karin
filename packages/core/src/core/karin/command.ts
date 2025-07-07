import { createLogger } from '@/plugin/tools'
import { system, types } from '@/utils'
import { createID } from './id'
import { plguinManager } from './load'
import type { OptionsBase } from './options'
import type { Elements } from '@/types/segment'
import type { MessageEventMap } from '@/types/event'
import type { PluginCache, PluginCacheKeyApp } from './base'

/**
 * 命令选项
 */
export interface Options<T extends keyof MessageEventMap> extends OptionsBase {
  /** 监听事件 */
  event?: T
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

/** 参数二为消息段时的类型 */
type MessageSegment = string | Elements | Elements[]

/** 参数二为函数时的类型 */
type MessageCallback<T extends keyof MessageEventMap> = (
  /** 消息事件上下文 */
  event: MessageEventMap[T],
  /** 调用后将继续匹配下一个插件 */
  next: () => void
) => Promise<void> | void

/**
 * 参数二维字符串时的命令选项
 */
interface StringOptions<T extends keyof MessageEventMap> extends Options<T> {
  /** 延迟回复 单位毫秒 */
  delay?: number
  /** 是否停止执行后续插件 */
  stop?: boolean
}

/**
 * 回调参数类型
 */
interface Callbacks {
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

/** 格式化命令选项函数返回值 */
type FormatOptions<T extends keyof MessageEventMap> = Required<Omit<
  Options<T>,
  'notAdapter' | 'perm' | 'rank'
>>

interface KeyApp extends PluginCacheKeyApp {
  type: 'command'
}

/** command 插件缓存对象 */
export interface CommandCache extends PluginCache {
  app: KeyApp
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

/** 格式化reg */
const formatReg = (reg: string | RegExp): RegExp => {
  return reg instanceof RegExp ? reg : new RegExp(reg)
}

/**
 * 格式化命令选项
 * @param options 选项
 * @returns 返回命令选项
 */
const formatOptions = <T extends keyof MessageEventMap> (
  options: Options<T>
): Required<FormatOptions<T>> => {
  return {
    at: types.bool(options.at, false),
    reply: types.bool(options.reply, false),
    recallMsg: types.number(options.recallMsg, 0),
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

    await event.reply(element, {
      at: ('at' in options && options.at) || false,
      reply: ('reply' in options && options.reply) || false,
      recallMsg: ('recallMsg' in options && Number(options.recallMsg)) || 0,
    })

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
  const caller = system.getCaller()
  const pkgName = plguinManager.getPackageName(caller)
  if (!pkgName) {
    throw new Error(`请在符合标准规范的文件中使用此方法: ${caller}`)
  }

  let optCache = formatOptions(options)
  let logCache = createLogger(options.log, true)
  let regCache = formatReg(reg)
  let fncCache = formatFnc<T>(second, options) as MessageCallback<keyof MessageEventMap>

  const result: CommandCache = {
    get pkg () {
      return plguinManager.getPluginPackageDetail(pkgName)!
    },
    get file () {
      return plguinManager.getFileCache(caller)
    },
    app: {
      id: createID(),
      type: 'command',
      log: logCache,
      get name () {
        return optCache.name
      },
    },
    register: {
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
    },
    control: {
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
        plguinManager.unregisterCommand(result.app.id)
      },
    },
  }

  /** 对部分属性进行冻结 */
  Object.freeze(result.app.id)
  Object.freeze(result.app.type)
  plguinManager.registerCommand(result)

  return result
}
