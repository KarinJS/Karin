import fs from 'node:fs';
/**
 * 检查目录是否存在
 * @param file 文件路径
 * @returns 返回布尔值
 */
export declare const existsSync: (file: string) => boolean;
/**
 * 检查是否为目录
 * @param file 文件路径
 * @returns 返回布尔值
 */
export declare const isDirSync: (file: string) => boolean;
/**
 * 检查是否为文件
 * @param file 文件路径
 * @returns 返回布尔值
 */
export declare const isFileSync: (file: string) => boolean;
/**
 * 递归创建文件夹
 * @param dirname 文件夹路径
 * @returns 返回布尔值 是否创建成功
 */
export declare const mkdirSync: (dirname: string) => boolean;
/**
 * 检查目录是否存在 不存在则创建
 * @param file 文件路径
 * @returns 返回布尔值
 */
export declare const existToMkdirSync: (file: string) => boolean;
export declare const rmSync: typeof fs.rmSync;
