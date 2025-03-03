import axios from 'axios'

/** github源 */
const github = 'https://github.com'

/** 测试目标文件 */
const testUrl = 'https://raw.githubusercontent.com/karinjs/karin/refs/heads/main/package.json'

/**
 * github加速源
 */
export const githubMirror = [
  'https://cdn.moran233.xyz',
  'https://ql.133.info',
  'https://gh.zhaojun.im/',
  'https://gh-proxy.com',
  'https://ghfast.top',
  'https://ghp.ci/'
]

/**
 * 测速 获取最快的github源 `包括官方源`
 * @returns 返回最快的镜像源信息
 */
export const speedTest = async () => {
  const list = [github, ...githubMirror]
  const controllers = list.map(() => new AbortController())

  const promises = list.map(async (host, index) => {
    try {
      const startTime = Date.now()
      const url = host === github ? testUrl : `${host}/${testUrl}`
      await axios.get(url, { signal: controllers[index].signal, timeout: 2 * 1000 })
      const endTime = Date.now()

      /** 中断其他请求 */
      controllers.forEach((controller, i) => {
        if (i !== index) controller.abort()
      })

      return {
        code: true,
        host,
        time: endTime - startTime,
      }
    } catch {
      return {
        code: false,
        host,
        time: 999999,
      }
    }
  })

  // 等待所有请求完成或被中断，返回最快的有效结果
  const results = await Promise.all(promises)
  return results.filter(Boolean).sort((a, b) => a.time - b.time)[0] || null
}

/**
 * 测3次 取最快的
 * - 如果是官方源 返回空函数
 * - 否则则返回替换函数
 */
export const testGithub = async () => {
  const list = await Promise.all(Array.from({ length: 3 }, () => speedTest()))
  const { host } = list.filter(Boolean).sort((a, b) => a.time - b.time)[0] || null
  if (host === github) return (url: string) => url
  return (url: string) => `${host}/${url}`
}
