import type { Event } from '@/types/event';
import type { ButtonElement, KeyboardElement } from '@/types/segment';
/**
 * 调用按钮处理器
 * @param msg 传e.msg就行
 * @param e 消息事件 可不传
 * @param arg 自定义参数 可不传
 * @returns 返回按钮元素
 */
export declare const buttonHandle: (reg: string, args?: {
    e?: Event;
    [key: string]: any;
}) => Promise<(KeyboardElement | ButtonElement)[]>;
