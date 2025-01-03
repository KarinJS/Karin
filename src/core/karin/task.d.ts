import type { Task } from '@/types/plugin';
export interface TaskOptions {
    /** 插件名称 */
    name?: string;
    /** 是否启用日志 */
    log?: boolean;
}
/**
 * 构建定时任务
 * @param name 任务名称
 * @param cron cron表达式
 * @param fnc 执行函数
 * @param options 选项
 */
export declare const task: (name: string, cron: string, fnc: Function, options?: TaskOptions) => Task;
