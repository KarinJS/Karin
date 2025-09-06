import { URL } from 'node:url'
import { pingRequest } from './race'
import type { GithubConfig } from '@/types/utils/request'

/**
 * 构建符合 https://github.akams.cn/ 标准的github加速源
 * @param owner - 仓库所属用户名
 * @param repo - 仓库名
 * @returns 返回符合标准的github加速源
 */
export const buildGithub = (proxy: string): GithubConfig => {
  return {
    proxy,
    isClone: true,
    isRaw: true,
    raw: function (url: string) {
      return `${this.proxy}/${url}`
    },
    clone: function (url: string) {
      return `${this.proxy}/${url}`
    },
  }
}

/**
 * 解析github地址
 * @param url - github地址
 * @returns 返回解析后的地址
 */
export const parseGithubUrl = (url: string) => {
  const urlObj = new URL(url)
  /** 用户名 */
  const owner = urlObj.pathname.split('/')[1]
  /** 仓库名 */
  const repo = urlObj.pathname.split('/')[2]
  /** 路径 */
  const path = urlObj.pathname.split('/').slice(3).join('/')
  return { owner, repo, path }
}

/**
 * Gihub加速 获取当前最快的源
 * @param urls - 请求地址数组
 * @param owner - 仓库所属用户名
 * @param repo - 仓库名
 * @returns 返回最快的源
 */
export const getFastGithub = async (type: 'raw' | 'clone'): Promise<GithubConfig> => {
  const list: GithubConfig[] = [
    {
      proxy: 'https://github.com',
      isClone: true,
      isRaw: true,
      raw: function (url: string) {
        return url
      },
      clone: function (url: string) {
        return url
      },
    },
    {
      proxy: 'https://jsd.cdn.zzko.cn/gh',
      isClone: false,
      isRaw: true,
      raw: function (url: string) {
        const { owner, repo, path } = parseGithubUrl(url)
        return `${this.proxy}/${owner}/${repo}/${path}`
      },
      clone: function (url: string) {
        const { owner, repo } = parseGithubUrl(url)
        return `${this.proxy}/${owner}/${repo}`
      },
    },
    {
      proxy: 'https://jsd.onmicrosoft.cn/gh',
      isClone: false,
      isRaw: true,
      raw: function (url: string) {
        const { owner, repo, path } = parseGithubUrl(url)
        return `${this.proxy}/${owner}/${repo}/${path}`
      },
      clone: function (url: string) {
        const { owner, repo } = parseGithubUrl(url)
        return `${this.proxy}/${owner}/${repo}`
      },
    },
    buildGithub('https://gitproxy.click'),
    buildGithub('https://gh.qninq.cn'),
    buildGithub('https://github.starrlzy.cn'),
    buildGithub('https://gh-proxy.ygxz.in'),
  ]

  /** 最终ping的配置列表 */
  const urls: GithubConfig[] = []
  list.forEach(item => {
    if (type === 'raw' && item.isRaw) {
      urls.push(item)
    } else if (type === 'clone' && item.isClone) {
      urls.push(item)
    }
  })

  const rawUrl = 'https://raw.githubusercontent.com/github/docs/refs/heads/main/README.md'
  const gitCloneUrl = 'https://github.com/github/docs.git'
  /** 最终需要ping的url */
  const pingUrls: string[] = []
  /** 测试url和github配置map */
  const map: Record<string, GithubConfig> = {}

  urls.forEach(item => {
    const url = type === 'raw' ? item.raw(rawUrl) : item.clone(gitCloneUrl)
    pingUrls.push(url)
    map[url] = item
  })

  const result = await pingRequest(pingUrls, { detailed: true, isRace: true })
  if (!result) {
    return list[0]
  }

  return map[result.url]
}
