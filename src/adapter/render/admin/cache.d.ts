import type { Options, RenderResult } from './types';
/** 渲染函数类型 */
export type Render = <T extends Options>(options: T) => Promise<RenderResult<T>>;
/**
 * @description 注册渲染器
 * @param id 渲染器ID
 * @param render 渲染函数
 * @returns 渲染器索引
 */
export declare const registerRender: (id: string, render: Render) => number;
/**
 * @description 卸载渲染器
 * @param index 渲染器索引
 * @returns 是否卸载成功
 */
export declare const unregisterRender: (index: number) => boolean;
/**
 * @description 返回渲染器实例 未键入随机
 * @param id 渲染器ID
 * @returns 渲染器实例
 */
export declare const getRender: (id?: string | number) => {
    /** 渲染器索引 唯一标识符 */
    index: number;
    /** 渲染器ID */
    id: string;
    /** 渲染函数 */
    render: Render;
};
/**
 * @description 调用标准渲染器
 * @param options 渲染器参数
 * @param id 指定渲染器ID
 */
export declare const callRender: <T extends Options>(options: T, id?: string) => Promise<RenderResult<T & {
    encoding: string;
}>>;
/**
 * @description 获取全部渲染器数量
 * @returns 渲染器数量
 */
export declare const getRenderCount: () => number;
/**
 * @description 获取全部渲染器列表
 * @returns 渲染器列表
 */
export declare const getRenderList: () => {
    /** 渲染器索引 唯一标识符 */
    index: number;
    /** 渲染器ID */
    id: string;
    /** 渲染函数 */
    render: Render;
}[];
/**
 * @description 快速渲染
 * @param data html路径、http地址
 * @returns 返回图片base64或数组
 */
export declare const renderHtml: (data: string) => Promise<string>;
/**
 * @description 快速分片渲染
 * @param file html路径、http地址
 * @param multiPage 分片高度 未传递为自动计算
 */
export declare const renderMultiHtml: (file: string, multiPage?: number | boolean) => Promise<string[]>;
declare class RenderCache {
    /**
     * 注册渲染器
     * @param data 渲染器数据
     * @param data.id 渲染器ID
     * @param data.type 渲染器类型
     * @param ata.render 渲染器标准方法
     * @returns 渲染器索引
     */
    app(data: {
        id: string;
        type?: 'image' | string;
        render: Render;
    }): number;
    /**
       * 卸载渲染器
       * @param index 渲染器索引
       * @returns 是否卸载成功
       */
    unapp(index: number): boolean;
    /**
       * 返回渲染器实例 未键入id返回第一个
       * @param id 渲染器ID
       * @returns 渲染器实例
       */
    App(id?: string): {
        /** 渲染器索引 唯一标识符 */
        index: number;
        /** 渲染器ID */
        id: string;
        /** 渲染函数 */
        render: Render;
    };
    /**
       * 调用标准渲染器
       */
    render<T extends Options>(options: T, id?: string): Promise<RenderResult<T>>;
    /**
       * 快速渲染
       * @param data html路径、http地址
       * @returns 返回图片base64或数组
       */
    renderHtml(data: string): Promise<string>;
    /**
       * 快速分片渲染
       * @param data html路径、http地址
       * @param multiPage 分片高度 自动计算传true
       */
    renderMultiHtml(data: string, multiPage?: number | boolean): Promise<string[]>;
}
/**
   * 渲染器管理器
   */
export declare const render: RenderCache;
/**
   * @description 即将废弃，请使用 `render`
  */
export declare const Renderer: RenderCache;
export {};
