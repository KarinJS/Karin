import type { SendMsgResults } from '../adapter';
import type { Elements, SendMessage } from '../segment';
/** 快速回复源函数 适配器实现 */
export type SrcReply = (
/** 发送的消息 */
elements: Elements[]) => Promise<SendMsgResults> | SendMsgResults;
/** 快速回复函数 */
export type Reply = (
/** 发送的消息 */
elements: SendMessage, 
/** 发送消息选项 */
options?: {
    /** 是否@发送者 */
    at?: boolean;
    /** 是否引用回复发送者 */
    reply?: boolean;
    /** 撤回消息时间 默认为0不撤回 */
    recallMsg?: number;
    /** 重试次数 默认为0 */
    retryCount?: number;
}) => Promise<SendMsgResults> | SendMsgResults;
