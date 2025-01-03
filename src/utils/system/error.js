/**
 * @description 拆解错误对象 用于`JSON`序列化
 * @param error 错误对象
 * @returns 拆解后的错误对象
 */
export const stringifyError = (error) => {
    const { name, message, stack } = error || {};
    return { name, message, stack };
};
/**
 * 将错误对象转为字符串
 * @param error 错误对象
 * @returns 错误字符串
 */
export const errorToString = (error) => {
    if (!error)
        return '';
    return [
        `name: ${error.name}`,
        `message: ${error.message}`,
        `stack: ${error.stack?.toString()}`,
    ].join('\n');
};
