import { Options } from './types';
/**
 * @description 处理模板
 * @param options 截图参数
 */
export declare const renderTpl: (options: Omit<Options, "name"> & {
    name?: string;
}) => Omit<Options, "name"> & {
    name?: string;
};
