import { cache } from '@/plugin/cache';
import { config as cfg, getFriendCfg, getGroupCfg } from '@/utils/config';
import type { Message, Event } from '@/types/event';
import type { AdapterProtocol } from '@/types/adapter';
import type { GroupMessage, GroupTempMessage, GuildMessage } from '../../message';
/**
 * @description 日志
 * @param userId 用户ID
 * @param text 日志内容
 */
export declare const log: (userId: string, text: string) => void;
/**
 * @description 初始化`msg` `rawMessage`
 * @param ctx 消息事件对象
 */
export declare const initMsg: (ctx: Message) => void;
/**
 * @description 初始化事件的角色身份
 * @param ctx 事件对象
 * @param config 基本配置
 */
export declare const initRole: (ctx: Event, config: ReturnType<typeof cfg>) => void;
/**
 * @description 初始化Bot的前缀
 * @param ctx 消息事件对象
 * @param alias Bot前缀列表
 */
export declare const initAlias: (ctx: Message, alias: string[]) => void;
/**
 * @description 事件发布
 */
export declare const initEmit: (ctx: Event) => void;
/**
 * 检查触发事件的适配器是否收到限制
 * @param plugin 插件缓存对象
 * @param protocol 适配器协议实现名称
 * @returns `true` 表示通过
 */
export declare const disableViaAdapter: (plugin: (typeof cache.command)[number] | (typeof cache.accept)[number], protocol: AdapterProtocol) => boolean;
/**
 * 检查当前插件是否通过插件白名单
 * @param plugin 插件对象
 * @param config 当前群、好友的配置对象
 * @returns `true` 表示通过
 */
export declare const disableViaPluginWhitelist: (plugin: (typeof cache.command)[number] | (typeof cache.accept)[number], config: ReturnType<typeof getFriendCfg> | ReturnType<typeof getGroupCfg>) => boolean;
/**
 * 检查当前插件是否通过插件黑名单
 * @param plugin 插件对象
 * @param config 当前群、好友的配置对象
 * @returns `true` 表示通过
 */
export declare const disableViaPluginBlacklist: (plugin: (typeof cache.command)[number] | (typeof cache.accept)[number], config: ReturnType<typeof getFriendCfg> | ReturnType<typeof getGroupCfg>) => boolean;
/**
 * @description 过滤事件
 * @param ctx 好友消息事件
 * @param friend 好友配置
 * @param cd 是否处于CD中
 * @returns `true` 表示通过
 */
export declare const privateFilterEvent: (ctx: Event, config: ReturnType<typeof cfg>, friend: ReturnType<typeof getFriendCfg>, cd: boolean) => boolean;
/**
 * @description 过滤事件
 * @param ctx 群、频道消息事件
 * @param group 群配置
 * @param cd 是否处于CD中
 * @returns `true` 表示通过
 */
export declare const groupFilterEvent: (ctx: Event, config: ReturnType<typeof cfg>, group: ReturnType<typeof getGroupCfg>, cd: boolean) => boolean;
/**
 * 检查是否通过群日志打印
 * @param event 群事件对象
 * @param config 基本配置对象
 * @returns `true` 表示通过
 */
export declare const groupPrint: (ctx: GroupMessage | GroupTempMessage, config: ReturnType<typeof cfg>) => boolean;
/**
 * 检查是否通过频道日志打印
 * @param event 频道事件对象
 * @param config 基本配置对象
 * @returns `true` 表示通过
 */
export declare const guildPrint: (ctx: GuildMessage, config: ReturnType<typeof cfg>) => boolean;
