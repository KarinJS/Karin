import type { GetPluginType, GetPluginReturn } from '@/types/plugin';
/**
 * 获取插件
 * @param type 获取插件的方式
 * @param isInfo 是否获取插件详细信息 否则返回插件名称列表
 */
export declare const getPlugins: <T extends boolean = false>(type: GetPluginType, isInfo?: T) => Promise<GetPluginReturn<T>>;
/**
 * 判断是否为npm插件
 * @param name pkg名称
 * @returns 是否为pkg插件
 */
export declare const isNpmPlugin: (name: string) => Promise<boolean>;
