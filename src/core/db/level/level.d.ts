import { Level } from 'level';
export declare class LevelDB extends Level {
    id: string;
    get: ((key: string) => Promise<any>) & typeof Level.prototype.get;
    constructor(path: string);
    /**
     * 和get方法一样
     * @param key 键
     * @param value 值
     */
    set(key: string, value: string | object): Promise<void>;
    /**
     * 和get方法一样 但是不抛出错误
     * @param key 键
     */
    has(key: string): Promise<any | null>;
}
/**
 * @description 创建 LevelDB 数据库客户端
 * @returns LevelDB 数据库实例
 */
export declare const createLevelDB: () => LevelDB;
