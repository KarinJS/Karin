import { type Request } from 'express';
/**
 * 判断给定的 hostname 或 IP 是否为本机的回环地址 支持v6(可能不全)
 * @param hostnameOrIp - 要检查的 hostname 或 IP 地址
 */
export declare const isLoopback: (hostnameOrIp: string) => Promise<boolean>;
/**
 * 判断一个 v4 地址是否在回环范围内
 * @param ip - IPv4 地址字符串
 */
export declare const isIPv4Loop: (ip: string) => boolean;
/**
 * 判断一个 IPv6 地址是否是回环地址 (::1 或 ::ffff:127.x.x.x)
 * @param ip - IPv6 地址字符串
 */
export declare const isIPv6Loop: (ip: string) => boolean;
/**
 * 获取请求的 IP 地址
 * 优先级: x-forwarded-for > remoteAddress > ip > hostname
 * @param req - 请求对象
 */
export declare const getRequestIp: (req: Request) => string[];
/**
 * 传入一个请求对象 判断是否为本机请求
 * @param req - 请求对象
 */
export declare const isLocalRequest: (req: Request) => Promise<boolean>;
