import fs from '@/utils/fs/main';
import type { ConfigMap, FriendDirect, GroupGuild, Package } from '@/types/config';
/** node-karin的package */
export declare const pkg: () => Package;
/** http端口 */
export declare const port: () => number;
/** host */
export declare const host: () => string;
/** 根路由文案 */
export declare const rootMsg: () => string[];
/** 主人列表 */
export declare const master: () => string[];
/** 管理员列表 */
export declare const admin: () => string[];
/** 超时时间 */
export declare const timeout: () => number;
/** Redis 配置 */
export declare const redis: () => import("@/types/config").Redis;
/** Pm2配置 */
export declare const pm2: () => import("@/types/config").PM2;
/** 鉴权秘钥 */
export declare const authKey: () => string;
/**
 * 获取好友配置
 * @param userId 用户ID
 * @param selfId 机器人ID
 */
export declare const getFriendCfg: (userId: string, selfId?: string) => FriendDirect;
/**
 * 获取频道私信配置
 * @param userId 用户ID
 * @param selfId 机器人ID
 */
export declare const getDirectCfg: (userId: string, selfId?: string) => FriendDirect;
/**
 * 获取指定群配置
 * @param groupId 群号
 * @param selfId 机器人ID
 */
export declare const getGroupCfg: (groupId: string, selfId?: string) => GroupGuild;
/**
 * 获取指定频道配置
 * @param guildId 频道ID
 * @param channelId 子频道ID
 * @param selfId 机器人ID
 */
export declare const getGuildCfg: (guildId: string, channelId?: string, selfId?: string) => GroupGuild;
/**
 * 获取配置 包含默认配置和用户配置
 * @param name 文件名称
 * @param isRefresh 是否刷新缓存
 */
export declare const getMergeYaml: <T extends keyof ConfigMap>(name: T, isRefresh?: boolean) => ConfigMap[T];
type GetYaml<T extends keyof ConfigMap, K> = K extends true ? ConfigMap[T] : fs.Watch<ConfigMap[T]>;
/**
 * 获取配置yaml
 * @param name 文件名称
 * @param type 文件类型 用户配置/默认配置
 * @param isRefresh 是否刷新缓存
 */
export declare const getYaml: <T extends keyof ConfigMap, K extends boolean = false>(name: T, type: "user" | "default", isRefresh?: K) => GetYaml<T, K>;
/**
 * Config 配置
 * @param isRefresh 是否刷新缓存
 */
export declare const config: (isRefresh?: boolean) => import("@/types/config").Config;
/**
 * Server 配置
 * @param isRefresh 是否刷新缓存
 */
export declare const server: (isRefresh?: boolean) => import("@/types/config").Server;
/**
 * 更新日志等级
 * @param level 日志等级
 */
export declare const updateLevel: (level?: string) => void;
/**
 * @description 修改框架配置
 * @param name 文件名称
 * @param data 配置数据
 */
export declare const setYaml: <T extends keyof ConfigMap>(name: T, data: Record<string, any>) => boolean;
/**
 * @description 创建基本配置
 */
/** 初始化 */
export declare const init: () => void;
export {};
