import { lookup } from 'dns/promises';
/**
 * 判断给定的 hostname 或 IP 是否为本机的回环地址 支持v6(可能不全)
 * @param hostnameOrIp - 要检查的 hostname 或 IP 地址
 */
export const isLoopback = async (hostnameOrIp) => {
    try {
        const addresses = await lookup(hostnameOrIp, { all: true });
        return addresses.some(addr => isIPv4Loop(addr.address) || isIPv6Loop(addr.address));
    }
    catch {
        // 如果解析失败 则默认不是回环地址
        return false;
    }
};
/**
 * 判断一个 v4 地址是否在回环范围内
 * @param ip - IPv4 地址字符串
 */
export const isIPv4Loop = (ip) => {
    const parts = ip.split('.').map(Number);
    const isLoopback = parts.length === 4 && parts[0] === 127;
    const isInRange = parts.every(part => Number.isInteger(part) && part >= 0 && part <= 255);
    return isLoopback && isInRange;
};
/**
 * 判断一个 IPv6 地址是否是回环地址 (::1 或 ::ffff:127.x.x.x)
 * @param ip - IPv6 地址字符串
 */
export const isIPv6Loop = (ip) => {
    if (ip === '::1')
        return true;
    if (ip.startsWith('::ffff:')) {
        const ipv4Part = ip.substring(7);
        return isIPv4Loop(ipv4Part);
    }
    return false;
};
/**
 * 获取请求的 IP 地址
 * 优先级: x-forwarded-for > remoteAddress > ip > hostname
 * @param req - 请求对象
 */
export const getRequestIp = (req) => {
    const list = [];
    /** 反向代理的 IP */
    const xForwardedFor = req.headers['x-forwarded-for'];
    if (Array.isArray(xForwardedFor)) {
        list.push(...xForwardedFor);
    }
    else if (typeof xForwardedFor === 'string') {
        list.push(xForwardedFor);
    }
    const remoteAddress = req.socket.remoteAddress;
    const ip = req.ip;
    const hostname = req.hostname;
    if (ip)
        list.push(ip);
    if (hostname)
        list.push(hostname);
    if (remoteAddress)
        list.push(remoteAddress);
    return list.filter(Boolean);
};
/**
 * 传入一个请求对象 判断是否为本机请求
 * @param req - 请求对象
 */
export const isLocalRequest = async (req) => {
    const ips = getRequestIp(req);
    for (const ip of ips) {
        /** 如果有一个不是本机地址 则返回 false */
        const isLocal = await isLoopback(ip);
        if (!isLocal)
            return false;
    }
    return true;
};
