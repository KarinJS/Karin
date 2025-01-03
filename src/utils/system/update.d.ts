import type { ExecException } from 'node:child_process';
/**
 * @description 传入npm包名 检查是否存在更新
 * @param name 包名
 * @returns 是否存在更新 true: 存在更新 false: 无更新
 */
export declare const checkPkgUpdate: (name: string) => Promise<{
    /** 存在更新 */
    status: "yes";
    /** 本地版本号 */
    local: string;
    /** 远程版本号 */
    remote: string;
} | {
    /** 无更新 */
    status: "no";
    /** 本地版本号 */
    local: string;
} | {
    /** 检查发生错误 */
    status: "error";
    /** 错误信息 */
    error: Error;
}>;
/**
 * @description 获取指定包的本地版本号 如果获取失败则会获取package.json中的版本号
 * @param name 包名
 */
export declare const getPkgVersion: (name: string) => Promise<string>;
/**
 * @description 获取指定包的远程版本号
 * @param name 包名
 * @param tag 标签，默认为 `latest`
 */
export declare const getRemotePkgVersion: (name: string, tag?: string) => Promise<string>;
/**
 * @description 更新指定的npm插件
 * @param name 包名
 * @param tag 标签 默认 `latest`
 */
export declare const updatePkg: (name: string, tag?: string) => Promise<{
    /** 更新失败 */
    status: "failed";
    /** 更新失败信息 */
    data: string | ExecException;
} | {
    /** 更新成功 */
    status: "ok";
    /** 更新成功信息 */
    data: string;
    /** 本地版本号 */
    local: string;
    /** 远程版本号 */
    remote: string;
}>;
/**
 * @description 更新全部npm插件
 */
export declare const updateAllPkg: () => Promise<string>;
/**
 * @description 检查git插件是否有更新
 * @param filePath 插件路径
 * @param time 任务执行超时时间 默认120s
 */
export declare const checkGitPluginUpdate: (filePath: string, time?: number) => Promise<{
    /** 存在更新 */
    status: "yes";
    /** 更新内容 */
    data: string;
    /** 落后次数 */
    count: number;
} | {
    /** 无更新 */
    status: "no";
    /** 最后更新时间描述 */
    data: string;
} | {
    /** 检查发生错误 */
    status: "error";
    data: Error;
}>;
/**
 * @description 获取指定仓库的提交记录
 * @param options 参数
 * @returns 提交记录
 */
export declare const getCommit: (options: {
    /** 指令命令路径 */
    path: string;
    /** 获取几次提交 默认1次 */
    count?: number;
    /** 指定哈希 */
    hash?: string;
    /** 指定分支 */
    branch?: string;
}) => Promise<string>;
/**
 * @description 获取指定仓库最后一次提交哈希值
 * @param filePath - 插件相对路径
 * @param short - 是否获取短哈希 默认true
 */
export declare const getHash: (filePath: string, short?: boolean) => Promise<string>;
/**
 * 获取指定仓库最后一次提交时间日期
 * @param filePath - 插件相对路径
 * @returns 最后一次提交时间
 * @example
 * ```ts
 * console.log(await getTime('./plugins/karin-plugin-example'))
 * // -> '2021-09-01 12:00:00'
 * ```
 */
export declare const getTime: (filePath: string) => Promise<string>;
/**
 * @description 更新指定git插件
 * @param filePath 插件路径
 * @param cmd 执行命令 默认`git pull`
 * @param time 任务执行超时时间 默认120s
 */
export declare const updateGitPlugin: (filePath: string, cmd?: string, time?: number) => Promise<{
    /** 更新失败 */
    status: "failed";
    /** 更新失败信息 */
    data: string | ExecException;
} | {
    /** 更新成功 */
    status: "ok";
    /** 更新成功信息 */
    data: string;
    /** 更新详情 */
    commit: string;
} | {
    /** 检查发生错误 */
    status: "error";
    data: Error;
}>;
/**
 * @description 更新所有git插件
 * @param time 任务执行超时时间 默认120s
 */
export declare const updateAllGitPlugin: (cmd?: string, time?: number) => Promise<string>;
