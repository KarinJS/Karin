import { createFile, createLogger, createPkg } from '@/plugin/tools';
/**
 * accept
 * @param event 监听事件
 * @param fnc 实现函数
 */
export const accept = (event, fnc, options = {}) => {
    const dsbAdapter = options.dsbAdapter || options.notAdapter || [];
    const rank = Number(options.rank ?? options.priority);
    return {
        event,
        fnc,
        log: createLogger(options.log),
        adapter: Array.isArray(options.adapter) ? options.adapter : [],
        dsbAdapter: Array.isArray(dsbAdapter) ? dsbAdapter : [],
        file: createFile('accept', options.name || 'accept'),
        pkg: createPkg(),
        priority: rank ?? 10000,
    };
};
