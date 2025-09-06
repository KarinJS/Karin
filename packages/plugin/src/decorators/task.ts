import callsites from 'callsites'
import { fileURLToPath } from 'node:url'
import { types } from '@karinjs/utils'
import { core } from '../core/core'
import register from '../register/register'
import { createID, createLogger } from './util'
import type { PluginRegisterCache } from './base'
import type { OptionsBase } from './options'

export interface TaskOptions extends OptionsBase {

}

/**
 * 格式化后的参数选项类型
 */
type TaskOptionsFormat = Required<Omit<TaskOptions, 'rank' | 'notAdapter' | 'perm' | 'permission'>>

/** task 插件缓存对象 */
export interface TaskCache extends PluginRegisterCache {
  /** 注册的信息 */
  register: {
    /** 任务名称 */
    name: string
    /** cron表达式 */
    cron: string
    /** 执行函数 */
    fnc: Function
    /** 插件选项 */
    options: TaskOptionsFormat
    /** 定时任务对象 */
    schedule?: any
  }
  /** 插件控制接口 */
  control: {
    /** 更新name */
    setName: (name: string) => void
    /** 更新cron */
    setCron: (cron: string) => void
    /** 更新fnc */
    setFnc: (fnc: Function) => void
    /** 更新options */
    setOptions: (options: TaskOptions) => void
    /** 卸载当前插件 */
    remove: () => void
  }
}

/**
 * 格式化task选项
 * @param options 选项
 * @returns 返回格式化后的选项
 */
const formatOptions = (options: TaskOptions): TaskOptionsFormat => {
  return {
    adapter: types.array(options.adapter, []),
    dsbAdapter: types.array(options.dsbAdapter, types.array(options.notAdapter, [])),
    priority: types.number(options.rank, types.number(options.priority, 10000)),
    name: types.string(options.name, 'task'),
    log: types.bool(options.log, true),
  }
}

/**
 * 构建定时任务
 * @param name 任务名称
 * @param cron cron表达式
 * @param fnc 执行函数
 * @param options 选项
 */
export const task = (
  name: string,
  cron: string,
  fnc: Function,
  options: TaskOptions = {}
): TaskCache => {
  if (!name) throw new Error('[task]: 缺少参数[name]')
  if (!cron) throw new Error('[task]: 缺少参数[cron]')
  if (!fnc || typeof fnc !== 'function') throw new Error('[task]: 缺少参数或类型错误[fnc]')

  const caller = fileURLToPath(callsites()[1].getFileName()!)
  const pkgName = core.getPackageName(caller)

  const id = createID()
  const type = 'task'
  let nameCache = name
  let cronCache = cron
  let fncCache = fnc
  let optCache = formatOptions(options)
  const logCache = createLogger(options.log, true)
  let scheduleCache: any

  const cache: TaskCache = {
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
        get name () {
          return nameCache
        },
        get cron () {
          return cronCache
        },
        get fnc () {
          return fncCache
        },
        get options () {
          return optCache
        },
        get schedule () {
          return scheduleCache
        },
        set schedule (value) {
          scheduleCache = value
        },
      }
    },
    get control () {
      return {
        setName: (name: string) => {
          nameCache = name
        },
        setCron: (cron: string) => {
          cronCache = cron
        },
        setFnc: (fnc: Function) => {
          fncCache = fnc
        },
        setOptions: (options: TaskOptions) => {
          optCache = formatOptions(options)
        },
        remove: () => {
          register.unregisterTask(id)
        },
      }
    },
  }

  register.registerTask(cache)
  return cache
}
