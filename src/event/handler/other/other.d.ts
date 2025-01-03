import { getFriendCfg, getGroupCfg } from '@/utils/config';
import type { Notice, Request } from '@/types/event';
/**
 * @description 初始化提示信息
 * @param ctx 事件对象
 */
export declare const initTips: (ctx: Notice | Request) => void;
/**
 * @description 打印控制台日志
 * @param ctx 消息事件对象
 * @param type 事件类型
 * @param prefix 日志前缀
 * @param level 日志等级
 */
export declare const initPrint: (ctx: Notice | Request, type: string, prefix: string, level?: "info" | "debug") => void;
/**
 * @description 分发事件给插件处理
 * @param ctx 好友、群通知、请求事件
 * @param config 好友配置
 * @param filter 场景过滤器
 */
export declare const deal: (ctx: Notice | Request, config: ReturnType<typeof getFriendCfg> | ReturnType<typeof getGroupCfg>) => Promise<void>;
