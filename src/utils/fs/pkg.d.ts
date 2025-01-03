/** package.json类型 */
export interface PkgData {
    /** 插件名称 */
    name: string;
    /** 插件版本 */
    version: string;
    /** 插件入口 */
    main: string;
    karin?: {
        /** ts入口 */
        main?: string;
        /** 插件app列表 */
        apps?: string | string[];
        /** ts插件app列表 ts专属 仅在ts开发模式下生效 */
        ['ts-apps']?: string | string[];
        /** 静态资源目录 */
        static?: string | string[];
        /** 基本文件夹结构 */
        files?: string[];
    };
    [key: string]: any;
}
/**
 * 输入包名 返回包根目录的绝对路径 仅简单查找
 * @param name - 包名
 * @param rootPath - 导入包的路径 此项适用于在插件中读取插件的依赖包
 * @returns - 包根目录的绝对路径
 * @example
 * pkgRoot('axios')
 * pkgRoot('axios', __filename)
 * pkgRoot('axios', import.meta.url)
 */
export declare const pkgRoot: (name: string, rootPath?: string) => string;
/**
 * 传入插件名称 返回插件根目录、路径、package.json等信息
 * @param name - 插件名称
 */
export declare const getPluginInfo: (name: string) => (import("../../types/plugin").PkgInfo & {
    readonly pkg: PkgData | null;
}) | null;
/**
 * 传入一个名称 判断是否为插件
 * @param name - 插件名称
 */
export declare const isPlugin: (name: string) => boolean;
