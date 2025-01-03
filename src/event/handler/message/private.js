import lodash from 'lodash';
import { privateCD } from '../other/cd';
import { cache } from '@/plugin/cache';
import { listeners } from '@/core/internal';
import { context as CTX } from '../other/context';
import { config as cfg, getFriendCfg } from '@/utils/config';
import { log, initAlias, initEmit, initMsg, initRole, disableViaAdapter, privateFilterEvent, disableViaPluginWhitelist, disableViaPluginBlacklist, } from '../other/handler';
import { Permission } from '../other/permission';
/**
 * @description 好友消息处理器
 * @param ctx 好友消息事件
 */
export const friendHandler = async (ctx) => {
    /** 基本配置 */
    const config = cfg();
    /** 好友配置 */
    const friend = getFriendCfg(ctx.userId, ctx.selfId);
    initMsg(ctx);
    initRole(ctx, config);
    initAlias(ctx, friend.alias);
    initEmit(ctx);
    initPrint(ctx, 'friend', '好友消息');
    const context = CTX(ctx);
    if (context)
        return ctx;
    const filter = privateFilterEvent(ctx, config, friend, privateCD(friend, ctx.userId));
    // TODO: 中间件实现
    if (filter) {
        privateDeal(ctx, friend, (plugin) => {
            if (plugin.event !== 'message' && plugin.event !== 'message.friend')
                return false;
            /** 好友场景只有这三种权限 非这三种一律跳过 */
            if (!['all', 'master', 'admin'].includes(plugin.permission))
                return false;
            return true;
        });
    }
};
/**
 * @description 频道私信消息处理器
 * @param ctx 频道私信消息事件
 */
export const directHandler = async (ctx) => {
    /** 基本配置 */
    const config = cfg();
    /** 好友配置 */
    const friend = getFriendCfg(ctx.userId, ctx.selfId);
    initMsg(ctx);
    initRole(ctx, config);
    initAlias(ctx, friend.alias);
    initEmit(ctx);
    initPrint(ctx, 'direct', '频道私信');
    const context = CTX(ctx);
    if (context)
        return ctx;
    const cd = privateCD(friend, ctx.userId);
    const filter = privateFilterEvent(ctx, config, friend, cd);
    // TODO: 中间件实现
    if (filter) {
        privateDeal(ctx, friend, (plugin) => {
            if (plugin.event !== 'message' && plugin.event !== 'message.direct')
                return false;
            /** 频道私信场景只有这三种权限 非这三种一律跳过 */
            if (!['all', 'master', 'admin'].includes(plugin.permission))
                return false;
            return true;
        });
    }
};
/**
 * @description 打印控制台日志
 * @param ctx 消息事件对象
 * @param type 事件类型
 * @param prefix 日志前缀
 * @param level 日志等级
 */
const initPrint = (ctx, type, prefix, level = 'info') => {
    ctx.logText = `[${type}:${ctx.userId}(${ctx.sender.nick || ''})]`;
    logger.bot(level, ctx.selfId, `${prefix}: [${ctx.userId}(${ctx.sender.nick || ''})] ${ctx.rawMessage}`);
};
/**
 * @description 分发事件给插件处理
 * @param ctx 好友消息事件
 * @param config 好友配置
 * @param filter 场景过滤器
 */
const privateDeal = async (ctx, config, filter) => {
    for (const plugin of cache.command) {
        if (!filter(plugin))
            continue;
        const result = await privateCmd(ctx, plugin, config);
        if (!result)
            return;
    }
    /** 未找到匹配插件 */
    log(ctx.userId, `未找到匹配到相应插件: ${ctx.messageId}`);
    // TODO: 中间件实现
    // MiddlewareHandler(cache.middleware.notFoundMsg, this.event)
};
/**
 * @description 调用私聊场景消息插件
 * @param ctx 好友消息事件
 * @param plugin 插件缓存对象
 * @param config 好友配置
 */
const privateCmd = async (ctx, plugin, config) => {
    const reg = plugin.reg;
    if (reg && !reg.test(ctx.msg))
        return true;
    if (!disableViaAdapter(plugin, ctx.bot.adapter.protocol))
        return true;
    if (!disableViaPluginWhitelist(plugin, config))
        return true;
    if (!disableViaPluginBlacklist(plugin, config))
        return true;
    ctx.logFnc = `[${plugin.pkg.name}][${plugin.file.method}]`;
    const logFnc = logger.fnc(ctx.logFnc);
    plugin.log(ctx.selfId, `${logFnc}${ctx.logText} ${lodash.truncate(ctx.msg, { length: 100 })}`);
    /** 计算插件处理时间 */
    const start = Date.now();
    // filter.addEventCount(plugin, ctx.event)
    // TODO: 未实现中间件
    try {
        if (!Permission.private(ctx, plugin))
            return false;
        /** 是否继续匹配下一个插件 */
        let next = false;
        if (plugin.type === 'fnc') {
            const result = await plugin.fnc(ctx, () => { next = true; });
            if (next === false && result === false)
                next = true;
        }
        else {
            const App = new plugin.Cls();
            if (typeof App?.[plugin.file.method] !== 'function') {
                return true;
            }
            App.e = ctx;
            App.next = () => { next = true; };
            const result = await App[plugin.file.method](App.e);
            if (next === false && result === false)
                next = true;
        }
        /** 贪婪匹配下一个 */
        if (next === true) {
            logger.debug(`${ctx.logFnc} 继续匹配下一个插件`);
            return true;
        }
        return false;
    }
    catch (cause) {
        listeners.emit('error', new Error(ctx.logFnc));
        return false;
    }
    finally {
        const time = logger.green(Date.now() - start + 'ms');
        const msg = lodash.truncate(ctx.msg, { length: 100 });
        plugin.log(ctx.selfId, `${logFnc} ${msg} 处理完成 ${time}`);
    }
};
