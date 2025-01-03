import type { FileCache, FriendDirect, GroupGuild } from '@/types/config';
/**
 * `@karinjs/config` 配置文件缓存
 */
export declare const cache: FileCache;
/**
 * 读取群、频道配置文件缓存
 * @param groupOrGuildId 群号或频道ID
 * @param selfIdOrChannelId 机器人ID或子频道ID
 * @param selfId 机器人ID
 */
export declare const getGroupOrGuildCache: (groupOrGuildId: string, selfIdOrChannelId?: string, selfId?: string) => {
    ok: boolean;
    config: GroupGuild;
    keys?: undefined;
} | {
    ok: boolean;
    keys: string[];
    config?: undefined;
};
/**
 * 统一转换为字符串数组
 * @param data 数据
 */
export declare const setStr: (data: any[]) => string[];
/**
 * 初始化群、频道配置 统一用户id为str
 * @param config 配置
 */
export declare const initGroupOrGuildCfg: (config: GroupGuild) => GroupGuild;
/**
 * 加上get value属性
 * @param data 数据
 * @param key 键
 */
export declare const addValue: (data: any, key: string) => void;
/**
 * 缓存并返回群、频道配置文件
 * @param keys 键组
 * @param data 配置
 */
export declare const setGroupOrGuildCache: (keys: string[], data: Record<string, GroupGuild>) => GroupGuild;
/**
 * 初始化好友、频道私信配置 统一用户id为str
 * @param config 配置
 */
export declare const initFriendDirectCfg: (config: FriendDirect) => FriendDirect;
/**
 * 读取好友、频道私信配置文件缓存
 * @param userId 用户ID
 * @param selfId 机器人ID
 */
export declare const getFriendOrDirectCache: (userId: string, selfId?: string) => {
    ok: boolean;
    config: FriendDirect;
    keys?: undefined;
} | {
    ok: boolean;
    keys: string[];
    config?: undefined;
};
/**
 * 缓存并返回好友、频道私信配置文件
 * @param keys 键组
 * @param data 配置
 */
export declare const setFriendOrDirectCache: (keys: string[], data: Record<string, FriendDirect>) => FriendDirect;
