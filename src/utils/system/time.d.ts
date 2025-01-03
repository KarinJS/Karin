/**
 * 获取kairn运行时间
 * @example
 * ```ts
 * uptime()
 * ```
 */
export declare const uptime: () => string;
/**
 * @description 传入一个或两个时间戳
 * @description 传入一个返回当前时间 - 时间1
 * @description 传入两个返回时间2 - 时间1
 * @param time - 时间戳
 * @example
 * common.formatTime(1620000000)
 * // -> '18天'
 * common.formatTime(1620000000, 1620000000)
 * // -> '18天'
 */
export declare const formatTime: (time: number, time2?: number) => string;
