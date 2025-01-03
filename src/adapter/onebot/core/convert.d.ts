import type { OB11Segment } from '../types';
import type { AdapterOneBot } from './base';
import { Elements, SendElement } from '@/types/segment';
/**
 * 构建错误信息
 * @param selfId 机器人ID
 * @param action 请求的action
 * @param request 请求的参数
 * @param error 错误信息
 */
export declare const buildError: (selfId: string, action: string, request: string, error?: unknown) => Error | undefined;
/**
   * onebot11转karin
   * @return karin格式消息
   */
export declare function AdapterConvertKarin(data: Array<OB11Segment>): Array<Elements>;
/**
 * 处理非本地ws的文件
 * @param file 文件路径
 */
export declare const fileToBase64: (file: string, url: string) => string;
/**
   * karin转onebot11
   * @param data karin格式消息
   */
export declare const KarinConvertAdapter: (data: Array<SendElement>, onebot: AdapterOneBot) => Array<OB11Segment>;
