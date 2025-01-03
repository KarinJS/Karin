import fs from 'node:fs';
import axios from 'axios';
import { sep } from './file';
import { Readable } from 'node:stream';
/**
 * 将数据转换为不带前缀的base64字符串
 * @param data - 文件路径或Buffer对象、可读流对象、http地址、base64://字符串
 * @param options - 选项 http为true时返回http地址
 * @returns 返回base64字符串
 * @example
 * ```ts
 * await base64('https://example.com/image.png')
 * await base64('C:/Users/admin/1.txt')
 * await base64('base64://aGVsbG8=')
 * await base64(fs.createReadStream('C:/Users/admin/1.txt'))
 * // -> 'aGVsbG8='
 * ```
 */
export const base64 = async (data, options = { http: false }) => {
    if (typeof data !== 'string') {
        if (Buffer.isBuffer(data))
            return data.toString('base64');
        if (data instanceof Uint8Array)
            return Buffer.from(data).toString('base64');
        if (data instanceof Readable)
            return (await stream(data)).toString('base64');
        /** tips: 正常来说应该是走不到这个位置。 */
        return data;
    }
    if (data.startsWith('base64://'))
        return data.replace('base64://', '');
    if (data.startsWith('http')) {
        if (options.http)
            return data;
        const response = await axios.get(data, { responseType: 'stream' });
        const buffer = await stream(response.data);
        return buffer.toString('base64');
    }
    const files = data.replace(sep, '');
    if (fs.existsSync(files))
        return (await fs.promises.readFile(files)).toString('base64');
    return Buffer.from(data, 'base64').toString('base64');
};
/**
 * 将数据转换为Buffer对象
 * @param data - 文件路径或Buffer对象、可读流对象、http地址、base64://字符串
 * @param options - 选项 http为true时返回http地址
 * @returns 返回Buffer对象
 * @example
 * ```ts
 * await buffer('https://example.com/image.png')
 * await buffer('C:/Users/admin/1.txt')
 * await buffer('base64://aGVsbG8=')
 * await buffer(fs.createReadStream('C:/Users/admin/1.txt'))
 * // -> <Buffer ...>
 * ```
 */
export const buffer = async (data, options) => {
    if (typeof data !== 'string') {
        if (Buffer.isBuffer(data))
            return data;
        if (data instanceof Uint8Array)
            return Buffer.from(data);
        if (data instanceof Readable)
            return await stream(data);
        return data;
    }
    if (data.startsWith('base64://')) {
        return Buffer.from(data.replace('base64://', ''), 'base64');
    }
    if (data.startsWith('http')) {
        if (options?.http)
            return data;
        const response = await axios.get(data, { responseType: 'arraybuffer' });
        return Buffer.from(response.data);
    }
    const files = data.replace(sep, '');
    if (fs.existsSync(files))
        return fs.readFileSync(files);
    return Buffer.from(data);
};
/**
 * 将数据流对象转换为Buffer对象
 * @param stream - 要转换的数据流对象
 * @returns 返回Buffer对象
 * @example
 * ```ts
 * await stream(fs.createReadStream('C:/Users/admin/1.txt'))
 * // -> <Buffer ...>
 */
export const stream = (stream) => new Promise((resolve, reject) => {
    const chunks = [];
    stream.on('data', chunk => chunks.push(chunk));
    stream.on('end', () => resolve(Buffer.concat(chunks)));
    stream.on('error', error => reject(error));
});
/**
 * 传入文件路径 转为buffer
 * @param path - 文件路径
 * @returns 返回Buffer对象 如果发生错误则返回null
 */
export const readFile = async (path) => {
    try {
        const data = await fs.promises.readFile(path);
        return data;
    }
    catch (error) {
        logger.error(error);
        return null;
    }
};
