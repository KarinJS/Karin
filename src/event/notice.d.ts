import { BaseEvent } from './base';
import type { NoticeEventSub, NoticeOptions, ReceiveLikeOptions, FriendIncreaseOptions, FriendDecreaseOptions, PrivatePokeOptions, PrivateRecallOptions, PrivateFileUploadedOptions, GroupPokeOptions, GroupRecallOptions, GroupFileUploadedOptions, GroupCardChangedOptions, GroupMemberUniqueTitleChangedOptions, GroupHlightsChangedOptions, GroupMemberIncreaseOptions, GroupMemberDecreaseOptions, GroupAdminChangedOptions, GroupSignInOptions, GroupMemberBanOptions, GroupWholeBanOptions, GroupMessageReactionOptions, GroupLuckKingOptions, GroupHonorChangedOptions } from '@/types/event';
/**
 * @description 通知事件基类
 * @class NoticeBase
 */
export declare abstract class NoticeBase extends BaseEvent<'notice'> {
    #private;
    /** 通知内容str */
    tips: string;
    /** 事件内容 */
    content: any;
    constructor({ subEvent, eventId, rawEvent, time, contact, sender, srcReply, bot, }: NoticeOptions);
    get event(): "notice";
    get subEvent(): NoticeEventSub;
}
/**
 * @description 收到点赞事件
 * @class ReceiveLikeNotice
 */
export declare class ReceiveLikeNotice extends NoticeBase {
    #private;
    constructor(options: ReceiveLikeOptions);
    get subEvent(): "receiveLike";
    get contact(): import("@/types/event").FriendContact;
    get sender(): import("@/types/event").Sender & import("@/types/event").SenderBase;
    get isPrivate(): true;
    get isFriend(): true;
    get isGroup(): false;
    get isGuild(): false;
    get isDirect(): false;
    get isGroupTemp(): false;
}
/**
 * @description 好友增加事件
 * @class FriendIncreaseNotice
 */
export declare class FriendIncreaseNotice extends NoticeBase {
    #private;
    constructor(options: FriendIncreaseOptions);
    get subEvent(): "friendIncrease";
    get contact(): import("@/types/event").FriendContact;
    get sender(): import("@/types/event").Sender & import("@/types/event").SenderBase;
    get isPrivate(): true;
    get isFriend(): true;
    get isGroup(): false;
    get isGuild(): false;
    get isDirect(): false;
    get isGroupTemp(): false;
}
/**
 * @description 好友减少事件
 * @class FriendDecreaseNotice
 */
export declare class FriendDecreaseNotice extends NoticeBase {
    #private;
    constructor(options: FriendDecreaseOptions);
    get subEvent(): "friendDecrease";
    get contact(): import("@/types/event").FriendContact;
    get sender(): import("@/types/event").Sender & import("@/types/event").SenderBase;
    get isPrivate(): true;
    get isFriend(): true;
    get isGroup(): false;
    get isGuild(): false;
    get isDirect(): false;
    get isGroupTemp(): false;
}
/**
 * @description 收到私聊戳一戳事件
 * @class PrivatePokeNotice
 */
export declare class PrivatePokeNotice extends NoticeBase {
    #private;
    constructor(options: PrivatePokeOptions);
    get subEvent(): "friendPoke";
    get contact(): import("@/types/event").FriendContact;
    get sender(): import("@/types/event").Sender & import("@/types/event").SenderBase;
    get isPrivate(): true;
    get isFriend(): true;
    get isGroup(): false;
    get isGuild(): false;
    get isDirect(): false;
    get isGroupTemp(): false;
}
/**
 * @description 收到私聊撤回事件
 * @class PrivateRecallNotice
 */
export declare class PrivateRecallNotice extends NoticeBase {
    #private;
    constructor(options: PrivateRecallOptions);
    get subEvent(): "friendRecall";
    get contact(): import("@/types/event").FriendContact;
    get sender(): import("@/types/event").Sender & import("@/types/event").SenderBase;
    get isPrivate(): true;
    get isFriend(): true;
    get isGroup(): false;
    get isGuild(): false;
    get isDirect(): false;
    get isGroupTemp(): false;
}
/**
 * @description 收到私聊文件上传事件
 * @class PrivateFileUploadedNotice
 */
