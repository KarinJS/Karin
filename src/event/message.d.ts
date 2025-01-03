import { BaseEvent } from './base';
import type { MessageEventSub, MessageOptions, FriendMessageOptions, GroupMessageOptions, DirectMessageOptions, GuildMessageOptions, GroupTempMessageOptions } from '@/types/event';
import type { Elements } from '@/types/segment';
/**
 * @description 消息事件基类
 * @class FriendMessage
 */
export declare abstract class MessageBase extends BaseEvent<'message'> {
    #private;
    /** 消息段 */
    elements: Elements[];
    /** 消息文本 */
    msg: string;
    /** 别名 */
    alias: string;
    /** 消息日志 */
    rawMessage: string;
    constructor({ subEvent, eventId, rawEvent, time, contact, sender, srcReply, bot, messageId, messageSeq, elements, }: MessageOptions);
    /**
     * @deprecated 即将废弃 请使用 `rawMessage`
     */
    get raw_message(): string;
    /**
     * @description 消息ID
     * @deprecated 即将废弃 请使用 `messageId`
     */
    get message_id(): string;
    /**
     * @description 消息序列号
     * @deprecated 即将废弃 请使用 `messageSeq`
     */
    get message_seq(): number;
    get event(): "message";
    get subEvent(): MessageEventSub;
    get messageId(): string;
    get messageSeq(): number;
    get at(): string[];
    get atBot(): boolean;
    get atAll(): boolean;
    get image(): string[];
    get record(): string;
    get replyId(): string;
    /**
     * @description 引用回复的消息id
     * @deprecated 即将废弃 请使用 `replyId`
     */
    get reply_id(): string;
}
/**
 * @description 好友消息事件类
 * @class FriendMessage
 */
export declare class FriendMessage extends MessageBase {
    #private;
    constructor(options: FriendMessageOptions);
    get contact(): import("@/types/event").FriendContact;
    get sender(): import("@/types/event").SenderBase;
    get subEvent(): "friend";
    get isPrivate(): true;
    get isFriend(): true;
    get isGroup(): false;
    get isGuild(): false;
    get isDirect(): false;
    get isGroupTemp(): false;
}
/**
 * @description 群消息事件类
 * @class GroupMessage
 */
export declare class GroupMessage extends MessageBase {
    #private;
    constructor(options: GroupMessageOptions);
    /**
     * @description 群ID
     * @deprecated 即将废弃 请使用 `groupId`
     */
    get group_id(): string;
    /**
     * @description 群ID
     */
    get groupId(): string;
    get contact(): import("@/types/event").GroupContact;
    get sender(): import("@/types/event").GroupSender;
    get subEvent(): "group";
    get isPrivate(): false;
    get isFriend(): false;
    get isGroup(): true;
    get isGuild(): false;
    get isDirect(): false;
    get isGroupTemp(): false;
}
/**
 * @description 频道私信消息事件类
 * @class DirectMessage
 */
export declare class DirectMessage extends MessageBase {
    #private;
    constructor(options: DirectMessageOptions);
    /** 来源频道id */
    get srcGuildId(): string;
    get contact(): import("@/types/event").DirectContact;
    get sender(): import("@/types/event").SenderBase;
    get subEvent(): "direct";
    get isPrivate(): true;
    get isFriend(): false;
    get isGroup(): false;
    get isGuild(): false;
    get isDirect(): true;
    get isGroupTemp(): false;
}
/**
 * @description 频道消息事件类
 * @class GuildMessage
 */
export declare class GuildMessage extends MessageBase {
    #private;
    constructor(options: GuildMessageOptions);
    /**
     * @description 频道ID
     * @deprecated 即将废弃 请使用 `guildId`
     */
    get guild_id(): string;
    /**
     * @description 子频道ID
     * @deprecated 即将废弃 请使用 `channelId`
     */
    get channel_id(): string;
    /**
     * @description 频道ID
     */
    get guildId(): string;
    /**
     * @description 子频道ID
     */
    get channelId(): string;
    get contact(): import("@/types/event").GuildContact;
    get sender(): import("@/types/event").GuildSender;
    get subEvent(): "guild";
    get isPrivate(): false;
    get isFriend(): false;
    get isGroup(): false;
    get isGuild(): true;
    get isDirect(): false;
    get isGroupTemp(): false;
}
/**
 * @description 群临时会话消息事件类
 * @class GroupTempMessage
 */
export declare class GroupTempMessage extends MessageBase {
    #private;
    constructor(options: GroupTempMessageOptions);
    /**
     * @description 群ID
     * @deprecated 即将废弃 请使用 `groupId`
     */
    get group_id(): string;
    /**
     * @description 群ID
     */
    get groupId(): string;
    get contact(): import("@/types/event").GroupTempContact;
    get sender(): import("@/types/event").SenderBase;
    get subEvent(): "groupTemp";
    get isPrivate(): false;
    get isFriend(): false;
    get isGroup(): false;
    get isGuild(): false;
    get isDirect(): false;
    get isGroupTemp(): true;
}
