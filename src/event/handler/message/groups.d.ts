import type { GroupMessage, GroupTempMessage, GuildMessage } from '../../message';
/**
 * @description 群聊消息处理器
 * @param ctx 群聊消息事件
 */
export declare const groupHandler: (ctx: GroupMessage) => Promise<GroupMessage | undefined>;
/**
 * @description 群聊临时消息处理器
 * @param ctx 群聊临时消息事件
 */
export declare const groupTempHandler: (ctx: GroupTempMessage) => Promise<GroupTempMessage | undefined>;
/**
 * @description 频道消息处理器
 * @param ctx 频道消息事件
 */
export declare const guildHandler: (ctx: GuildMessage) => Promise<GuildMessage | undefined>;
