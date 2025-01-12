import https from 'node:https'

/**
 * 配置部分
 */
const defaultTimeout = 2000 // 默认超时时间（毫秒）
const urls = [
  'https://x.com',
  'https://registry.npmjs.org',
  'https://github.com',
  'https://www.google.com',
  'https://chatgpt.com',
  'https://www.facebook.com',
  'https://www.twitter.com',
  'https://www.instagram.com',
  'https://www.youtube.com',
]

/**
 * 发送 GET 请求，并设置超时时间
 * @param url 请求的 URL
 * @returns Promise<{ url: string; success: boolean; status?: number; responseTime?: number }>
 */
function fetchUrl (url) {
  return new Promise((resolve) => {
    const startTime = Date.now()

    const req = https.get(url, (res) => {
      const responseTime = Date.now() - startTime
      resolve({ url, success: true, status: res.statusCode, responseTime })
      res.destroy() // 主动销毁连接
    })

    req.on('error', () => {
      const responseTime = Date.now() - startTime
      resolve({ url, success: false, responseTime })
    })

    req.setTimeout(defaultTimeout, () => {
      req.destroy()
      resolve({ url, success: false, responseTime: defaultTimeout })
    })
  })
}

/**
 * 超时封装，用于限制单个请求的最大等待时间
 * @param url 请求的 URL
 * @param timeout 超时时间（毫秒）
 * @returns Promise<{ url: string; success: boolean; status?: number; responseTime?: number }>
 */
function fetchUrlWithTimeout (url, timeout) {
  return Promise.race([
    fetchUrl(url),
    new Promise((resolve) =>
      setTimeout(() => resolve({ url, success: false, responseTime: timeout }), timeout)
    ),
  ])
}

/**
 * 并发请求所有 URL，并输出结果
 * @param urls 测试的 URL 数组
 * @param timeout 超时时间（毫秒）
 */
async function testConnectivity (urls, timeout = defaultTimeout) {
  console.log(`Testing connectivity with timeout: ${timeout}ms`)
  const results = await Promise.all(urls.map((url) => fetchUrlWithTimeout(url, timeout)))
  console.table(results) // 以表格形式输出结果
  process.exit(0)
}

/**
 * 自定义测试逻辑
 */
(async () => {
  const customTimeout = 800 // 设置自定义超时时间（毫秒）
  testConnectivity(urls, customTimeout)
})()
