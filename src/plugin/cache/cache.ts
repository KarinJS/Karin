import { Cache } from './types'
import type { MessageEventMap } from '@/event/types'
import type { CommandClass, CommandFnc } from './types'

/** 获取插件列表时的缓存 */
export const getPlgsCache = new Map<string, any>()

/** 缓存 */
export const cache: Cache = {
  accept: [],
  command: [],
  task: [],
  button: [],
  handler: [],
  middleware: [],
  missing: new Map(),
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
  /** 插件类 */
  cls: CommandClass['cls']
  /** 插件方法名称 */
  fncname: CommandClass['fncname']
  /** 权限 */
  permission?: CommandClass['perm']
  /** 优先级 */
  priority?: CommandClass['rank']
}

/**
 * 创建日志方法
 * @param enable 是否启用
 * @param id Bot ID
 * @param log 日志内容
 */
export const createLogger = (enable?: boolean) => {
  return enable === false
    ? (id: string, log: string) => logger.bot('debug', id, log)
    : (id: string, log: string) => logger.bot('mark', id, log)
}

/** 创建command calss风格的插件缓存 */
export const createCommandClassCache = (options: ClsOptions) => {
  cache.command.push({
    index: 0,
    fncType: 'command',
    type: 'class',
    name: options.name,
    fncname: options.fncname,
    adapter: Array.isArray(options.adapter) ? options.adapter : [],
    dsbAdapter: Array.isArray(options.dsbAdapter) ? options.dsbAdapter : [],
    cls: options.cls,
    reg: options.reg instanceof RegExp ? options.reg : new RegExp(options.reg),
    perm: options.permission || 'all',
    log: createLogger(options.log),
    rank: options.priority ?? 10000,
  })
}

/** 创建command fnc风格的插件 */
export const createCommandFncCache = <T extends keyof MessageEventMap = keyof MessageEventMap> (options: T extends keyof MessageEventMap
  ? FncOptions & {
    /** 监听事件 */
    event: T
    /** 执行方法 */
    fnc: (e: MessageEventMap[T]) => Promise<boolean> | boolean
  }
  : never
): CommandFnc => {
  return {
    fncType: 'command',
    type: 'fnc',
    index: 0,
    name: options.name || 'command',
    fncname: '',
    event: options.event as CommandFnc['event'],
    fnc: options.fnc as CommandFnc['fnc'],
    log: createLogger(options.log),
    perm: options.perm || 'all',
    rank: options.rank ?? 10000,
    reg: options.reg instanceof RegExp ? options.reg : new RegExp(options.reg),
    adapter: Array.isArray(options.adapter) ? options.adapter : [],
    dsbAdapter: Array.isArray(options.dsbAdapter) ? options.dsbAdapter : [],
  }
}

createCommandFncCache({
  event: 'message.friend',
  fnc: async (e) => {
    console.log(e)
    return true
  },
  name: 'command',
  reg: '.*',
  log: true,
  adapter: ['onebot'],
  dsbAdapter: ['onebot'],
  perm: 'all',
  rank: 10000,
})
