import type { Command } from '@/types/plugin';
/**
 * 命令选项
 */
export interface Options {
    /** 插件名称 */
    name?: string;
    /** 是否启用日志 */
    log?: boolean;
    /** 权限 默认`all` */
    perm?: Command['permission'];
    /** 优先级 默认`10000` */
    rank?: Command['priority'];
    /** 生效的适配器 */
    adapter?: Command['adapter'];
    /** 禁用的适配器 */
    dsbAdapter?: Command['dsbAdapter'];
    /**
     * 权限
     * @default 'all'
     */
    permission?: Command['permission'];
    /**
     * 插件优先级 数字越小优先级越高
     * @default 10000
     */
    priority?: Command['priority'];
    /**
     * 禁用的适配器
     * @deprecated 已废弃 请使用`dsbAdapter`
     */
    notAdapter?: Command['dsbAdapter'];
}
