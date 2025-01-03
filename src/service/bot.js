import { segment } from '@/utils/message';
import { makeMessageLog } from '@/utils/common';
import { listeners } from '@/core/internal/listeners';
import { makeMessage } from '@/utils/common';
import { SEND_MSG } from '@/utils/fs/key';
let index = 0;
const list = [];
/**
 * 获取Bot
 * @param id 适配器索引 | 适配器协议实现 | 机器人ID
 * @param isProtocol 此项是为了区分传入的是BotID还是协议实现
 * @returns 适配器
 */
export const getBot = (id, isProtocol = false) => {
    try {
        if (typeof id === 'number') {
            return list.find(item => item.index === id)?.bot || null;
        }
        if (isProtocol) {
            return list.find(item => item.bot.adapter.protocol === id)?.bot || null;
        }
        return list.find(item => item.bot.selfId === id)?.bot || null;
    }
    catch {
        return null;
    }
};
/**
 * 获取所有Bot类 不包含索引
 * @returns Bot类列表
 */
export const getAllBot = () => {
    return list.map(item => item.bot);
};
/**
 * 获取所有Bot类 包含索引
 * @returns 注册的Bot列表
 */
export const getAllBotList = () => {
    return list;
};
/**
 * 获取所有BotID
 * @returns BotID列表
 */
export const getAllBotID = () => {
    return list.map(item => item.bot.selfId);
};
/**
 * 获取注册的Bot数量
 * @returns Bot数量
 */
export const getBotCount = () => {
    return list.length;
};
/**
 * 卸载Bot
 * @param type 卸载方式
 * @param idOrIndex 适配器索引 | 机器人ID
 * @param address 机器人地址
 */
export const unregisterBot = (type, idOrIndex, address) => {
    const findIndexAndRemove = (predicate) => {
        const index = list.findIndex(predicate);
        if (index !== -1) {
            const [removed] = list.splice(index, 1);
            logger.bot('info', removed.bot.selfId, `${logger.red('[service][卸载Bot]')} ${removed.bot.adapter.name}`);
            return true;
        }
        logger.bot('warn', '', `[service][卸载Bot] 未找到指定Bot: ${JSON.stringify({ type, idOrIndex, address })}`);
        return false;
    };
    if (type === 'index') {
        return findIndexAndRemove(item => item.index === idOrIndex);
    }
    if (type === 'selfId') {
        return findIndexAndRemove(({ bot }) => bot.selfId === idOrIndex);
    }
    if (type === 'address') {
        return findIndexAndRemove(({ bot }) => bot.selfId === idOrIndex && bot.adapter.address === address);
    }
    logger.bot('warn', '', `[service][卸载Bot] 未知的卸载方式: ${type}`);
    return false;
};
/**
 * 注册Bot
 * @param bot 适配器实例
 * @returns 适配器索引
 */
export const registerBot = (type, bot) => {
    const id = ++index;
    const tips = (str) => logger.green(`[注册Bot][${str}]`);
    if (type === 'webSocketClient') {
        logger.bot('info', bot.selfId, `${tips('正向webSocket')} ${bot.account.name}: ${bot.adapter.address}`);
    }
    else if (type === 'other') {
        bot.adapter.address = 'internal://127.0.0.1';
        logger.bot('info', bot.selfId, `${tips('internal')} ${bot.account.name}`);
    }
    else if (type === 'http') {
        logger.bot('info', bot.selfId, `${tips('HTTP')} ${bot.account.name}: ${bot.adapter.address}`);
    }
    else if (type === 'webSocketServer') {
        logger.bot('info', bot.selfId, `${tips('反向WebSocket')} ${bot.account.name}: ${bot.adapter.address}`);
    }
    else if (type === 'grpc') {
        logger.bot('info', bot.selfId, `${tips('gRPC')} ${bot.account.name}: ${bot.adapter.address}`);
    }
    list.push({ index: id, bot });
    /**
     * @description 重写转发消息方法 添加中间件
     */
    const sendForwardMsg = bot.sendForwardMsg;
    bot.sendForwardMsg = async (contact, elements, options) => {
        // TODO: 重写转发消息方法 添加中间件
        // /** 先调用中间件 */
        // if (await MiddlewareHandler(cache.middleware.forwardMsg, bot, contact, elements)) {
        //   return { messageId: '', forwardId: '' }
        // }
        return sendForwardMsg.call(bot, contact, elements, options);
    };
    setTimeout(async () => {
        const { level } = await import('@/service/db');
        const key = `karin:restart:${bot.selfId}`;
        const options = await level.has(key);
        if (!options)
            return;
        try {
            const { selfId, contact, messageId, time } = options;
            /** 重启花费时间 保留2位小数 */
            const restartTime = ((Date.now() - time) / 1000).toFixed(2);
            /** 超过2分钟不发 */
            if (Number(restartTime) > 120) {
                return false;
            }
            const element = [
                segment.reply(messageId),
                segment.text(`\n重启成功：${restartTime}秒`),
            ];
            await sendMsg(selfId, contact, element);
        }
        finally {
            await level.del(key);
        }
    }, 10);
    return id;
};
/**
 * 发送主动消息
 * @param uid Bot的uid
 * @param contact 目标信息
 * @param elements 消息内容
 * @param options 消息选项
 */
export const sendMsg = async (selfId, contact, elements, options = { recallMsg: 0, retryCount: 1, retry_count: 1 }) => {
    /** 结果 */
    let result = {};
    /** 标准化 */
    const NewElements = makeMessage(elements);
    /** 先调用中间件 */
    // TODO: 未完成 中间件
    // if (await MiddlewareHandler(cache.middleware.sendMsg, selfId, contact, NewElements)) {
    //   return result
    // }
    const bot = getBot(selfId);
    if (!bot)
        throw new Error('发送消息失败: 未找到对应Bot实例');
    const { recallMsg } = options;
    const retryCount = options.retryCount ?? options.retry_count ?? 1;
    const { raw } = makeMessageLog(NewElements);
    if (contact.scene === 'group') {
        logger.bot('info', selfId, `${logger.green('Send Proactive Group')} ${contact.peer}: ${raw}`);
    }
    else {
        logger.bot('info', selfId, `${logger.green('Send Proactive private')} ${contact.peer}: ${raw}`);
    }
    try {
        listeners.emit(SEND_MSG, contact);
        /** 取结果 */
        result = await bot.sendMsg(contact, NewElements, retryCount);
        logger.bot('debug', selfId, `主动消息结果:${JSON.stringify(result, null, 2)}`);
    }
    catch (error) {
        logger.bot('error', selfId, `主动消息发送失败:${raw}`);
        logger.error(error);
    }
    result.message_id = result.messageId;
    /** 快速撤回 */
    if (recallMsg && recallMsg > 0 && result?.messageId) {
        setTimeout(() => bot.recallMsg(contact, result.messageId), recallMsg * 1000);
    }
    return result;
};
