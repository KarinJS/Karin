import type { Message } from '@/types/event';
import type { cache } from '@/plugin/cache';
import type { DirectMessage, FriendMessage, GroupMessage, GroupTempMessage, GuildMessage } from '../../message';
/**
 * 处理插件权限
 */
export declare class Permission {
    static master: string;
    static admin: string;
    static owner: string;
    static groupAdmin: string;
    /**
     * 处理没有权限的情况
     * @param ctx 上下文
     * @param authFailMsg 没有权限时的回复消息
     * @param defaultMsg 默认回复消息
     */
    static handleNoPermission(ctx: Message, authFailMsg: typeof cache.command[number]['authFailMsg'], defaultMsg: string): boolean;
    /**
     * 私聊场景
     * @param ctx 上下文
     * @param plugin 插件缓存对象
     */
    static private(ctx: FriendMessage | DirectMessage, plugin: typeof cache.command[number]): boolean;
    /**
     * 群聊场景
     * @param ctx 上下文
     * @param plugin 插件缓存对象
     */
    static groups(ctx: GroupMessage | GuildMessage | GroupTempMessage, plugin: typeof cache.command[number]): boolean;
}
