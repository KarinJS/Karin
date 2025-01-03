import { AdapterOneBot } from '../core/base';
import { Params, Request } from '../types';
export declare class HttpAdapterOneBot11 extends AdapterOneBot {
    #private;
    constructor(selfId: string, api: string, token?: string);
    init(): Promise<void>;
    /** 第一次请求 */
    private firstRequest;
    /** 获取登录号信息 */
    private setAdapterInfo;
    /** 设置登录号详细信息 */
    private setBotInfo;
    sendApi<T extends keyof Params>(action: T | `${T}`, params: Params[T], time?: number): Promise<Request[T]>;
}
export declare const createHttp: () => Promise<void>;
