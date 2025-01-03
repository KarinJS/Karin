import type { FriendContact, GroupContact, DirectContact, GuildContact, GroupTempContact } from '@/types/event';
/**
 * 构建好友事件来源
 * @param peer 好友ID
 * @param name 好友昵称 默认为空字符串
 */
export declare const contactFriend: (peer: FriendContact["peer"], name?: FriendContact["name"]) => FriendContact;
/**
 * 构建群聊事件来源
 * @param peer 群ID
 * @param name 群名
 */
export declare const contactGroup: (peer: GroupContact["peer"], name?: GroupContact["name"]) => GroupContact;
/**
 * 构建频道私信事件来源
 * @param peer 频道ID
 * @param subId 子频道ID
 * @param srcGuildId 来源频道ID
 * @param name 频道名称 默认为空字符串
 * @param subName 子频道名称 默认为空字符串
 */
export declare const contactDirect: (peer: DirectContact["peer"], subId: DirectContact["subPeer"], srcGuildId: DirectContact["srcGuildId"], name?: DirectContact["name"], subName?: DirectContact["subName"]) => DirectContact;
/**
 * 构建频道事件来源
 * @param peer 频道ID
 * @param subPeer 子频道ID
 * @param name 频道名称 默认为空字符串
 * @param subName 子频道名称 默认为空字符串
 */
export declare const contactGuild: (peer: GuildContact["peer"], subPeer: GuildContact["subPeer"], name?: GuildContact["name"], subName?: GuildContact["subName"]) => GuildContact;
/**
 * 构建群聊临时会话事件来源
 * @param peer 群ID
 * @param subPeer 发起临时会话的用户ID
 * @param name 群名
 */
export declare const contactGroupTemp: (peer: GroupTempContact["peer"], subPeer: GroupTempContact["subPeer"], name?: GroupTempContact["name"]) => GroupTempContact;
/**
 * 事件来源构建器
 * @description 用于构建不同场景的事件来源信息
 */
export declare const contact: {
    /** 好友场景 */
    friend: (peer: FriendContact["peer"], name?: FriendContact["name"]) => FriendContact;
    /** 群聊场景 */
    group: (peer: GroupContact["peer"], name?: GroupContact["name"]) => GroupContact;
    /** 频道场景 */
    guild: (peer: GuildContact["peer"], subPeer: GuildContact["subPeer"], name?: GuildContact["name"], subName?: GuildContact["subName"]) => GuildContact;
    /** 频道私信场景 */
    direct: (peer: DirectContact["peer"], subId: DirectContact["subPeer"], srcGuildId: DirectContact["srcGuildId"], name?: DirectContact["name"], subName?: DirectContact["subName"]) => DirectContact;
    /** 群聊临时会话场景 */
    groupTemp: (peer: GroupTempContact["peer"], subPeer: GroupTempContact["subPeer"], name?: GroupTempContact["name"]) => GroupTempContact;
};
