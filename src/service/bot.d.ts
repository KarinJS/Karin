import type { SendMsgResults } from '@/types/adapter';
import type { Contact } from '@/types/event';
import type { AdapterBase } from '@/adapter/base';
import type { Elements } from '@/types/segment';
import type { AdapterCommunication, AdapterProtocol, AdapterType } from '@/types/adapter';
export type GetBot = {
    /**
     * 获取指定Bot类
     * @param index 适配器索引
     */
    (index: number): AdapterType | null;
    /**
     * 获取指定Bot类
     * @param protocol 适配器协议实现
     * @param isProtocol 此项是为了区分传入的是BotID还是协议实现
     */
    (protocol: AdapterProtocol, isProtocol: boolean): AdapterType | null;
    /**
     * 获取指定Bot类
     * @param botID 机器人ID
     */
    (botID: string): AdapterType | null;
};
export type UnregisterBot = {
    /**
     * @description 通过索引ID卸载Bot
     * @param index 适配器索引
     */
    (type: 'index', index: number): boolean;
    /**
     * @description 通过BotID卸载Bot
     * @param selfId 机器人ID
     */
    (type: 'selfId', selfId: string): boolean;
    /**
     * @description 通过BotID和地址卸载Bot
     * @param type 卸载类型
     * @param selfId 机器人ID
     * @param address 机器人地址
     */
    (type: 'address', selfId: string, address: string): boolean;
};
/**
 * 获取Bot
 * @param id 适配器索引 | 适配器协议实现 | 机器人ID
 * @param isProtocol 此项是为了区分传入的是BotID还是协议实现
 * @returns 适配器
 */
export declare const getBot: GetBot;
/**
 * 获取所有Bot类 不包含索引
 * @returns Bot类列表
 */
export declare const getAllBot: () => AdapterType[];
/**
 * 获取所有Bot类 包含索引
 * @returns 注册的Bot列表
 */
export declare const getAllBotList: () => {
    index: number;
    bot: AdapterType;
}[];
/**
 * 获取所有BotID
 * @returns BotID列表
 */
export declare const getAllBotID: () => string[];
/**
 * 获取注册的Bot数量
 * @returns Bot数量
 */
export declare const getBotCount: () => number;
/**
 * 卸载Bot
 * @param type 卸载方式
 * @param idOrIndex 适配器索引 | 机器人ID
 * @param address 机器人地址
 */
export declare const unregisterBot: UnregisterBot;
/**
 * 注册Bot
 * @param bot 适配器实例
 * @returns 适配器索引
 */
export declare const registerBot: (type: AdapterCommunication, bot: AdapterBase) => number;
type Message = string | Elements | Array<Elements>;
interface SendMsgOptions {
    /** 发送成功后撤回消息时间 */
    recallMsg?: number;
    /** @deprecated 已废弃 请使用 `retryCount` */
    retry_count?: number;
    /** 重试次数 */
    retryCount?: number;
}
/**
 * 发送主动消息
 * @param uid Bot的uid
 * @param contact 目标信息
 * @param elements 消息内容
 * @param options 消息选项
 */
export declare const sendMsg: (selfId: string, contact: Contact, elements: Message, options?: SendMsgOptions) => Promise<SendMsgResults>;
export {};
