import type { LoggerLevel } from '../system/logger';
/**
 * `config.yaml` 类型
 */
export interface Config {
    /** log4js 配置 */
    log4jsCfg: {
        /** 日志等级 */
        level: LoggerLevel;
        /** 日志保留天数 */
        daysToKeep: number;
        /** 整体化: 将日志输出到一个文件(一天为一个文件) 日志较多的情况下不建议与碎片化同时开启 */
        overall: boolean;
        /** 碎片化: 将日志分片，达到指定大小后自动切割 日志较多的情况下不建议与整体化同时开启 */
        fragments: boolean;
        /** 碎片化每个日志文件最大大小 MB */
        maxLogSize: number;
        /** # logger.fnc颜色 不支持热更新 */
        logColor: string;
    };
    /** 重启是否调用pm2 如果不调用则会直接关机 此配置适合有进程守护的程序 */
    pm2Restart: boolean;
    /** 私聊设置 频道和好友共享此配置 */
    private: {
        /** 是否开启私聊 */
        enable: boolean;
        /** 关闭私聊后回复的提示词 为空则不回复 */
        tips: string;
        /** 关闭私聊后的用户白名单 */
        disable: string[];
    };
    /** ffmpeg路径 */
    ffmpegPath: string;
    /** ffprobe路径 */
    ffprobePath: string;
    /** ffplay路径 */
    ffplayPath: string;
    /** Bot主人列表 主权限 */
    master: string[];
    /** Bot管理列表 子权限 */
    admin: string[];
    /** 黑名单相关 */
    disable: {
        /** 黑名单用户 */
        users: string[];
        /** 黑名单群聊 */
        groups: string[];
        /** 黑名单频道 */
        guilds: string[];
        /** 黑名单子频道 */
        channels: string[];
        /** 黑名单频道私聊 禁用指定来源频道的私聊 */
        directs: string[];
        /** 消息日志黑名单群聊 设置后不会打印指定群的消息日志 */
        groupLog: string[];
        /** 消息日志黑名单频道 设置后不会打印指定频道的消息日志 */
        guildLog: string[];
        /** 消息日志黑名单子频道 设置后不会打印指定子频道的消息日志 */
        channelLog: string[];
    };
    /** 白名单相关 */
    enable: {
        /** 白名单用户 */
        users: string[];
        /** 白名单群聊 */
        groups: string[];
        /** 白名单频道 */
        guilds: string[];
        /** 白名单子频道 */
        channels: string[];
        /** 白名单频道私聊 仅允许指定来源频道的私聊 */
        directs: string[];
        /** 消息日志白名单群聊 设置后只会打印指定群的消息日志 */
        groupLog: string[];
        /** 消息日志白名单频道 设置后只会打印指定频道的消息日志 */
        guildLog: string[];
        /** 消息日志白名单子频道 设置后只会打印指定子频道的消息日志 */
        channelLog: string[];
    };
}
