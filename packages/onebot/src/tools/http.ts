/**
 * HTTP请求工具
 * 基于Node.js 18原生fetch API实现
 */

/**
 * 请求配置接口
 */
export interface RequestConfig {
  /**
   * 请求URL
   */
  url: string

  /**
   * 请求方法
   */
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'

  /**
   * 请求头
   */
  headers?: Record<string, string>

  /**
   * 请求超时时间（毫秒）
   */
  timeout?: number

  /**
   * 请求参数（URL查询参数或请求体）
   */
  data?: any

  /**
   * 响应类型
   * 注意：实际解析时会优先根据响应的 Content-Type 头判断，此参数作为回退选项
   */
  responseType?: 'json' | 'text' | 'blob' | 'arraybuffer'
}

/**
 * HTTP响应接口
 */
export interface HttpResponse<T = any> {
  /**
   * 响应数据
   */
  data: T

  /**
   * HTTP状态码
   */
  status: number

  /**
   * 状态文本
   */
  statusText: string

  /**
   * 响应头
   */
  headers: Record<string, string>

  /**
   * 请求配置
   */
  config: RequestConfig
}

/**
 * HTTP请求错误接口
 */
export interface HttpError extends Error {
  /**
   * 错误类型
   */
  type?: 'timeout' | 'network' | 'abort' | 'server'

  /**
   * 请求配置
   */
  config?: RequestConfig

  /**
   * HTTP状态码
   */
  status?: number

  /**
   * 响应数据
   */
  response?: HttpResponse
}

/**
 * 处理请求参数
 * @param url - 请求URL
 * @param params - 查询参数
 * @returns 处理后的URL
 */
const buildUrl = (url: string, params?: Record<string, any>): string => {
  if (!params) return url

  const queryString = Object.entries(params)
    .map(([key, value]) => {
      const encodedValue = encodeURIComponent(
        typeof value === 'object' ? JSON.stringify(value) : String(value)
      )
      return `${encodeURIComponent(key)}=${encodedValue}`
    })
    .join('&')

  return url + (url.includes('?') ? '&' : '?') + queryString
}

/**
 * 将Headers对象转换为普通对象
 * @param headers - Headers对象
 * @returns 普通对象形式的headers
 */
const headersToObject = (headers: Headers): Record<string, string> => {
  const result: Record<string, string> = {}
  headers.forEach((value, key) => {
    result[key.toLowerCase()] = value
  })
  return result
}

/**
 * 根据 Content-Type 判断响应数据类型
 * @param contentType - Content-Type 响应头
 * @returns 推断的响应类型
 */
const getResponseTypeFromContentType = (contentType: string): 'json' | 'text' | 'blob' | 'arraybuffer' => {
  const type = contentType.toLowerCase()

  if (type.includes('application/json') || type.includes('text/json')) {
    return 'json'
  }

  if (type.includes('text/') || type.includes('application/xml') || type.includes('application/xhtml')) {
    return 'text'
  }

  if (type.includes('application/octet-stream') ||
    type.includes('application/pdf') ||
    type.includes('application/zip')) {
    return 'arraybuffer'
  }

  if (type.includes('image/') || type.includes('audio/') || type.includes('video/')) {
    return 'blob'
  }

  // 默认尝试 JSON，如果失败则降级为 text
  return 'json'
}/**
 * 创建超时控制器
 * @param abortController - 中止控制器
 * @param timeout - 超时时间（毫秒）
 * @param config - 请求配置
 * @returns 超时定时器ID
 */
const setupTimeout = (abortController: AbortController, timeout: number): NodeJS.Timeout => {
  return setTimeout(() => {
    abortController.abort()
  }, timeout)
}

/**
 * 发送HTTP请求
 * @param config - 请求配置
 * @returns Promise包装的HTTP响应
 */
const request = async <T = any> (config: RequestConfig): Promise<HttpResponse<T>> => {
  const { url, method = 'GET', headers = {}, timeout = 10000, data, responseType = 'json' } = config

  let requestUrl = url
  const requestInit: RequestInit = {
    method,
    headers: { ...headers },
  }

  // 处理GET请求参数
  if (method === 'GET' && data) {
    requestUrl = buildUrl(url, data)
  } else if (data) {
    // 处理请求体
    if (typeof data === 'object') {
      requestInit.body = JSON.stringify(data)
    } else {
      requestInit.body = data
    }
  }

  if (!headers['Content-Type'] && !headers['content-type']) {
    requestInit.headers = {
      ...requestInit.headers,
      'Content-Type': 'application/json;charset=UTF-8',
    }
  }

  // 创建中止控制器
  const abortController = new AbortController()
  requestInit.signal = abortController.signal

  // 设置超时定时器
  let timeoutId: NodeJS.Timeout | undefined
  if (timeout > 0) {
    timeoutId = setupTimeout(abortController, timeout)
  }

  try {
    const response = await fetch(requestUrl, requestInit)

    // 清除超时定时器
    if (timeoutId) {
      clearTimeout(timeoutId)
    }

    // 解析响应数据
    let responseData: T

    // 获取 Content-Type 响应头
    const contentType = response.headers.get('content-type') || ''

    // 优先根据 Content-Type 判断响应类型，responseType 作为回退
    const actualResponseType = contentType ? getResponseTypeFromContentType(contentType) : responseType

    switch (actualResponseType) {
      case 'json':
        try {
          responseData = await response.json() as T
        } catch {
          // JSON 解析失败，降级为文本
          responseData = await response.text() as unknown as T
        }
        break
      case 'text':
        responseData = await response.text() as unknown as T
        break
      case 'blob':
        responseData = await response.blob() as unknown as T
        break
      case 'arraybuffer':
        responseData = await response.arrayBuffer() as unknown as T
        break
      default:
        // 默认尝试 JSON，失败则降级为文本
        try {
          responseData = await response.json() as T
        } catch {
          responseData = await response.text() as unknown as T
        }
    }

    // 构建响应对象
    const httpResponse: HttpResponse<T> = {
      data: responseData,
      status: response.status,
      statusText: response.statusText,
      headers: headersToObject(response.headers),
      config,
    }

    // 处理非2xx响应
    if (!response.ok) {
      const error = new Error(`请求失败，状态码: ${response.status}`) as HttpError
      error.type = 'server'
      error.config = config
      error.status = response.status
      error.response = httpResponse
      throw error
    }

    return httpResponse
  } catch (error) {
    // 清除超时定时器
    if (timeoutId) {
      clearTimeout(timeoutId)
    }

    // 处理错误
    if (error instanceof Error) {
      const httpError = error as HttpError

      // 判断是否为超时错误
      if (error.name === 'AbortError') {
        httpError.message = `请求超时（${timeout}ms）`
        httpError.type = 'timeout'
      } else if (!httpError.type) {
        httpError.type = 'network'
      }

      httpError.config = config
      throw httpError
    }

    // 处理其他类型错误
    throw error
  }
}

export default {
  get: <T = any> (url: string, params?: any, config: Omit<RequestConfig, 'url' | 'method' | 'data'> = {}): Promise<HttpResponse<T>> => {
    return request<T>({
      ...config,
      method: 'GET',
      url,
      data: params,
    })
  },
  post: <T = any> (url: string, data?: any, config: Omit<RequestConfig, 'url' | 'method' | 'data'> = {}): Promise<HttpResponse<T>> => {
    return request<T>({
      ...config,
      method: 'POST',
      url,
      data,
    })
  },
  request: <T = any> (config: RequestConfig): Promise<HttpResponse<T>> => {
    return request<T>(config)
  },
}
