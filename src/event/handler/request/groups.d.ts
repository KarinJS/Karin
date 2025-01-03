import type { GroupRequestEventMap } from '@/types/event';
/**
 * @description 群请求事件处理器
 * @param ctx 群请求事件
 */
export declare const groupRequestHandler: (ctx: GroupRequestEventMap[keyof GroupRequestEventMap]) => Promise<void>;
