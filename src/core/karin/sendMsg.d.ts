import type { Elements } from '@/types/segment';
type Message = string | Elements | Array<Elements>;
interface SendMsgOptions {
    /** 发送成功后撤回消息时间 */
    recallMsg?: number;
    /** @deprecated 已废弃 请使用 `retryCount` */
    retry_count?: number;
    /** 重试次数 */
    retryCount?: number;
}
interface SendMasterOptions extends SendMsgOptions {
    /** 是否必须为Bot对应的主人/管理员 默认false */
    mustMaster?: boolean;
}
interface SendAdminOptions extends SendMsgOptions {
    /** 是否必须为Bot对应的主人/管理员 默认false */
    mustAdmin?: boolean;
}
/**
 * 给主人发消息
 * @param selfId Bot的ID
 * @param targetId 主人ID
 * @param elements 消息内容
 * @param options 消息选项
 */
export declare const sendMaster: (selfId: string, targetId: string, elements: Message, options?: SendMasterOptions) => Promise<import("../../types/adapter").SendMsgResults>;
/**
 * 给管理员发消息
 * @param selfId Bot的ID
 * @param targetId 管理员ID
 * @param elements 消息内容
 * @param options 消息选项
 */
export declare const sendAdmin: (selfId: string, targetId: string, elements: Message, options?: SendAdminOptions) => Promise<import("../../types/adapter").SendMsgResults>;
export {};
