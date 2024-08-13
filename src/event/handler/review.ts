import { logger, config } from 'karin/utils'
import { KarinMessageType, GroupCfg, KarinEventTypes, PluginCommandInfoType, PluginAcceptInfoType } from 'karin/types'
import { pluginLoader } from 'karin/core'

/**
 * 事件拦截器
 * 利用可执行函数的特性，热更新所有拦截器
 * 所有拦截器返回的都是布尔值 为true说明通过 为false则未通过
 */
export const review = new (class Handler {
  GroupCD: { [key: string]: boolean }
  GroupUserCD: { [key: string]: boolean }
  App = config['App']
  Config = config['Config']
  CD: (e: KarinEventTypes, config: GroupCfg) => boolean
  mode: (e: KarinMessageType, config: GroupCfg) => boolean
  alias: (e: KarinMessageType, config: GroupCfg) => boolean
  GroupEnable: (e: KarinEventTypes) => boolean
  UserEnable: (e: KarinEventTypes) => boolean
  GroupMsgPrint: (e: KarinEventTypes) => boolean
  PluginEnable: (app: PluginCommandInfoType | PluginAcceptInfoType, config: GroupCfg) => boolean
  Private: () => boolean
  constructor () {
    /** 群聊所有消息cd */
    this.GroupCD = {}
    /** 群聊个人cd */
    this.GroupUserCD = {}

    /** 事件cd */
    this.CD = (e, config) => true
    /** 响应模式 */
    this.mode = (e, config) => true
    /** 前缀、别名 */
    this.alias = (e, config) => true
    /** 群聊黑白名单 哪个群可以触发事件 */
    this.GroupEnable = e => true
    /** 用户黑白名单 谁可以触发事件 */
    this.UserEnable = e => true
    /** 群聊事件日志 哪个群可以打印日志 */
    this.GroupMsgPrint = e => true
    /** 插件黑白名单 哪个插件可以被触发 */
    this.PluginEnable = (app, config) => true

    /** 私聊功能 */
    this.Private = () => false

    // 延迟1秒执行
    setTimeout(() => {
      this.main()
    }, 1000)
  }

  main () {
    this.App = config.App
    this.Config = config.Config
    this.#CD()
    this.#mode()
    this.#alias()
    this.#GroupEnable()
    this.#UserEnable()
    this.#GroupMsgPrint()
    this.#PluginEnable()
    this.#Private()
  }

  /**
   * 群聊黑白名单 允许哪个群触发事件
   */
  #GroupEnable () {
    /** 同时启用 */
    if (this.App.WhiteList.groups && this.App.BlackList.groups) {
      this.GroupEnable = e => {
        if (!e.group_id) return true
        /** 白名单不为空 */
        if (Array.isArray(this.Config.WhiteList.groups) && this.Config.WhiteList.groups.length) {
          return this.Config.WhiteList.groups.includes(String(e.group_id))
        }

        /** 白名单为空 检查黑名单是否为空 */
        if (Array.isArray(this.Config.BlackList.groups) && this.Config.BlackList.groups.length) {
          return !this.Config.BlackList.groups.includes(String(e.group_id))
        }

        /** 黑白名单都为空 */
        return true
      }
      return true
    }

    /** 白名单启用 */
    if (this.App.WhiteList.groups) {
      this.GroupEnable = e => {
        if (Array.isArray(this.Config.WhiteList.groups) && this.Config.WhiteList.groups.length) {
          return this.Config.WhiteList.groups.includes(String(e.group_id))
        }
        return true
      }
      return true
    }

    /** 黑名单启用 */
    if (this.App.BlackList.groups) {
      this.GroupEnable = e => {
        if (Array.isArray(this.Config.BlackList.groups) && this.Config.BlackList.groups.length) {
          return !this.Config.BlackList.groups.includes(String(e.group_id))
        }
        return true
      }
      return true
    }

    /** 都没有启用 */
    this.GroupEnable = () => true
  }

  /**
   * 用户黑白名单 允许那个用户触发事件
   */
  #UserEnable () {
    /** 同时启用 */
    if (this.App.WhiteList.users && this.App.BlackList.users) {
      this.UserEnable = e => {
        /** 白名单不为空 */
        if (Array.isArray(this.Config.WhiteList.users) && this.Config.WhiteList.users.length) {
          return this.Config.WhiteList.users.includes(String(e.user_id))
        }

        /** 白名单为空 检查黑名单是否为空 */
        if (Array.isArray(this.Config.BlackList.users) && this.Config.BlackList.users.length) {
          return !this.Config.BlackList.users.includes(String(e.user_id))
        }

        /** 黑白名单都为空 */
        return true
      }
      return true
    }

    /** 白名单启用 */
    if (this.App.WhiteList.users) {
      this.UserEnable = e => {
        if (Array.isArray(this.Config.WhiteList.users) && this.Config.WhiteList.users.length) {
          return this.Config.WhiteList.users.includes(String(e.user_id))
        }
        return true
      }
      return true
    }

    /** 黑名单启用 */
    if (this.App.BlackList.users) {
      this.UserEnable = e => {
        if (Array.isArray(this.Config.BlackList.users) && this.Config.BlackList.users.length) {
          return !this.Config.BlackList.users.includes(String(e.user_id))
        }
        return true
      }
      return true
    }

    /** 都没有启用 */
    this.UserEnable = () => true
  }

  /**
   * 群聊事件日志 是否打印
   */
  #GroupMsgPrint () {
    /** 同时启用 */
    if (this.App.WhiteList.GroupMsgLog && this.App.BlackList.GroupMsgLog) {
      this.GroupMsgPrint = e => {
        /** 白名单不为空 */
        if (Array.isArray(this.Config.WhiteList.GroupMsgLog) && this.Config.WhiteList.GroupMsgLog.length) {
          return this.Config.WhiteList.GroupMsgLog.includes(String(e.group_id))
        }

        /** 白名单为空 检查黑名单是否为空 */
        if (Array.isArray(this.Config.BlackList.GroupMsgLog) && this.Config.BlackList.GroupMsgLog.length) {
          return !this.Config.BlackList.GroupMsgLog.includes(String(e.group_id))
        }

        /** 黑白名单都为空 */
        return true
      }
      return true
    }

    /** 白名单启用 */
    if (this.App.WhiteList.GroupMsgLog) {
      this.GroupMsgPrint = e => {
        if (Array.isArray(this.Config.WhiteList.GroupMsgLog) && this.Config.WhiteList.GroupMsgLog.length) {
          return this.Config.WhiteList.GroupMsgLog.includes(String(e.group_id))
        }
        return true
      }
      return true
    }

    /** 黑名单启用 */
    if (this.App.BlackList.GroupMsgLog) {
      this.GroupMsgPrint = e => {
        if (Array.isArray(this.Config.BlackList.GroupMsgLog) && this.Config.BlackList.GroupMsgLog.length) {
          return !this.Config.BlackList.GroupMsgLog.includes(String(e.group_id))
        }
        return true
      }
      return true
    }

    /** 都没有启用 */
    this.GroupMsgPrint = () => true
  }

  /**
   * 黑白名单插件 哪个插件可以被触发
   */
  #PluginEnable () {
    /** 同时启用 */
    if (this.App.GroupConfig.enable && this.App.GroupConfig.disable) {
      this.PluginEnable = (app, config) => {
        const plugin = pluginLoader.plugin.get(app.key)!
        /** 白名单不为空 */
        if (Array.isArray(config.enable) && config.enable.length) {
          /** 插件包是否处于功能白名单 */
          for (const key of config.enable) {
            if (key.plugin === plugin.plugin) return true
            if (key.name === plugin.file || key.name === app.name) return true
          }

          logger.debug(logger.green(`[功能白名单] 插件名称 [${app.name}] 不存在功能白名单中`))
          return false
        }

        /** 白名单为空 检查黑名单是否为空 */
        if (Array.isArray(config.disable) && config.disable.length) {
          for (const key of config.disable) {
            if (key.plugin === plugin.plugin) {
              logger.debug(logger.red(`[功能黑名单] 插件包 [${app.name}] 处于功能黑名单`))
              return false
            }
            if (key.name === plugin.file || key.name === app.name) {
              logger.debug(logger.red(`[功能黑名单] 插件 [${app.name}] 处于功能黑名单`))
              return false
            }
          }

          return true
        }

        /** 黑白名单都为空 */
        return true
      }
      return true
    }

    /** 白名单启用 */
    if (this.App.GroupConfig.enable) {
      this.PluginEnable = (app, config) => {
        const plugin = pluginLoader.plugin.get(app.key)!

        if (Array.isArray(config.enable) && config.enable.length) {
          for (const key of config.enable) {
            if (key.plugin === plugin.plugin) return true
            if (key.name === plugin.file || key.name === app.name) return true
          }

          logger.debug(logger.green(`[功能白名单] 插件名称 [${app.name}] 不存在功能白名单中`))
          return false
        }
        return true
      }
      return true
    }

    /** 黑名单启用 */
    if (this.App.GroupConfig.disable) {
      this.PluginEnable = (app, config) => {
        const plugin = pluginLoader.plugin.get(app.key)!

        if (Array.isArray(config.disable) && config.disable.length) {
          for (const key of config.disable) {
            if (key.plugin === plugin.plugin) {
              logger.debug(logger.red(`[功能黑名单] 插件包 [${app.name}] 处于功能黑名单`))
              return false
            }
            if (key.name === plugin.file || key.name === app.name) {
              logger.debug(logger.red(`[功能黑名单] 插件 [${app.name}] 处于功能黑名单`))
              return false
            }
          }

          return true
        }
        return true
      }
      return true
    }

    /** 都没有启用 */
    this.PluginEnable = () => true
    return true
  }

  /** 群聊cd */
  #CD () {
    /** 同时启用 */
    if (this.App.GroupConfig.GroupCD && this.App.GroupConfig.GroupUserCD) {
      this.CD = (e, config) => {
        const key = `${e.group_id}.${e.user_id}`
        /** cd中... */
        if (this.GroupCD[e.group_id] || this.GroupUserCD[key]) return false

        /** 全局 */
        this.GroupCD[e.group_id] = true
        setTimeout(() => delete this.GroupCD[e.group_id], config.GroupCD * 1000)

        /** 个人 */
        this.GroupUserCD[key] = true
        setTimeout(() => delete this.GroupUserCD[key], config.GroupUserCD * 1000)
        return true
      }
      return true
    }

    /** 启用单个群聊所有消息冷却时间 */
    if (this.App.GroupConfig.GroupCD) {
      this.CD = (e, config) => {
        /** cd中... */
        if (this.GroupCD[e.group_id]) return false
        /** 全局 */
        this.GroupCD[e.group_id] = true
        setTimeout(() => delete this.GroupCD[e.group_id], config.GroupCD * 1000)
        return true
      }
      return true
    }

    /** 启用单个群聊个人消息冷却时间 */
    if (this.App.GroupConfig.GroupUserCD) {
      this.CD = (e, config) => {
        const key = `${e.group_id}.${e.user_id}`
        /** cd中... */
        if (this.GroupUserCD[key]) return false
        /** 个人 */
        this.GroupUserCD[key] = true
        setTimeout(() => delete this.GroupUserCD[key], config.GroupUserCD * 1000)
        return true
      }
      return true
    }

    /** 都没有启用 */
    this.CD = () => true
  }

  /**
   * 响应模式
   */
  #mode () {
    /** 启用 */
    if (this.App.GroupConfig.mode) {
      this.mode = (e, config) => {
        const modeMap: { [key: number]: () => boolean } = {
          0: () => true,
          1: () => e.atBot,
          2: () => e.isMaster,
          3: () => !!e.alias,
          4: () => {
            if (e.atBot) return true
            return !!e.alias
          },
          5: () => {
            if (e.isMaster) return true
            if (e.atBot) return true
            return !!e.alias
          },
        }
        return modeMap[Number(config.mode) || 0]()
      }
      return true
    }

    /** 未启用 */
    this.mode = () => true
  }

  /**
   * 前缀、别名
   */
  #alias () {
    /** 启用 */
    if (this.App.GroupConfig.alias) {
      this.alias = (e, config) => {
        const aliasRegex = new RegExp(`^(${config.alias.join('|')})`)
        const match = e.msg.match(aliasRegex)
        if (match) {
          e.msg = e.msg.replace(aliasRegex, '').trim()
          e.alias = match[1]
          return true
        }
        return false
      }
      return true
    }

    /** 未启用 */
    this.alias = () => true
  }

  /**
   * 私聊功能
   */
  #Private () {
    /** 启用 */
    if (this.App.PrivateConfig?.enable) {
      this.Private = () => true
      return true
    }

    /** 未启用 */
    this.Private = () => false
  }
})()
