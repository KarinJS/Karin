/**
 * @description 拆解错误对象 用于`JSON`序列化
 * @param error 错误对象
 * @returns 拆解后的错误对象
 */
export declare const stringifyError: (error?: Error | null) => {
    name: string | undefined;
    message: string | undefined;
    stack: string | undefined;
};
/**
 * 将错误对象转为字符串
 * @param error 错误对象
 * @returns 错误字符串
 */
export declare const errorToString: (error?: Error | null) => string;
