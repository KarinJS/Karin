import { createFile, createLogger, createPkg } from '@/plugin/tools';
/**
 * 快速构建命令
 * @param reg 正则表达式
 * @param second 函数或者字符串或者KarinElement、KarinElement数组
 * @param options 选项
 * @returns 返回插件对象
 */
export const command = (reg, second, options = {}) => {
    reg = typeof reg === 'string' ? new RegExp(reg) : reg;
    /** 参数归一化 */
    const fnc = typeof second === 'function'
        ? second
        : async (e) => {
            const element = typeof second === 'number' ? String(second) : second;
            await e.reply(element, {
                at: ('at' in options && options.at) || false,
                reply: ('reply' in options && options.reply) || false,
                recallMsg: ('recallMsg' in options && Number(options.recallMsg)) || 0,
            });
            return !('stop' in options && !options.stop);
        };
    const dsbAdapter = options.dsbAdapter || options.notAdapter || [];
    const rank = Number(options.rank ?? options.priority);
    return {
        type: 'fnc',
        event: options.event || 'message',
        fnc,
        log: createLogger(options.log),
        permission: options.perm || options.permission || 'all',
        priority: isNaN(rank) ? 10000 : rank,
        reg,
        adapter: Array.isArray(options.adapter) ? options.adapter : [],
        dsbAdapter: Array.isArray(dsbAdapter) ? dsbAdapter : [],
        authFailMsg: options.authFailMsg || true,
        file: createFile('command', options.name || 'command'),
        pkg: createPkg(),
    };
};
