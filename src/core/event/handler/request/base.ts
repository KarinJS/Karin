import * as common from '../common'
import { config as cfg } from '@main/index'
import { cache } from '@/plugin/cache/cache'
import { FriendRequestEventMap, GroupRequestEventMap } from '@/event/types/types'
import type { ConfigType, FriendDirectFileCfg, GroupGuildFileCfg } from '@/utils/config/types'

type Event = GroupRequestEventMap[keyof GroupRequestEventMap] | FriendRequestEventMap[keyof FriendRequestEventMap]

export abstract class BaseRequestHandler {
  event: Event
  config: ConfigType
  eventCfg!: GroupGuildFileCfg | FriendDirectFileCfg

  constructor (event: Event) {
    this.event = event
    this.config = cfg.config()
  }

  init () {
    this.tips()
    this.print()
    common.setEventRole(this.event)
    common.emit(this.event)
    this.isLimitEvent() && this.deal()
    return this
  }

  /**
   * 检查当前事件是否受到限制
   * @returns `true` 表示通过
   */
  isLimitEvent () {
    return false
  }

  /**
   * 构建通知日志
   * @returns 无返回值
   */
  tips () {

  }

  /**
   * 打印通知日志
   * @returns 无返回值
   */
  print () {

  }

  async deal () {
    for (const plugin of cache.accept) {
      if (plugin.event !== this.event.event && plugin.event !== `${this.event.event}.${this.event.subEvent}`) {
        continue
      }

      if (!common.adapterLimited(plugin, this.event.bot.adapter.protocol)) continue
      if (!common.isLimitedPluginEnable(plugin, this.eventCfg)) continue
      if (!common.isLimitedPluginDisable(plugin, this.eventCfg)) continue

      this.event.logFnc = `[${plugin.name}][${plugin.file.method}]`
      const logFnc = logger.fnc(this.event.logFnc)
      plugin.log(this.event.selfId, `${logFnc}${this.event.logText}`)

      /** 计算插件处理时间 */
      const start = Date.now()
      common.addEventCount(plugin, this.event)

      try {
        const result = await plugin.fnc(this.event)

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
        plugin.log(this.event.selfId, `${logFnc} 处理完成 ${logger.green(Date.now() - start + 'ms')}`)
      }
    }

    common.log(`[${this.event.userId}] 未找到匹配到相应插件: ${this.event.eventId}`)
  }
}
