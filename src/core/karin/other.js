import { EventEmitter } from 'events';
import { getAllBot, getAllBotList, getBot, getBotCount } from '@/core/service';
class Other extends EventEmitter {
    /** 框架名称 */
    name = 'karin';
    /**
     * 构建contact
     * @param scene 场景
     * @param peer 群号或者用户id
     * @param subPeer 子id
     */
    contact(scene, peer, subPeer, name) {
        if (scene === 'guild' || scene === 'direct' || scene === 'groupTemp') {
            return { scene, peer, subPeer, name };
        }
        else {
            return { scene, peer, subPeer: undefined, name };
        }
    }
    /**
     * 构建群contact
     * @param peer - 群号
     * @param name - 群名
     */
    contactGroup(peer, name) {
        return { scene: 'group', peer, subPeer: undefined, name: name || '' };
    }
    /**
     * 构建好友contact
     * @param peer - 用户id
     * @param name - 昵称
     */
    contactFriend(peer, name) {
        return { scene: 'friend', peer, subPeer: undefined, name: name || '' };
    }
    /**
     * 构建频道contact
     * @param peer - 频道id
     * @param subPeer - 子频道id
     * @param name - 频道名称
     * @param subName - 子频道名称
     * @returns 频道contact
     */
    contactGuild(peer, subPeer, name, subName) {
        return { scene: 'guild', peer, subPeer, name: name || '', subName: subName || '' };
    }
    /**
     * 构建临时群会话contact
     * @param peer - 群号
     * @param subPeer - 子id
     * @param name - 群名
     */
    contactGroupTemp(peer, subPeer, name) {
        return { scene: 'groupTemp', peer, subPeer, name: name || '' };
    }
    /**
     * 构建消息事件私聊发送者信息
     * @param userId 发送者ID
     * @param nick 昵称
     * @param sex 性别
     * @param age 年龄
     * @param uid 隐藏字段 uid
     * @param uin 隐藏字段 uin
     */
    friendSender(userId, nick, sex = 'unknown', age, uid, uin) {
        return { userId: String(userId), nick, sex, age, uid, uin, name: nick };
    }
    /**
     * 构建消息事件群聊发送者信息
     * @param userId 发送者ID
     * @param nick 昵称
     * @param role 角色
     * @param sex 性别
     * @param age 年龄
     * @param card 群名片/备注
     * @param area 地区
     * @param level 成员等级
     * @param title 专属头衔
     * @param uid 隐藏字段 uid
     * @param uin 隐藏字段 uin
     */
    groupSender(
    /** 发送者QQ号 */
    userId, 
    /** 发送者在群的角色身份 非群、频道场景为`unknown` */
    role, 
    /** 发送者昵称 */
    nick, 
    /** 发送者性别 */
    sex, 
    /** 发送者年龄 */
    age, 
    /** 群名片/备注 */
    card, 
    /** 地区 */
    area, 
    /** 成员等级 */
    level, 
    /** 专属头衔 */
    title, 
    /** 发送者uid */
    uid, 
    /** 发送者uin */
    uin) {
        return {
            userId: String(userId),
            role: role || 'unknown',
            nick: nick || '',
            sex,
            age,
            card,
            area,
            level,
            title,
            uid,
            uin,
            name: nick || '',
        };
    }
    /**
     * 根据索引获取Bot
     * @param index - Bot的索引id
     */
    getBotByIndex(index) {
        return getBot(index);
    }
    /**
     * 获取注册的Bot数量
     * @returns Bot数量
     */
    getBotCount() {
        return getBotCount();
    }
    /**
     * 获取所有Bot列表
     * @param isIndex - 是否返回包含的索引列表 默认`false` 返回Bot列表
     */
    getBotAll(isIndex) {
        if (isIndex)
            return getAllBotList();
        return getAllBot().map((item) => item);
    }
}
export const other = new Other();
