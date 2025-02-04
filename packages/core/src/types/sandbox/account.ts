import { Sex } from '../event'

/**
 * 登录号信息
 */
export interface AccountInfo {
  /** 登录号ID */
  userId: string
  /** 昵称 */
  nick: string
  /** 性别 */
  sex: Sex
  /** 头像 */
  avatar: string
  /** 签名 */
  sign: string
  /** 在线状态 */
  status: 'online' | 'offline' | 'hidden'
}
