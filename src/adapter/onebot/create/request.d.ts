import type { AdapterOneBot } from '../core/base';
import { type OB11Request } from '../types/event';
/**
 * 创建请求事件
 * @param event onebot11请求事件
 * @param bot 标准api实例
 */
export declare const createRequest: (event: OB11Request, bot: AdapterOneBot) => void;
