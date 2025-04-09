import type { Message } from '@/types/event'
import type { cache } from '@/plugin/system/cache'
import type {
  DirectMessage,
  FriendMessage,
  GroupMessage,
  GroupTempMessage,
  GuildMessage,
} from '../../message'

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
    authFailMsg: typeof cache.command[number]['authFailMsg'],
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
    plugin: typeof cache.command[number]
  ) {
    if (!plugin.permission || plugin.permission === 'all') {
      return true
    }

    if (plugin.permission === 'master') {
      if (ctx.isMaster) return true
      return this.handleNoPermission(ctx, plugin.authFailMsg, this.master)
    }

    if (plugin.permission === 'admin') {
      if (ctx.isMaster || ctx.isAdmin) return true
      return this.handleNoPermission(ctx, plugin.authFailMsg, this.admin)
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
    plugin: typeof cache.command[number]
  ) {
    if (!plugin.permission || plugin.permission === 'all') {
      return true
    }

    if (plugin.permission === 'master') {
      if (ctx.isMaster) return true
      return this.handleNoPermission(ctx, plugin.authFailMsg, this.master)
    }

    if (plugin.permission === 'admin') {
      if (ctx.isMaster || ctx.isAdmin) return true
      return this.handleNoPermission(ctx, plugin.authFailMsg, this.admin)
    }

    if (ctx.isGroup) {
      if (plugin.permission === 'group.owner') {
        if (ctx.isMaster || ctx.isAdmin || ctx.sender?.role === 'owner') return true
        return this.handleNoPermission(ctx, plugin.authFailMsg, this.owner)
      }

      if (plugin.permission === 'group.admin') {
        if (
          ctx.isMaster ||
          ctx.isAdmin ||
          ctx.sender?.role === 'owner' ||
          ctx.sender?.role === 'admin'
        ) return true
        return this.handleNoPermission(ctx, plugin.authFailMsg, this.groupAdmin)
      }
    } else if (ctx.isGuild) {
      if (plugin.permission === 'guild.owner') {
        if (ctx.isMaster || ctx.isAdmin || ctx.sender?.role === 'owner') return true
        return this.handleNoPermission(ctx, plugin.authFailMsg, this.owner)
      }

      if (plugin.permission === 'guild.admin') {
        if (
          ctx.isMaster ||
          ctx.isAdmin ||
          ctx.sender?.role === 'owner' ||
          ctx.sender?.role === 'admin'
        ) return true
        return this.handleNoPermission(ctx, plugin.authFailMsg, this.groupAdmin)
      }
    }

    return true
  }
}
