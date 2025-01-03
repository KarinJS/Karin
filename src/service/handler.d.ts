import type { Event } from '@/types/event';
export interface HandlerType<T = any> {
    /**
     * 调用事件处理器
     * @param key - 事件键
     * @param args 自定义参数 如果传递e需要传递标准事件对象
     */
    (key: string, args: {
        [key: string]: any;
        e?: Event;
    }): Promise<T>;
    /**
     * 调用事件处理器
     * @param key - 事件键
     * @param args 自定义参数 如果传递e需要传递标准事件对象
     */
    call<K = any>(key: string, args: {
        [key: string]: any;
        e?: Event;
    }): Promise<K>;
    /**
     * 检查是否存在指定键的事件处理器
     * @param key 事件键
     */
    has(key: string): boolean;
}
/**
 * 事件处理器
 */
export declare const handler: HandlerType;
