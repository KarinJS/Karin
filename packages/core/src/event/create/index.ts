import { directHandler, friendHandler, groupHandler, groupTempHandler, guildHandler } from '../handler/message'
import { friendNoticeHandler, groupNoticeHandler } from '../handler/notice'
import { friendRequestHandler, groupRequestHandler } from '../handler/request'
import {
  FriendMessage,
  GroupMessage,
  DirectMessage,
  GuildMessage,
  GroupTempMessage,
} from '../message'
import {
  ReceiveLikeNotice,
  FriendDecreaseNotice,
  FriendIncreaseNotice,
  PrivatePokeNotice,
  PrivateRecallNotice,
  PrivateFileUploadedNotice,
  GroupPokeNotice,
  GroupRecallNotice,
  GroupFileUploadedNotice,
  GroupCardChangedNotice,
  GroupMemberTitleUpdatedNotice,
  GroupHlightsChangedNotice,
  GroupMemberIncreaseNotice,
  GroupMemberDecreaseNotice,
  GroupAdminChangedNotice,
  GroupSignInNotice,
  GroupMemberBanNotice,
  GroupWholeBanNotice,
  GroupMessageReactionNotice,
  GroupLuckKingNotice,
  GroupHonorChangedNotice,
} from '../notice'
import {
  GroupApplyRequest,
  GroupInviteRequest,
  PrivateApplyRequest,
} from '../request'
import type {
  FriendMessageOptions,
  GroupMessageOptions,
  DirectMessageOptions,
  GuildMessageOptions,
  GroupTempMessageOptions,
} from '@/types/event'
import type {
  ReceiveLikeOptions,
  FriendIncreaseOptions,
  FriendDecreaseOptions,
  PrivatePokeOptions,
  PrivateRecallOptions,
  PrivateFileUploadedOptions,
  GroupPokeOptions,
  GroupRecallOptions,
  GroupFileUploadedOptions,
  GroupCardChangedOptions,
  GroupMemberUniqueTitleChangedOptions,
  GroupHlightsChangedOptions,
  GroupMemberIncreaseOptions,
  GroupMemberDecreaseOptions,
  GroupAdminChangedOptions,
  GroupSignInOptions,
  GroupMemberBanOptions,
  GroupWholeBanOptions,
  GroupMessageReactionOptions,
  GroupLuckKingOptions,
  GroupHonorChangedOptions,
} from '@/types/event'
import type {
  PrivateApplyRequestOptions,
  GroupApplyRequestOptions,
  GroupInviteRequestOptions,
} from '@/types/event'

/**
 * @description 创建好友消息事件
 * @param options 好友消息事件所需参数
 */
export const createFriendMessage = (options: FriendMessageOptions) => {
  const event = new FriendMessage(options)
  friendHandler(event)
  return event
}

/**
 * @description 创建群消息事件实例
 * @param options 群消息事件所需参数
 */
export const createGroupMessage = (options: GroupMessageOptions) => {
  const event = new GroupMessage(options)
  groupHandler(event)
  return event
}

/**
 * @description 创建频道消息事件实例
 * @param options 频道消息事件所需参数
 */
export const createGuildMessage = (options: GuildMessageOptions) => {
  const event = new GuildMessage(options)
  guildHandler(event)
  return event
}

/**
 * @description 创建频道私信消息事件实例
 * @param options 频道私信消息事件所需参数
 */
export const createDirectMessage = (options: DirectMessageOptions) => {
  const event = new DirectMessage(options)
  directHandler(event)
  return event
}

/**
 * @description 创建群临时消息事件实例
 * @param options 群临时消息事件所需参数
 */
export const createGroupTempMessage = (options: GroupTempMessageOptions) => {
  const event = new GroupTempMessage(options)
  groupTempHandler(event)
  return event
}

/**
 * @description 创建点赞通知事件
 * @param options 点赞通知事件所需参数
 */
export const createReceiveLikeNotice = (options: ReceiveLikeOptions) => {
  const event = new ReceiveLikeNotice(options)
  friendNoticeHandler(event)
  return event
}

/**
 * @description 创建好友增加通知事件
 * @param options 好友增加通知事件所需参数
 */
export const createFriendIncreaseNotice = (options: FriendIncreaseOptions) => {
  const event = new FriendIncreaseNotice(options)
  friendNoticeHandler(event)
  return event
}

/**
 * @description 创建好友减少通知事件
 * @param options 好友减少通知事件所需参数
 */
export const createFriendDecreaseNotice = (options: FriendDecreaseOptions) => {
  const event = new FriendDecreaseNotice(options)
  friendNoticeHandler(event)
  return event
}

/**
 * @description 创建私聊戳一戳通知事件
 * @param options 私聊戳一戳通知事件所需参数
 */
export const createPrivatePokeNotice = (options: PrivatePokeOptions) => {
  const event = new PrivatePokeNotice(options)
  friendNoticeHandler(event)
  return event
}

/**
 * @description 创建私聊撤回通知事件
 * @param options 私聊撤回通知事件所需参数
 */
export const createPrivateRecallNotice = (options: PrivateRecallOptions) => {
  const event = new PrivateRecallNotice(options)
  friendNoticeHandler(event)
  return event
}

/**
 * @description 创建私聊文件上传通知事件
 * @param options 私聊文件上传通知事件所需参数
 */
export const createPrivateFileUploadedNotice = (options: PrivateFileUploadedOptions) => {
  const event = new PrivateFileUploadedNotice(options)
  friendNoticeHandler(event)
  return event
}

