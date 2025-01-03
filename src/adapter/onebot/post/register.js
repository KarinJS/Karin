/** http post bot列表 */
const botList = new Map();
/**
 * @description 注册一个http post bot
 * @param selfId 机器人ID
 * @param token 鉴权token 用于校验请求是否合法
 */
export const registerHttpBot = (selfId, token) => {
    if (!token) {
        botList.set(selfId, { token: null, isAuth: false });
    }
    else {
        botList.set(selfId, { token, isAuth: true });
    }
    logger.debug(`[service][onebot-post][注册Bot] ${selfId}`);
};
/**
 * @description 卸载一个http post bot
 * @param selfId 机器人ID
 */
export const unregisterHttpBot = (selfId) => {
    botList.delete(selfId);
    logger.debug(`[service][onebot-post][卸载Bot] ${selfId}`);
};
/**
 * @description 获取鉴权token
 * @param selfId 机器人ID
 */
export const getHttpBotToken = (selfId) => {
    return botList.get(selfId);
};
/**
 * @description 更新鉴权token
 * @param selfId 机器人ID
 * @param token 鉴权token
 */
export const updateHttpBotToken = (selfId, token) => {
    const bot = botList.get(selfId);
    if (!bot)
        return;
    if (!token) {
        botList.set(selfId, { token: null, isAuth: false });
        return;
    }
    botList.set(selfId, { token, isAuth: true });
};
