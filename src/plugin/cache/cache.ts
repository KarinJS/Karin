import type { Plugin } from '../class'
import { Cache } from './types'
import { PermissionEnum } from '@/adapter/sender'

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

type CommandClassOptions = {
  index: number
  name: string
  fncname: string
  cls: new () => Plugin
  reg: string | RegExp
  log?: boolean
  apadter?: string[]
  dsbAdapter?: string[]
  permission?: `${PermissionEnum}`
  priority?: number
}

/** 创建command calss风格的插件缓存 */
export const createCommandClassCache = (options: CommandClassOptions) => {
  const log = options.log === false
    ? (id: string, log: string) => logger.bot('debug', id, log)
    : (id: string, log: string) => logger.bot('mark', id, log)

  cache.command.push({
    index: options.index,
    fncType: 'command',
    type: 'class',
    name: options.name,
    fncname: options.fncname,
    adapter: Array.isArray(options.apadter) ? options.apadter : [],
    dsbAdapter: Array.isArray(options.dsbAdapter) ? options.dsbAdapter : [],
    cls: options.cls,
    reg: options.reg instanceof RegExp ? options.reg : new RegExp(options.reg),
    perm: options.permission || 'all',
    log,
    rank: options.priority ?? 10000,
  })
}
