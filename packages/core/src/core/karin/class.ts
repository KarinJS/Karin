import { system, types } from '@/utils'
import { plguinManager } from './load'
import { formatReg, createID, createLogger } from './util'
import type { FNC } from './util'
import type { PluginCacheKeyApp, PluginCache } from './base'
import type { Message, MessageEventMap, Permission, AdapterProtocol } from '@/types'

interface KeyApp extends PluginCacheKeyApp {
  get type (): 'class'
}

interface RuleItemBase {
  /** 命令正则 */
  reg: string | RegExp
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
interface FormatOptions {
  /** 插件名称 */
  name: string
  /** 插件描述 */
  desc: string
  /** 插件事件 */
  event: keyof MessageEventMap
  /** 优先级 */
  priority: number
  /** 指令规则 */
  rule: {
    /** 命令正则 */
    reg: RegExp
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

/** class 插件缓存对象 */
export interface ClassCache extends PluginCache {
  app: KeyApp
  /** 注册的信息 */
  register: FormatOptions
  /** 插件控制接口 */
  control: {
    /** 更新rule */
    setRule: (rule: PluginOptions['rule']) => boolean
    /** 卸载当前插件 */
    remove: () => void
  }
}

/**
 * 格式化options
 * @param options 插件配置
 * @returns 格式化后的options
 */
const formatOptions = <T extends keyof MessageEventMap> (options: PluginOptions): FormatOptions => {
  const event = types.string<keyof MessageEventMap>(options.event, 'message')

  return {
    name: types.string(options.name, 'class.command'),
    desc: types.string(options.desc, '无描述'),
    event,
    priority: types.number(options.priority, 10000),
    rule: types.array<PluginRuleItem<T>[]>(options.rule, []).map(item => {
      return {
        reg: formatReg(item.reg),
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

/**
 * @class
 * @description 插件类
 */
export abstract class Plugin<T extends keyof MessageEventMap = keyof MessageEventMap> {
  /** 消息事件对象 */
  e!: T extends keyof MessageEventMap ? MessageEventMap[T] : Message
  /** 调用后将继续匹配下一个插件 */
  next!: () => unknown
  /** 快速回复 */
  reply!: Message['reply']

  constructor (options: PluginOptions) {
    let _options = formatOptions(options)

    const id = createID()
    const type = 'class'
    const caller = system.getCaller(import.meta.url)
    const pkgName = plguinManager.getPackageName(caller)

    const result: ClassCache = {
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
          get type (): 'class' {
            return type
          },
          get log () {
            return createLogger(false, true)
          },
          get name () {
            return _options.name
          },
        }
      },
      get register () {
        return {
          get name () {
            return _options.name
          },
          get desc () {
            return _options.desc
          },
          get event () {
            return _options.event
          },
          get priority () {
            return _options.priority
          },
          get rule () {
            return _options.rule
          },
        }
      },
      get control () {
        return {
          setRule: (rule: PluginOptions['rule']) => {
            try {
              _options = formatOptions({ ..._options, rule } as PluginOptions)
              return true
            } catch (error) {
              logger.error(error)
              return false
            }
          },
          setOptions: (options: PluginOptions) => {
            _options = formatOptions(options)
          },
          remove: () => {
            plguinManager.unregisterClass(result.app.id)
          },
        }
      },
    }

    plguinManager.registerClass(result)
  }

  /**
   * 快速回复合并转发
   * @param element 合并转发消息元素节点
   */
  async replyForward (element: Parameters<typeof this.e.bot.sendForwardMsg>[1]) {
    const result = await this.e.bot.sendForwardMsg(this.e.contact, element)
    return {
      ...result,
      /** @deprecated 已废弃 请请使用 messageId */
      message_id: result.messageId,
    }
  }
}
