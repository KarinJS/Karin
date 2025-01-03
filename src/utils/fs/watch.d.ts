import { type FSWatcher } from 'chokidar';
/**
 * 监听文件变动
 * @param file 文件路径
 * @param fnc 文件变动后调用的函数
 */
export declare const watch: <T>(file: string, fnc: (
/** 旧数据 */
oldData: T, 
/** 新数据 */
newData: T) => void) => Watch<T>;
/**
 * 传入两个配置文件路径，监听第一个的变动并返回合并后的配置
 * @param dynamicFile 动态配置文件路径
 * @param defaultCFile 默认配置文件路径
 */
export declare const watchAndMerge: <T>(dynamicFile: string, defaultCFile: string, fnc: (oldData: T, newData: T) => T) => Watcher<T>;
/**
 * 监听管理器
 * @param file 文件路径
 * @param fnc 文件变动后调用的函数
 */
export declare class Watch<T> {
    watcher: FSWatcher;
    file: string;
    constructor(file: string, watcher: FSWatcher);
    /**
     * @description 获取配置数据
     */
    get value(): T;
    /**
     * @description 关闭监听器并清理全部缓存
     */
    close(): Promise<void>;
}
export declare class Watcher<T> {
    watcher: FSWatcher;
    dynamicFile: string;
    defaultCFile: string;
    constructor(dynamicFile: string, defaultCfgFile: string, watcher: FSWatcher);
    /**
     * @description 获取配置数据
     */
    get value(): T | (T & any[])[number][];
    /**
     * @description 关闭监听器并清理全部缓存
     */
    close(): Promise<void>;
}
