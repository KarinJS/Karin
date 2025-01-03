import { Sender, SenderGroup } from '@/types/event';
/**
 * 构建好友场景的`sender`
 * @param userId 用户ID
 * @param name 用户名
 * @param sex 性别
 * @param age 年龄
 * @param uid QQ场景专属
 * @param uin QQ场景专属
 */
export declare const senderFriend: (userId: Sender<"friend">["userId"], name?: Sender<"friend">["name"], sex?: Sender<"friend">["sex"], age?: Sender<"friend">["age"], uid?: Sender<"friend">["uid"], uin?: Sender<"friend">["uin"]) => Sender<"friend">;
/**
 * 构建群聊场景的`sender`
 */
export declare const senderGroup: SenderGroup;
/**
 * 构建频道场景的`sender`
 * @param userId 用户ID
 * @param role 群成员身份
 * @param name 用户名
 * @param sex 性别
 * @param age 年龄
 */
export declare const senderGuild: (userId: Sender<"guild">["userId"], role: Sender<"guild">["role"], name: Sender<"guild">["name"] | undefined, sex: Sender<"guild">["sex"], age: Sender<"guild">["age"]) => Sender<"guild">;
/**
 * 构建频道私信场景的`sender`
 */
export declare const senderDirect: (userId: Sender<"friend">["userId"], name?: Sender<"friend">["name"], sex?: Sender<"friend">["sex"], age?: Sender<"friend">["age"], uid?: Sender<"friend">["uid"], uin?: Sender<"friend">["uin"]) => Sender<"friend">;
/**
 * 构建群聊临时会话场景的`sender`
 */
export declare const senderGroupTemp: (userId: Sender<"friend">["userId"], name?: Sender<"friend">["name"], sex?: Sender<"friend">["sex"], age?: Sender<"friend">["age"], uid?: Sender<"friend">["uid"], uin?: Sender<"friend">["uin"]) => Sender<"friend">;
/**
 * 事件发送者构建器
 * @description 用于构建不同场景的事件发送者信息
 */
export declare const sender: {
    /** 好友场景 */
    friend: (userId: Sender<"friend">["userId"], name?: Sender<"friend">["name"], sex?: Sender<"friend">["sex"], age?: Sender<"friend">["age"], uid?: Sender<"friend">["uid"], uin?: Sender<"friend">["uin"]) => Sender<"friend">;
    /** 群聊场景 */
    group: SenderGroup;
    /** 频道场景 */
    guild: (userId: Sender<"guild">["userId"], role: Sender<"guild">["role"], name: Sender<"guild">["name"] | undefined, sex: Sender<"guild">["sex"], age: Sender<"guild">["age"]) => Sender<"guild">;
    /** 频道私信场景 */
    direct: (userId: Sender<"friend">["userId"], name?: Sender<"friend">["name"], sex?: Sender<"friend">["sex"], age?: Sender<"friend">["age"], uid?: Sender<"friend">["uid"], uin?: Sender<"friend">["uin"]) => Sender<"friend">;
    /** 群聊临时会话场景 */
    groupTemp: (userId: Sender<"friend">["userId"], name?: Sender<"friend">["name"], sex?: Sender<"friend">["sex"], age?: Sender<"friend">["age"], uid?: Sender<"friend">["uid"], uin?: Sender<"friend">["uin"]) => Sender<"friend">;
};
