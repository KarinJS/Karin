import { pingRequest } from './race'

export interface GithubConfig {
  proxy: string
  /**
   * 是否支持克隆
   */
  isClone: boolean
  /**
   * 是否支持raw
   */
  isRaw: boolean
  /**
   * 获取raw地址
   * @param owner - 仓库所属用户名
   * @param repo - 仓库名
   * @param path - 路径
   * @returns 返回raw地址
   */
  raw: (owner: string, repo: string, path: string) => string
  /**
   * 克隆地址
   * @param owner - 仓库所属用户名
   * @param repo - 仓库名
   * @returns 返回克隆地址
   */
  clone: (owner: string, repo: string) => string
}

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
    raw: function (owner: string, repo: string, path: string) {
      return `${this.proxy}/https://raw.githubusercontent.com/${owner}/${repo}/HEAD/${path}`
    },
    clone: function (owner: string, repo: string) {
      return `${this.proxy}/https://raw.githubusercontent.com/${owner}/${repo}`
    },
  }
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
      raw: function (owner: string, repo: string, path: string) {
        return `https://raw.githubusercontent.com/${owner}/${repo}/HEAD/${path}`
      },
      clone: function (owner: string, repo: string) {
        return `${this.proxy}/${owner}/${repo}.git`
      },
    },
    {
      proxy: 'https://jsd.cdn.zzko.cn/gh',
      isClone: false,
      isRaw: true,
      raw: function (owner: string, repo: string, path: string) {
        return `${this.proxy}/${owner}/${repo}/HEAD/${path}`
      },
      clone: function (owner: string, repo: string) {
        return `${this.proxy}/${owner}/${repo}`
      },
    },
    {
      proxy: 'https://jsd.onmicrosoft.cn/gh',
      isClone: false,
      isRaw: true,
      raw: function (owner: string, repo: string, path: string) {
        return `${this.proxy}/${owner}/${repo}/HEAD/${path}`
      },
      clone: function (owner: string, repo: string) {
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

  const owner = 'karinjs'
  const repo = 'karin'
  /** 最终需要ping的url */
  const pingUrls: string[] = []
  /** 测试url和github配置map */
  const map: Record<string, GithubConfig> = {}

  urls.forEach(item => {
    const url = type === 'raw' ? item.raw(owner, repo, 'package.json') : item.clone(owner, repo)
    pingUrls.push(url)
    map[url] = item
  })

  const result = await pingRequest(pingUrls, { detailed: true, isRace: true })
  console.log(result)
  if (!result) {
    return list[0]
  }

  return map[result.url]
}
