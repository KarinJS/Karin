import type { Options, RenderResult } from '@/adapter/render/admin/types';
export interface Renders {
    /**
     * 快速渲染
     * @param file - 文件路径、http地址
     */
    render(file: string): Promise<string>;
    /**
     * 分片渲染
     * @param options - 渲染参数
     */
    render(file: string, multiPage: number | boolean): Promise<Array<string>>;
    /**
     * 自定义渲染
     * @param options - 渲染参数
     */
    render<T extends Options>(options: T, id?: string): Promise<RenderResult<T>>;
    /**
     * 如果第三个重载没有类型 请使用这个重载
     * @param options - 渲染参数
     */
    render<T extends Options>(type: 'opt', options: T, id?: string): Promise<RenderResult<T>>;
}
/**
 * 渲染
 * @param options - 渲染参数
 * @param multiPageOrId - 多页截图参数
 * @param id - 页面id
 */
export declare const render: <T extends Options>(options: string | T, multiPageOrId?: string | number | boolean | T, id?: string) => Promise<RenderResult<T>>;
