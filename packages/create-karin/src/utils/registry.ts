import { exec } from './exec'
import { raceRequest } from './race'

/** 官方 */
export const NPM_REGISTRY = 'https://registry.npmjs.org'
/** 阿里云 */
export const ALIYUN_REGISTRY = 'https://registry.npmmirror.com'
/** 腾讯云 */
export const TENCENT_REGISTRY = 'https://mirrors.cloud.tencent.com/npm'

/**
 * 可用的 Registry 列表
 */
export interface RegistryOption {
  /** 名称 */
  name: string
  /** 地址 */
  url: string
}

/**
 * 获取可用的registry列表
 * @returns registry列表
 */
export const getRegistryList = (): RegistryOption[] => {
  return [
    { name: '官方源', url: NPM_REGISTRY },
    { name: '阿里云', url: ALIYUN_REGISTRY },
    { name: '腾讯云', url: TENCENT_REGISTRY },
  ]
}

/**
 * 获取最快的registry源
 * @param url 镜像源URL
 * @returns 官方源兜底
 */
export const getBestRegistry = async (): Promise<string> => {
  try {
    const url = [NPM_REGISTRY, ALIYUN_REGISTRY, TENCENT_REGISTRY]
    const regult = await raceRequest(url)
    return regult!.config.url! || ALIYUN_REGISTRY
  } catch (error) {
    return ALIYUN_REGISTRY
  }
}

/**
 * 获取当前registry源
 * @returns registry源
 */
export const getRegistry = async (): Promise<string> => {
  const { stdout } = await exec('npm config get registry')
  return stdout.trim()
}

/**
 * 设置registry源
 * @param registry registry源地址
 * @returns 是否设置成功
 */
export const setRegistry = async (registry: string): Promise<boolean> => {
  try {
    await exec(`npm config set registry ${registry}`)
    return true
  } catch (error) {
    return false
  }
}

/**
 * 获取当前registry源的名称
 * @returns registry源名称
 */
export const getCurrentRegistryName = async (): Promise<string> => {
  const currentRegistry = await getRegistry()
  const registryList = getRegistryList()

  const found = registryList.find(item => currentRegistry.includes(item.url))
  return found ? found.name : '未知源'
}
