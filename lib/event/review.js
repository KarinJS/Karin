/* eslint-disable no-unused-vars */
import { Cfg } from '#Karin'

/**
 * 事件拦截器
 * 利用可执行函数的特性，热更新所有拦截器
 * 所有拦截器返回的都是布尔值 为true说明通过 为false则未通过
 */
class Review {
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
    this.ailas = (e, config) => true
    /** 群聊黑白名单 哪个群可以触发事件 */
    this.GroupEnable = (e) => true
    /** 用户黑白名单 谁可以触发事件 */
    this.UserEnable = (e) => true
    /** 群聊事件日志 哪个群可以打印日志 */
    this.GroupMsgPrint = (e) => true
    /** 插件黑白名单 哪个插件可以被触发 */
    this.PluginEnable = (app, config) => true

    /** 初始化 */
    this.main()
  }

  main () {
    this.App = Cfg.App
    this.Config = Cfg.Config
    this.#CD()
    this.#mode()
    this.#ailas()
    this.#GroupEnable()
    this.#UserEnable()
    this.#GroupMsgPrint()
    this.#PluginEnable()
  }

  /**
   * 群聊黑白名单 允许哪个群触发事件
   */
  #GroupEnable () {
    /** 同时启用 */
    if (this.App.WhiteList.groups && this.App.BlackList.groups) {
      this.GroupEnable = (e) => {
        /** 白名单不为空 */
        if (Array.isArray(this.Config.WhiteList.groups) && this.Config.WhiteList.groups.length) {
          return this.Config.WhiteList.groups.includes(Number(e.group_id) || String(e.group_id))
        }

        /** 白名单为空 检查黑名单是否为空 */
        if (Array.isArray(this.Config.BlackList.groups) && this.Config.BlackList.groups.length) {
          return !this.Config.BlackList.groups.includes(Number(e.group_id) || String(e.group_id))
        }

        /** 黑白名单都为空 */
        return true
      }
      return true
    }

    /** 白名单启用 */
    if (this.App.WhiteList.groups) {
      this.GroupEnable = (e) => {
        if (Array.isArray(this.Config.WhiteList.groups) && this.Config.WhiteList.groups.length) {
          return this.Config.WhiteList.groups.includes(Number(e.group_id) || String(e.group_id))
        }
        return true
      }
      return true
    }

    /** 黑名单启用 */
    if (this.App.BlackList.groups) {
      this.GroupEnable = (e) => {
        if (Array.isArray(this.Config.BlackList.groups) && this.Config.BlackList.groups.length) {
          return !this.Config.BlackList.groups.includes(Number(e.group_id) || String(e.group_id))
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
      this.UserEnable = (e) => {
        /** 白名单不为空 */
        if (Array.isArray(this.Config.WhiteList.users) && this.Config.WhiteList.users.length) {
          return this.Config.WhiteList.users.includes(Number(e.user_id) || String(e.user_id))
        }

        /** 白名单为空 检查黑名单是否为空 */
        if (Array.isArray(this.Config.BlackList.users) && this.Config.BlackList.users.length) {
          return !this.Config.BlackList.users.includes(Number(e.user_id) || String(e.user_id))
        }

        /** 黑白名单都为空 */
        return true
      }
      return true
    }

    /** 白名单启用 */
    if (this.App.WhiteList.users) {
      this.UserEnable = (e) => {
        if (Array.isArray(this.Config.WhiteList.users) && this.Config.WhiteList.users.length) {
          return this.Config.WhiteList.users.includes(Number(e.user_id) || String(e.user_id))
        }
        return true
      }
      return true
    }

    /** 黑名单启用 */
    if (this.App.BlackList.users) {
      this.UserEnable = (e) => {
        if (Array.isArray(this.Config.BlackList.users) && this.Config.BlackList.users.length) {
          return !this.Config.BlackList.users.includes(Number(e.user_id) || String(e.user_id))
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
      this.GroupMsgPrint = (e) => {
        /** 白名单不为空 */
        if (Array.isArray(this.Config.WhiteList.GroupMsgLog) && this.Config.WhiteList.GroupMsgLog.length) {
          return this.Config.WhiteList.GroupMsgLog.includes(Number(e.group_id) || String(e.group_id))
        }

        /** 白名单为空 检查黑名单是否为空 */
        if (Array.isArray(this.Config.BlackList.GroupMsgLog) && this.Config.BlackList.GroupMsgLog.length) {
          return !this.Config.BlackList.GroupMsgLog.includes(Number(e.group_id) || String(e.group_id))
        }

        /** 黑白名单都为空 */
        return true
      }
      return true
    }

    /** 白名单启用 */
    if (this.App.WhiteList.GroupMsgLog) {
      this.GroupMsgPrint = (e) => {
        if (Array.isArray(this.Config.WhiteList.GroupMsgLog) && this.Config.WhiteList.GroupMsgLog.length) {
          return this.Config.WhiteList.GroupMsgLog.includes(Number(e.group_id) || String(e.group_id))
        }
        return true
      }
      return true
    }

    /** 黑名单启用 */
    if (this.App.BlackList.GroupMsgLog) {
      this.GroupMsgPrint = (e) => {
        if (Array.isArray(this.Config.BlackList.GroupMsgLog) && this.Config.BlackList.GroupMsgLog.length) {
          return !this.Config.BlackList.GroupMsgLog.includes(Number(e.group_id) || String(e.group_id))
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
        /** 白名单不为空 */
        if (Array.isArray(config.enable) && config.enable.length) {
          /** 插件包是否处于功能白名单 */
          if (config.enable.includes(app.file.dir)) return true
          /** 插件是否处于功能白名单 */
          if (config.enable.includes(`${app.file.dir}/${app.file.name}`)) return true
          /** 插件名称是否处于功能白名单 */
          if (config.enable.includes(app.name)) return true
          logger.debug(logger.green(`[功能白名单] 插件名称 [${app.name}] 不存在功能白名单中`))
          return false
        }

        /** 白名单为空 检查黑名单是否为空 */
        if (Array.isArray(config.disable) && config.disable.length) {
          /** 插件包是否处于功能黑名单 */
          if (config.disable.includes(app.file.dir)) {
            logger.debug(logger.red(`[功能黑名单] 插件包 [${app.file.dir}] 处于功能黑名单`))
            return false
          }
          /** 插件是否处于功能黑名单 */
          if (config.disable.includes(`${app.file.dir}/${app.file.name}`)) {
            logger.debug(logger.red(`[功能黑名单] 插件 [${app.file.dir}/${app.file.name}] 处于功能黑名单`))
            return false
          }
          /** 插件名称是否处于功能黑名单 */
          if (config.disable.includes(app.name)) {
            logger.debug(logger.red(`[功能黑名单] 插件名称 [${app.name}] 处于功能黑名单`))
            return false
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
        if (Array.isArray(config.enable) && config.enable.length) {
          if (config.enable.includes(app.file.dir)) return true
          if (config.enable.includes(`${app.file.dir}/${app.file.name}`)) return true
          if (config.enable.includes(app.name)) return true
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
        if (Array.isArray(config.disable) && config.disable.length) {
          if (config.disable.includes(app.file.dir)) {
            logger.debug(logger.red(`[功能黑名单] 插件包 [${app.file.dir}] 处于功能黑名单`))
            return false
          }
          if (config.disable.includes(`${app.file.dir}/${app.file.name}`)) {
            logger.debug(logger.red(`[功能黑名单] 插件 [${app.file.dir}/${app.file.name}] 处于功能黑名单`))
            return false
          }
          if (config.disable.includes(app.name)) {
            logger.debug(logger.red(`[功能黑名单] 插件名称 [${app.name}] 处于功能黑名单`))
            return false
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
        const modeMap = {
          0: () => true,
          1: () => e.atBot,
          2: () => e.isMaster,
          3: () => !!e.ailas,
          4: () => {
            if (e.atBot) return true
            return !!e.ailas
          },
          5: () => {
            if (e.isMaster) return true
            if (e.atBot) return true
            return !!e.ailas
          }
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
  #ailas () {
    /** 启用 */
    if (this.App.GroupConfig.ailas) {
      this.ailas = (e, config) => {
        const ailasRegex = new RegExp(`^(${config.ailas.join('|')})`)
        const match = e.msg.match(ailasRegex)
        if (match) {
          e.msg = e.msg.replace(ailasRegex, '').trim()
          e.ailas = match[1]
        }
      }
      return true
    }

    /** 未启用 */
    this.ailas = () => true
  }
}

export default new Review()