export declare class PrivateFileUploadedNotice extends NoticeBase {
    #private;
    constructor(options: PrivateFileUploadedOptions);
    get subEvent(): "friendFileUploaded";
    get contact(): import("@/types/event").FriendContact;
    get sender(): import("@/types/event").Sender & import("@/types/event").SenderBase;
    get isPrivate(): true;
    get isFriend(): true;
    get isGroup(): false;
    get isGuild(): false;
    get isDirect(): false;
    get isGroupTemp(): false;
}
export declare class GroupNotice extends NoticeBase {
    /**
     * @deprecated 已经弃用 请使用`groupId`
     */
    get group_id(): string;
    get groupId(): string;
}
/**
 * @description 收到群聊戳一戳事件
 * @class GroupPokeNotice
 */
export declare class GroupPokeNotice extends GroupNotice {
    #private;
    constructor(options: GroupPokeOptions);
    get subEvent(): "groupPoke";
    get contact(): import("@/types/event").GroupContact;
    get sender(): import("@/types/event").Sender & import("@/types/event").GroupSender;
    get isPrivate(): false;
    get isFriend(): false;
    get isGroup(): true;
    get isGuild(): false;
    get isDirect(): false;
    get isGroupTemp(): false;
}
/**
 * @description 收到群聊撤回事件
 * @class GroupRecallNotice
 */
export declare class GroupRecallNotice extends GroupNotice {
    #private;
    constructor(options: GroupRecallOptions);
    get subEvent(): "groupRecall";
    get contact(): import("@/types/event").GroupContact;
    get sender(): import("@/types/event").Sender & import("@/types/event").GroupSender;
    get isPrivate(): false;
    get isFriend(): false;
    get isGroup(): true;
    get isGuild(): false;
    get isDirect(): false;
    get isGroupTemp(): false;
}
/**
 * @description 收到群聊文件上传事件
 * @class GroupFileUploadedNotice
 */
export declare class GroupFileUploadedNotice extends GroupNotice {
    #private;
    constructor(options: GroupFileUploadedOptions);
    get subEvent(): "groupFileUploaded";
    get contact(): import("@/types/event").GroupContact;
    get sender(): import("@/types/event").Sender & import("@/types/event").GroupSender;
    get isPrivate(): false;
    get isFriend(): false;
    get isGroup(): true;
    get isGuild(): false;
    get isDirect(): false;
    get isGroupTemp(): false;
}
/**
 * @description 群名片变动事件
 * @class GroupCardChangedNotice
 */
export declare class GroupCardChangedNotice extends GroupNotice {
    #private;
    constructor(options: GroupCardChangedOptions);
    get subEvent(): "groupCardChanged";
    get contact(): import("@/types/event").GroupContact;
    get sender(): import("@/types/event").Sender & import("@/types/event").GroupSender;
    get isPrivate(): false;
    get isFriend(): false;
    get isGroup(): true;
    get isGuild(): false;
    get isDirect(): false;
    get isGroupTemp(): false;
}
/**
 * @description 群成员头衔变动事件
 * @class GroupMemberTitleUpdatedNotice
 */
export declare class GroupMemberTitleUpdatedNotice extends GroupNotice {
    #private;
    constructor(options: GroupMemberUniqueTitleChangedOptions);
    get subEvent(): "groupMemberTitleUpdate";
    get contact(): import("@/types/event").GroupContact;
    get sender(): import("@/types/event").Sender & import("@/types/event").GroupSender;
    get isPrivate(): false;
    get isFriend(): false;
    get isGroup(): true;
    get isGuild(): false;
    get isDirect(): false;
    get isGroupTemp(): false;
}
/**
 * @description 群精华消息变动事件
 * @class GroupHlightsChangedNotice
 */
export declare class GroupHlightsChangedNotice extends GroupNotice {
    #private;
    constructor(options: GroupHlightsChangedOptions);
    get subEvent(): "groupHighlightsChange";
    get contact(): import("@/types/event").GroupContact;
    get sender(): import("@/types/event").Sender & import("@/types/event").GroupSender;
    get isPrivate(): false;
    get isFriend(): false;
    get isGroup(): true;
    get isGuild(): false;
    get isDirect(): false;
    get isGroupTemp(): false;
}
/**
 * @description 群成员增加事件
 * @class GroupMemberIncreaseNotice
 */
export declare class GroupMemberIncreaseNotice extends GroupNotice {
    #private;
    constructor(options: GroupMemberIncreaseOptions);
    get subEvent(): "groupMemberAdd";
    get contact(): import("@/types/event").GroupContact;
    get sender(): import("@/types/event").Sender & import("@/types/event").GroupSender;
    get isPrivate(): false;
    get isFriend(): false;
    get isGroup(): true;
    get isGuild(): false;
    get isDirect(): false;
    get isGroupTemp(): false;
}
/**
 * @description 群成员减少事件
 * @class GroupMemberDecreaseNotice
 */
