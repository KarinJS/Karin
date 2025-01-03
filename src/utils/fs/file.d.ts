import type { AxiosRequestConfig } from 'axios';
/** 当前运行环境的路径标准协议前缀 */
export declare const sep: RegExp;
/**
 * 下载保存文件
 * @param  fileUrl 下载地址
 * @param  savePath 保存路径
 * @param param axios参数
 */
export declare const downFile: (fileUrl: string, savePath: string, param?: AxiosRequestConfig) => Promise<boolean>;
/**
 * 标准化文件路径 统一使用/分隔符
 * @param file - 路径
 * @param absPath - 返回绝对路径 默认为true
 * @param prefix - 添加file://前缀 默认为false
 * @returns 标准化后的路径
 */
export declare const absPath: (file: string, absPath?: boolean, prefix?: boolean) => string;
/**
 * 为每个插件创建基本文件夹结构
 * @param name 插件名称
 * @param files 需要创建的文件夹列表
 */
export declare const createPluginDir: (name: string, files?: string[]) => Promise<void>;
/**
 * 获取符合后缀的文件列表(仅包含文件名称)
 * @param filePath 文件路径
 * @param suffixs 需要复制的文件后缀 可带点
 * @returns 符合条件的文件列表
 */
export declare const getFiles: (filePath: string, suffixs?: string[]) => string[];
/**
 * 复制文件 同步
 * @param files 需要复制的文件列表
 * @param defaulPath 模板配置文件路径
 * @param userPath 用户配置文件路径
 */
export declare const copyFilesSync: (files: string[], defaulPath: string, userPath: string) => void;
/**
 * 复制文件 异步
 * @param files 需要复制的文件列表
 * @param defaulPath 模板配置文件路径
 * @param userPath 用户配置文件路径
 */
export declare const copyFiles: (files: string[], defaulPath: string, userPath: string) => Promise<void>;
/**
 * 创建配置文件 同步
 * @description 从模板配置文件复制到用户配置文件
 * @param defaulPath 模板配置文件路径
 * @param userPath 用户配置文件路径
 * @param suffixs 需要复制的文件后缀 可带点
 * @param isThrow 是否抛出异常 默认不抛出
 * @returns 是否复制成功
 * @example
 * ```ts
 * copyConfigSync('defaultPath', 'userPath')
 * copyConfigSync('defaultPath', 'userPath', ['yaml'])
 * copyConfigSync('defaultPath', 'userPath', ['.yaml', 'json'])
 * copyConfigSync('defaultPath', 'userPath', [], true)
 * ```
 */
export declare const copyConfigSync: (defaulPath: string, userPath: string, suffixs?: string[], isThrow?: boolean) => boolean;
/**
 * 创建配置文件 异步
 * @description 从模板配置文件复制到用户配置文件
 * @param defaulPath 模板配置文件路径
 * @param userPath 用户配置文件路径
 * @param suffixs 需要复制的文件后缀 可带点
 * @param isThrow 是否抛出异常 默认不抛出
 * @returns 是否复制成功
 * @example
 * ```ts
 * await copyConfig('defaultPath', 'userPath')
 * await copyConfig('defaultPath', 'userPath', ['yaml'])
 * await copyConfig('defaultPath', 'userPath', ['.yaml', 'json'])
 * await copyConfig('defaultPath', 'userPath', [], true)
 * ```
 */
export declare const copyConfig: (defaulPath: string, userPath: string, suffixs?: string[], isThrow?: boolean) => Promise<boolean>;
