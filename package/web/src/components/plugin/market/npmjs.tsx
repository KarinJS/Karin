import axios from 'axios'

/**
 * 注册表状态
 */
export interface RegistryState {
  registry: string
  npmjsApi: string
  isInitialized: boolean
  isInitializing: boolean
}

/**
 * 全局状态对象，存储已解析的最快注册表地址
 */
export const registryState: RegistryState = {
  registry: 'https://registry.npmjs.org', // 默认值
  npmjsApi: 'https://api.npmjs.org/downloads/point', // 默认值
  isInitialized: false,
  isInitializing: false,
}

/**
 * 初始化注册表地址
 * 这个函数会在后台执行，不会阻塞UI渲染
 */
export const initializeRegistryUrls = async () => {
  if (registryState.isInitialized || registryState.isInitializing) return

  registryState.isInitializing = true

  try {
    // 获取最快的 npm 包信息 API 端点
    const registryList = [
      'https://registry.npmjs.org',
      'https://registry.npmmirror.com',
    ]

    const registryUrl = await Promise.race(
      registryList.map((item) => axios.head(item, { timeout: 2000 })
        .then(res => res.config.url!)
        .catch(() => registryList[0]) // 出错时使用默认值
      )
    )

    registryState.registry = registryUrl

    // 获取最快的 npm 包下载量 API 端点
    const npmApiList = [
      'https://api.npmjs.org',
      'https://npmapi.ikechan8370.com',
    ]

    const npmApiUrl = await Promise.race(
      npmApiList.map((item) =>
        axios.head(item, { timeout: 2000 })
          .then(res => res.config.url!)
          .catch((error) => {
            if (error.response && error.response.status === 404) {
              return item
            }
            return npmApiList[0] // 出错时使用默认值
          })
      )
    )

    registryState.npmjsApi = npmApiUrl + '/downloads/point'
    registryState.isInitialized = true
  } catch (error) {
    console.error('[initializeRegistryUrls] 初始化注册表地址失败:', error)
    // 即使初始化失败，也设置为已初始化，使用默认值
    registryState.isInitialized = true
  } finally {
    registryState.isInitializing = false
  }
}

/**
 * 获取npm包的下载量
 * @param name npm包名
 * @returns 下载量数字，失败返回0
 */
export const getPackageDownloads = async (name: string) => {
  if (!name || name === '-') return 0

  /** 获取当前年份 */
  const year = new Date().getFullYear()
  const dateRange = `${year}-01-01:${year}-12-31`

  try {
    // 不阻塞等待初始化完成，使用当前状态进行请求
    const options = { timeout: 5000 }
    const npmUrl = `${registryState.npmjsApi}/${dateRange}/${name}`
    const cnpmUrl = `https://registry.npmmirror.com/downloads/range/${dateRange}/${name}`

    // 使用Promise.allSettled代替Promise.all，避免一个请求失败导致整个Promise链失败
    const results = await Promise.allSettled([
      axios.get(npmUrl, options).then(result => result.data.downloads).catch(() => 0),
      axios.get(cnpmUrl, options).then(result => {
        if (!result.data.downloads?.length) return 0
        return result.data.downloads.reduce(
          (total: number, item: any) => total + (item.downloads || 0),
          0
        )
      }).catch(() => 0),
    ])

    // 提取成功的结果
    const downloads = results.map(result =>
      result.status === 'fulfilled' ? result.value : 0
    )

    return downloads[0] + downloads[1]
  } catch (error) {
    console.error(`[getPackageDownloads] ${name} 获取下载量失败:`, error)
  }

  return 0
}

/**
 * 获取包大小、更新时间
 * @param name npm包名
 * @returns 包信息对象，失败返回默认值
 */
export const getPackageInfo = async (name: string): Promise<{ size: number, updated: string }> => {
  if (!name || name === '-') return { size: 0, updated: '' }

  try {
    const registryResult = await axios.get(`${registryState.registry}/${name}`, {
      timeout: 5000,
      // 添加错误状态码处理
      validateStatus: (status) => status === 200,
    })

    if (registryResult.status === 200) {
      /** 最新版本 */
      const latest = registryResult.data['dist-tags']?.latest

      if (!latest || !registryResult.data.versions?.[latest]) {
        return { size: 0, updated: registryResult.data.time?.modified || '' }
      }

      /** 包大小 */
      const size = registryResult.data.versions[latest]?.dist?.unpackedSize || 0
      /** 更新时间: 2025-02-07T07:02:10.971Z 格式为 ISO 8601 */
      const updated = registryResult.data.time?.modified || ''

      return { size, updated }
    }

    return { size: 0, updated: '' }
  } catch (error) {
    console.error(`[getPackageInfo] ${name} 获取包信息失败:`, error)
    return { size: 0, updated: '' }
  }
}
