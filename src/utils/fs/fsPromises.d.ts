/**
 * 异步检查路径文件是否存在
 * @param file 文件路径
 * @returns 返回布尔值
 */
export declare const exists: (file: string) => Promise<boolean>;
/**
 * 异步检查是否为目录
 * @param file 文件路径
 * @returns 返回布尔值
 */
export declare const isDir: (file: string) => Promise<boolean>;
/**
 * 异步检查是否为文件
 * @param file 文件路径
 * @returns 返回布尔值
 */
export declare const isFile: (file: string) => Promise<boolean>;
/**
 * 递归创建文件夹
 * @param dirname 文件夹路径
 * @returns 返回布尔值 是否创建成功
 */
export declare const mkdir: (dirname: string) => Promise<boolean>;
/**
 * 检查目录是否存在 不存在则创建
 * @param file 文件路径
 * @returns 返回布尔值
 */
export declare const existToMkdir: (file: string) => Promise<boolean>;
