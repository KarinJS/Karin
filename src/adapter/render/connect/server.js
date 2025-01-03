import { config } from '@/utils';
import { WebSocketRender } from './ws';
import { registerWSPath } from '@/core/service/server';
const { reverseWsToken } = config.server();
/**
 * @description WebSocket服务端渲染
 * @class WebSocketServerRenderer
 */
export class WebSocketServerRenderer extends WebSocketRender {
    /** 请求实例 */
    request;
    constructor(socket, request) {
        super(socket);
        this.request = request;
        const url = `ws://${request.headers.host}${request.url}`;
        if (reverseWsToken) {
            const token = request.headers['authorization'];
            if (!token || !this.auth(reverseWsToken, token)) {
                logger.error(`[WebSocket] 鉴权失败: token: ${token} url: ${url}`);
                this.socket.close();
                return;
            }
        }
        logger.info(`[WebSocket] 连接成功: url: ${url}`);
    }
}
registerWSPath('/puppeteer', WebSocketServerRenderer);
