import axios from 'axios'
import { exec } from '../system'

import type { } from '@karinjs/logger'

/** npm registry、proxy、https-proxy配置 */
export interface NpmBaseConfigResponse {
  registry: string
  proxy: string
  'https-proxy': string
}

/** npm registry配置 */
export interface NpmRegistryResponse {
  _id: string
  _rev: string
  name: string
  'dist-tags': {
    latest: string
    [key: string]: string
  },
  versions: Record<string, {
    name: string
    version: string
    license: string,
    _id: string,
    maintainers: [
      {
        name: string,
        email: string
      }
    ],
    dist: {
      shasum: string,
      tarball: string,
      fileCount: number,
      integrity: string,
      signatures: {
        sig: string,
        keyid: string
      }[],
      unpackedSize: number
    },
    gitHead: string,
    _npmUser: {
      name: string,
      email: string
    },
    _npmVersion: string,
    _nodeVersion: string,
    _hasShrinkwrap: false,
    _npmOperationalInternal: {
      tmp: string,
      host: string
    }
    [key: string]: any
  }>
  time: Record<string, string>
  maintainers: [
    {
      name: string,
      email: string
    },
    {
      name: string,
      email: string
    }
  ],
  readme: string,
  readmeFilename: string
  [key: string]: any
}

/**
 * 获取registry
 */
export const getRegistry = async () => {
  if (process.env.npm_config_registry) {
    return process.env.npm_config_registry
  }

  const registry = await exec('npm config get registry')
  process.env.npm_config_registry = registry.stdout
  return registry.stdout
}

/**
 * 获取一个npm包registry配置
 * @param name - 包名
 * @returns registry
 */
export const getNpmRegistry = async (name: string): Promise<NpmRegistryResponse> => {
  /** 获取npm源 */
  const registry = await getRegistry()
  /** 请求npm源 */
  const response = await axios.get(`${registry}/${name}`)
  return response.data
}

/**
 * 获取一个npm包的最新版本
 * @param name - 包名
 * @returns 最新版本
 */
export const getNpmLatestVersion = async (name: string) => {
  try {
    const result = await getNpmRegistry(name)
    return result['dist-tags'].latest
  } catch (error) {
    const log = (global?.logger || console)
    log.debug(new Error(`获取${name}最新版本失败`, { cause: error }))
    return null
  }
}

/** 初始化一下 防止并发 */
getRegistry()
