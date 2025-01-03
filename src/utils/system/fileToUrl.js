import { handler } from '@/service/handler';
/** fileToUrl Handler键 */
export const fileToUrlHandlerKey = 'fileToUrl';
/**
 * 文件转换为url
 */
export const fileToUrl = async (type, file, filename, args) => {
    if (!handler.has(fileToUrlHandlerKey))
        throw new Error('[Handler][Error]: 没有配置文件转换为url的处理器');
    return handler(fileToUrlHandlerKey, { file, type, filename, args });
};
