import axios, { AxiosError } from 'axios'
import crypto from 'node:crypto'
import { registerRender, unregisterRender } from '../admin/cache'
import { render } from '@/utils/config/render'

/**
 * @description 创建http渲染器
 */
export const createHttpRenderClient = () => {
  const cfg = render()
  if (!cfg.http_server || !Array.isArray(cfg.http_server) || cfg.http_server.length === 0) {
    logger.trace('[render][http] 未配置任何正向HTTP 已跳过创建')
    return
  }

  return Promise.allSettled(cfg.http_server.map(async (item) => {
    let { url, token, enable } = item
    if (!enable) return
    url = url.replace('/puppeteer', '')
    /** 初次鉴权 */
    const headers = { authorization: crypto.createHash('md5').update(`Bearer ${token}`).digest('hex') }
    try {
      /** 先ping */
      const result = await axios.get(`${url}/ping`, { timeout: 5000 })
      if (result.status !== 200 || String(result.data.status) !== '200') {
        logger.error(`[render][http] 创建渲染器失败: 无法连接 ${url}`)
      }

      const auth = await axios.get(`${url}/auth`, { headers, timeout: 5000 })
      if (auth.status !== 200 || String(auth.data.status) !== '200') {
        logger.error(`[render][http] 创建渲染器失败: 鉴权错误 ${url}`)
        return
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const { response } = error as AxiosError
        logger.error(`[render][http] 创建渲染器失败: ${response?.status} ${response?.statusText} - ${JSON.stringify(response?.data || '未知错误')}`)
      } else {
        logger.error(`[render][http] 创建渲染器失败: ${error}`)
      }
      return
    }

    const index = registerRender('puppeteer', async (options) => {
      try {
        const result = await axios.post(`${url}/puppeteer`, options, { headers })
        if (result.status !== 200) {
          throw new Error(`[render][http] 渲染失败: ${result.status} ${result.statusText} - ${result.data?.message || '未知错误'}`)
        }
        return result.data
      } catch (error) {
        /** 如果是axios的错误，进一步细化处理 */
        if (axios.isAxiosError(error)) {
          if (!error.response) {
            unregisterRender(index)
            throw new Error(`[render][http] 网络连接失败: ${error.message}`)
          }

          const { response } = error as AxiosError
          throw new Error(`[render][http] 渲染失败: ${response?.status} ${response?.statusText} - ${JSON.stringify(response?.data || '未知错误')}`)
        }

        /** 非axios错误直接抛出 */
        if (error instanceof Error) {
          throw error
        }

        /** 捕获未预料的情况 */
        throw new Error(`[render][unknown] 未知错误: ${error}`)
      }
    })
  }))
}
