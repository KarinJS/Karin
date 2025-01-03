import { createFile, createPkg } from '@/plugin/tools';
/**
 * 按钮
 * @param reg - 正则表达式
 * @param fnc - 函数
 */
export const button = (reg, fnc, options = {}) => {
    const rank = Number(options.rank ?? options.priority);
    return {
        fnc,
        reg: reg instanceof RegExp ? reg : new RegExp(reg),
        rank: isNaN(rank) ? 10000 : rank,
        file: createFile('button', options.name || 'button'),
        pkg: createPkg(),
        priority: rank ?? 10000,
    };
};
