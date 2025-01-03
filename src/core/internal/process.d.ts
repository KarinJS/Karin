/** 处理基本信号 */
export declare const processHandler: () => void;
/**
 * 检查是否存在后台进程
 * @param port - 端口号
 */
export declare const checkProcess: (port: number) => Promise<void>;
/**
 * @description 处理退出事件
 * @param code 退出码
 */
export declare const processExit: (code: unknown) => Promise<never>;
