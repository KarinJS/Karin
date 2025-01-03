import { FriendDirect, GroupGuild } from '@/types/config';
import { Notice, Request } from '@/types/event';
/**
 * 好友、频道私信CD过滤器
 * @param eventCfg - 事件配置
 * @param key - 用户key
 * @returns `true` 表示通过 没有在CD中
 */
export declare const privateCD: (eventCfg: FriendDirect, key: string) => boolean;
/**
 * 群、频道CD过滤器
 * @param eventCfg - 事件配置
 * @param groupKey - 群key
 * @param userKey - 用户key
 * @returns `true` 表示通过 没有在CD中
 */
export declare const groupsCD: (eventCfg: GroupGuild, groupKey: string, userKey: string) => boolean;
/**
 * 通知、请求事件CD过滤器
 * @param config - 事件配置
 * @param key - 用户key
 */
export declare const noticeRequestCD: (ctx: Notice | Request, config: FriendDirect | GroupGuild, key: string) => boolean;
