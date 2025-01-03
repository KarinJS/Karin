export interface CacheEntry<T = any> {
    /** 缓存数据 */
    data: T;
    /** 过期时间的时间戳（毫秒） */
    expiry: number | 0;
}
export type Parser = (content: string) => any;
export type RequireOptions = {
    /** 文件编码，默认utf-8 */
    encoding?: BufferEncoding;
    /** 是否强制读取，不使用缓存 */
    force?: boolean;
    /** 过期时间，单位秒，默认300秒，0则永不过期 */
    ex?: number;
    /** 文件大小限制，单位字节，默认0无限制 */
    size?: number;
    /** 自定义解析器 */
    parser?: Parser;
};
export type RequireFunction = <T = any>(filePath: string, options?: RequireOptions) => Promise<T>;
export type RequireFunctionSync = <T = any>(filePath: string, options?: RequireOptions) => T;
/**
 * @description 清除指定缓存
 * @param filePath 文件路径
 * @returns 是否清除成功
 */
export declare const clearRequireFile: (filePath: string) => boolean;
/**
 * @description 清除所有缓存
 */
export declare const clearRequire: () => void;
/**
 * 异步导入文件
 * @description 缓存导入的文件 默认缓存300秒
 * @param filePath 文件路径
 * @param options 选项
 * @returns 返回文件的内容
 */
export declare const requireFile: RequireFunction;
/**
 * 同步导入文件
 * @description 缓存导入的文件 默认缓存300秒
 * @param filePath 文件路径
 * @param options 选项
 * @returns 返回文件的内容
 */
export declare const requireFileSync: RequireFunctionSync;
