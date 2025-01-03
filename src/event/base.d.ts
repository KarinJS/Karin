import type { AdapterType } from '@/types/adapter';
import type { BaseEventOptions, Contact, EventParent, EventToSubEvent, Reply, Sender, SrcReply } from '@/types/event';
/** 事件实现基类 */
export declare abstract class BaseEvent<T extends EventParent> {
    #private;
    /** 快速回复 */
    reply: Reply;
    /** 存储器 由开发者自行调用 */
    store: Map<any, any>;
    /** 日志函数字符串 */
    logFnc: string;
    /** 日志用户字符串 */
    logText: string;
    /** 是否为主人 */
    isMaster: boolean;
    /** 是否为Bot管理员 */
    isAdmin: boolean;
    constructor({ event, subEvent, eventId, rawEvent, time, contact, sender, srcReply, bot, }: BaseEventOptions<T>);
    /**
     * @description 机器人ID
     * @deprecated 即将废弃，请使用 `selfId`
     */
    get self_id(): string;
    /**
     * @description 用户ID
     * @deprecated 即将废弃，请使用 `userId`
     */
    get user_id(): string;
    /** 机器人自身ID */
    get selfId(): string;
    /** 用户ID */
    get userId(): string;
    /** 事件父类型 */
    get event(): T;
    /** 事件子类型 */
    get subEvent(): EventToSubEvent[T];
    /** 事件ID */
    get eventId(): string;
    /** 原始事件 */
    get rawEvent(): unknown;
    /** 事件触发时间戳 */
    get time(): number;
    /** 事件来源信息 */
    get contact(): Contact;
    /** 事件发送者信息 */
    get sender(): Sender;
    /** 快速回复源函数 */
    get srcReply(): SrcReply;
    /** 机器人实例 */
    get bot(): AdapterType;
    /**
     * 是否为私聊场景
     * - 在好友场景下为 `true`
     * - 在频道私信场景下为 `true`
     */
    get isPrivate(): boolean;
    /** 是否为好友场景 */
    get isFriend(): boolean;
    /** 是否为群聊场景 */
    get isGroup(): boolean;
    /** 是否为频道场景 */
    get isGuild(): boolean;
    /** 是否为群临时会话场景 */
    get isGroupTemp(): boolean;
    /** 是否为频道私信场景 */
    get isDirect(): boolean;
}
