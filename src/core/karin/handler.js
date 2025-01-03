import { createFile, createPkg } from '@/plugin/tools';
/**
 * - 构建handler
 * @param key - 事件key
 * @param fnc - 函数实现
 * @param options - 选项
 */
export const handler = (key, fnc, options = {}) => {
    if (!key)
        throw new Error('[handler]: 缺少参数[key]');
    if (!fnc)
        throw new Error('[handler]: 缺少参数[fnc]');
    return {
        key,
        fnc,
        priority: Number(options.rank ?? options.priority) || 10000,
        file: createFile('handler', options.name || 'handler'),
        pkg: createPkg(),
    };
};
