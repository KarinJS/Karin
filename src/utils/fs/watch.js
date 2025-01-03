import path from 'node:path';
import chokidar from 'chokidar';
import { clearRequireFile, requireFileSync } from './require';
const cache = new Map();
/**
 * 监听文件变动
 * @param file 文件路径
 * @param fnc 文件变动后调用的函数
 */
export const watch = (file, fnc) => {
    /** 检查此文件是否已有监听器 已有则先将原来的停止 */
    const isWatch = cache.get(file);
    if (isWatch) {
        isWatch.close();
        cache.delete(file);
    }
    /** 新的监听 */
    const watcher = chokidar.watch(file);
    /** 缓存监听器 */
    cache.set(file, watcher);
    /** 监听文件变动 */
    watcher.on('change', async () => {
        logger.info(`[配置文件变动] ${path.relative(process.cwd(), file).replace(/\\/g, '/')}`);
        const oldData = requireFileSync(file);
        clearRequireFile(file);
        const newData = requireFileSync(file);
        typeof fnc === 'function' && fnc(oldData, newData);
    });
    /** 监听删除 */
    watcher.on('unlink', () => {
        logger.info(`[配置文件删除] ${path.relative(process.cwd(), file).replace(/\\/g, '/')}`);
        clearRequireFile(file);
    });
    /** 如果watcher被关闭 则当前实例移除全部监听器并清理watcherMap中的缓存 */
    watcher.once('close', () => {
        watcher.removeAllListeners();
        cache.delete(file);
        clearRequireFile(file);
    });
    return new Watch(file, watcher);
};
/**
 * 传入两个配置文件路径，监听第一个的变动并返回合并后的配置
 * @param dynamicFile 动态配置文件路径
 * @param defaultCFile 默认配置文件路径
 */
export const watchAndMerge = (dynamicFile, defaultCFile, fnc) => {
    /** 监听器 */
    const watcher = watch(dynamicFile, fnc);
    return new Watcher(dynamicFile, defaultCFile, watcher.watcher);
};
/**
 * 监听管理器
 * @param file 文件路径
 * @param fnc 文件变动后调用的函数
 */
export class Watch {
    watcher;
    file;
    constructor(file, watcher) {
        /** 监听器 */
        this.watcher = watcher;
        /** 动态配置文件路径 */
        this.file = file;
    }
    /**
     * @description 获取配置数据
     */
    get value() {
        return requireFileSync(this.file);
    }
    /**
     * @description 关闭监听器并清理全部缓存
     */
    close() {
        /** 清理缓存 */
        clearRequireFile(this.file);
        /** 关闭监听器 */
        return this.watcher.close();
    }
}
export class Watcher {
    watcher;
    dynamicFile;
    defaultCFile;
    constructor(dynamicFile, defaultCfgFile, watcher) {
        /** 监听器 */
        this.watcher = watcher;
        /** 动态配置文件路径 */
        this.dynamicFile = dynamicFile;
        /** 默认配置文件路径 */
        this.defaultCFile = defaultCfgFile;
    }
    /**
     * @description 获取配置数据
     */
    get value() {
        const dynamicData = requireFileSync(this.dynamicFile);
        const defaultData = requireFileSync(this.defaultCFile);
        if (typeof defaultData === 'object' && typeof dynamicData === 'object') {
            return { ...defaultData, ...dynamicData };
        }
        if (Array.isArray(defaultData) && Array.isArray(dynamicData)) {
            return [...defaultData, ...dynamicData];
        }
        return dynamicData;
    }
    /**
     * @description 关闭监听器并清理全部缓存
     */
    close() {
        /** 清理缓存 */
        clearRequireFile(this.defaultCFile);
        /** 关闭监听器 */
        return this.watcher.close();
    }
}
