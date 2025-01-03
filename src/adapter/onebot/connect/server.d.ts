import { WsAdapterOneBot11 } from './ws';
import type { WebSocket } from 'ws';
import type { IncomingMessage } from 'node:http';
export declare class AdapterServerOneBot11 extends WsAdapterOneBot11 {
    /** websocket实例 */
    socket: WebSocket;
    /** 请求实例 */
    request: IncomingMessage;
    constructor(socket: WebSocket, request: IncomingMessage);
    init(): Promise<void>;
    /**
     * @description 鉴权
     * @returns 返回`true`表示鉴权成功
     */
    private auth;
}
