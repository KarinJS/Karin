import { BaseEvent } from './base';
import type { RequestEventSub, RequestOptions, PrivateApplyRequestOptions, GroupApplyRequestOptions, GroupInviteRequestOptions } from '@/types/event';
/**
 * @description 请求事件基类
 * @class RequestBase
 */
export declare abstract class RequestBase extends BaseEvent<'request'> {
    #private;
    /** 通知内容str */
    tips: string;
    /** 事件内容 */
    content: any;
    constructor({ subEvent, eventId, rawEvent, time, contact, sender, srcReply, bot, }: RequestOptions);
    get event(): "request";
    get subEvent(): RequestEventSub;
}
/**
 * @description 创建好友申请请求事件
 * @class ReceiveLikeNotice
 */
export declare class PrivateApplyRequest extends RequestBase {
    #private;
    constructor(options: PrivateApplyRequestOptions);
    get subEvent(): "friendApply";
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
 * @description 创建入群请求事件
 * @class ReceiveLikeNotice
 */
export declare class GroupApplyRequest extends RequestBase {
    #private;
    constructor(options: GroupApplyRequestOptions);
    /**
     * @deprecated 已经弃用 请使用`groupId`
     */
    get group_id(): string;
    get groupId(): string;
    get subEvent(): "groupApply";
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
 * @description 创建邀请Bot入群请求事件
 * @class GroupInviteRequest
 */
export declare class GroupInviteRequest extends RequestBase {
    #private;
    constructor(options: GroupInviteRequestOptions);
    /**
     * @deprecated 已经弃用 请使用`groupId`
     */
    get group_id(): string;
    get groupId(): string;
    get subEvent(): "groupInvite";
    get contact(): import("@/types/event").GroupContact;
    get sender(): import("@/types/event").Sender & import("@/types/event").GroupSender;
    get isPrivate(): false;
    get isFriend(): false;
    get isGroup(): true;
    get isGuild(): false;
    get isDirect(): false;
    get isGroupTemp(): false;
}
