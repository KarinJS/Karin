import Cfg from './config.js'
import common from '../common/common.js'

class Other {
  constructor () {
    /** 群聊所有消息cd */
    this.global_cd = {}
    /** 群聊个人cd */
    this.personal_cd = {}
    /** 事件cd */
    this.cd = (e) => false
    /** 响应模式 */
    this.mode = (e) => true
    /** 前缀、别名 */
    this.ailas = (e) => true
    /** 白名单用户 */
    this.white_list_user = (e) => true
    /** 黑名单用户 */
    this.black_list_user = (e) => false
    /** 白名单群聊 */
    this.white_list_group = (e) => true
    /** 黑名单群聊 */
    this.black_list_group = (e) => false
    /** 白名单插件 */
    this.white_list_app = (e, app) => true
    /** 黑名单插件 */
    this.black_list_app = (e, app) => false
    /** 群消息打印 */
    this.group_msg_print = (e) => ''
    this.main()
  }

  main () {
    const { App, Config } = Cfg
    const { white_list: white, black_list: black, group_config: group } = App
    /** 黑白名单相关 */
    this.#check_list(white, black, Config)
    /** 群聊cd */
    this.#CD(group)
    /** 响应模式 */
    this.#mode(group)
    /** 黑白名单插件 */
    this.#check_app(group)
    /** 前缀 */
    this.#ailas(group)
  }

  #log (e) {
    logger.info(common.logger(e.self_id, `群消息：[${e.group_id}-${e.user_id}(${e.sender.nick || ''})] ${e.raw_message}`))
  }

  /** 黑白名单相关 */
  #check_list (white, black, Config) {
    /** 白名单用户 */
    if (white.users && Config.white_list.users.length) {
      this.white_list_user = (e) => white.users.includes(e.user_id)
    }

    /** 白名单群聊 */
    if (white.groups && Config.white_list.groups.length) {
      this.white_list_group = (e) => white.groups.includes(e.group_id)
    }

    /** 群聊日志打印 */
    if (white.msg_groups && black.msg_groups) {
      this.group_msg_print = (e) => {
        const config = Cfg.group(e.group_id)
        /** 只有当群在白名单中或不在黑名单中才打印日志 */
        if (config.white_list.msg_groups.includes(e.group_id) || !config.black_list.msg_groups.includes(e.group_id)) {
          this.#log(e)
        }
      }
    } else if (white.msg_groups) {
      this.group_msg_print = (e) => {
        const config = Cfg.group(e.group_id)
        /** 只有当群在白名单中才打印日志 */
        config.white_list.msg_groups.includes(e.group_id) && this.#log(e)
      }
    } else if (black.msg_groups) {
      this.group_msg_print = (e) => {
        const config = Cfg.group(e.group_id)
        /** 只有当群不在黑名单中才打印日志 */
        !config.black_list.msg_groups.includes(e.group_id) && this.#log(e)
      }
    } else {
      this.group_msg_print = (e) => ''
    }

    /** 黑名单用户 */
    if (black.users && Config.black_list.users.length) {
      this.black_list_user = (e) => Config.black_list.users.includes(e.user_id)
    } else {
      this.black_list_user = (e) => false
    }

    /** 黑名单群聊 */
    if (black.groups && Config.black_list.groups.length) {
      this.black_list_group = (e) => Config.black_list.groups.includes(e.group_id)
    } else {
      this.black_list_group = (e) => false
    }
  }

  /** 群聊cd */
  #CD (group) {
    /** 群cd */
    if (group.global_cd && group.personal_cd) {
      this.cd = (e) => {
        const key = `${e.group_id}.${e.user_id}`
        /** cd中... */
        if (this.global_cd[e.group_id] || this.personal_cd[key]) return true

        const config = Cfg.group(e.group_id)
        /** 全局 */
        this.global_cd[e.group_id] = true
        setTimeout(() => {
          delete this.global_cd[e.group_id]
        }, config.global_cd * 1000)

        /** 个人 */
        this.personal_cd[key] = true
        setTimeout(() => {
          delete this.personal_cd[key]
        }, config.personal_cd * 1000)
        return false
      }
    } else if (group.global_cd) {
      this.cd = (e) => {
        /** cd中... */
        if (this.global_cd[e.group_id]) return true

        const config = Cfg.group(e.group_id)
        /** 全局 */
        this.global_cd[e.group_id] = true
        setTimeout(() => {
          delete this.global_cd[e.group_id]
        }, config.global_cd * 1000)
        return false
      }
    } else if (group.personal_cd) {
      this.cd = (e) => {
        const key = `${e.group_id}.${e.user_id}`
        /** cd中... */
        if (this.personal_cd[key]) return true

        const config = Cfg.group(e.group_id)
        /** 个人 */
        this.personal_cd[key] = true
        setTimeout(() => {
          delete this.personal_cd[key]
        }, config.personal_cd * 1000)
        return false
      }
    } else {
      this.cd = (e) => false
    }
  }

  /** 响应模式 */
  #mode (group) {
    /** 响应模式 */
    if (group.mode) {
      this.mode = (e) => {
        if (!e.group_id) return true
        const config = Cfg.group(e.group_id)
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
    } else {
      this.mode = (e) => true
    }
  }

  /** 黑白名单插件 */
  #check_app (group) {
    /** 白名单插件 */
    if (group.enable) {
      this.white_list_app = (e, app) => {
        const config = Cfg.group(e.group_id)
        /** 检查插件包是否处于功能白名单 */
        if (config.enable.includes(app.file.dir)) return true
        /** 检查单插件是否处于功能白名单 */
        if (config.enable.includes(`${app.file.dir}/${app.file.name}`)) return true
        /** 检查插件名称是否处于功能白名单 */
        if (config.enable.includes(app.name)) return true
        logger.debug(logger.green(`[功能白名单] 插件名称 [${app.name}] 不存在功能白名单中`))
        return false
      }
    } else {
      this.white_list_app = (e, app) => true
    }

    /** 黑名单插件 */
    if (group.disable) {
      this.black_list_app = (e, app) => {
        const config = Cfg.group(e.group_id)
        /** 检查插件包是否处于功能黑名单 */
        if (config.disable.includes(app.file.dir)) {
          logger.debug(logger.red(`[功能黑名单] 插件包 [${app.file.dir}] 处于功能黑名单`))
          return false
        }
        /** 检查单插件是否处于功能黑名单 */
        if (config.disable.includes(`${app.file.dir}/${app.file.name}`)) {
          logger.debug(logger.red(`[功能黑名单] 插件 [${app.file.dir}/${app.file.name}] 处于功能黑名单`))
          return false
        }
        /** 检查插件名称是否处于功能黑名单 */
        if (config.disable.includes(app.name)) {
          logger.debug(logger.red(`[功能黑名单] 插件名称 [${app.name}] 处于功能黑名单`))
          return false
        }
        return true
      }
    } else {
      this.black_list_app = (e, app) => false
    }
  }

  /** 前缀 */
  #ailas (group) {
    /** 前缀 */
    if (group.ailas) {
      this.ailas = (e) => {
        const config = Cfg.group(e.group_id)
        const ailasRegex = new RegExp(`^(${config.ailas.join('|')})`)
        const match = e.msg.match(ailasRegex)
        if (match) {
          e.msg = e.msg.replace(ailasRegex, '').trim()
          e.ailas = match[1]
        }
      }
    } else {
      this.ailas = (e) => true
    }
  }
}

let other = new Other()

export default other
