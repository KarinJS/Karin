import type { GroupNoticeEventMap } from '@/types/event';
/**
 * @description 群通知处理器
 * @param ctx 群通知事件
 */
export declare const groupNoticeHandler: (ctx: GroupNoticeEventMap[keyof GroupNoticeEventMap]) => Promise<void>;
