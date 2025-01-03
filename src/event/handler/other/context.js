import { listeners } from '@/core/internal';
/** 上下文缓存 */
export const ctx = new Map();
/**
 * 处理事件上下文
 * @param event 事件对象
 */
export const context = (event) => {
    const key = event.contact.subPeer
        ? `${event.contact.peer}:${event.contact.subPeer}:${event.userId}`
        : `${event.contact.peer}:${event.userId}`;
    if (!ctx.has(key)) {
        return false;
    }
    listeners.emit(`ctx:${key}`, event);
    ctx.delete(key);
    return true;
};
