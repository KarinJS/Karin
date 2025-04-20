import { red } from 'kolorist'
import { ALIYUN_REGISTRY } from './registry'
import { exec } from './exec'

/**
 * 获取当前pm2的版本
 */
export const getPm2Version = async () => {
  const { stdout } = await exec('pm2 --version')
  return stdout.trim()
}

/**
 * install pm2
 * @param suffix - 镜像源后缀
 * @packages retry - 重试次数
 * @returns boolean
 */
export const installPm2 = async (
  suffix: string,
  retry: number = 0
): Promise<boolean> => {
  const cmd = `npm install -g pm2@latest${suffix ? ` --registry=${suffix}` : ''}`
  try {
    const { stdout } = await exec(cmd)
    return stdout.trim().length > 0
  } catch (error) {
    if (retry > 0) {
      /** 重试一次 使用阿里云兜底 */
      console.log(red(`[pm2] 安装失败，正在使用 ${ALIYUN_REGISTRY} 重试...`))
      return installPm2(ALIYUN_REGISTRY, retry - 1)
    }

    throw new Error(red('pm2 安装失败，请检查你的网络环境'))
  }
}
