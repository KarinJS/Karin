import { FriendMessage, GroupMessage, DirectMessage, GuildMessage, GroupTempMessage } from '../message';
import { ReceiveLikeNotice, FriendDecreaseNotice, FriendIncreaseNotice, PrivatePokeNotice, PrivateRecallNotice, PrivateFileUploadedNotice, GroupPokeNotice, GroupRecallNotice, GroupFileUploadedNotice, GroupCardChangedNotice, GroupMemberTitleUpdatedNotice, GroupHlightsChangedNotice, GroupMemberIncreaseNotice, GroupMemberDecreaseNotice, GroupAdminChangedNotice, GroupSignInNotice, GroupMemberBanNotice, GroupWholeBanNotice, GroupMessageReactionNotice, GroupLuckKingNotice, GroupHonorChangedNotice } from '../notice';
import { GroupApplyRequest, GroupInviteRequest, PrivateApplyRequest } from '../request';
import type { FriendMessageOptions, GroupMessageOptions, DirectMessageOptions, GuildMessageOptions, GroupTempMessageOptions } from '@/types/event';
import type { ReceiveLikeOptions, FriendIncreaseOptions, FriendDecreaseOptions, PrivatePokeOptions, PrivateRecallOptions, PrivateFileUploadedOptions, GroupPokeOptions, GroupRecallOptions, GroupFileUploadedOptions, GroupCardChangedOptions, GroupMemberUniqueTitleChangedOptions, GroupHlightsChangedOptions, GroupMemberIncreaseOptions, GroupMemberDecreaseOptions, GroupAdminChangedOptions, GroupSignInOptions, GroupMemberBanOptions, GroupWholeBanOptions, GroupMessageReactionOptions, GroupLuckKingOptions, GroupHonorChangedOptions } from '@/types/event';
import type { PrivateApplyRequestOptions, GroupApplyRequestOptions, GroupInviteRequestOptions } from '@/types/event';
/**
 * @description 创建好友消息事件
 * @param options 好友消息事件所需参数
 */
export declare const createFriendMessage: (options: FriendMessageOptions) => FriendMessage;
/**
 * @description 创建群消息事件实例
 * @param options 群消息事件所需参数
 */
export declare const createGroupMessage: (options: GroupMessageOptions) => GroupMessage;
/**
 * @description 创建频道消息事件实例
 * @param options 频道消息事件所需参数
 */
export declare const createGuildMessage: (options: GuildMessageOptions) => GuildMessage;
/**
 * @description 创建频道私信消息事件实例
 * @param options 频道私信消息事件所需参数
 */
export declare const createDirectMessage: (options: DirectMessageOptions) => DirectMessage;
/**
 * @description 创建群临时消息事件实例
 * @param options 群临时消息事件所需参数
 */
export declare const createGroupTempMessage: (options: GroupTempMessageOptions) => GroupTempMessage;
/**
 * @description 创建点赞通知事件
 * @param options 点赞通知事件所需参数
 */
export declare const createReceiveLikeNotice: (options: ReceiveLikeOptions) => ReceiveLikeNotice;
/**
 * @description 创建好友增加通知事件
 * @param options 好友增加通知事件所需参数
 */
export declare const createFriendIncreaseNotice: (options: FriendIncreaseOptions) => FriendIncreaseNotice;
/**
 * @description 创建好友减少通知事件
 * @param options 好友减少通知事件所需参数
 */
export declare const createFriendDecreaseNotice: (options: FriendDecreaseOptions) => FriendDecreaseNotice;
/**
 * @description 创建私聊戳一戳通知事件
 * @param options 私聊戳一戳通知事件所需参数
 */
export declare const createPrivatePokeNotice: (options: PrivatePokeOptions) => PrivatePokeNotice;
/**
 * @description 创建私聊撤回通知事件
 * @param options 私聊撤回通知事件所需参数
 */
export declare const createPrivateRecallNotice: (options: PrivateRecallOptions) => PrivateRecallNotice;
/**
 * @description 创建私聊文件上传通知事件
 * @param options 私聊文件上传通知事件所需参数
 */
export declare const createPrivateFileUploadedNotice: (options: PrivateFileUploadedOptions) => PrivateFileUploadedNotice;
/**
 * @description 创建群戳一戳通知事件
 * @param options 群戳一戳通知事件所需参数
 */
