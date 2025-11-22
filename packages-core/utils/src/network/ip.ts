import { lookup } from 'node:dns/promises'
import type { LookupAddress } from 'node:dns'
import type { Request } from 'express'

/**
 * 判断 IPv4 地址是否为回环地址
 *
 * @param ip - IPv4 地址
 * @returns 是否为回环地址（127.0.0.0/8）
 *
 * @example
 * ```typescript
 * isIPv4Loopback('127.0.0.1') // true
 * isIPv4Loopback('127.0.0.255') // true
 * isIPv4Loopback('192.168.1.1') // false
 * ```
 *
 * @public
 */
export const isIPv4Loopback = (ip: string): boolean => {
  const parts = ip.split('.').map(Number)
  const isLoopback = parts.length === 4 && parts[0] === 127
  const isValid = parts.every(part => Number.isInteger(part) && part >= 0 && part <= 255)
  return isLoopback && isValid
}

/**
 * 判断 IPv6 地址是否为回环地址
 *
 * @param ip - IPv6 地址
 * @returns 是否为回环地址（::1 或 ::ffff:127.x.x.x）
 *
 * @example
 * ```typescript
 * isIPv6Loopback('::1') // true
 * isIPv6Loopback('::ffff:127.0.0.1') // true
 * isIPv6Loopback('fe80::1') // false
 * ```
 *
 * @public
 */
export const isIPv6Loopback = (ip: string): boolean => {
  // ::1 是 IPv6 标准回环地址
  if (ip === '::1') {
    return true
  }

  // ::ffff:127.x.x.x 是 IPv4 映射的 IPv6 地址
  if (ip.startsWith('::ffff:')) {
    const ipv4Part = ip.substring(7)
    return isIPv4Loopback(ipv4Part)
  }

  return false
}

/**
 * 判断主机名或 IP 地址是否为回环地址
 *
 * @param hostnameOrIp - 主机名或 IP 地址
 * @returns 是否为回环地址
 *
 * @example
 * ```typescript
 * await isLoopback('localhost') // true
 * await isLoopback('127.0.0.1') // true
 * await isLoopback('::1') // true
 * await isLoopback('example.com') // false
 * ```
 *
 * @public
 */
export const isLoopback = async (hostnameOrIp: string): Promise<boolean> => {
  try {
    const addresses: LookupAddress[] = await lookup(hostnameOrIp, { all: true })
    return addresses.some(addr =>
      isIPv4Loopback(addr.address) || isIPv6Loopback(addr.address)
    )
  } catch {
    // 解析失败，默认不是回环地址
    return false
  }
}

/**
 * 从 Express 请求对象获取客户端 IP 地址列表
 *
 * 优先级：x-forwarded-for > remoteAddress > ip > hostname
 *
 * @param req - Express 请求对象
 * @returns IP 地址列表
 *
 * @example
 * ```typescript
 * app.get('/api', (req, res) => {
 *   const ips = getRequestIp(req)
 *   console.log('Client IPs:', ips)
 * })
 * ```
 *
 * @public
 */
export const getRequestIp = (req: Request): string[] => {
  const list: string[] = []

  // 反向代理的 IP（可能包含多个）
  const xForwardedFor = req.headers['x-forwarded-for']
  if (Array.isArray(xForwardedFor)) {
    list.push(...xForwardedFor)
  } else if (typeof xForwardedFor === 'string') {
    list.push(...xForwardedFor.split(',').map(ip => ip.trim()))
  }

  // 直接连接的 IP
  const { remoteAddress } = req.socket
  const { ip, hostname } = req

  if (ip) list.push(ip)
  if (hostname) list.push(hostname)
  if (remoteAddress) list.push(remoteAddress)

  return list.filter(Boolean)
}

/**
 * 判断 Express 请求是否来自本地
 *
 * @param req - Express 请求对象
 * @returns 是否为本地请求
 *
 * @example
 * ```typescript
 * app.get('/admin', async (req, res) => {
 *   if (!await isLocalRequest(req)) {
 *     return res.status(403).send('Access denied')
 *   }
 *   // 处理管理请求
 * })
 * ```
 *
 * @public
 */
export const isLocalRequest = async (req: Request): Promise<boolean> => {
  const ips = getRequestIp(req)

  // 所有 IP 都必须是本地地址
  for (const ip of ips) {
    const isLocal = await isLoopback(ip)
    if (!isLocal) {
      return false
    }
  }

  return true
}
