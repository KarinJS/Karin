import { AdapterBase } from '../base';
import type { AdapterType, SendMsgResults } from '@/types/adapter';
import type { Contact } from '@/types/event';
import type { Elements } from '@/types/segment';
/**
 * 控制台交互适配器
 * @class AdapterConsole
 */
export declare class AdapterConsole extends AdapterBase implements AdapterType {
    constructor();
    get selfId(): string;
    createEvent(data: Buffer): void;
    sendMsg(contact: Contact, elements: Array<Elements>, retryCount?: number): Promise<SendMsgResults>;
    getUrl(data: string | Buffer, ext: string): Promise<string>;
}
