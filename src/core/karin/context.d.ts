import type { Event, Message } from '@/types/event';
/**
 * 上下文
 * @param e - 消息事件
 * @param options - 上下文选项
 * @returns 返回下文消息事件 如果超时则返回null
 */
export declare const ctx: <T = Message>(e: Event, options?: {
    /** 指定用户id触发下文 不指定则使用默认e.user_id */
    userId?: string;
    /** 超时时间 默认120秒 */
    time?: number;
    /** 超时后是否回复 */
    reply?: boolean;
    /** 超时回复文本 默认为'操作超时已取消' */
    replyMsg?: string;
}) => Promise<unknown>;
