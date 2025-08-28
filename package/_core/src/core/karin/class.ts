import { types, isClass } from '@/utils'
import * as manager from '../../plugins/manager'
import * as register from '../../plugins/register'
import { createID } from '@/core/karin/util'
import { formatReg, createLogger } from './util'
import { CommandCache } from '@/core/karin/command'

import type { FNC } from './util'
import type { Message, MessageEventMap, Permission, AdapterProtocol, AdapterType } from '@/types'

export interface RuleItemBase {
  /** 命令正则 */
  reg: string | RegExp
  /** 插件名称 */
  name?: string
  /** 优先级 默认为10000 */
  priority?: number
  /** 插件触发权限 例如只有主人才可触发 */
  permission?: Permission
  /** 打印日志 默认为true */
  log?: boolean
  /** 生效的适配器 */
  adapter?: AdapterProtocol[]
  /** 禁用的适配器 */
  dsbAdapter?: AdapterProtocol[]
  /**
   * 如果无权触发插件 是否打印日志
   * - `true`: `暂无权限，只有主人才能操作`
   * - `false`: ``
   * - `string`: `自定义提示`
   */
  authFailMsg?: boolean | string
}

/**
 * 格式化后的options
 */
export interface FormatOptions {
  /** 插件名称 */
  name: string
  /** 插件描述 */
  desc: string
  /** 插件事件 */
  event: keyof MessageEventMap
  /** 优先级 */
  priority: number
  /** 导出的class类名称 */
  exportName: string
  /** 指令规则 */
  rule: {
    /** 命令正则 */
    reg: RegExp
    /** 插件名称 */
    name: string
    /** 事件类型 */
    event: keyof MessageEventMap
    /** 优先级 */
    priority: number
    /** 插件触发权限 例如只有主人才可触发 */
    permission: Permission
    /** 打印日志 默认为true */
    log: (...args: any[]) => void
    /** 生效的适配器 */
    adapter: AdapterProtocol[]
    /** 禁用的适配器 */
    dsbAdapter: AdapterProtocol[]
    /**
     * 如果无权触发插件 是否打印日志
     * - `true`: `暂无权限，只有主人才能操作`
     * - `false`: ``
     * - `string`: `自定义提示`
     */
    authFailMsg: boolean | string
    /** 处理函数 */
    fnc: FNC<any> | string
  }[]
}

/**
 * 插件规则项
 * @template T 事件类型
 */
export type PluginRuleItem<T extends keyof MessageEventMap = never> = T extends never
  ? RuleItemBase & {
    /** 事件类型 */
    event?: never
    /** 处理函数 */
    fnc: FNC<MessageEventMap['message']> | string
  }
  : RuleItemBase & {
    /** 事件类型 */
    event?: T
    /** 处理函数 */
    fnc: FNC<MessageEventMap[T]> | string
  }

/**
 * 动态新增一个rule
 * @template T 事件类型
 */
export interface AddRuleItemType<T extends keyof MessageEventMap> extends RuleItemBase {
  /** 事件类型 */
  event?: T
  /** 处理函数 */
  fnc: FNC<T extends keyof MessageEventMap ? MessageEventMap[T] : MessageEventMap['message']>
}

/**
 * @class
 * @description 插件配置
 */
export type PluginOptions = {
  [K in keyof MessageEventMap]: {
    /** 插件名称 */
    name: string
    /** 插件描述 */
    desc?: string
    /** 插件父事件 */
    event?: K
    /** 优先级 */
    priority?: number
    /** 指令规则 */
    rule: Array<
      | PluginRuleItem<K>
      | { [P in keyof MessageEventMap]: PluginRuleItem<P> & { event: P } }[keyof MessageEventMap]
    >
  }
}[keyof MessageEventMap]

/**
 * 格式化options
 * @param options 插件配置
 * @returns 格式化后的options
 */
export const formatOptions = <T extends keyof MessageEventMap> (options: PluginOptions): FormatOptions => {
  const event = types.string<keyof MessageEventMap>(options.event, 'message')

  return {
    name: types.string(options.name, 'class.command'),
    desc: types.string(options.desc, '无描述'),
    event,
    priority: types.number(options.priority, 10000),
    exportName: '',
    rule: types.array<PluginRuleItem<T>[]>(options.rule, []).map(item => {
      return {
        reg: formatReg(item.reg),
        name: types.string(item.name, 'class.command'),
        event: types.string(item.event, event) as T,
        priority: types.number(item.priority, 10000),
        permission: types.string(item.permission, 'all'),
        log: createLogger(item.log, true),
        adapter: types.array(item.adapter, []),
        dsbAdapter: types.array(item.dsbAdapter, []),
        authFailMsg: types.string(item.authFailMsg, true),
        fnc: typeof item.fnc === 'function' ? item.fnc : types.string(item.fnc, ''),
      }
    }),
  }
}

