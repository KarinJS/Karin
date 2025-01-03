import { EventEmitter } from 'events';
import type { MessageEventMap, NoticeEventMap, RequestEventMap } from '@/types/event';
/** 事件字典 */
export type EventMap<T extends keyof MessageEventMap = keyof MessageEventMap, U extends keyof NoticeEventMap = keyof NoticeEventMap, V extends keyof RequestEventMap = keyof RequestEventMap> = {
    [key in T]: (event: MessageEventMap[key]) => void;
} & {
    [key in U]: (event: NoticeEventMap[key]) => void;
} & {
    [key in V]: (event: RequestEventMap[key]) => void;
} & Record<string, any>;
/** 类型化事件监听器 */
export declare class TypedListeners extends EventEmitter {
    /**
     * 注册事件监听器
     * @param event 事件名称
     * @param listener 监听器函数
     */
    on<T extends keyof EventMap>(event: T, listener: EventMap[T]): this;
    /**
     * 注册一次性事件监听器
     * @param event 事件名称
     * @param listener 监听器函数
     */
    once<T extends keyof EventMap>(event: T, listener: EventMap[T]): this;
    /**
     * 移除事件监听器
     * @param event 事件名称
     * @param listener 监听器函数
     */
    off<T extends keyof EventMap>(event: T, listener: EventMap[T]): this;
    /**
     * 触发事件
     * @param event 事件名称
     * @param args 事件参数
     */
    emit<T extends keyof EventMap>(event: T, ...args: Parameters<EventMap[T]>): boolean;
    /**
     * 获取事件监听器列表
     * @param event 事件名称
     */
    listeners<T extends keyof EventMap>(event: T): EventMap[T][];
    /**
     * 移除所有事件监听器
     * @param event 事件名称
     * @returns this
     */
    removeAllListeners<T extends keyof EventMap>(event?: T): this;
    /**
     * 设置最大监听器数量
     * @param n 最大监听器数量
     * @returns this
     */
    setMaxListeners(n: number): this;
    /**
     * 获取最大监听器数量
     * @returns 最大监听器数量
     */
    getMaxListeners(): number;
    /**
     * 添加事件监听器
     * @param event 事件名称
     * @param listener 监听器函数
     */
    addListener<T extends keyof EventMap>(event: T, listener: EventMap[T]): this;
    /**
     * 获取事件监听器数量
     * @param event 事件名称
     * @returns 监听器数量
     */
    listenerCount<T extends keyof EventMap>(event: T): number;
    /**
     * 返回已注册的事件名称数组
     * @param event 事件名称
     * @returns 监听器数量
     */
    eventNames<T extends keyof EventMap>(): T[];
    /**
     * 返回指定事件的原始监听器数组（包括一次性监听器）
     * @param event 事件名称
     * @returns 监听器数量
     */
    rawListeners<T extends keyof EventMap>(event: T): Function[];
    /**
     * 为指定事件添加监听器，但将其添加到监听器数组的开头
     * @param event 事件名称
     * @returns 监听器数量
     */
    prependListener<T extends keyof EventMap>(event: T, listener: EventMap[T]): this;
    /**
     *  为指定事件添加一次性监听器，并将其添加到监听器数组的开头
     * @param event 事件名称
     * @returns 监听器数量
     */
    prependOnceListener<T extends keyof EventMap>(event: T, listener: EventMap[T]): this;
    /**
     * 移除事件监听器
     * @param event 事件名称
     * @param listener 监听器函数
     */
    removeListener<T extends keyof EventMap>(event: T, listener: EventMap[T]): this;
}
/**
 * @internal
 * @description 内部事件监听器
 */
export declare const listeners: TypedListeners;
