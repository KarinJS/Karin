import type { PkgInfo, PluginFile, PluginFncTypes } from '@/types/plugin';
/**
 * 创建日志方法
 * @param enable 是否启用
 * @param isBot 是否为bot
 */
export declare const createLogger: <T extends boolean>(enable?: boolean, isBot?: T) => T extends true ? (id: string, log: string) => void : (log: string) => void;
/**
 * 创建插件文件对象
 * @param type - 文件类型
 */
export declare const createFile: <T extends PluginFncTypes>(type: T, name: string) => PluginFile<T>;
/**
 * 创建插件pkg对象
 */
export declare const createPkg: () => PkgInfo;
