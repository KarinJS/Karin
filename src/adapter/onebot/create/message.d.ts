import type { AdapterOneBot } from '../core/base';
import type { OB11Message } from '../types/event';
/**
 * 创建消息事件
 * @param event onebot11消息事件
 * @param bot 标准api实例
 */
export declare const createMessage: (event: OB11Message, bot: AdapterOneBot) => void;
