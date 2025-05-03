import { red } from 'kolorist'
import { ALIYUN_REGISTRY } from './registry'
import { exec } from './exec'

/**
 * 获取当前pnpm的版本
 */
export const getPnpmVersion = async () => {
  const { stdout } = await exec('pnpm --version')
  return stdout.trim()
}

/**
 * install pnpm
 * @param suffix - 镜像源后缀
 * @packages retry - 重试次数
 * @returns boolean
 */
export const installPnpm = async (
  suffix: string,
  retry: number = 0
): Promise<boolean> => {
  const cmd = `npm install -g pnpm@^9${suffix ? ` --registry=${suffix}` : ''}`
  try {
    const { stdout } = await exec(cmd)
    return stdout.length > 0
  } catch (error) {
    if (retry > 0) {
      /** 重试一次 使用阿里云兜底 */
      console.log(red(`[pnpm] 安装失败，正在使用 ${ALIYUN_REGISTRY} 重试...`))
      return installPnpm(ALIYUN_REGISTRY, retry - 1)
    }

    throw new Error(red('pnpm 安装失败，请检查你的网络环境'))
  }
}
