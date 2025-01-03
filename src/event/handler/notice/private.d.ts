import type { FriendNoticeEventMap } from '@/types/event';
/**
 * @description 好友通知处理器
 * @param ctx 好友通知事件
 */
export declare const friendNoticeHandler: (ctx: FriendNoticeEventMap[keyof FriendNoticeEventMap]) => Promise<void>;
