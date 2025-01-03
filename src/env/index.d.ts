export declare const isWin: () => boolean;
export declare const isMac: () => boolean;
export declare const isLinux: () => boolean;
export declare const isDev: () => boolean;
export declare const isWatch: () => boolean;
export declare const isJs: () => boolean;
export declare const isTs: () => boolean;
export declare const isNode: () => boolean;
export declare const isTsx: () => boolean;
export declare const isPm2: () => boolean;
export declare const isProd: () => boolean;
/**
 * @description 设置运行端口
 * @param port 端口
 */
export declare const setPort: (port: number | string) => void;
/**
 * @description 设置当前版本
 * @param version 版本
 */
export declare const setVersion: (version: string) => void;
/**
 * @description 设置运行语言
 * @param lang 语言
*/
export declare const setLang: (lang: "js" | "ts") => void;
/**
 * @description 设置运行器
 * @param runner 运行器
*/
export declare const setRunner: (runner: "node" | "tsx" | "pm2") => void;
/**
 * @description 设置运行模式
 * @param mode 模式
 */
export declare const setMode: (mode?: string) => void | "" | undefined;
/**
 * @description 设置监听模式
 * @param watch 是否监听
 */
export declare const setWatch: (watch?: boolean) => false | void | undefined;
/**
 * @description 设置默认参数
 */
export declare const setDefault: () => void;
