/**
 * 提取指定版本号的更新日志
 * @param version 版本号
 * @param data `CHANGELOG.md`文件内容
 * @returns 更新日志
 */
export declare const log: (version: string, data: string) => string | null;
/**
 * 提取指定范围版本号的更新日志
 * @param version 起始版本号
 * @param data `CHANGELOG.md`文件内容
 * @param length 提取长度
 * @param reverse 是否反向提取 默认为`false`向后提取
 */
export declare const logs: (version: string, data: string, length?: number, reverse?: boolean) => string;
/**
 * 提取指定版本号之间的更新日志
 * @param data `CHANGELOG.md`文件内容
 * @param startVersion 起始版本号
 * @param endVersion 结束版本号
 * @description
 * - `CHANGELOG.md`的版本号排序约定为从新到旧
 * - 也就是说 结束版本号应该比起始版本号新
 * - 举例: `range(data, '1.0.0', '2.0.0')` 提取`1.0.0`到`2.0.0`之间的更新日志
 */
export declare const range: (data: string, startVersion: string, endVersion: string) => string;
/**
 * 对更新日志进行解析并形成对象
 * @param data 更新日志内容
 * @returns 以版本号为键的更新日志对象
 */
export declare const parseChangelog: (data: string) => Record<string, string>;
