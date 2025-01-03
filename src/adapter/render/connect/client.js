import WebSocket from 'ws';
import crypto from 'node:crypto';
import { config } from '@/utils';
import { WebSocketRender } from './ws';
/**
 * @description WebSocket客户端渲染
 * @class WebSocketServerRenderer
 */
export class WebSocketClientRenderer extends WebSocketRender {
}
/**
 * @description 创建puppeteer WebSocket客户端
 */
export const createWebSocketRenderClient = () => {
    const { renderWs } = config.server();
    if (!renderWs || !Array.isArray(renderWs) || renderWs.length === 0) {
        logger.trace('[render][WebSocket] 未配置任何正向WebSocket 已跳过创建');
        return;
    }
    return Promise.allSettled(renderWs.map(async (item) => {
        const { url, token } = item;
        const headers = { Authorization: crypto.createHash('md5').update(`Bearer ${token}`).digest('hex') };
        const socket = new WebSocket(url, { headers });
        socket.once('open', async () => {
            logger.info(`[render][WebSocket] 连接成功: ${url}`);
            await new WebSocketClientRenderer(socket).init();
        });
    }));
};
