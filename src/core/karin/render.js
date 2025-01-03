import { callRender, renderHtml, renderMultiHtml } from '@/adapter/render';
/**
 * 渲染
 * @param options - 渲染参数
 * @param multiPageOrId - 多页截图参数
 * @param id - 页面id
 */
export const render = (options, multiPageOrId, id) => {
    if (options === 'opt') {
        return callRender(multiPageOrId, id);
    }
    if (typeof options === 'string') {
        if (!multiPageOrId) {
            return renderHtml(options);
        }
        return renderMultiHtml(options, multiPageOrId);
    }
    return callRender(options, multiPageOrId);
};
