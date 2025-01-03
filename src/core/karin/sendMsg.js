import { sendMsg } from '../service';
import { master, admin } from '@/utils/config';
/**
 * 给主人发消息
 * @param selfId Bot的ID
 * @param targetId 主人ID
 * @param elements 消息内容
 * @param options 消息选项
 */
export const sendMaster = async (selfId, targetId, elements, options = { recallMsg: 0, retryCount: 1, mustMaster: false }) => {
    /** 检查目标是否为主人 */
    const mustMaster = options?.mustMaster ?? false;
    const lsit = master();
    if (mustMaster) {
        if (!lsit.includes(`${selfId}@${targetId}`)) {
            throw new Error('发送消息失败: 目标不是Bot的专属主人');
        }
    }
    else {
        if (!lsit.includes(targetId)) {
            throw new Error('发送消息失败: 目标不是主人');
        }
    }
    const contact = { peer: targetId, scene: 'friend' };
    return sendMsg(selfId, contact, elements, options);
};
/**
 * 给管理员发消息
 * @param selfId Bot的ID
 * @param targetId 管理员ID
 * @param elements 消息内容
 * @param options 消息选项
 */
export const sendAdmin = async (selfId, targetId, elements, options = { recallMsg: 0, retryCount: 1, mustAdmin: false }) => {
    /** 检查目标是否为管理员 */
    const mustAdmin = options?.mustAdmin ?? false;
    const lsit = admin();
    if (mustAdmin) {
        if (!lsit.includes(`${selfId}@${targetId}`)) {
            throw new Error('发送消息失败: 目标不是Bot的专属管理员');
        }
    }
    else {
        if (!lsit.includes(targetId)) {
            throw new Error('发送消息失败: 目标不是管理员');
        }
    }
    const contact = { peer: targetId, scene: 'friend' };
    return sendMsg(selfId, contact, elements, options);
};
