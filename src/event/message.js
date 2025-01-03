import { BaseEvent } from './base';
/**
 * @description 消息事件基类
 * @class FriendMessage
 */
export class MessageBase extends BaseEvent {
    #event;
    #subEvent;
    #messageId;
    #messageSeq;
    /** 消息段 */
    elements;
    /** 消息文本 */
    msg;
    /** 别名 */
    alias;
    /** 消息日志 */
    rawMessage;
    constructor({ subEvent, eventId, rawEvent, time, contact, sender, srcReply, bot, messageId, messageSeq, elements, }) {
        super({
            subEvent,
            eventId,
            rawEvent,
            time,
            contact,
            sender,
            srcReply,
            bot,
            event: 'message',
        });
        this.#event = 'message';
        this.#subEvent = subEvent;
        this.#messageId = messageId;
        this.#messageSeq = messageSeq;
        this.elements = elements;
        this.msg = '';
        this.alias = '';
        this.rawMessage = '';
    }
    /**
     * @deprecated 即将废弃 请使用 `rawMessage`
     */
    get raw_message() {
        return this.rawMessage;
    }
    /**
     * @description 消息ID
     * @deprecated 即将废弃 请使用 `messageId`
     */
    get message_id() {
        return this.messageId;
    }
    /**
     * @description 消息序列号
     * @deprecated 即将废弃 请使用 `messageSeq`
     */
    get message_seq() {
        return this.messageSeq;
    }
    get event() {
        return this.#event;
    }
    get subEvent() {
        return this.#subEvent;
    }
    get messageId() {
        return this.#messageId;
    }
    get messageSeq() {
        return this.#messageSeq;
    }
    get at() {
        return this.elements
            .filter(element => element.type === 'at')
            .map(element => element.targetId)
            .filter(Boolean);
    }
    get atBot() {
        return this.at.includes(this.selfId);
    }
    get atAll() {
        return this.at.includes('all');
    }
    get image() {
        return this.elements
            .filter(element => element.type === 'image')
            .map(element => element.file)
            .filter(Boolean);
    }
    get record() {
        const record = this.elements.find(element => element.type === 'record');
        return record ? record.file : '';
    }
    get replyId() {
        const reply = this.elements.find(element => element.type === 'reply');
        return reply ? reply.messageId : '';
    }
    /**
     * @description 引用回复的消息id
     * @deprecated 即将废弃 请使用 `replyId`
     */
    get reply_id() {
        return this.replyId;
    }
}
/**
 * @description 好友消息事件类
 * @class FriendMessage
 */
export class FriendMessage extends MessageBase {
    #subEvent;
    #contact;
    #sender;
    constructor(options) {
        super(Object.assign(options, { subEvent: 'friend' }));
        this.#subEvent = 'friend';
        this.#contact = options.contact;
        this.#sender = options.sender;
    }
    get contact() {
        return this.#contact;
    }
    get sender() {
        return this.#sender;
    }
    get subEvent() {
        return this.#subEvent;
    }
    get isPrivate() {
        return true;
    }
    get isFriend() {
        return true;
    }
    get isGroup() {
        return false;
    }
    get isGuild() {
        return false;
    }
    get isDirect() {
        return false;
    }
    get isGroupTemp() {
        return false;
    }
}
/**
 * @description 群消息事件类
 * @class GroupMessage
 */
export class GroupMessage extends MessageBase {
    #subEvent;
    #contact;
    #sender;
    constructor(options) {
        super(Object.assign(options, { subEvent: 'group' }));
        this.#subEvent = 'group';
        this.#contact = options.contact;
        this.#sender = options.sender;
    }
    /**
     * @description 群ID
     * @deprecated 即将废弃 请使用 `groupId`
     */
    get group_id() {
        return this.groupId;
    }
    /**
     * @description 群ID
     */
    get groupId() {
        return this.contact.peer;
    }
    get contact() {
        return this.#contact;
    }
    get sender() {
        return this.#sender;
    }
    get subEvent() {
        return this.#subEvent;
    }
    get isPrivate() {
        return false;
    }
    get isFriend() {
        return false;
    }
    get isGroup() {
        return true;
    }
    get isGuild() {
        return false;
    }
    get isDirect() {
        return false;
    }
    get isGroupTemp() {
        return false;
    }
}
/**
 * @description 频道私信消息事件类
 * @class DirectMessage
 */
export class DirectMessage extends MessageBase {
    #subEvent;
    #contact;
    #sender;
    constructor(options) {
        super(Object.assign(options, { subEvent: 'direct' }));
        this.#subEvent = 'direct';
        this.#sender = options.sender;
        this.#contact = options.contact;
    }
    /** 来源频道id */
    get srcGuildId() {
        return this.#contact.srcGuildId;
    }
    get contact() {
        return this.#contact;
    }
    get sender() {
        return this.#sender;
    }
    get subEvent() {
        return this.#subEvent;
    }
    get isPrivate() {
        return true;
    }
    get isFriend() {
        return false;
    }
    get isGroup() {
        return false;
    }
    get isGuild() {
        return false;
    }
    get isDirect() {
        return true;
    }
    get isGroupTemp() {
        return false;
    }
}
/**
 * @description 频道消息事件类
 * @class GuildMessage
 */
export class GuildMessage extends MessageBase {
    #subEvent;
    #contact;
    #sender;
    constructor(options) {
        super(Object.assign(options, { subEvent: 'guild' }));
        this.#subEvent = 'guild';
        this.#contact = options.contact;
        this.#sender = options.sender;
    }
    /**
     * @description 频道ID
     * @deprecated 即将废弃 请使用 `guildId`
     */
    get guild_id() {
        return this.guildId;
    }
    /**
     * @description 子频道ID
     * @deprecated 即将废弃 请使用 `channelId`
     */
    get channel_id() {
        return this.channelId;
    }
    /**
     * @description 频道ID
     */
    get guildId() {
        return this.#contact.peer;
    }
    /**
     * @description 子频道ID
     */
    get channelId() {
        return this.#contact.subPeer;
    }
    get contact() {
        return this.#contact;
    }
    get sender() {
        return this.#sender;
    }
    get subEvent() {
        return this.#subEvent;
    }
    get isPrivate() {
        return false;
    }
    get isFriend() {
        return false;
    }
    get isGroup() {
        return false;
    }
    get isGuild() {
        return true;
    }
    get isDirect() {
        return false;
    }
    get isGroupTemp() {
        return false;
    }
}
/**
 * @description 群临时会话消息事件类
 * @class GroupTempMessage
 */
export class GroupTempMessage extends MessageBase {
    #subEvent;
    #contact;
    #sender;
    constructor(options) {
        super(Object.assign(options, { subEvent: 'groupTemp' }));
        this.#subEvent = 'groupTemp';
        this.#contact = options.contact;
        this.#sender = options.sender;
    }
    /**
     * @description 群ID
     * @deprecated 即将废弃 请使用 `groupId`
     */
    get group_id() {
        return this.groupId;
    }
    /**
     * @description 群ID
     */
    get groupId() {
        return this.contact.peer;
    }
    get contact() {
        return this.#contact;
    }
    get sender() {
        return this.#sender;
    }
    get subEvent() {
        return this.#subEvent;
    }
    get isPrivate() {
        return false;
    }
    get isFriend() {
        return false;
    }
    get isGroup() {
        return false;
    }
    get isGuild() {
        return false;
    }
    get isDirect() {
        return false;
    }
    get isGroupTemp() {
        return true;
    }
}