/**
 * @description 创建群戳一戳通知事件
 * @param options 群戳一戳通知事件所需参数
 */
export const createGroupPokeNotice = (options: GroupPokeOptions) => {
  const event = new GroupPokeNotice(options)
  groupNoticeHandler(event)
  return event
}

/**
 * @description 创建群撤回通知事件
 * @param options 群撤回通知事件所需参数
 */
export const createGroupRecallNotice = (options: GroupRecallOptions) => {
  const event = new GroupRecallNotice(options)
  groupNoticeHandler(event)
  return event
}

/**
 * @description 创建群文件上传通知事件
 * @param options 群文件上传通知事件所需参数
 */
export const createGroupFileUploadedNotice = (options: GroupFileUploadedOptions) => {
  const event = new GroupFileUploadedNotice(options)
  groupNoticeHandler(event)
  return event
}

/**
 * @description 创建群成员名片更新通知事件
 * @param options 群成员名片更新通知事件所需参数
 */
export const createGroupCardChangedNotice = (options: GroupCardChangedOptions) => {
  const event = new GroupCardChangedNotice(options)
  groupNoticeHandler(event)
  return event
}

/**
 * @description 创建群成员专属头衔更新通知事件
 * @param options 群成员专属头衔更新通知事件所需参数
 */
export const createGroupMemberTitleUpdatedNotice = (options: GroupMemberUniqueTitleChangedOptions) => {
  const event = new GroupMemberTitleUpdatedNotice(options)
  groupNoticeHandler(event)
  return event
}

/**
 * @description 创建群精华消息变更通知事件
 * @param options 群精华消息变更通知事件所需参数
 */
export const createGroupHlightsChangedNotice = (options: GroupHlightsChangedOptions) => {
  const event = new GroupHlightsChangedNotice(options)
  groupNoticeHandler(event)
  return event
}

/**
 * @description 创建群成员增加通知事件
 * @param options 群成员增加通知事件所需参数
 */
export const createGroupMemberAddNotice = (options: GroupMemberIncreaseOptions) => {
  const event = new GroupMemberIncreaseNotice(options)
  groupNoticeHandler(event)
  return event
}

/**
 * @description 创建群成员减少通知事件
 * @param options 群成员减少通知事件所需参数
 */
export const createGroupMemberDelNotice = (options: GroupMemberDecreaseOptions) => {
  const event = new GroupMemberDecreaseNotice(options)
  groupNoticeHandler(event)
  return event
}

/**
 * @description 创建群管理员变更通知事件
 * @param options 群管理员变更通知事件所需参数
 */
export const createGroupAdminChangedNotice = (options: GroupAdminChangedOptions) => {
  const event = new GroupAdminChangedNotice(options)
  groupNoticeHandler(event)
  return event
}

/**
 * @description 创建群签到通知事件
 * @param options 群签到通知事件所需参数
 */
export const createGroupSignInNotice = (options: GroupSignInOptions) => {
  const event = new GroupSignInNotice(options)
  groupNoticeHandler(event)
  return event
}

/**
 * @description 创建群禁言通知事件
 * @param options 群禁言通知事件所需参数
 */
export const createGroupMemberBanNotice = (options: GroupMemberBanOptions) => {
  const event = new GroupMemberBanNotice(options)
  groupNoticeHandler(event)
  return event
}

/**
 * @description 创建群全员禁言通知事件
 * @param options 群全员禁言通知事件所需参数
 */
export const createGroupWholeBanNotice = (options: GroupWholeBanOptions) => {
  const event = new GroupWholeBanNotice(options)
  groupNoticeHandler(event)
  return event
}

/**
 * @description 创建群消息表态通知事件
 * @param options 群消息表态通知事件所需参数
 */
export const createGroupMessageReactionNotice = (options: GroupMessageReactionOptions) => {
  const event = new GroupMessageReactionNotice(options)
  groupNoticeHandler(event)
  return event
}

/**
 * @description 创建群红包运气王通知事件
 * @param options 群红包运气王通知事件所需参数
 */
export const createGroupLuckKingNotice = (options: GroupLuckKingOptions) => {
  const event = new GroupLuckKingNotice(options)
  groupNoticeHandler(event)
  return event
}

/**
 * @description 创建群成员荣誉变更通知事件
 * @param options 群成员荣誉变更通知事件所需参数
 */
export const createGroupHonorChangedNotice = (options: GroupHonorChangedOptions) => {
  const event = new GroupHonorChangedNotice(options)
  groupNoticeHandler(event)
  return event
}

/**
 * @description 创建群成员申请入群请求事件
 * @param options 群成员申请入群请求事件所需参数
 */
export const createGroupApplyRequest = (options: GroupApplyRequestOptions) => {
  const event = new GroupApplyRequest(options)
  groupRequestHandler(event)
  return event
}

/**
 * @description 创建邀请Bot加群请求事件
 * @param options 邀请Bot加群请求事件所需参数
 */
export const createGroupInviteRequest = (options: GroupInviteRequestOptions) => {
  const event = new GroupInviteRequest(options)
  groupRequestHandler(event)
  return event
}

/**
 * @description 创建Bot收到添加为好友请求事件
 * @param options Bot收到添加为好友请求事件所需参数
 */
export const createPrivateApplyRequest = (options: PrivateApplyRequestOptions) => {
  const event = new PrivateApplyRequest(options)
  friendRequestHandler(event)
  return event
}
