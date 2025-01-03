/**
 * @description 运行子进程
 * @returns 返回子进程
 */
export declare const runFork: () => void;
/**
 * @description dev模式启动 `js`热更新
 * @param isWatch 是否监听文件变化并重启
 * @returns 返回子进程
 */
export declare const runDev: (isWatch?: boolean) => void;
/**
 * @description `tsx` 启动
 * @param pkg 包信息
 * @param isWatch 是否监听文件变化并重启
 */
export declare const runTsx: (pkg: Record<string, any>, isWatch?: boolean) => Promise<void>;
/**
 * @description 执行命令
 * @param command 命令
 */
export declare const command: (command: string) => Promise<boolean>;
/**
 * @description 检查是否安装了 `pm2`
 */
export declare const checkPM2: () => Promise<boolean>;
/**
 * @description `pm2` 启动成功打印信息
 */
export declare const printPM2: () => Promise<void>;
/**
 * @description 初始化`pm2`守护进程 后台启动
 */
export declare const runPM2: () => Promise<void>;
/**
 * @description 停止 PM2 守护进程
 */
export declare const stopPM2: () => Promise<void>;
/**
 * @description 重启 PM2 守护进程
 */
export declare const restartPM2: () => Promise<void>;
/**
 * @description 查看 PM2 日志
 */
export declare const logPM2: () => Promise<void>;
