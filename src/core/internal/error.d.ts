/**
 * @description 打印插件载入错误
 */
export declare const printMissing: () => void;
export declare const errorHandler: {
    /** 插件载入错误 */
    loaderPlugin: (name: string, file: string, error: unknown) => void;
    /** 定时任务执行错误 */
    taskStart: (name: string, task: string, error: unknown) => void;
    /** 打印插件载入错误 */
    printMissing: () => void;
};
