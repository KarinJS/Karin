import { getCaller, types } from '@karinjs/utils'
import * as manager from '../manager/manager'
import * as register from '../manager/register'
import { createID, createLogger } from './util'

import type { Event } from '@karinjs/adapter'
import type { PluginCache } from './base'
import type { ButtonType } from '../manager/types'
import type { OptionsBase } from './options'

export interface ButtonOptions extends OptionsBase {

}

/**
 * 格式化后的参数选项类型
 */
type ButtonOptionsFormat = Required<Omit<ButtonOptions, 'rank' | 'notAdapter' | 'perm' | 'permission'>>

/** button 插件缓存对象 */
export interface ButtonCache extends PluginCache {
  type: 'button'
  /** 注册的信息 */
  register: {
    /** 正则表达式 */
    reg: RegExp
    /** 实现函数 */
    fnc: (
      /** 是否继续匹配下一个按钮 默认否 调用后则继续 */
      next: () => void,
      /** 自定义参数 如果传e需要符合标准 */
      args?: { e?: Event, [key: string]: any }
    ) => Promise<ButtonType> | ButtonType
    /** 插件选项 */
    options: ButtonOptionsFormat
  }
  /** 插件控制接口 */
  control: {
    /** 更新reg */
    setReg: (reg: string | RegExp) => void
    /** 更新fnc */
    setFnc: (fnc: ButtonCache['register']['fnc']) => void
    /** 更新options */
    setOptions: (options: ButtonOptions) => void
    /** 卸载当前插件 */
    remove: () => void
  }
}

/**
 * 格式化button选项
 * @param options 选项
 * @returns 返回格式化后的选项
 */
const formatOptions = (options: ButtonOptions): ButtonOptionsFormat => {
  return {
    adapter: types.array(options.adapter, []),
    dsbAdapter: types.array(options.dsbAdapter, types.array(options.notAdapter, [])),
    priority: types.number(options.rank, types.number(options.priority, 10000)),
    name: types.string(options.name, 'button'),
    log: types.bool(options.log, true),
  }
}

/**
 * 格式化正则表达式
 * @param reg 正则表达式或字符串
 * @returns 返回格式化后的正则表达式
 */
const formatReg = (reg: string | RegExp): RegExp => {
  return reg instanceof RegExp ? reg : new RegExp(reg)
}

/**
 * 按钮
 * @param reg - 正则表达式
 * @param fnc - 函数
 * @param options - 选项
 */
export const button = (
  reg: RegExp | string,
  fnc: ButtonCache['register']['fnc'],
  options: ButtonOptions = {}
): ButtonCache => {
  if (!reg) throw new Error('[button]: 缺少参数[reg]')
  if (!fnc) throw new Error('[button]: 缺少参数[fnc]')

  const caller = getCaller(import.meta.url)
  const pkgName = manager.getPackageName(caller)

  const id = createID()
  const type = 'button'
  let regCache = formatReg(reg)
  let fncCache = fnc
  let optCache = formatOptions(options)
  const logCache = createLogger(options.log, true)

  const cache: ButtonCache = {
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
        get type (): 'button' {
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
        get reg () {
          return regCache
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
        setFnc: (fnc: ButtonCache['register']['fnc']) => {
          fncCache = fnc
        },
        setOptions: (options: ButtonOptions) => {
          optCache = formatOptions(options)
        },
        remove: () => {
          register.unregisterButton(id)
        },
      }
    },
  }

  register.registerButton(cache)
  return cache
}
