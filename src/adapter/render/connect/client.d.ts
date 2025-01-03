import { WebSocketRender } from './ws';
/**
 * @description WebSocket客户端渲染
 * @class WebSocketServerRenderer
 */
export declare class WebSocketClientRenderer extends WebSocketRender {
}
/**
 * @description 创建puppeteer WebSocket客户端
 */
export declare const createWebSocketRenderClient: () => Promise<PromiseSettledResult<void>[]> | undefined;
