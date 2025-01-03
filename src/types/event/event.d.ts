import type { FriendMessage, GroupMessage, DirectMessage, GuildMessage, GroupTempMessage } from '@/event/message';
import type { ReceiveLikeNotice, FriendDecreaseNotice, FriendIncreaseNotice, PrivatePokeNotice, PrivateRecallNotice, PrivateFileUploadedNotice, GroupPokeNotice, GroupRecallNotice, GroupFileUploadedNotice, GroupCardChangedNotice, GroupMemberTitleUpdatedNotice, GroupHlightsChangedNotice, GroupMemberIncreaseNotice, GroupMemberDecreaseNotice, GroupAdminChangedNotice, GroupSignInNotice, GroupMemberBanNotice, GroupWholeBanNotice, GroupMessageReactionNotice, GroupLuckKingNotice, GroupHonorChangedNotice } from '@/event/notice';
import { GroupApplyRequest, GroupInviteRequest, PrivateApplyRequest } from '@/event/request';
/** 消息事件对应的对象类型 */
export interface MessageEventMap {
    message: Message;
    'message.group': GroupMessage;
    'message.friend': FriendMessage;
    'message.guild': GuildMessage;
    'message.direct': DirectMessage;
    'message.groupTemp': GroupTempMessage;
}
/** 私聊通知事件对应的对象类型 */
export interface FriendNoticeEventMap {
    'notice.receiveLike': ReceiveLikeNotice;
    'notice.friendDecrease': FriendDecreaseNotice;
    'notice.friendIncrease': FriendIncreaseNotice;
    'notice.privatePoke': PrivatePokeNotice;
    'notice.privateRecall': PrivateRecallNotice;
    'notice.privateFileUploaded': PrivateFileUploadedNotice;
}
/** 群聊通知事件对应的对象类型 */
export interface GroupNoticeEventMap {
    'notice.groupPoke': GroupPokeNotice;
    'notice.groupRecall': GroupRecallNotice;
    'notice.groupFileUploaded': GroupFileUploadedNotice;
    'notice.groupCardChanged': GroupCardChangedNotice;
    'notice.groupMemberTitleUpdate': GroupMemberTitleUpdatedNotice;
    'notice.groupHighlightsChange': GroupHlightsChangedNotice;
    'notice.groupMemberAdd': GroupMemberIncreaseNotice;
    'notice.groupMemberRemove': GroupMemberDecreaseNotice;
    'notice.groupAdminChanged': GroupAdminChangedNotice;
    'notice.groupSignIn': GroupSignInNotice;
    'notice.groupMemberBan': GroupMemberBanNotice;
    'notice.groupWholeBan': GroupWholeBanNotice;
    'notice.groupMessageReaction': GroupMessageReactionNotice;
    'notice.groupLuckyKing': GroupLuckKingNotice;
    'notice.groupHonorChange': GroupHonorChangedNotice;
}
/** 通知事件对应的对象类型 */
export interface NoticeEventMap extends FriendNoticeEventMap, GroupNoticeEventMap {
    notice: Notice;
}
/** 好友请求事件对应的对象类型 */
export interface FriendRequestEventMap {
    'request.friendApply': PrivateApplyRequest;
}
/** 群聊请求事件对应的对象类型 */
export interface GroupRequestEventMap {
    'request.groupApply': GroupApplyRequest;
    'request.groupInvite': GroupInviteRequest;
}
/** 请求事件对应的对象类型 */
export interface RequestEventMap extends FriendRequestEventMap, GroupRequestEventMap {
    request: Request;
}
/**
 * @description 通知事件类型
 */
export type Notice = ReceiveLikeNotice | FriendDecreaseNotice | FriendIncreaseNotice | PrivatePokeNotice | PrivateRecallNotice | PrivateFileUploadedNotice | GroupPokeNotice | GroupRecallNotice | GroupFileUploadedNotice | GroupCardChangedNotice | GroupMemberTitleUpdatedNotice | GroupHlightsChangedNotice | GroupMemberIncreaseNotice | GroupMemberDecreaseNotice | GroupAdminChangedNotice | GroupSignInNotice | GroupMemberBanNotice | GroupWholeBanNotice | GroupMessageReactionNotice | GroupLuckKingNotice | GroupHonorChangedNotice;
/**
 * @description 消息事件类型
 */
export type Message = FriendMessage | GroupMessage | DirectMessage | GuildMessage | GroupTempMessage;
/**
 * @description 请求事件类型
 */
export type Request = PrivateApplyRequest | GroupApplyRequest | GroupInviteRequest;
/**
 * @description 所有事件类型
 */
export type Event = Message | Notice | Request;
