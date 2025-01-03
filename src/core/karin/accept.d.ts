import type { Options } from './base';
import type { Accept, NoticeAndRequest } from '@/types/plugin';
export interface AcceptOptions extends Options {
}
/**
 * accept
 * @param event 监听事件
 * @param fnc 实现函数
 */
export declare const accept: <T extends keyof NoticeAndRequest>(event: T, fnc: (e: NoticeAndRequest[T], next: () => unknown) => Promise<unknown> | unknown, options?: AcceptOptions) => Accept<T>;
