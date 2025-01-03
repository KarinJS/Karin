import { Contact } from '@/types/event';
/**
 * 重启Bot
 * @param selfId - 机器人的id 传e.self_id
 * @param contact - 事件联系人信息 也就是从哪来的这条消息 传e.contact即可
 * @param messageId - 消息id 传e.message_id
 * @param isFront - 是否为前台重启 默认是 不支持的环境会强制为pm2重启
 */
export declare const restart: (selfId: string, contact: Contact, messageId: string, isFront?: boolean) => Promise<{
    status: "success" | "failed";
    data: string | Error;
}>;
/**
 * 直接重启
 */
export declare const restartDirect: () => Promise<void>;
