import * as segment from './segment';
import type { CustomNodeElement, Elements, SendMessage } from '@/types/segment';
export { segment };
/**
 * 将消息元素转换为字符串
 * @param data 消息元素
 * @returns 消息字符串和原始字符串
 */
export declare const createRawMessage: (data: Elements[]) => {
    /** 原始消息字符串: `[at:10001]这是一条测试的文本消息` */
    raw: string;
    /**
     * - 经过处理的纯文本
     * - 可用于正则匹配
     * - tips: 此时还没有处理bot前缀
     */
    msg: string;
};
/**
 * 消息元素归一化 主要处理字符串文本
 * @param elements 消息
 */
export declare const makeMessage: (elements: SendMessage) => Array<Elements>;
/**
 * 制作简单转发，返回segment.node[]。仅简单包装node，也可以自己组装
 * @param elements
 * @param fakeId 转发用户的QQ号 必填
 * @param fakeName 转发用户显示的昵称 必填
 */
export declare const makeForward: (elements: SendMessage | Array<Elements[]>, fakeId?: string, fakeName?: string) => Array<CustomNodeElement>;
