import { listeners } from '../internal';
import { ctx as context } from '@/event/handler/other/context';
/**
 * 上下文
 * @param e - 消息事件
 * @param options - 上下文选项
 * @returns 返回下文消息事件 如果超时则返回null
 */
export const ctx = async (e, options) => {
    const time = options?.time || 120;
    const userId = options?.userId || e.userId || e.user_id;
    const key = e.contact.subPeer ? `${e.contact.peer}:${e.contact.subPeer}:${userId}` : `${e.contact.peer}:${userId}`;
    context.set(key, e);
    return new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
            const data = context.get(key);
            if (data?.eventId === e.eventId) {
                context.delete(key);
                if (options?.reply)
                    e.reply(options.replyMsg || '操作超时已取消');
                /** 移除监听器 */
                listeners.removeAllListeners(`ctx:${key}`);
                reject(new Error(`接收下文事件超时，已取消下文监听: ${key}`));
                return true;
            }
        }, time * 1000);
        listeners.once(`ctx:${key}`, (e) => {
            clearTimeout(timeout);
            resolve(e);
        });
    });
};
