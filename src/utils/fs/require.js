import yaml from 'yaml';
import fs from 'node:fs';
import path from 'node:path';
const cache = new Map();
/**
 * @description 清除指定缓存
 * @param filePath 文件路径
 * @returns 是否清除成功
 */
export const clearRequireFile = (filePath) => {
    const absPath = path.resolve(filePath).replace(/\\/g, '/');
    return cache.has(absPath) && cache.delete(absPath);
};
/**
 * @description 清除所有缓存
 */
export const clearRequire = () => cache.clear();
/**
 * 异步导入文件
 * @description 缓存导入的文件 默认缓存300秒
 * @param filePath 文件路径
 * @param options 选项
 * @returns 返回文件的内容
 */
export const requireFile = async (filePath, options = {}) => {
    const now = Date.now();
    const absPath = path.resolve(filePath).replace(/\\/g, '/');
    const { encoding = 'utf-8', force = false, ex = 300, size = 0, parser } = options;
    const data = fileReady(absPath, now, force, ex);
    if (data !== false)
        return data;
    const content = await fs.promises.readFile(absPath, encoding);
    return fileCache(content, absPath, ex, now, size, encoding, parser);
};
/**
 * 同步导入文件
 * @description 缓存导入的文件 默认缓存300秒
 * @param filePath 文件路径
 * @param options 选项
 * @returns 返回文件的内容
 */
export const requireFileSync = (filePath, options = {}) => {
    const now = Date.now();
    const absPath = path.resolve(filePath).replace(/\\/g, '/');
    const { encoding = 'utf-8', force = false, ex = 300, size = 0, parser } = options;
    const data = fileReady(absPath, now, force, ex);
    if (data !== false)
        return data;
    const content = fs.readFileSync(absPath, encoding);
    return fileCache(content, absPath, ex, now, size, encoding, parser);
};
/**
 * @description 导入文件前准备
 * @param absPath 文件绝对路径
 * @param force 是否强制读取，不使用缓存
 * @param now 当前时间
 * @param ex 过期时间
 */
const fileReady = (absPath, now, force, ex) => {
    if (!force) {
        const cached = cache.get(absPath);
        if (cached) {
            /**  命中缓存 更新过期时间 */
            if (cached.expiry === 0 || cached.expiry > now) {
                if (ex <= 0)
                    return cached.data;
                touchRequireFile(absPath, ex);
                return cached.data;
            }
            else {
                cache.delete(absPath);
            }
        }
    }
    return false;
};
/**
 * @description 导入文件后续处理
 * @param content 文件内容
 * @param absPath 文件绝对路径
 * @param ex 过期时间
 * @param now 当前时间
 * @param size 文件大小
 * @param encoding 文件编码
 * @param parser 自定义解析器
 * @returns 文件内容
 */
const fileCache = (content, absPath, ex, now, size, encoding, parser) => {
    /** 判断文件大小 字节 */
    if (size > 0 && Buffer.byteLength(content, encoding) > size) {
        /** 文件过大 不进行缓存 */
        return parseContent(absPath, content, parser);
    }
    /** 自动解析 */
    const data = parseContent(absPath, content, parser);
    /** 过期时间 */
    const expiry = ex === 0 ? 0 : now + ex * 1000;
    /** 缓存数据 */
    cache.set(absPath, { data, expiry });
    return data;
};
/**
 * @description 更新过期时间到最新
 * @param filePath 文件路径
 * @param ex 过期时间
 */
const touchRequireFile = async (filePath, ex) => {
    // 内部使用的filePath不需要转换为绝对路径 已经是绝对路径了
    const entry = cache.get(filePath);
    if (entry) {
        entry.expiry = Date.now() + ex * 1000;
        cache.set(filePath, entry);
    }
};
/**
 * 根据文件后缀解析内容或使用自定义解析器
 * @param absPath 绝对路径
 * @param content 文件内容
 * @param parser 自定义解析器
 * @returns 解析后的数据
 */
const parseContent = (absPath, content, parser) => {
    if (parser)
        return parser(content);
    if (absPath.endsWith('.json')) {
        return JSON.parse(content);
    }
    else if (absPath.endsWith('.yaml') || absPath.endsWith('.yml')) {
        return yaml.parse(content);
    }
    else {
        return content;
    }
};
/** 每60秒检查一次过期时间 */
setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of cache.entries()) {
        /** 永不过期 */
        if (entry.expiry === 0)
            continue;
        /** 过期删除 */
        if (entry.expiry <= now)
            cache.delete(key);
    }
}, 60000);
