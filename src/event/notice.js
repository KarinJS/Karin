import { BaseEvent } from './base';
/**
 * @description 通知事件基类
 * @class NoticeBase
 */
export class NoticeBase extends BaseEvent {
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
            event: 'notice',
        });
        this.#event = 'notice';
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
 * @description 收到点赞事件
 * @class ReceiveLikeNotice
 */
export class ReceiveLikeNotice extends NoticeBase {
    #subEvent;
    #contact;
    #sender;
    constructor(options) {
        super(Object.assign(options, { subEvent: 'receiveLike' }));
        this.#subEvent = 'receiveLike';
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
 * @description 好友增加事件
 * @class FriendIncreaseNotice
 */
export class FriendIncreaseNotice extends NoticeBase {
    #subEvent;
    #contact;
    #sender;
    constructor(options) {
        super(Object.assign(options, { subEvent: 'friendIncrease' }));
        this.#subEvent = 'friendIncrease';
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
 * @description 好友减少事件
 * @class FriendDecreaseNotice
 */
export class FriendDecreaseNotice extends NoticeBase {
    #subEvent;
    #contact;
    #sender;
    constructor(options) {
        super(Object.assign(options, { subEvent: 'friendDecrease' }));
        this.#subEvent = 'friendDecrease';
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
 * @description 收到私聊戳一戳事件
 * @class PrivatePokeNotice
 */
export class PrivatePokeNotice extends NoticeBase {
    #subEvent;
    #contact;
    #sender;
    constructor(options) {
        super(Object.assign(options, { subEvent: 'friendPoke' }));
        this.#subEvent = 'friendPoke';
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
 * @description 收到私聊撤回事件
 * @class PrivateRecallNotice
 */
export class PrivateRecallNotice extends NoticeBase {
    #subEvent;
    #contact;
    #sender;
    constructor(options) {
        super(Object.assign(options, { subEvent: 'friendRecall' }));
        this.#subEvent = 'friendRecall';
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
 * @description 收到私聊文件上传事件
 * @class PrivateFileUploadedNotice
 */
export class PrivateFileUploadedNotice extends NoticeBase {
    #subEvent;
    #contact;
    #sender;
    constructor(options) {
        super(Object.assign(options, { subEvent: 'friendFileUploaded' }));
        this.#subEvent = 'friendFileUploaded';
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
export class GroupNotice extends NoticeBase {
    /**
     * @deprecated 已经弃用 请使用`groupId`
     */
    get group_id() {
        return this.contact.peer;
    }
    get groupId() {
        return this.contact.peer;
    }
}
/**
 * @description 收到群聊戳一戳事件
 * @class GroupPokeNotice
 */
export class GroupPokeNotice extends GroupNotice {
    #subEvent;
    #contact;
    #sender;
    constructor(options) {
        super(Object.assign(options, { subEvent: 'groupPoke' }));
        this.#subEvent = 'groupPoke';
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
 * @description 收到群聊撤回事件
 * @class GroupRecallNotice
 */
export class GroupRecallNotice extends GroupNotice {
    #subEvent;
    #contact;
    #sender;
    constructor(options) {
        super(Object.assign(options, { subEvent: 'groupRecall' }));
        this.#subEvent = 'groupRecall';
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
 * @description 收到群聊文件上传事件
 * @class GroupFileUploadedNotice
 */
export class GroupFileUploadedNotice extends GroupNotice {
    #subEvent;
    #contact;
    #sender;
    constructor(options) {
        super(Object.assign(options, { subEvent: 'groupFileUploaded' }));
        this.#subEvent = 'groupFileUploaded';
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
 * @description 群名片变动事件
 * @class GroupCardChangedNotice
 */
export class GroupCardChangedNotice extends GroupNotice {
    #subEvent;
    #contact;
    #sender;
    constructor(options) {
        super(Object.assign(options, { subEvent: 'groupCardChanged' }));
        this.#subEvent = 'groupCardChanged';
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
 * @description 群成员头衔变动事件
 * @class GroupMemberTitleUpdatedNotice
 */
export class GroupMemberTitleUpdatedNotice extends GroupNotice {
    #subEvent;
    #contact;
    #sender;
    constructor(options) {
        super(Object.assign(options, { subEvent: 'groupMemberTitleUpdate' }));
        this.#subEvent = 'groupMemberTitleUpdate';
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
 * @description 群精华消息变动事件
 * @class GroupHlightsChangedNotice
 */
export class GroupHlightsChangedNotice extends GroupNotice {
    #subEvent;
    #contact;
    #sender;
    constructor(options) {
        super(Object.assign(options, { subEvent: 'groupHighlightsChange' }));
        this.#subEvent = 'groupHighlightsChange';
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
 * @description 群成员增加事件
 * @class GroupMemberIncreaseNotice
 */
export class GroupMemberIncreaseNotice extends GroupNotice {
    #subEvent;
    #contact;
    #sender;
    constructor(options) {
        super(Object.assign(options, { subEvent: 'groupMemberAdd' }));
        this.#subEvent = 'groupMemberAdd';
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
 * @description 群成员减少事件
 * @class GroupMemberDecreaseNotice
 */
export class GroupMemberDecreaseNotice extends GroupNotice {
    #subEvent;
    #contact;
    #sender;
    constructor(options) {
        super(Object.assign(options, { subEvent: 'groupMemberRemove' }));
        this.#subEvent = 'groupMemberRemove';
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
 * @description 群管理员变动事件
 * @class GroupAdminChangedNotice
 */
export class GroupAdminChangedNotice extends GroupNotice {
    #subEvent;
    #contact;
    #sender;
    constructor(options) {
        super(Object.assign(options, { subEvent: 'groupAdminChanged' }));
        this.#subEvent = 'groupAdminChanged';
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
 * @description 群打卡事件
 * @class GroupSignInNotice
 */
export class GroupSignInNotice extends GroupNotice {
    #subEvent;
    #contact;
    #sender;
    constructor(options) {
        super(Object.assign(options, { subEvent: 'groupSignIn' }));
        this.#subEvent = 'groupSignIn';
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
 * @description 群成员被禁言事件
 * @class GroupMemberBanNotice
 */
export class GroupMemberBanNotice extends GroupNotice {
    #subEvent;
    #contact;
    #sender;
    constructor(options) {
        super(Object.assign(options, { subEvent: 'groupMemberBan' }));
        this.#subEvent = 'groupMemberBan';
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
 * @description 群全员禁言事件
 * @class GroupWholeBanNotice
 */
export class GroupWholeBanNotice extends GroupNotice {
    #subEvent;
    #contact;
    #sender;
    constructor(options) {
        super(Object.assign(options, { subEvent: 'groupWholeBan' }));
        this.#subEvent = 'groupWholeBan';
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
 * @description 群表情动态事件
 * @class GroupMessageReactionNotice
 */
export class GroupMessageReactionNotice extends GroupNotice {
    #subEvent;
    #contact;
    #sender;
    constructor(options) {
        super(Object.assign(options, { subEvent: 'groupMessageReaction' }));
        this.#subEvent = 'groupMessageReaction';
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
 * @description 群聊运气王事件
 * @class GroupLuckKingNotice
 */
export class GroupLuckKingNotice extends GroupNotice {
    #subEvent;
    #contact;
    #sender;
    constructor(options) {
        super(Object.assign(options, { subEvent: 'groupLuckyKing' }));
        this.#subEvent = 'groupLuckyKing';
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
 * @description 群聊荣誉变更事件
 * @class GroupHonorChangedNotice
 */
export class GroupHonorChangedNotice extends GroupNotice {
    #subEvent;
    #contact;
    #sender;
    constructor(options) {
        super(Object.assign(options, { subEvent: 'groupHonorChange' }));
        this.#subEvent = 'groupHonorChange';
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
