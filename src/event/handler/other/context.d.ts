import { Event, Message } from '@/types/event';
/** 上下文缓存 */
export declare const ctx: Map<string, Event>;
/**
 * 处理事件上下文
 * @param event 事件对象
 */
export declare const context: (event: Message) => boolean;
