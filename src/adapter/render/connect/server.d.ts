import { WebSocketRender } from './ws';
import type { WebSocket } from 'ws';
import type { IncomingMessage } from 'node:http';
/**
 * @description WebSocket服务端渲染
 * @class WebSocketServerRenderer
 */
export declare class WebSocketServerRenderer extends WebSocketRender {
    /** 请求实例 */
    request: IncomingMessage;
    constructor(socket: WebSocket, request: IncomingMessage);
}
