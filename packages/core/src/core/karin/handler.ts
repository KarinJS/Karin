import { system, types } from '@/utils'
import * as manager from '../../plugins/manager'
import * as register from '../../plugins/register'
import { createID, createLogger } from './util'
import type { PluginCache } from './base'
import type { OptionsBase } from './options'

export interface HandlerOptions extends OptionsBase {

}

/**
 * 格式化后的参数选项类型
 */
type HandlerOptionsFormat = Required<Omit<HandlerOptions, 'rank' | 'notAdapter' | 'perm' | 'permission'>>

/** handler 插件缓存对象 */
export interface HandlerCache extends PluginCache {
  /** 注册的信息 */
  register: {
    /** 事件key */
    key: string
    /** 实现函数 */
    fnc: (
      /** 自定义参数 由调用方传递 */
      args: { [key: string]: any },
      /** 调用后将继续执行下一个handler */
      next: (msg?: string) => void,
    ) => Promise<unknown> | unknown
    /** 插件选项 */
    options: HandlerOptionsFormat
  }
  /** 插件控制接口 */
  control: {
    /** 更新key */
    setKey: (key: string) => void
    /** 更新fnc */
    setFnc: (fnc: HandlerCache['register']['fnc']) => void
    /** 更新options */
    setOptions: (options: HandlerOptions) => void
    /** 卸载当前插件 */
    remove: () => void
  }
}

/**
 * 格式化handler选项
 * @param options 选项
 * @returns 返回格式化后的选项
 */
const formatOptions = (options: HandlerOptions): HandlerOptionsFormat => {
  return {
    adapter: types.array(options.adapter, []),
    dsbAdapter: types.array(options.dsbAdapter, types.array(options.notAdapter, [])),
    priority: types.number(options.rank, types.number(options.priority, 10000)),
    name: types.string(options.name, 'handler'),
    log: types.bool(options.log, true),
  }
}

/**
 * 构建handler
 * @param key - 事件key
 * @param fnc - 函数实现
 * @param options - 选项
 */
export const handler = (key: string, fnc: HandlerCache['register']['fnc'], options: HandlerOptions = {}): HandlerCache => {
  if (!key) throw new Error('[handler]: 缺少参数[key]')
  if (!fnc) throw new Error('[handler]: 缺少参数[fnc]')

  const caller = system.getCaller(import.meta.url)
  const pkgName = manager.getPackageName(caller)

  const id = createID()
  const type = 'handler'
  let keyCache = key
  let fncCache = fnc
  let optCache = formatOptions(options)
  const logCache = createLogger(options.log, true)

  const cache: HandlerCache = {
    get type (): typeof type {
      return type
    },
    get pkg () {
      if (!pkgName) {
        throw new Error(`请在符合标准规范的文件中使用此方法: ${caller}`)
      }
      return manager.getPluginPackageDetail(pkgName)!
    },
    get file () {
      return manager.getFileCache(caller)
    },
    get app () {
      return {
        get id () {
          return id
        },
        get type (): 'handler' {
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
        get key () {
          return keyCache
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
        setKey: (key: string) => {
          keyCache = key
        },
        setFnc: (fnc: HandlerCache['register']['fnc']) => {
          fncCache = fnc
        },
        setOptions: (options: HandlerOptions) => {
          optCache = formatOptions(options)
        },
        remove: () => {
          register.unregisterHandler(id)
        },
      }
    },
  }

  register.registerHandler(cache)
  return cache
}
