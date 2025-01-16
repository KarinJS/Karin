import { red } from 'kolorist'
import { exec, testUrls } from './tools'

/**
 * 测试网络环境
 */
export const pingUrls = async () => {
  const { succ, count } = await testUrls(undefined, { silent: false })

  const ping = succ * 2 > count
  const suffix = ping ? '--registry=https://registry.npmmirror.com' : ''
  return { ping, suffix }
}

/**
 * 检查pnpm是否安装
 */
export const checkPnpm = async () => {
  const { status } = await exec('pnpm -v')
  return status
}

/**
 * 安装pnpm
 */
export const installPnpm = async (suffix: string) => {
  const cmd = `npm install -g pnpm${suffix}`
  const { status } = await exec(cmd)
  if (!status) {
    throw new Error(red('pnpm 安装失败 请检查你的网络环境'))
  }
}

/**
 * 检查是否安装了pm2
 */
export const checkPm2 = async () => {
  const { status } = await exec('pm2 -v')
  return status
}

/**
 * 安装pm2
 */
export const installPm2 = async (suffix: string) => {
  const cmd = `npm install -g pm2${suffix}`
  const { status } = await exec(cmd)
  if (!status) {
    throw new Error(red('pm2 安装失败 请检查你的网络环境'))
  }
}

/**
 * 检查包管理器是否存在
 * @param packageManager - 包管理器名称
 */
export const checkPackageManager = async (packageManager: string) => {
  try {
    const { status } = await exec(`${packageManager} --version`)
    return status
  } catch {
    return false
  }
}

/**
 * 安装包管理器
 * @param packageManager - 包管理器名称
 * @param suffix - 镜像源后缀
 */
export const installPackageManager = async (packageManager: string, suffix = '') => {
  if (packageManager === 'pnpm') {
    await installPnpm(suffix)
  } else if (packageManager === 'yarn') {
    await exec(`npm install -g yarn${suffix}`)
  }
  // npm 不需要安装，因为它是 Node.js 自带的
}
