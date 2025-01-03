import type { WebSocket } from 'ws';
import type { Options, RenderResult } from '../admin/types';
export declare abstract class WebSocketRender {
    /** websocket实例 */
    socket: WebSocket;
    /** 唯一标识符 */
    echo: number;
    /** 索引 */
    index: number;
    constructor(socket: WebSocket);
    init(): Promise<void>;
    /**
     * @description 鉴权
     * @param token
     * @param targetToken 目标的token
     * @returns 是否鉴权成功
     */
    auth(token: string, targetToken: string): boolean;
    /**
     * @description 处理静态资源请求
     * @param echo 唯一标识符
     * @param data 数据
     */
    static(echo: string, data: {
        file: string;
        type: string;
        url: string;
    }): Promise<void>;
    render<T extends Options>(data: T): Promise<RenderResult<T>>;
    sendApi(action: 'render' | 'close', data: object): Promise<any>;
}
