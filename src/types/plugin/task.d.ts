import type schedule from 'node-schedule';
import type { Log, PkgInfo, PluginFile } from './base';
/** 定时任务方法 */
export interface Task {
    /** 插件包基本属性 */
    pkg: PkgInfo;
    /** 插件方法基本属性 */
    file: PluginFile<'task'>;
    /** 任务名称 */
    name: string;
    /** cron表达式 */
    cron: string;
    /** 执行方法 */
    fnc: Function;
    /** 打印触发插件日志方法 */
    log: Log<false>;
    /** schedule */
    schedule?: schedule.Job;
}