export declare class GroupMemberDecreaseNotice extends GroupNotice {
    #private;
    constructor(options: GroupMemberDecreaseOptions);
    get subEvent(): "groupMemberRemove";
    get contact(): import("@/types/event").GroupContact;
    get sender(): import("@/types/event").Sender & import("@/types/event").GroupSender;
    get isPrivate(): false;
    get isFriend(): false;
    get isGroup(): true;
    get isGuild(): false;
    get isDirect(): false;
    get isGroupTemp(): false;
}
/**
 * @description 群管理员变动事件
 * @class GroupAdminChangedNotice
 */
export declare class GroupAdminChangedNotice extends GroupNotice {
    #private;
    constructor(options: GroupAdminChangedOptions);
    get subEvent(): "groupAdminChanged";
    get contact(): import("@/types/event").GroupContact;
    get sender(): import("@/types/event").Sender & import("@/types/event").GroupSender;
    get isPrivate(): false;
    get isFriend(): false;
    get isGroup(): true;
    get isGuild(): false;
    get isDirect(): false;
    get isGroupTemp(): false;
}
/**
 * @description 群打卡事件
 * @class GroupSignInNotice
 */
export declare class GroupSignInNotice extends GroupNotice {
    #private;
    constructor(options: GroupSignInOptions);
    get subEvent(): "groupSignIn";
    get contact(): import("@/types/event").GroupContact;
    get sender(): import("@/types/event").Sender & import("@/types/event").GroupSender;
    get isPrivate(): false;
    get isFriend(): false;
    get isGroup(): true;
    get isGuild(): false;
    get isDirect(): false;
    get isGroupTemp(): false;
}
/**
 * @description 群成员被禁言事件
 * @class GroupMemberBanNotice
 */
export declare class GroupMemberBanNotice extends GroupNotice {
    #private;
    constructor(options: GroupMemberBanOptions);
    get subEvent(): "groupMemberBan";
    get contact(): import("@/types/event").GroupContact;
    get sender(): import("@/types/event").Sender & import("@/types/event").GroupSender;
    get isPrivate(): false;
    get isFriend(): false;
    get isGroup(): true;
    get isGuild(): false;
    get isDirect(): false;
    get isGroupTemp(): false;
}
/**
 * @description 群全员禁言事件
 * @class GroupWholeBanNotice
 */
export declare class GroupWholeBanNotice extends GroupNotice {
    #private;
    constructor(options: GroupWholeBanOptions);
    get subEvent(): "groupWholeBan";
    get contact(): import("@/types/event").GroupContact;
    get sender(): import("@/types/event").Sender & import("@/types/event").GroupSender;
    get isPrivate(): false;
    get isFriend(): false;
    get isGroup(): true;
    get isGuild(): false;
    get isDirect(): false;
    get isGroupTemp(): false;
}
/**
 * @description 群表情动态事件
 * @class GroupMessageReactionNotice
 */
export declare class GroupMessageReactionNotice extends GroupNotice {
    #private;
    constructor(options: GroupMessageReactionOptions);
    get subEvent(): "groupMessageReaction";
    get contact(): import("@/types/event").GroupContact;
    get sender(): import("@/types/event").Sender & import("@/types/event").GroupSender;
    get isPrivate(): false;
    get isFriend(): false;
    get isGroup(): true;
    get isGuild(): false;
    get isDirect(): false;
    get isGroupTemp(): false;
}
/**
 * @description 群聊运气王事件
 * @class GroupLuckKingNotice
 */
export declare class GroupLuckKingNotice extends GroupNotice {
    #private;
    constructor(options: GroupLuckKingOptions);
    get subEvent(): "groupLuckyKing";
    get contact(): import("@/types/event").GroupContact;
    get sender(): import("@/types/event").Sender & import("@/types/event").GroupSender;
    get isPrivate(): false;
    get isFriend(): false;
    get isGroup(): true;
    get isGuild(): false;
    get isDirect(): false;
    get isGroupTemp(): false;
}
/**
 * @description 群聊荣誉变更事件
 * @class GroupHonorChangedNotice
 */
export declare class GroupHonorChangedNotice extends GroupNotice {
    #private;
    constructor(options: GroupHonorChangedOptions);
    get subEvent(): "groupHonorChange";
    get contact(): import("@/types/event").GroupContact;
    get sender(): import("@/types/event").Sender & import("@/types/event").GroupSender;
    get isPrivate(): false;
    get isFriend(): false;
    get isGroup(): true;
    get isGuild(): false;
    get isDirect(): false;
    get isGroupTemp(): false;
}
