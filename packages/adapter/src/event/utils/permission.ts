import type { Message } from '../../event/types'
import type {
  DirectMessage,
  FriendMessage,
  GroupMessage,
  GroupTempMessage,
  GuildMessage,
} from '../abstract/message'
import type { CommandCache } from '@karinjs/plugin'

/**
 * 权限管理工具
 */
export const permission = {
  /** 权限错误提示信息 */
  messages: {
    master: '暂无权限，只有主人才能操作',
    admin: '暂无权限，只有管理员才能操作',
    owner: '暂无权限，只有群主才能操作',
    groupAdmin: '暂无权限，只有群管理员才能操作',
  },

  /**
   * 处理没有权限的情况
   * @param ctx 上下文
   * @param authFailMsg 没有权限时的回复消息
   * @param defaultMsg 默认回复消息
   * @returns `false` 表示没有权限
   */
  handleNoPermission: (
    ctx: Message,
    authFailMsg: CommandCache['register']['options']['authFailMsg'],
    defaultMsg: string
  ): boolean => {
    if (authFailMsg === false) {
      ctx.bot.logger('debug', `${defaultMsg}: ${ctx.messageId}`)
      return false
    }

    ctx.reply(typeof authFailMsg === 'string' ? authFailMsg : defaultMsg)
    return false
  },

  /**
   * 私聊场景权限检查
   * @param ctx 上下文
   * @param perm 权限
   * @param authFailMsg 没有权限时的回复消息
   * @returns `true` 表示有权限
   */
  checkPrivate: (
    ctx: FriendMessage | DirectMessage,
    perm: CommandCache['register']['options']['permission'],
    authFailMsg: CommandCache['register']['options']['authFailMsg']
  ): boolean => {
    if (!perm || perm === 'all') {
      return true
    }

    if (perm === 'master') {
      if (ctx.isMaster) return true
      return permission.handleNoPermission(ctx, authFailMsg, permission.messages.master)
    }

    if (perm === 'admin') {
      if (ctx.isMaster || ctx.isAdmin) return true
      return permission.handleNoPermission(ctx, authFailMsg, permission.messages.admin)
    }

    return true
  },

  /**
   * 群聊场景权限检查
   * @param ctx 上下文
   * @param perm 权限
   * @param authFailMsg 没有权限时的回复消息
   * @returns `true` 表示有权限
   */
  checkGroup: (
    ctx: GroupMessage | GuildMessage | GroupTempMessage,
    perm: CommandCache['register']['options']['permission'],
    authFailMsg: CommandCache['register']['options']['authFailMsg']
  ): boolean => {
    if (!perm || perm === 'all') {
      return true
    }

    if (perm === 'master') {
      if (ctx.isMaster) return true
      return permission.handleNoPermission(ctx, authFailMsg, permission.messages.master)
    }

    if (perm === 'admin') {
      if (ctx.isMaster || ctx.isAdmin) return true
      return permission.handleNoPermission(ctx, authFailMsg, permission.messages.admin)
    }

    if (ctx.isGroup) {
      if (perm === 'group.owner') {
        if (ctx.isMaster || ctx.isAdmin || ctx.sender?.role === 'owner') return true
        return permission.handleNoPermission(ctx, authFailMsg, permission.messages.owner)
      }

      if (perm === 'group.admin') {
        if (
          ctx.isMaster ||
          ctx.isAdmin ||
          ctx.sender?.role === 'owner' ||
          ctx.sender?.role === 'admin'
        ) return true
        return permission.handleNoPermission(ctx, authFailMsg, permission.messages.groupAdmin)
      }
    } else if (ctx.isGuild) {
      if (perm === 'guild.owner') {
        if (ctx.isMaster || ctx.isAdmin || ctx.sender?.role === 'owner') return true
        return permission.handleNoPermission(ctx, authFailMsg, permission.messages.owner)
      }

      if (perm === 'guild.admin') {
        if (
          ctx.isMaster ||
          ctx.isAdmin ||
          ctx.sender?.role === 'owner' ||
          ctx.sender?.role === 'admin'
        ) return true
        return permission.handleNoPermission(ctx, authFailMsg, permission.messages.groupAdmin)
      }
    }

    return true
  },
}
