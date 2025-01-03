/**
 * @description 根据文件后缀名从指定路径下读取符合要求的文件
 * @param path - 路径
 * @param ext - 后缀名、或后缀名列表
 * @param returnType - 返回类型 `name:文件名` `rel:相对路径` `abs:绝对路径`
 * @example
 * ```ts
 * filesByExt('./plugins/karin-plugin-test', '.js')
 * // -> ['1.js', '2.js']
 * filesByExt('./plugins', ['.js', '.ts'], 'name')
 * // -> ['1.js', '2.js', '3.ts']
 * filesByExt('./plugins', '.js', 'rel')
 * // -> ['plugins/1.js', 'plugins/2.js']
 * filesByExt('./plugins', '.js', 'abs')
 * // -> ['C:/Users/karin/plugins/1.js', 'C:/Users/karin/plugins/2.js']
 * ```
 */
export declare const filesByExt: (filePath: string, ext: string | string[], returnType?: "name" | "rel" | "abs") => string[];
/**
 * @description 分割路径为文件夹路径和文件名
 * @param filePath - 路径
 * @returns - 文件夹路径和文件名
 * @example
 * ```ts
 * splitPath('C:/Users/admin/1.txt')
 * // -> { dirname: 'C:/Users/admin', basename: '1.txt' }
 * ```
 */
export declare const splitPath: (filePath: string) => {
    dirname: string;
    basename: string;
};
/**
 * @description 去掉相对路径的前缀和后缀
 * @param filePath - 相对路径路径
 * @example
 * ```ts
 * getRelPath('./plugins/karin-plugin-example/index.ts')
 * // -> 'plugins/karin-plugin-example/index.ts'
 * ```
 */
export declare const getRelPath: (filePath: string) => string;
/**
 * 根据传入的 import.meta.url 计算相对于项目根目录的路径，返回需要的 '../' 层级。
 * @param url - import.meta.url
 * @returns 相对路径的层级数量，用 '../' 表示
 * @example
 * ```ts
 * // 在 plugins/karin-plugin-example/index.ts 中使用
 * urlToPath(import.meta.url)
 * // -> '../../'
 * ```
 */
export declare const urlToPath: (url: string) => string;
/**
 * @description 检查目标路径是否处于根路径下
 * @param root 根路径
 * @param target 目标路径
 * @param isAbs 是否将传入的路径转为绝对路径
 * @returns 返回布尔值
 */
export declare const isSubPath: (root: string, target: string, isAbs?: boolean) => boolean | "";
