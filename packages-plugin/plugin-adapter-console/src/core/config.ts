import { PluginConfig } from '@karinjs/config'
import pkg from '../../package.json'

export interface ConsoleConfig {
  /**
   * 请求主机地址
   * @example
   * ```bash
   * http://example.com
   * ```
   */
  host: string
  /**
   * 请求验证令牌
   */
  token: string
  /**
   * 打印链接是否仅本地可访问
   */
  isLocal: boolean
  /**
   * 加盐字符串、位数
   * @description 用于生成临时文件名称的加盐字符串或位数，提升安全性
   * @default 3
   * @example
   * ```bash
   * # 这里有2种配置方式 1. 直接填写字符串 2. 填写数字表示生成随机字符串的长度
   * salt: karin-console-plugin
   * # 或者
   * salt: 3 # 对于配置长度，则会每次在启动后随机生成一个指定长度的字符串作为盐值
   * ```
   */
  salt: string | number
  /** 头像地址 */
  avatar: {
    /** 机器人头像 */
    bot: string
    /** 用户头像 */
    user: string
    /** 群头像 */
    group: string
  }
}

export const config = new PluginConfig<{ 'config.json': ConsoleConfig }>(pkg.name)
