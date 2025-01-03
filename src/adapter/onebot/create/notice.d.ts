import { AdapterOneBot } from '../core/base';
import type { OB11Message, OB11Notice, OB11Request } from '../types/event';
/**
 * 创建通知事件
 * @param event onebot11通知事件
 * @param bot 标准api实例
 */
export declare const createNotice: (event: OB11Notice, bot: AdapterOneBot) => void;
/**
 * 创建请求事件
 * @param event onebot11请求事件
 * @param bot 标准api实例
 */
export declare const createRequest: (event: OB11Request, bot: AdapterOneBot) => void;
/**
 * 处理元事件
 * @param event 元事件
 * @param bot 标准api实例
 */
export declare const createMeta: (event: OB11Message, bot: AdapterOneBot) => void;
