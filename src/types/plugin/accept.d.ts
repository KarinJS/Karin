import { NoticeEventMap, RequestEventMap } from '../event';
import type { AdapterOptions, Log, PkgInfo, PluginFile } from './base';
/** 通知、请求事件联合类型 */
export type NoticeAndRequest = NoticeEventMap & RequestEventMap;
/** 通知、请求事件接收方法 */
export interface Accept<T extends keyof NoticeAndRequest = keyof NoticeAndRequest> extends AdapterOptions {
    /** 插件包基本属性 */
    pkg: PkgInfo;
    /** 插件方法基本属性 */
    file: PluginFile<'accept'>;
    /** 监听事件 */
    event: T;
    /** 优先级 */
    priority: number;
    /** 打印触发插件日志方法 */
    log: Log<true>;
    /** 插件方法 */
    fnc: (
    /** 事件 */
    e: NoticeAndRequest[T], 
    /** 调用后将继续匹配下一个插件 */
    next: () => unknown) => Promise<unknown> | unknown;
}
