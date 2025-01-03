import fs from 'node:fs';
/**
 * 异步检查路径文件是否存在
 * @param file 文件路径
 * @returns 返回布尔值
 */
export const exists = async (file) => {
    try {
        await fs.promises.access(file, fs.constants.F_OK);
        return true;
    }
    catch {
        return false;
    }
};
/**
 * 异步检查是否为目录
 * @param file 文件路径
 * @returns 返回布尔值
 */
export const isDir = async (file) => {
    try {
        const stat = await fs.promises.stat(file);
        return stat.isDirectory();
    }
    catch {
        return false;
    }
};
/**
 * 异步检查是否为文件
 * @param file 文件路径
 * @returns 返回布尔值
 */
export const isFile = async (file) => {
    try {
        const stat = await fs.promises.stat(file);
        return stat.isFile();
    }
    catch {
        return false;
    }
};
/**
 * 递归创建文件夹
 * @param dirname 文件夹路径
 * @returns 返回布尔值 是否创建成功
 */
export const mkdir = async (dirname) => {
    try {
        await fs.promises.mkdir(dirname, { recursive: true });
        return true;
    }
    catch {
        return false;
    }
};
/**
 * 检查目录是否存在 不存在则创建
 * @param file 文件路径
 * @returns 返回布尔值
 */
export const existToMkdir = async (file) => {
    try {
        if (!await exists(file))
            await mkdir(file);
        return true;
    }
    catch {
        return false;
    }
};