export declare const createGroupPokeNotice: (options: GroupPokeOptions) => GroupPokeNotice;
/**
 * @description 创建群撤回通知事件
 * @param options 群撤回通知事件所需参数
 */
export declare const createGroupRecallNotice: (options: GroupRecallOptions) => GroupRecallNotice;
/**
 * @description 创建群文件上传通知事件
 * @param options 群文件上传通知事件所需参数
 */
export declare const createGroupFileUploadedNotice: (options: GroupFileUploadedOptions) => GroupFileUploadedNotice;
/**
 * @description 创建群成员名片更新通知事件
 * @param options 群成员名片更新通知事件所需参数
 */
export declare const createGroupCardChangedNotice: (options: GroupCardChangedOptions) => GroupCardChangedNotice;
/**
 * @description 创建群成员专属头衔更新通知事件
 * @param options 群成员专属头衔更新通知事件所需参数
 */
export declare const createGroupMemberTitleUpdatedNotice: (options: GroupMemberUniqueTitleChangedOptions) => GroupMemberTitleUpdatedNotice;
/**
 * @description 创建群精华消息变更通知事件
 * @param options 群精华消息变更通知事件所需参数
 */
export declare const createGroupHlightsChangedNotice: (options: GroupHlightsChangedOptions) => GroupHlightsChangedNotice;
/**
 * @description 创建群成员增加通知事件
 * @param options 群成员增加通知事件所需参数
 */
export declare const createGroupMemberAddNotice: (options: GroupMemberIncreaseOptions) => GroupMemberIncreaseNotice;
/**
 * @description 创建群成员减少通知事件
 * @param options 群成员减少通知事件所需参数
 */
export declare const createGroupMemberDelNotice: (options: GroupMemberDecreaseOptions) => GroupMemberDecreaseNotice;
/**
 * @description 创建群管理员变更通知事件
 * @param options 群管理员变更通知事件所需参数
 */
export declare const createGroupAdminChangedNotice: (options: GroupAdminChangedOptions) => GroupAdminChangedNotice;
/**
 * @description 创建群签到通知事件
 * @param options 群签到通知事件所需参数
 */
export declare const createGroupSignInNotice: (options: GroupSignInOptions) => GroupSignInNotice;
/**
 * @description 创建群禁言通知事件
 * @param options 群禁言通知事件所需参数
 */
export declare const createGroupMemberBanNotice: (options: GroupMemberBanOptions) => GroupMemberBanNotice;
/**
 * @description 创建群全员禁言通知事件
 * @param options 群全员禁言通知事件所需参数
 */
export declare const createGroupWholeBanNotice: (options: GroupWholeBanOptions) => GroupWholeBanNotice;
/**
 * @description 创建群消息表态通知事件
 * @param options 群消息表态通知事件所需参数
 */
export declare const createGroupMessageReactionNotice: (options: GroupMessageReactionOptions) => GroupMessageReactionNotice;
/**
 * @description 创建群红包运气王通知事件
 * @param options 群红包运气王通知事件所需参数
 */
export declare const createGroupLuckKingNotice: (options: GroupLuckKingOptions) => GroupLuckKingNotice;
/**
 * @description 创建群成员荣誉变更通知事件
 * @param options 群成员荣誉变更通知事件所需参数
 */
export declare const createGroupHonorChangedNotice: (options: GroupHonorChangedOptions) => GroupHonorChangedNotice;
/**
 * @description 创建群成员申请入群请求事件
 * @param options 群成员申请入群请求事件所需参数
 */
export declare const createGroupApplyRequest: (options: GroupApplyRequestOptions) => GroupApplyRequest;
/**
 * @description 创建邀请Bot加群请求事件
 * @param options 邀请Bot加群请求事件所需参数
 */
export declare const createGroupInviteRequest: (options: GroupInviteRequestOptions) => GroupInviteRequest;
/**
 * @description 创建Bot收到添加为好友请求事件
 * @param options Bot收到添加为好友请求事件所需参数
 */
export declare const createPrivateApplyRequest: (options: PrivateApplyRequestOptions) => PrivateApplyRequest;
