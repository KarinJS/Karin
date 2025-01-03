/**
 * 动态导入模块
 * @param url 模块地址 仅支持绝对路径
 * @param isRefresh 是否重新加载 不使用缓存
 */
export declare const importModule: (url: string, isRefresh?: boolean) => Promise<{
    status: true;
    data: any;
} | {
    status: false;
    data: unknown;
}>;