export const formatFnc = (fnc: FNC<any> | string, plugin: Plugin): FNC<any> => {
  // 绑定原型，防止丢失this
  return typeof fnc === 'function'
    ? fnc.bind(plugin)
    : (...args: any[]) => (plugin as unknown as Record<string, Function>)?.[fnc].bind(plugin)(...args)
}

/**
 * @class
 * @description 插件类
 */
export abstract class Plugin<T extends keyof MessageEventMap = keyof MessageEventMap> {
  /** 插件配置 */
  _options!: PluginOptions
  /** 消息事件对象 */
  e!: T extends keyof MessageEventMap ? MessageEventMap[T] : Message
  /** 调用后将继续匹配下一个插件 */
  next!: () => unknown
  /** 快速回复 */
  reply!: Message['reply']

  constructor (options: PluginOptions) {
    this._options = options
  }

  /**
   * 快速回复合并转发
   * @param element 合并转发消息元素节点
   */
  async replyForward (element: Parameters<AdapterType['sendForwardMsg']>[1]) {
    const result = await this.e.bot.sendForwardMsg(this.e.contact, element)
    return {
      ...result,
      /** @deprecated 已废弃 请请使用 messageId */
      message_id: result.messageId,
    }
  }
}

/**
 * 加载 class 插件
 * @param pkgName 插件包名称
 * @param file 文件路径
 * @param Cls 类
 */
export const loadClass = (
  pkgName: string,
  file: string,
  Cls: unknown
) => {
  if (!isClass<Plugin>(Cls)) return
  const plugin = new Cls()

  if (!plugin._options || typeof plugin._options !== 'object') {
    logger.debug(`[loadClass] ${file} 非class插件 跳过注册`)
    return
  }

  const ids: string[] = []
  const exportName = plugin.constructor.name
  const options = formatOptions(plugin._options)
  options.exportName = exportName

  const createCommand = (v: FormatOptions['rule'][number]) => {
    if (typeof v.fnc === 'string') {
      // @ts-ignore
      if (!plugin?.[v.fnc]) {
        logger.warn(`[loadClass][${pkgName}] 插件 ${file} 的 ${v.fnc} 方法不存在，跳过注册当前rule`)
        return
      }
    }

    const id = createID()
    const type = 'class'
    let regCache = formatReg(v.reg)
    let fncCache = formatFnc(v.fnc, plugin)
    let ruleOptions = v
    ids.push(id)

    const result: CommandCache = {
      type,
      get pkg () {
        if (!pkgName) {
          throw new Error(`请在符合标准规范的文件中使用此方法: ${file}`)
        }
        return manager.getPluginPackageDetail(pkgName)!
      },
      get file () {
        return manager.getFileCache(file)
      },
      get app () {
        return {
          get id () {
            return id
          },
          get type (): 'class' {
            return type
          },
          get log () {
            return v.log
          },
          get name () {
            return v.name
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
          get _options () {
            return options
          },
          get options () {
            return ruleOptions
          },
          get instance () {
            return plugin
          },
          get ids () {
            return ids
          },
        }
      },
      get control () {
        return {
          setReg: (reg: string | RegExp) => {
            regCache = formatReg(reg)
          },
          setFnc: (fnc: FNC<any>) => {
            if (typeof fnc !== 'function') {
              throw new TypeError('setFnc 参数必须是一个函数')
            }
            fncCache = fnc
          },
          setRule: (rule: RuleItemBase) => {
            const opt = { ...options, rule: [rule] }
            const formatOpt = formatOptions(opt as unknown as PluginOptions)
            ruleOptions = formatOpt.rule[0]
            regCache = formatReg(formatOpt.rule[0].reg)
          },
          remove: () => {
            register.unregisterCommand(result.app.id)
          },
          addRule: <T extends keyof MessageEventMap> (rule: AddRuleItemType<T> & { event?: T }) => {
            const opt = { ...options, rule: [rule] }
            const formatOpt = formatOptions(opt as unknown as PluginOptions)
            options.rule.push(formatOpt.rule[0])
            const command = createCommand(formatOpt.rule[0])
            if (!command) return

            register.registerCommand(command)
          },
          removeRule: () => {
            ids.forEach(id => register.unregisterCommand(id))
            ids.length = 0
          },
        }
      },
    }

    return result
  }

  options.rule.forEach(v => {
    const command = createCommand(v)
    if (!command) return

    register.registerCommand(command)
  })
}
