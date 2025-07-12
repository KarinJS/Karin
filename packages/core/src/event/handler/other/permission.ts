import type { Message } from '@/types/event'
import type {
  DirectMessage,
  FriendMessage,
  GroupMessage,
  GroupTempMessage,
  GuildMessage,
} from '../../message'
import type { CommandCache } from '@/core/karin/command'

/**
 * 处理插件权限
 */
export class Permission {
  static master = '暂无权限，只有主人才能操作'
  static admin = '暂无权限，只有管理员才能操作'
  static owner = '暂无权限，只有群主才能操作'
  static groupAdmin = '暂无权限，只有群管理员才能操作'

  /**
   * 处理没有权限的情况
   * @param ctx 上下文
   * @param authFailMsg 没有权限时的回复消息
   * @param defaultMsg 默认回复消息
   */
  static handleNoPermission (
    ctx: Message,
    authFailMsg: CommandCache['register']['options']['authFailMsg'],
    defaultMsg: string
  ) {
    if (authFailMsg === false) {
      ctx.bot.logger('debug', `${defaultMsg}: ${ctx.messageId}`)
      return false
    }

    ctx.reply(typeof authFailMsg === 'string' ? authFailMsg : defaultMsg)
    return false
  }

  /**
   * 私聊场景
   * @param ctx 上下文
   * @param plugin 插件缓存对象
   */
  static private (
    ctx: FriendMessage | DirectMessage,
    plugin: CommandCache
  ) {
    const { permission, authFailMsg } = plugin.register.options
    if (!permission || permission === 'all') {
      return true
    }

    if (permission === 'master') {
      if (ctx.isMaster) return true
      return this.handleNoPermission(ctx, authFailMsg, this.master)
    }

    if (permission === 'admin') {
      if (ctx.isMaster || ctx.isAdmin) return true
      return this.handleNoPermission(ctx, authFailMsg, this.admin)
    }

    return true
  }

  /**
   * 群聊场景
   * @param ctx 上下文
   * @param plugin 插件缓存对象
   */
  static groups (
    ctx: GroupMessage | GuildMessage | GroupTempMessage,
    plugin: CommandCache
  ) {
    const { permission, authFailMsg } = plugin.register.options
    if (!permission || permission === 'all') {
      return true
    }

    if (permission === 'master') {
      if (ctx.isMaster) return true
      return this.handleNoPermission(ctx, authFailMsg, this.master)
    }

    if (permission === 'admin') {
      if (ctx.isMaster || ctx.isAdmin) return true
      return this.handleNoPermission(ctx, authFailMsg, this.admin)
    }

    if (ctx.isGroup) {
      if (permission === 'group.owner') {
        if (ctx.isMaster || ctx.isAdmin || ctx.sender?.role === 'owner') return true
        return this.handleNoPermission(ctx, authFailMsg, this.owner)
      }

      if (permission === 'group.admin') {
        if (
          ctx.isMaster ||
          ctx.isAdmin ||
          ctx.sender?.role === 'owner' ||
          ctx.sender?.role === 'admin'
        ) return true
        return this.handleNoPermission(ctx, authFailMsg, this.groupAdmin)
      }
    } else if (ctx.isGuild) {
      if (permission === 'guild.owner') {
        if (ctx.isMaster || ctx.isAdmin || ctx.sender?.role === 'owner') return true
        return this.handleNoPermission(ctx, authFailMsg, this.owner)
      }

      if (permission === 'guild.admin') {
        if (
          ctx.isMaster ||
          ctx.isAdmin ||
          ctx.sender?.role === 'owner' ||
          ctx.sender?.role === 'admin'
        ) return true
        return this.handleNoPermission(ctx, authFailMsg, this.groupAdmin)
      }
    }

    return true
  }
}
