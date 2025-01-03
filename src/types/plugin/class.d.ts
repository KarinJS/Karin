import type { AdapterProtocol } from '../adapter';
import type { Message, MessageEventMap, Permission } from '../event';
import { NodeElement } from '../segment';
export interface PluginRule {
    /** 命令正则 */
    reg: string | RegExp;
    /** 命令执行方法名称 */
    fnc: string;
    /** 监听子事件 */
    event?: keyof Omit<MessageEventMap, 'message'>;
    /** 优先级 默认为10000 */
    priority?: number;
    /** 插件触发权限 例如只有主人才可触发 */
    permission?: Permission;
    /** 打印日志 默认为true */
    log?: boolean;
    /** 生效的适配器 */
    adapter?: AdapterProtocol[];
    /** 禁用的适配器 */
    dsbAdapter?: AdapterProtocol[];
    /**
    * 如果无权触发插件 是否打印日志
    * - `true`: `暂无权限，只有主人才能操作`
    * - `false`: ``
    * - `string`: `自定义提示`
    */
    authFailMsg: boolean | string;
}
export interface PluginOptions<T extends keyof MessageEventMap> {
    /** 插件名称 */
    name: string;
    /** 插件描述 */
    desc?: string;
    /** 插件事件 */
    event?: T;
    /** 优先级 */
    priority?: number;
    /** 指令规则 */
    rule: PluginRule[];
}
/** 消息事件插件类 */
export declare class Plugin<T extends keyof MessageEventMap = keyof MessageEventMap> {
    /** 插件名称 */
    name: PluginOptions<T>['name'];
    /** 指令规则集 */
    rule: PluginOptions<T>['rule'];
    /** 插件描述 */
    desc: PluginOptions<T>['desc'];
    /** 插件事件 */
    event: T;
    /** 优先级 */
    priority: PluginOptions<T>['priority'];
    /** 消息事件对象 */
    e: T extends keyof MessageEventMap ? MessageEventMap[T] : Message;
    /** 调用后将继续匹配下一个插件 */
    next: () => unknown;
    /** 快速回复 */
    reply: Message['reply'];
    constructor(options: PluginOptions<T> & {
        event?: T;
    });
    /**
     * 快速回复合并转发
     * @param element 合并转发消息元素节点
     */
    replyForward(element: NodeElement[]): Promise<{
        /** @deprecated 已废弃 请请使用 messageId */
        message_id: string;
        messageId: string;
    }>;
}
