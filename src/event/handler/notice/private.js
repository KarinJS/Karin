import { initPrint, initTips, deal } from '../other/other';
import { noticeRequestCD } from '../other/cd';
import { config as cfg, getFriendCfg } from '@/utils/config';
import { privateFilterEvent, initEmit, initRole, } from '../other/handler';
/**
 * @description 好友通知处理器
 * @param ctx 好友通知事件
 */
export const friendNoticeHandler = async (ctx) => {
    /** 基本配置 */
    const config = cfg();
    /** 好友配置 */
    const friend = getFriendCfg(ctx.userId, ctx.selfId);
    initRole(ctx, config);
    initEmit(ctx);
    initTips(ctx);
    initPrint(ctx, 'friend', '好友通知');
    const cd = noticeRequestCD(ctx, friend, ctx.userId);
    const filter = privateFilterEvent(ctx, config, friend, cd);
    // TODO: 中间件实现
    if (filter)
        deal(ctx, friend);
};
