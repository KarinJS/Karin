import { RECV_MSG } from '@karinjs/envs'
import { lock } from '@karinjs/utils'
import { internalEmitter } from '@karinjs/core'
import { createRawMessage } from '../../event/abstract/raw'

import type { ConfigConfig } from '@karinjs/config'
import type { Message, Event, Notice, Request } from '../types'

/**
 * 事件初始化工具
 */
export const initializer = {
  /**
   * 初始化`msg` `rawMessage`
   * @param ctx 消息事件对象
   */
  message: (ctx: Message): void => {
    const { msg, raw } = createRawMessage(ctx.elements)
    ctx.msg = msg
    ctx.rawMessage = raw
  },

  /**
   * 初始化通知事件的 `tips`
   * @param ctx 通知事件对象
   */
  notice: (ctx: Notice): void => {
    ctx.tips = ((): string => {
      switch (ctx.subEvent) {
        case 'friendPoke':
          return `戳一戳: ${ctx.content.operatorId} ${ctx.content.action || '戳了戳'} ${ctx.content.targetId}`
        case 'receiveLike':
          return `收到点赞: ${ctx.content.count}`
        case 'friendRecall':
          return `撤回消息: ${ctx.content.messageId}`
        case 'privateFileUploaded':
          return `文件上传: [fid:${ctx.content.fid}] [fid:${ctx.content.fid}] [name:${ctx.content.name}]`
        case 'friendIncrease':
          return `新增好友: ${ctx.content.targetId}`
        case 'friendDecrease':
          return `好友减少: ${ctx.content.targetId}`
        case 'groupPoke':
          return `戳一戳: ${ctx.content.operatorId} ${ctx.content.action || '戳了戳'} ${ctx.content.targetId}`
        case 'groupMessageReaction':
          return `表情动态: 给消息 ${ctx.content.messageId} ${ctx.content.isSet ? '添加' : '取消'}了表情 ${ctx.content.faceId}`
        case 'groupRecall':
          return `撤回消息: ${ctx.content.messageId}`
        case 'groupFileUploaded':
          return `文件上传: [fid:${ctx.content.fid}] [fid:${ctx.content.fid}] [name:${ctx.content.name}]`
        case 'groupMemberAdd':
          return `新增成员: [操作者:${ctx.content.operatorId}] [目标成员:${ctx.content.targetId}]`
        case 'groupMemberRemove':
          return `移除成员: [操作者:${ctx.content.operatorId}] [目标成员:${ctx.content.targetId}]`
        case 'groupCardChanged':
          return `名片变动: [操作者:${ctx.content.operatorId}] [目标成员:${ctx.content.targetId}]`
        case 'groupAdminChanged':
          return `管理员变动: ${ctx.content.targetId} 被${ctx.content.isAdmin ? '设置' : '取消'}管理员`
        case 'groupSignIn':
          return `签到: ${ctx.content.targetId}`
        case 'groupMemberTitleUpdate':
          return `头衔变动: ${ctx.content.title}`
        case 'groupHonorChange':
          return `荣誉变更: ${ctx.userId} 获得了 ${ctx.content.honorType} 荣誉`
        case 'groupLuckyKing':
          return `运气王: ${ctx.content.userId} 从 ${ctx.content.userId} 发的红包中获得了运气王`
        case 'groupHighlightsChange':
          return ctx.content.isSet
            ? `设置精华: ${ctx.content.operatorId} 将 ${ctx.content.messageId} 设置为精华消息`
            : `取消精华: ${ctx.content.operatorId} 将 ${ctx.content.messageId} 取消精华消息`
        case 'groupMemberBan':
          return ctx.content.isBan
            ? `禁言成员: ${ctx.content.operatorId} 将 ${ctx.content.targetId} 禁言 ${ctx.content.duration}秒`
            : `解除禁言: ${ctx.content.operatorId} 解除了 ${ctx.content.targetId} 的禁言`
        case 'groupWholeBan':
          return ctx.content.isBan
            ? `全员禁言: ${ctx.content.operatorId}`
            : `解除全员禁言: ${ctx.content.operatorId}`
        default:
          // @ts-ignore
          return `未知子事件: ${JSON.stringify(ctx.rawEvent)}`
      }
    })()
  },

  /**
   * 初始化请求事件的 `tips`
   * @param ctx 请求事件对象
   */
  request: (ctx: Request): void => {
    ctx.tips = ((): string => {
      switch (ctx.subEvent) {
        case 'groupInvite':
          return `群邀请: ${ctx.content.inviterId} 邀请Bot加入群 ${ctx.content.groupId}，flag: ${ctx.content.flag}`
        case 'friendApply':
          return `好友申请: ${ctx.content.applierId} 申请添加Bot为好友，验证信息: ${ctx.content.comment || '无'}`
        case 'groupApply':
          return `群申请: ${ctx.content.applierId} 申请加入群 ${ctx.content.groupId}，flag: ${ctx.content.flag} 验证信息: ${ctx.content.comment}`
        default:
          // @ts-ignore
          return `未知子事件: ${JSON.stringify(ctx.rawEvent)}`
      }
    })()
  },
  /**
   * 初始化事件的角色身份
   * @param ctx 事件对象
   * @param config 基本配置
   */
  role: (ctx: Event, config: ConfigConfig): void => {
    /** 主人 */
    if (config.master.includes(`${ctx.selfId}@${ctx.userId}`) || config.master.includes(ctx.userId)) {
      ctx.isMaster = true
      ctx.isAdmin = true
    } else if (
      config.admin.includes(`${ctx.selfId}@${ctx.userId}`) ||
      config.admin.includes(ctx.userId)
    ) {
      /** 管理员 */
      ctx.isAdmin = true
      ctx.isMaster = false
    } else {
      ctx.isAdmin = false
      ctx.isMaster = false
    }

    // 锁定属性防止修改
    lock.prop(ctx, 'isMaster')
    lock.prop(ctx, 'isAdmin')
  },

  /**
   * 初始化Bot的前缀
   * @param ctx 消息事件对象
   * @param alias Bot前缀列表
   */
  alias: (ctx: Message, alias: string[]): void => {
    const aliasRegex = new RegExp(`^(${alias.join('|')})`)
    const match = ctx.msg.match(aliasRegex)
    if (!match) {
      ctx.alias = ''
      return
    }

    ctx.msg = ctx.msg.replace(aliasRegex, '').trim()
    ctx.alias = match[1] || ''
  },

  /**
   * 事件发布
   * @param ctx 事件对象
   */
  emitEvent: (ctx: Event): void => {
    internalEmitter.emit(RECV_MSG, ctx.contact)
  },
}
