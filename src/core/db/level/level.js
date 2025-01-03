import { levelPath } from '@root';
import { Level } from 'level';
export class LevelDB extends Level {
    id;
    get;
    constructor(path) {
        super(path, { valueEncoding: 'json' });
        this.id = 'Level';
        this.get = super.get.bind(this);
    }
    /**
     * 和get方法一样
     * @param key 键
     * @param value 值
     */
    async set(key, value) {
        return await super.put(key, value);
    }
    /**
     * 和get方法一样 但是不抛出错误
     * @param key 键
     */
    async has(key) {
        try {
            return await super.get(key);
        }
        catch {
            return null;
        }
    }
}
/**
 * @description 创建 LevelDB 数据库客户端
 * @returns LevelDB 数据库实例
 */
export const createLevelDB = () => {
    return new LevelDB(levelPath);
};
