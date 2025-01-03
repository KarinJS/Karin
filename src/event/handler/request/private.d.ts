import type { FriendRequestEventMap } from '@/types/event';
/**
 * @description 好友请求事件处理器
 * @param ctx 好友请求事件
 */
export declare const friendRequestHandler: (ctx: FriendRequestEventMap[keyof FriendRequestEventMap]) => Promise<void>;
