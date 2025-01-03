/**
 * 事件来源
 * - group: 群聊
 * - friend: 好友聊天
 * - guild: 频道
 * - direct: 频道私信
 * - groupTemp: 临时群会话
 */
export type Scene = 'group' | 'friend' | 'guild' | 'direct' | 'groupTemp';
/**
 * 事件来源类型基类
 */
export interface BaseContact {
    /** 事件来源 */
    scene: Scene;
    /** 事件来源id */
    peer: string;
    /** 事件来源子id 仅在频道、频道私信和临时会话中存在 */
    subPeer?: string;
    /** 来源场景的昵称 */
    name: string;
    /** 来源场景的子昵称 */
    subName?: string;
}
/**
 * 群聊来源信息类型
 */
export interface GroupContact extends BaseContact {
    scene: 'group';
    /** 群ID */
    peer: string;
    /** 群名 */
    name: string;
}
/**
 * 好友来源信息类型
 */
export interface FriendContact extends BaseContact {
    scene: 'friend';
    /** 好友ID */
    peer: string;
    /** 好友昵称 */
    name: string;
}
/**
 * 频道私信来源信息类型
 */
export interface DirectContact extends BaseContact {
    scene: 'direct';
    /** 频道ID 虚拟ID 用于请求Api使用 */
    peer: string;
    /** 子频道ID 虚拟ID */
    subPeer: string;
    /** 频道名称 */
    name: string;
    /** 子频道名称 */
    subName?: string;
    /** 来源频道ID */
    srcGuildId: string;
}
/**
 * 频道来源信息类型
 */
export interface GuildContact extends BaseContact {
    scene: 'guild';
    /** 频道ID */
    peer: string;
    /** 频道名称 */
    name: string;
    /** 子频道ID */
    subPeer: string;
    /** 子频道名称 */
    subName: string;
}
/**
 * 群临时会话来源信息类型
 */
export interface GroupTempContact extends BaseContact {
    scene: 'groupTemp';
    /** 群ID */
    peer: string;
    /** 发起临时会话用户ID */
    subPeer: string;
    /** 群名 */
    name: string;
}
/**
 * 事件来源信息
 * - `group`: 群聊
 * - `friend`: 好友
 * - `guild`: 频道
 * - `direct`: 频道私信
 * - `groupTemp`: 临时群会话
 */
export type Contact<T extends Scene = Scene> = T extends 'group' ? GroupContact : T extends 'friend' ? FriendContact : T extends 'guild' ? GuildContact : T extends 'direct' ? DirectContact : T extends 'groupTemp' ? GroupTempContact : never;
