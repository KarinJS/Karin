import type { SnapkaScreenshotOptions, SnapkaScreenshotViewportOptions } from '@snapka/types'

export interface ScreenshotProviderOptions {
  /** 服务名称 */
  name: string
  /**
   * 截图方法
   * @param options - 截图选项
   * @return 截图结果
   */
  screenshot: (options: SnapkaScreenshotOptions<'base64'>) => Promise<string>
  /**
   * 分片截图方法
   * @param options - 截图选项
   * @return 分片截图结果
   */
  screenshotChunks: (options: SnapkaScreenshotViewportOptions<'base64'>) => Promise<string>
}

/**
 * 截图服务
 */
export class ScreenshotService {
  /** 已注册的截图服务 */
  private services = new Map<string, ScreenshotProviderOptions>()

  /**
   * 注册截图服务
   * @param options - 服务配置
   */
  register (options: ScreenshotProviderOptions): void {
    if (this.services.has(options.name)) {
      throw new Error(`截图服务 "${options.name}" 已经注册`)
    }

    this.services.set(options.name, options)
  }

  /**
   * 检查服务是否已注册
   * @param name - 服务名称
   */
  has (name: string): boolean {
    return this.services.has(name)
  }

  /**
   * 获取所有已注册的服务名称
   */
  getServiceNames (): string[] {
    return Array.from(this.services.keys())
  }

  /**
   * 获取截图服务
   * @param serviceName - 服务名称，不提供则随机选择一个
   * @returns 截图服务配置
   */
  private getService (serviceName?: string): ScreenshotProviderOptions {
    /** 没指定就随机 */
    const name = (() => {
      if (serviceName && this.services.has(serviceName)) return serviceName
      const keys = Array.from(this.services.keys())
      if (keys.length === 0) {
        throw new Error('没有可用的截图服务')
      }
      const randomIndex = Math.floor(Math.random() * keys.length)
      return keys[randomIndex]
    })()

    const service = this.services.get(name)
    if (!service) {
      throw new Error(`截图服务 "${name}" 未注册`)
    }

    return service
  }

  /**
   * 执行截图
   * @param options - 截图选项
   * @param serviceName - 服务名称，不提供则使用默认服务
   * @returns 截图base64
   */
  async screenshot (options: SnapkaScreenshotOptions<'base64'>, serviceName?: string): Promise<string> {
    const service = this.getService(serviceName)

    try {
      return await service.screenshot(options)
    } catch (error) {
      throw new Error(`截图服务 "${service.name}" 执行失败`, { cause: error })
    }
  }

  /**
   * 执行分片截图
   * @param options - 截图选项
   * @param serviceName - 服务名称，不提供则使用默认服务
   * @returns 分片截图base64
   */
  async screenshotChunks (options: SnapkaScreenshotViewportOptions<'base64'>, serviceName?: string): Promise<string> {
    const service = this.getService(serviceName)

    try {
      return await service.screenshotChunks(options)
    } catch (error) {
      throw new Error(`截图服务 "${service.name}" 执行分片截图失败`, { cause: error })
    }
  }

  /**
   * 注销服务
   * @param name - 服务名称
   */
  unregister (name: string): boolean {
    return this.services.delete(name)
  }

  /**
   * 清空所有服务
   */
  clear (): void {
    this.services.clear()
  }
}

/**
 * 默认截图服务实例
 */
export const screenshotService = new ScreenshotService()
