import util from 'node:util';
import { cache } from '@/plugin/cache';
/**
 * 调用事件处理器
 * @param key 事件键
 * @param args 自定义参数 一般用来传递e之类的
 */
const call = async (key, args) => {
    let result;
    for (const info of cache.handler[key] || []) {
        try {
            let done = true;
            /**
             * 拒绝处理器 调用后则不再继续执行下一个处理器
             * @param msg 错误信息
             */
            const next = () => { done = false; };
            const res = info.fnc(args, next);
            result = util.types.isPromise(res) ? await res : res;
            if (done) {
                logger.mark(`[Handler][Done]: [${info.pkg.name}][${info.file.method}][${key}]`);
                return result;
            }
        }
        catch (error) {
            logger.error(`[Handler][Error]: [${info.pkg.name}][${info.file.method}][${key}]`);
            logger.error(error);
        }
    }
    return result;
};
/**
 * 检查是否存在指定键的事件处理器
 */
const has = (key) => !!cache.handler[key];
/**
 * 事件处理器
 */
export const handler = Object.assign(call, { call, has });
