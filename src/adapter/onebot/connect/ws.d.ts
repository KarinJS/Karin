import { AdapterOneBot } from '../core/base';
import { Params, Request } from '../types';
import type { WebSocket } from 'ws';
import type { AdapterCommunication } from '@/types/adapter';
export declare abstract class WsAdapterOneBot11 extends AdapterOneBot {
    /** 请求id */
    seq: number;
    /** WebSocket实例 */
    socket: WebSocket;
    constructor(socket: WebSocket);
    /**
     * 初始化
     * @param selfId 机器人ID
     * @param url WebSocket地址
     * @param communication 通讯方式
     */
    init(selfId: string, url: string, communication: AdapterCommunication): Promise<void>;
    private onEvent;
    /** 获取登录号信息 */
    private setAdapterInfo;
    /** 设置登录号详细信息 */
    private setBotInfo;
    sendApi<T extends keyof Params>(action: T | `${T}`, params: Params[T], time?: number): Promise<Request[T]>;
}
