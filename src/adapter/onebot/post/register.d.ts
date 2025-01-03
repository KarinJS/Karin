/**
 * @description 注册一个http post bot
 * @param selfId 机器人ID
 * @param token 鉴权token 用于校验请求是否合法
 */
export declare const registerHttpBot: (selfId: string, token?: string) => void;
/**
 * @description 卸载一个http post bot
 * @param selfId 机器人ID
 */
export declare const unregisterHttpBot: (selfId: string) => void;
/**
 * @description 获取鉴权token
 * @param selfId 机器人ID
 */
export declare const getHttpBotToken: (selfId: string) => {
    token: string;
    isAuth: true;
} | {
    token: null;
    isAuth: false;
} | undefined;
/**
 * @description 更新鉴权token
 * @param selfId 机器人ID
 * @param token 鉴权token
 */
export declare const updateHttpBotToken: (selfId: string, token?: string) => void;
