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
export declare const base64: (data: unknown, options?: {
    http: boolean;
}) => Promise<string>;
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
export declare const buffer: <T extends {
    http: boolean;
}>(data: unknown, options?: T) => Promise<T extends {
    http: true;
} ? string : Buffer>;
/**
 * 将数据流对象转换为Buffer对象
 * @param stream - 要转换的数据流对象
 * @returns 返回Buffer对象
 * @example
 * ```ts
 * await stream(fs.createReadStream('C:/Users/admin/1.txt'))
 * // -> <Buffer ...>
 */
export declare const stream: (stream: Readable) => Promise<Buffer>;
/**
 * 传入文件路径 转为buffer
 * @param path - 文件路径
 * @returns 返回Buffer对象 如果发生错误则返回null
 */
export declare const readFile: (path: string) => Promise<Buffer | null>;
