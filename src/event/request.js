import { BaseEvent } from './base';
/**
 * @description 请求事件基类
 * @class RequestBase
 */
export class RequestBase extends BaseEvent {
    #event;
    #subEvent;
    /** 通知内容str */
    tips;
    /** 事件内容 */
    content;
    constructor({ subEvent, eventId, rawEvent, time, contact, sender, srcReply, bot, }) {
        super({
            subEvent,
            eventId,
            rawEvent,
            time,
            contact,
            sender,
            srcReply,
            bot,
            event: 'request',
        });
        this.#event = 'request';
        this.#subEvent = subEvent;
        this.tips = '';
    }
    get event() {
        return this.#event;
    }
    get subEvent() {
        return this.#subEvent;
    }
}
/**
 * @description 创建好友申请请求事件
 * @class ReceiveLikeNotice
 */
export class PrivateApplyRequest extends RequestBase {
    #subEvent;
    #contact;
    #sender;
    constructor(options) {
        super(Object.assign(options, { subEvent: 'friendApply' }));
        this.#subEvent = 'friendApply';
        this.#contact = options.contact;
        this.#sender = options.sender;
    }
    get subEvent() {
        return this.#subEvent;
    }
    get contact() {
        return this.#contact;
    }
    get sender() {
        return this.#sender;
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
 * @description 创建入群请求事件
 * @class ReceiveLikeNotice
 */
export class GroupApplyRequest extends RequestBase {
    #subEvent;
    #contact;
    #sender;
    constructor(options) {
        super(Object.assign(options, { subEvent: 'groupApply' }));
        this.#subEvent = 'groupApply';
        this.#contact = options.contact;
        this.#sender = options.sender;
    }
    /**
     * @deprecated 已经弃用 请使用`groupId`
     */
    get group_id() {
        return this.contact.peer;
    }
    get groupId() {
        return this.contact.peer;
    }
    get subEvent() {
        return this.#subEvent;
    }
    get contact() {
        return this.#contact;
    }
    get sender() {
        return this.#sender;
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
 * @description 创建邀请Bot入群请求事件
 * @class GroupInviteRequest
 */
export class GroupInviteRequest extends RequestBase {
    #subEvent;
    #contact;
    #sender;
    constructor(options) {
        super(Object.assign(options, { subEvent: 'groupInvite' }));
        this.#subEvent = 'groupInvite';
        this.#contact = options.contact;
        this.#sender = options.sender;
    }
    /**
     * @deprecated 已经弃用 请使用`groupId`
     */
    get group_id() {
        return this.contact.peer;
    }
    get groupId() {
        return this.contact.peer;
    }
    get subEvent() {
        return this.#subEvent;
    }
    get contact() {
        return this.#contact;
    }
    get sender() {
        return this.#sender;
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
