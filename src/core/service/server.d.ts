import { WebSocketServer } from 'ws';
import type { WebSocket } from 'ws';
import type { IncomingMessage } from 'http';
type Request = new (socket: WebSocket, request: IncomingMessage) => any;
/**
 * @description 注册一个ws路由
 * @param path ws路由
 * @param cls ws类
 */
export declare const registerWSPath: (path: string, cls: Request) => void;
/**
 * @description 注册一个http post bot
 * @param selfId 机器人ID
 * @param token 鉴权token 用于校验请求是否合法
 */
export declare const registerHttpBot: (selfId: string, token?: string) => void;
/**
 * @description 卸载一个http post bot
 * @param selfId 机器人ID
 */
export declare const unregisterHttpBot: (selfId: string) => void;
/**
 * @description 获取鉴权token
 * @param selfId 机器人ID
 */
export declare const getHttpBotToken: (selfId: string) => {
    token: string;
    isAuth: true;
} | {
    token: null;
    isAuth: false;
} | undefined;
/**
 * @description 更新鉴权token
 * @param selfId 机器人ID
 * @param token 鉴权token
 */
export declare const updateHttpBotToken: (selfId: string, token?: string) => void;
/**
 * @description 创建 WebSocket 服务
 * @param app express 服务
 */
export declare const createWebSocketServer: (wss: WebSocketServer) => WebSocketServer;
export {};
