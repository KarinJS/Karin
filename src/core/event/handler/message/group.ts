import lodash from 'lodash'
import * as common from '@/event/handler/common'
import { config as cfg } from '@/utils'
import { cache } from '@/plugin/cache/cache'
import { PermissionEnum } from '@/adapter/sender'
import { createRawMessage } from '@/utils/message'
import type { ConfigType, GroupGuildFileCfg } from '@/utils/config/types'
import type { GroupMessage } from '@/event/create/message/group'
import { MiddlewareHandler } from '@/utils/message/middleware'

/** 群CD */
const groupCD: Record<string, NodeJS.Timeout> = {}
/** 群个人cd */
const groupUserCD: Record<string, NodeJS.Timeout> = {}

/**
 * @description 群消息处理器
 * @class GroupMessageHandler
 */
export class GroupMessageHandler {
  ctx!: boolean
  event: GroupMessage
  config: ConfigType
  eventCfg: GroupGuildFileCfg
  isPrint: boolean

  constructor (event: GroupMessage) {
    this.event = event
    this.config = cfg.config()
    this.eventCfg = cfg.getGroupCfg(this.event.groupId, this.event.selfId)
    this.isPrint = common.isLimitedLogEnable(this.event) && common.isLimitedLogDisable(this.event)
  }

  async init () {
    const data = createRawMessage(this.event.elements)
    this.event.msg = data.msg
    this.event.rawMessage = data.raw

    common.setEventRole(this.event)
    common.alias(this.event, this.eventCfg.alias)
    common.emit(this.event)
    this.print()
    this.ctx = common.context(this.event)
    if (this.ctx) return this

    const pass = this.isLimitEvent()

    /** 先调用中间件 */
    const result = await MiddlewareHandler(cache.middleware.recvMsg, this.event, pass)
    if (result) return this

    pass && this.deal()

    return this
  }

  /**
   * 检查是否存在cd中
   * @returns `true` 表示没有在CD中
   */
  get isCD (): boolean {
    const groupKey = this.event.groupId
    const userKey = `${groupKey}.${this.event.userId}`

    /** 计时器存在直接返回即可 */
    if (groupCD[groupKey] || groupUserCD[userKey]) {
      return false
    }

    if (this.eventCfg.cd > 0) {
      groupCD[groupKey] = setTimeout(() => {
        delete groupCD[groupKey]
      }, this.eventCfg.cd * 1000)
    }

    if (this.eventCfg.userCD > 0) {
      groupUserCD[userKey] = setTimeout(() => {
        delete groupUserCD[userKey]
      }, this.eventCfg.userCD * 1000)
    }

    return true
  }

  /**
   * 打印群消息日志
   * @returns 无返回值
   */
  print () {
    this.event.logText = `[Group:${this.event.groupId}-${this.event.userId}(${this.event.sender.nick || ''})]`
    const level = this.isPrint ? 'info' : 'debug'
    logger.bot(level, this.event.selfId, `群消息：[${this.event.groupId}-${this.event.userId}(${this.event.sender.nick || ''})] ${this.event.rawMessage}`)
  }

  /**
   * 检查当前事件是否受到限制
   * @returns `true` 表示通过
   */
  isLimitEvent () {
    if (!this.isCD) {
      common.log(`[${this.event.groupId}][${this.event.userId}] 正在冷却中: ${this.event.eventId}`)
      return false
    }

    if (!common.isLimitedGroupEnable(this.event)) {
      common.log(`[${this.event.groupId}][${this.event.userId}] 未通过群白名单: ${this.event.eventId}`)
      return false
    }

    if (!common.isLimitedGroupDisable(this.event)) {
      common.log(`[${this.event.groupId}][${this.event.userId}] 未通过群黑名单: ${this.event.eventId}`)
      return false
    }

    if (!common.isLimitedMemberEnable(this.event, this.eventCfg)) {
      common.log(`[${this.event.groupId}][${this.event.userId}] 未通过群成员白名单: ${this.event.eventId}`)
      return false
    }

    if (!common.isLimitedMemberDisable(this.event, this.eventCfg)) {
      common.log(`[${this.event.groupId}][${this.event.userId}] 未通过群成员黑名单: ${this.event.eventId}`)
      return false
    }

    if (!common.isLimitedGroupMode(this.event, this.eventCfg)) {
      return false
    }

    return true
  }

