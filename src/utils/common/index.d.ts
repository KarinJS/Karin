import type { AxiosRequestConfig, AxiosResponse } from 'axios';
export { isDir, existToMkdir as exists } from '@/utils/fs/fsPromises';
export { downFile, absPath } from '@/utils/fs/file';
export { mkdirSync as mkdir } from '@/utils/fs/fsSync';
export { base64, buffer, stream } from '@/utils/fs/data';
export { getRelPath, urlToPath, splitPath } from '@/utils/fs/path';
export { read as readYaml, write as writeYaml } from '@/utils/fs/yaml';
export { readJsonSync as readJson, writeJsonSync as writeJson } from '@/utils/fs/json';
export { pkgRoot as pkgroot, getPluginInfo as pkgJson, isPlugin } from '@/utils/fs/pkg';
export { karinToQQBot as buttonToQQBot, karinToQQBot, qqbotToKarin } from '@/utils/button/convert';
export { createRawMessage, createRawMessage as makeMessageLog, makeMessage, makeForward } from '@/utils/message/message';
export type AxiosFn = {
    /**
     * 对axios进行简单封装，超时、错误后返回null，不会抛出异常
     * @param param axios参数
     */
    (param: AxiosRequestConfig): Promise<AxiosResponse<any> | null>;
    /**
     * 对axios进行简单封装，超时、错误后返回null，不会抛出异常
     * @param url 请求地址
     * @param type 请求类型
     * @param param axios参数
     */
    (url: string, type: 'get' | 'post', param?: AxiosRequestConfig): Promise<AxiosResponse<any> | null>;
};
export interface NpmInfo {
    plugin: string;
    path: string;
    file: string;
    isMain: boolean;
}
/**
 * 休眠函数
 * @param ms 毫秒
 * @example
 * ```ts
 * await sleep(1000)
 * ```
 */
export declare const sleep: (ms: number) => Promise<unknown>;
/**
 * axios请求
 * @param paramOrUrl axios参数或url
 * @param type 请求类型 只有在传入url时有效
 * @param param axios参数 只有在传入url时有效
 * @example
 * ```ts
 * await axios({ url: 'https://example.com', method: 'get' })
 * await axios({ url: 'https://example.com', method: 'post', data: { key: 'value' } })
 * await axios('https://example.com', 'post', { data: { key: 'value' } })
 * await axios('https://example.com', 'get')
 * // -> null 或 axios返回值
 * ```
 */
export declare const axios: AxiosFn;
/**
 * 获取运行时间
 * @example
 * ```ts
 * uptime()
 * // -> '1天2小时3分钟4秒'
 * // -> '2小时3分钟4秒'
 * // -> '3分钟4秒'
 * // -> '4秒'
 * ```
 */
export declare const uptime: () => string;
/**
 * @description 传入一个或两个时间戳
 * @description 传入一个返回当前时间 - 时间1
 * @description 传入两个返回时间2 - 时间1
 * @param time - 时间戳
 * @example
 * common.formatTime(1620000000)
 * // -> '18天'
 * common.formatTime(1620000000, 1620000000)
 * // -> '18天'
 */
export declare const formatTime: (time: number, time2?: number) => string;
/**
 * @deprecated 已废弃 建议使用`yaml`模块
 * 更新yaml文件
 * @param filePath - 文件路径
 * @param settings - 设置项
 */
export declare const updateYaml: (filePath: string, settings: Array<{
    /** 键路径 */
    key: string;
    /** 要写入的内容 */
    val: any;
    /** 需要写入的注释 */
    comment: string;
    /** 注释在开头还是结尾 */
    type?: "top" | "end";
}>) => void;
/**
 * @deprecated 已废弃 请使用`getNpmPlugins`、`getNpmPluginsInfo`
 * 获取npm插件列表
 * @param showDetails - 是否返回详细信息
 * 默认只返回插件npm包名，为true时返回详细的{dir, name}[]
 */
export declare const getNpmPlugins: (showDetails?: boolean) => Promise<string[] | import("../../types/plugin").PkgInfo[]>;
/**
 * @deprecated 已废弃
 * 获取git插件列表
 * @param isPack - 是否屏蔽不带package.json的插件，默认为false
 */
export declare const getPlugins: (isPack?: boolean) => Promise<string[]>;
/**
 * @deprecated 已废弃
 * 获取git插件列表
 * @param isPack - 是否屏蔽不带package.json的插件，默认为false
 */
export declare const getGitPlugins: (isPack?: boolean) => Promise<string[] | import("../../types/plugin").PkgInfo[]>;
/**
 * 传入图片数组，拼接成一个图片
 * @param images - 图片数组 支持路径和带前缀base64字符串`(base64://...)`
 * @param perRow - 每行图片数量 默认3
 * @returns 返回base64 不含`data:image/png;base64` `base64://`等前缀
 */
export declare const mergeImage: (images: string[], perRow?: number) => Promise<{
    base64: string;
    height: number;
    width: number;
}>;
/**
 * 将全部图片转为绝对路径
 * @param images - 图片数组
 * @param root - 根目录
 * @returns 返回绝对路径数组
 */
export declare const getAbsPath: (images: string[], root: string) => string[];
