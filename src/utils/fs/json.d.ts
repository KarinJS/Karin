/**
 * 读取 JSON 文件
 * @param path 文件路径
 * @param isThrow 是否抛出异常 默认为`false`
 */
export declare const readJsonSync: (path: string, isThrow?: boolean) => any;
/**
 * 写入 JSON 文件
 * @param path 文件路径
 * @param data 数据
 * @param isThrow 是否抛出异常 默认为`false`
 */
export declare const writeJsonSync: (path: string, data: any, isThrow?: boolean) => boolean;
/**
 * 异步读取 JSON 文件
 * @param path 文件路径
 *  @param isThrow 是否抛出异常 默认为`false`
 */
export declare const readJson: (path: string, isThrow?: boolean) => Promise<any>;
/**
 * 异步写入 JSON 文件
 * @param path 文件路径
 * @param data 数据
 * @param isThrow 是否抛出异常 默认为`false`
 */
export declare const writeJson: (path: string, data: any, isThrow?: boolean) => Promise<boolean>;
/** JSON 文件操作 */
export declare const json: {
    /** 同步读取 */
    readSync: (path: string, isThrow?: boolean) => any;
    /** 同步写入 */
    writeSync: (path: string, data: any, isThrow?: boolean) => boolean;
    /** 异步读取 */
    read: (path: string, isThrow?: boolean) => Promise<any>;
    /** 异步写入 */
    write: (path: string, data: any, isThrow?: boolean) => Promise<boolean>;
};
