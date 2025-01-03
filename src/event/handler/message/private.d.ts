import type { DirectMessage, FriendMessage } from '../../message';
/**
 * @description 好友消息处理器
 * @param ctx 好友消息事件
 */
export declare const friendHandler: (ctx: FriendMessage) => Promise<FriendMessage | undefined>;
/**
 * @description 频道私信消息处理器
 * @param ctx 频道私信消息事件
 */
export declare const directHandler: (ctx: DirectMessage) => Promise<DirectMessage | undefined>;
