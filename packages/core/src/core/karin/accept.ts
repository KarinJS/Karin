import { system, types } from '@/utils'
import { plguinManager } from './load'
import { createID, createLogger } from './util'
import { PluginCache, PluginCacheKeyApp } from './base'
import type { FNC } from './util'
import type { OptionsBase } from './options'
import type { NoticeAndRequest } from '@/types/plugin'

export interface AcceptOptions<T extends keyof NoticeAndRequest = keyof NoticeAndRequest> extends Omit<OptionsBase, 'perm' | 'permission'> {
  /** 事件类型 */
  event?: T
}

/**
 * 格式化后的参数选项类型
 */
type AcceptOptionsFormat = Required<Omit<OptionsBase, 'perm' | 'permission' | 'notAdapter' | 'rank'>> & {
  /** 事件类型 */
  event: keyof NoticeAndRequest
}

interface KeyApp extends PluginCacheKeyApp {
  get type (): 'accept'
}

/** accept 插件缓存对象 */
export interface AcceptCache extends PluginCache {
  app: KeyApp
  /** 注册的信息 */
  register: {
    /** 事件类型 */
    event: keyof NoticeAndRequest
    /** 实现函数 */
    fnc: FNC<NoticeAndRequest[keyof NoticeAndRequest]>
    /** 插件选项 */
    options: AcceptOptionsFormat
  }
  /** 插件控制接口 */
  control: {
    /** 更新event */
    setEvent: (event: keyof NoticeAndRequest) => void
    /** 更新fnc */
    setFnc: (fnc: FNC<NoticeAndRequest[keyof NoticeAndRequest]>) => void
    /** 更新options */
    setOptions: (options: AcceptOptions) => void
    /** 卸载当前插件 */
    remove: () => void
  }
}

/**
 * 格式化accept选项
 * @param options 选项
 * @returns 返回格式化后的选项
 */
const formatOptions = (options: AcceptOptions): AcceptOptionsFormat => {
  return {
    event: types.string(options.event, 'notice'),
    adapter: types.array(options.adapter, []),
    dsbAdapter: types.array(options.dsbAdapter, types.array(options.notAdapter, [])),
    priority: types.number(options.rank, types.number(options.priority, 10000)),
    name: types.string(options.name, 'accept'),
    log: types.bool(options.log, true),
  }
}

/**
 * accept
 * @param event 监听事件
 * @param fnc 实现函数
 */
export const accept = <T extends keyof NoticeAndRequest> (
  event: T,
  fnc: FNC<NoticeAndRequest[T]>,
  options: AcceptOptions<T> = {}
): AcceptCache => {
  const caller = system.getCaller(import.meta.url)
  const pkgName = plguinManager.getPackageName(caller)

  const id = createID()
  const type = 'accept'
  let fncCache = fnc as FNC<NoticeAndRequest[keyof NoticeAndRequest]>
  let eventCache = Object.freeze(event as keyof NoticeAndRequest)
  let optCache = Object.freeze(formatOptions(options))
  const logCache = Object.freeze(createLogger(options.log, true))

  const cache: AcceptCache = {
    get pkg () {
      if (!pkgName) {
        throw new Error(`请在符合标准规范的文件中使用此方法: ${caller}`)
      }
      return plguinManager.getPluginPackageDetail(pkgName)!
    },
    get file () {
      return plguinManager.getFileCache(caller)
    },
    get app () {
      return {
        get id () {
          return id
        },
        get type (): 'accept' {
          return type
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
        get event () {
          return eventCache
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
        setEvent: (event: keyof NoticeAndRequest) => {
          eventCache = event as T
        },
        setFnc: (fnc: FNC<NoticeAndRequest[keyof NoticeAndRequest]>) => {
          fncCache = fnc
        },
        setOptions: (options: AcceptOptions) => {
          optCache = formatOptions(options)
        },
        remove: () => {
          plguinManager.unregisterAccept(id)
        },
      }
    },
  }

  plguinManager.registerAccept(cache)
  return cache
}
