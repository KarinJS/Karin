import type { Message, Notice, Request } from '@/types'

/**
 * 事件日志工具
 */
export const eventLogger = {
  /**
   * 消息过滤日志
   * @param logText 日志前缀
   * @param text 日志内容
   */
  filter: (logText: string, text: string): void => {
    logger.debug(`[消息过滤]${logText} ${text}`)
  },
  /**
   * 收到消息事件日志
   * @param ctx 消息事件对象
   * @param level 日志等级
   */
  message: (ctx: Message, level: 'info' | 'debug' = 'info'): void => {
    const { id, type } = (() => {
      if (ctx.isFriend) {
        return { id: ctx.userId, type: '好友消息' }
      }

      if (ctx.isGroup) {
        return { id: `${ctx.groupId}-${ctx.userId}`, type: '群消息' }
      }

      if (ctx.isGuild) {
        return { id: `${ctx.guildId}-${ctx.channelId}-${ctx.userId}`, type: '频道消息' }
      }

      if (ctx.isGroupTemp) {
        return { id: `${ctx.groupId}-${ctx.userId}`, type: '群临时消息' }
      }

      return { id: ctx.userId, type: '私信消息' }
    })()

    const name = ctx.sender.nick || ''
    ctx.logText = `[${ctx.contact.scene}:${id}(${name})]`
    logger.bot(level, ctx.selfId, `${type}: [${id}(${name})] ${ctx.rawMessage}`)
  },
  /**
   * 收到通知事件日志
   * @param ctx 通知事件对象
   * @param type 事件类型
   * @param prefix 日志前缀
   * @param level 日志等级
   */
  notice: (ctx: Notice, level: 'info' | 'debug' = 'info'): void => {
    const { id, type } = (() => {
      if (ctx.isFriend) {
        return { id: ctx.userId, type: '好友通知' }
      }

      if (ctx.isGroup) {
        return { id: `${ctx.groupId}-${ctx.userId}`, type: '群通知' }
      }

      // @ts-ignore
      return { id: ctx.userId, type: '私信通知' }
    })()

    const name = ctx.sender.nick || ''
    ctx.logText = `[${ctx.contact.scene}:${id}(${name})]`
    logger.bot(level, ctx.selfId, `${type}: [${id}(${name})] ${ctx.tips}`)
  },

  /**
   * 收到请求事件日志
   * @param ctx 请求事件对象
   * @param level 日志等级
   */
  request: (ctx: Request, level: 'info' | 'debug' = 'info'): void => {
    const { id, type } = (() => {
      if (ctx.isFriend) {
        return { id: ctx.userId, type: '好友请求' }
      }

      if (ctx.isGroup) {
        return { id: `${ctx.groupId}-${ctx.userId}`, type: '群请求' }
      }

      // @ts-ignore
      return { id: ctx.userId, type: '私信请求' }
    })()

    const name = ctx.sender.nick || ''
    ctx.logText = `[${ctx.contact.scene}:${id}(${name})]`
    logger.bot(level, ctx.selfId, `${type}: [${id}(${name})] ${ctx.tips}`)
  },
}
