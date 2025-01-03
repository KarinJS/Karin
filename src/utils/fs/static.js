import { cache } from '@/plugin/cache';
import { isSubPath } from './path';
/**
 * @description 传入一个文件路径，检查是否是静态资源中的文件
 * @param filePath 文件路径
 * @returns 是否是静态资源中的文件
 */
export const isStatic = (filePath) => {
    // TODO: 待完善
    try {
        for (const item of cache.static) {
            if (isSubPath(item, filePath)) {
                return true;
            }
        }
        return false;
    }
    catch (error) {
        logger.error('isStatic', error);
        return false;
    }
};