  /**
   * 判断触发用户是否拥有权限
   * @param permission 权限
   * @returns `true` 表示拥有权限
   */
  permission (permission: `${PermissionEnum}`): boolean {
    if (!permission || permission === 'all') return true

    if (permission === 'master') {
      if (!this.event.isMaster) {
        this.event.reply('暂无权限，只有主人才能操作')
        return false
      }
      return true
    }

    if (permission === 'admin') {
      if (!this.event.isMaster && !this.event.isAdmin) {
        this.event.reply('暂无权限，只有管理员才能操作')
        return false
      }
      return true
    }

    if (this.event.isGroup) {
      const list = {
        'group.owner': {
          role: 'owner',
          name: '群主',
        },
        'group.admin': {
          role: 'admin',
          name: '群管理员',
        },
      } as const

      const role = list[permission as keyof typeof list]
      if (!role) return true
      if (role.role === 'owner' && this.event.sender?.role === 'owner') return true
      if (role.role === 'admin' && (this.event.sender?.role === 'owner' || this.event.sender?.role === 'admin')) return true

      this.event.reply(`暂无权限，只有${role.name}才能操作`)
      return false
    }

    return true
  }

  /**
   * 分发事件给插件处理
   * @returns 无返回值
   */
  async deal () {
    for (const plugin of cache.command) {
      if (plugin.event !== 'message' && plugin.event !== 'message.group') continue
      if (plugin.perm === 'guild.admin' || plugin.perm === 'guild.owner') continue

      const reg = plugin.reg
      if (reg && !reg.test(this.event.msg)) continue
      if (!common.adapterLimited(plugin, this.event.bot.adapter.protocol)) continue
      if (!common.isLimitedPluginEnable(plugin, this.eventCfg)) continue
      if (!common.isLimitedPluginDisable(plugin, this.eventCfg)) continue

      this.event.logFnc = `[${plugin.name}][${plugin.file.method}]`
      const logFnc = logger.fnc(this.event.logFnc)
      this.isPrint && plugin.log(
        this.event.selfId,
        `${logFnc}${this.event.logText} ${lodash.truncate(this.event.msg, { length: 100 })}`
      )

      /** 计算插件处理时间 */
      const start = Date.now()
      common.addEventCount(plugin, this.event)

      try {
        if (!this.permission(plugin.perm)) return
        let result
        if (plugin.type === 'fnc') {
          result = await plugin.fnc(this.event)
        } else {
          const App = new plugin.Cls()
          if (typeof App?.[plugin.file.method as keyof typeof App] !== 'function') {
            continue
          }

          App.e = this.event
          App.reply = this.event.reply.bind(this.event)
          result = await (App as any)[plugin.file.method](App.e)
        }
        /** 贪婪匹配下一个 */
        if (result === false) {
          logger.debug(`${this.event.logFnc} 继续匹配下一个插件`)
          continue
        }

        return
      } catch (error: any) {
        logger.error(`${this.event.logFnc}`)
        common.emitError(error)
        return
      } finally {
        this.isPrint && plugin.log(
          this.event.selfId,
          `${logFnc} ${lodash.truncate(this.event.msg, { length: 100 })} 处理完成 ${logger.green(Date.now() - start + 'ms')}`
        )
      }
    }

    /** 未找到匹配插件 */
    common.log(`[${this.event.groupId}-${this.event.userId}] 未找到匹配到相应插件: ${this.event.eventId}`)
    MiddlewareHandler(cache.middleware.notFoundMsg, this.event)
  }
}
