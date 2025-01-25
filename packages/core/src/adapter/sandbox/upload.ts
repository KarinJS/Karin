import fs from 'node:fs'
import path from 'node:path'
import { AdapterSandbox } from './adapter'
import { sandboxDataPath } from '@/root'
import { downFile } from '@/utils/fs/file'

/**
 * 上传头像
 * @param type 类型
 * @param targetId 目标id
 * @param data 文件内容
 * @returns 返回文件名`(带后缀)`
 */
export const uploadAvatar = async (
  bot: AdapterSandbox,
  type: 'friend' | 'group',
  targetId: string,
  data: string
) => {
  const prefix = type === 'friend' ? bot.prefix.friendAvatar : bot.prefix.groupAvatar
  const file = path.join(sandboxDataPath, 'avatar', `${prefix}${targetId}${bot.prefix.avatarExt}`)
  /** 如果文件存在 先删掉 */
  if (fs.existsSync(file)) {
    await fs.promises.unlink(file)
  }

  if (data.startsWith('http')) {
    const result = await downFile(data, file)
    if (!result) {
      throw new Error('文件下载失败，请检查链接是否有效')
    }
  } else if (data.startsWith('base64://')) {
    await fs.promises.writeFile(file, Buffer.from(data.replace(/^base64:\/\//, ''), 'base64'))
  } else if (fs.existsSync(data)) {
    await fs.promises.copyFile(data, file)
  } else {
    throw new Error('文件格式错误，请检查文件是否为base64或http链接: ' + data)
  }

  if (type === 'friend') {
    return bot.getAvatarUrl(targetId)
  }

  return bot.getGroupAvatarUrl(targetId)
}
