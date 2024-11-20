import { Cache } from './types'
import type { CommandClass, CommandFnc } from './types'

/** 获取插件列表时的缓存 */
export const getPluginCache = new Map<string, any>()

/** 缓存 */
export const cache: Cache = {
  index: {},
  accept: [],
  command: [],
  task: [],
  button: [],
  handler: {},
  missing: new Map(),
  watcher: new Map(),
  middleware: {
    recvMsg: [],
    replyMsg: [],
    sendMsg: [],
    forwardMsg: [],
    notFoundMsg: [],
  },
  count: {
    accept: 0,
    command: 0,
    task: 0,
    button: 0,
    handler: {
      key: 0,
      fnc: 0,
    },
    middleware: 0,
  },
  static: [],
}

export type FncOptions = {
  /** 插件名称 */
  name: string
  /** 是否启用日志 */
  log?: boolean
  /** 正则 */
  reg: string | RegExp
  /** 权限 */
  perm?: CommandFnc['perm']
  /** 优先级 */
  rank?: CommandFnc['rank']
  /** 适配器 */
  adapter?: CommandFnc['adapter']
  /** 适配器 */
  dsbAdapter?: CommandFnc['dsbAdapter']
}

export type ClsOptions = Omit<FncOptions, 'perm' | 'rank'> & {
  /** 插件索引 */
  index: number
  /** 插件类 */
  cls: CommandClass['Cls']
  /** 监听事件 */
  event?: CommandClass['event']
  /** 插件方法名称 */
  fname: CommandClass['file']['method']
  /** 优先级 */
  priority?: CommandClass['rank']
}

/**
 * 创建日志方法
 * @param enable 是否启用
 * @param isBot 是否为bot
 */
export const createLogger = (enable?: boolean, isBot = true): Function => {
  if (isBot) {
    return enable === false
      ? (id: string, log: string) => logger.bot('debug', id, log)
      : (id: string, log: string) => logger.bot('mark', id, log)
  }
  return enable === false
    ? (log: string) => logger.debug(log)
    : (log: string) => logger.mark(log)
}

// /** 创建command class风格的插件缓存 */
// export const createCommandClassCache = (options: ClsOptions) => {
//   cache.command.push({
//     get info () {
//       return cache.index[options.index]
//     },
//     file: {

//     }
//     type: 'class',
//     event: options.event || 'message',
//     index: options.index,
//     name: options.name,
//     adapter: Array.isArray(options.adapter) ? options.adapter : [],
//     dsbAdapter: Array.isArray(options.dsbAdapter) ? options.dsbAdapter : [],
//     cls: options.cls,
//     reg: options.reg instanceof RegExp ? options.reg : new RegExp(options.reg),
//     log: createLogger(options.log),
//     rank: options.priority ?? 10000,
//   })
// }

// /** 创建command fnc风格的插件 */
// export const createCommandFncCache = <T extends keyof MessageEventMap = keyof MessageEventMap> (options: T extends keyof MessageEventMap
//   ? FncOptions & {
//     /** 监听事件 */
//     event: T
//     /** 执行方法 */
//     fnc: (e: MessageEventMap[T]) => Promise<boolean> | boolean
//   }
//   : never
// ): CommandFnc => {
//   return {
//     fncType: 'command',
//     type: 'fnc',
//     index: 0,
//     name: options.name || 'command',
//     fname: '',
//     event: options.event as CommandFnc['event'],
//     fnc: options.fnc as CommandFnc['fnc'],
//     log: createLogger(options.log),
//     perm: options.perm || 'all',
//     rank: options.rank ?? 10000,
//     reg: options.reg instanceof RegExp ? options.reg : new RegExp(options.reg),
//     adapter: Array.isArray(options.adapter) ? options.adapter : [],
//     dsbAdapter: Array.isArray(options.dsbAdapter) ? options.dsbAdapter : [],
//   }
// }
