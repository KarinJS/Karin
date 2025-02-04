import fs from 'node:fs'
import path from 'node:path'
import { sandboxDataPath } from '@/root'
import { buffer } from '@/utils/fs/data'
import { DEFAULT_USER_AVATAR, DEFAULT_GROUP_AVATAR } from './db'

/** 好友头像前缀 */
const FRIEND_AVATAR_PREFIX = 'friend_avatar_'
/** 群头像前缀 */
const GROUP_AVATAR_PREFIX = 'group_avatar_'
/** 登录号头像前缀 */
const SELF_AVATAR = 'self_avatar'

/**
 * 组合头像文件名称
 * @param type 类型
 * @param targetId 目标id
 * @returns 返回文件名`(带后缀)`
 */
const getAvatarFileName = (
  type: 'friend' | 'group' | 'self',
  targetId: string
) => {
  if (type === 'self') {
    return `${SELF_AVATAR}.png`
  }

  const prefix = type === 'friend' ? FRIEND_AVATAR_PREFIX : GROUP_AVATAR_PREFIX
  return `${prefix}${targetId}.png`
}

/**
 * 上传头像
 * @param type 类型
 * @param targetId 目标id
 * @param data 文件内容
 * @returns 返回文件名`(带后缀)`
 */

export const uploadAvatar = async (
  type: 'friend' | 'group' | 'self',
  targetId: string,
  data: string
) => {
  const basename = getAvatarFileName(type, targetId)
  const dir = path.join(sandboxDataPath, 'avatar')
  if (!fs.existsSync(dir)) {
    await fs.promises.mkdir(dir, { recursive: true })
  }

  /** 如果文件存在 先删掉 */
  const file = path.join(dir, basename)
  if (fs.existsSync(file)) {
    await fs.promises.unlink(file)
  }

  const avatar = await buffer(data)
  await fs.promises.writeFile(file, avatar)
  return getAvatarUrl(type, targetId)
}

/**
 * 获取头像url
 * @param type 类型
 * @param targetId 目标id
 * @returns 返回头像url
 */
export const getAvatarUrl = (
  type: 'friend' | 'group' | 'self',
  targetId: string
) => {
  const basename = getAvatarFileName(type, targetId)
  const file = path.join(sandboxDataPath, 'avatar', basename)
  if (fs.existsSync(file)) {
    /** 静态资源路径 web使用 */
    return `http://127.0.0.1:${process.env.HTTP_PORT}/sandbox/avatar/${basename}`
  }

  return type === 'friend' ? DEFAULT_GROUP_AVATAR : DEFAULT_USER_AVATAR
}
