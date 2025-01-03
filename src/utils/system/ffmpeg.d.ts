import type { ExecOptions, ExecReturn } from '@/types/system';
/**
 * @description ffmpeg命令
 * @param cmd 命令
 * @param options 参数
 */
export declare const ffmpeg: <T extends boolean = false>(cmd: string, options?: ExecOptions<T>) => Promise<ExecReturn<T>>;
/**
 * @description ffprobe命令
 * @param cmd 命令
 * @param options 参数
 */
export declare const ffprobe: <T extends boolean = false>(cmd: string, options?: ExecOptions<T>) => Promise<ExecReturn<T>>;
/**
 * @description ffplay命令
 * @param cmd 命令
 * @param options 参数
 */
export declare const ffplay: <T extends boolean = false>(cmd: string, options?: ExecOptions<T>) => Promise<ExecReturn<T>>;
