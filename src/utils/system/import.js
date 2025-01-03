/**
 * 动态导入模块
 * @param url 模块地址 仅支持绝对路径
 * @param isRefresh 是否重新加载 不使用缓存
 */
export const importModule = async (url, isRefresh = false) => {
    try {
        const module = await import(`file://${url}${isRefresh ? `?t=${Date.now()}` : ''}`);
        return { status: true, data: module };
    }
    catch (error) {
        return { status: false, data: error };
    }
};
