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
  'https://ghp.ci/',
  'https://ghproxy.com',
  'https://ghp.ci',
  'https://ghgo.xyz',
]

/**
 * 测速 获取最快的github源 `包括官方源`
 * @returns 返回最快的镜像源信息
 */
export const speedTest = async () => {
  const list = [github, ...githubMirror]
  const controllers = list.map(() => new AbortController())

  // 添加官方源保底结果
  const fallbackResult = {
    code: true,
    host: github,
    time: Infinity
  }

  try {
    const results = await Promise.all(
      list.map(async (host, index) => {
        try {
          const startTime = Date.now()
          const url = host === github ? testUrl : `${host}/${testUrl}`
          await axios.get(url, {
            signal: controllers[index].signal,
            timeout: 2 * 1000
          })

          controllers.forEach((controller, i) => {
            if (i !== index) controller.abort()
          })

          return {
            code: true,
            host,
            time: Date.now() - startTime
          }
        } catch {
          return {
            code: false,
            host,
            time: Infinity
          }
        }
      })
    )

    // 优先选择有效的非官方源，最后使用官方源
    return [...results.filter(r => r.code), fallbackResult]
      .sort((a, b) => a.time - b.time)[0]
  } catch {
    return fallbackResult
  }
}

/**
 * 测3次 取最快的
 * - 如果是官方源 返回空函数
 * - 否则则返回替换函数
 */
export const testGithub = async () => {
  try {
    const list = await Promise.all(Array.from({ length: 3 }, () => speedTest().catch(() => null)))

    // 筛选有效结果并添加官方源保底
    const validResults = list.filter((item): item is Exclude<typeof item, null> => Boolean(item))
    const fallback = { code: true, host: github, time: Infinity }
    const fastest = [...validResults, fallback].sort((a, b) => a.time - b.time)[0]

    return (url: string) => {
      // 始终包含官方源兜底
      return fastest.host === github ? url : `${fastest.host}/${url}`
    }
  } catch {
    // 彻底失败时返回原始处理函数
    return (url: string) => url
  }
}
