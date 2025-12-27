import { templateService } from './template'
import { screenshotService } from './screenshot'

import type { TemplateEngine } from './template'
import type { SnapkaScreenshotOptions, SnapkaScreenshotViewportOptions } from '@snapka/types'

/**
 * 模板渲染参数
 */
export interface TemplateRenderOptions {
  /**
   * 模板参数
   * @deprecated 请使用 template.data 字段
   */
  data?: Record<string, any>
  /**
   * 模板信息
   */
  template?: {
    /**
     * 模板名称
     * @description 不提供则默认使用 art-template
     */
    name?: TemplateEngine | (string & {})
    /** 模板数据 */
    data?: Record<string, any>
  }
}

/**
 * 截图参数
 */
export interface ScreenshotOptions extends SnapkaScreenshotOptions<'base64'>, TemplateRenderOptions { }

/**
 * 分片截图参数
 */
export interface ScreenshotChunksOptions extends SnapkaScreenshotViewportOptions<'base64'>, TemplateRenderOptions { }

/**
 * 渲染服务类
 * @description 提供模板渲染和截图功能的统一接口
 */
export class RenderingService {
  /**
   * 获取截图参数中的模板信息和其他参数
   * @param opt - 截图参数
   */
  getOptions<T extends ScreenshotOptions | ScreenshotChunksOptions> (opt: T): {
    isTemplate: true,
    templateName: string,
    templateData: Record<string, any>
    options: Omit<T, 'data' | 'template'>
  } | {
    isTemplate: false,
    options: Omit<T, 'data' | 'template'>
  } {
    const { data: __, template: ___, ...rest } = opt

    /** 判断是否提供了模板数据 */
    if (opt.template?.data || opt.data) {
      const templateName = opt.template?.name || 'art-template'
      const templateData = opt.template?.data || opt.data || {}

      return {
        isTemplate: true,
        templateName,
        templateData,
        options: rest,
      }
    }

    return { isTemplate: false, options: rest }
  }

  /**
   * 执行截图
   * @param options - 截图参数
   * @param serviceName - 截图服务名称，不提供则随机选择
   * @returns 截图base64字符串
   */
  async screenshot (options: ScreenshotOptions, serviceName?: string): Promise<string> {
    const opt = this.getOptions(options)

    if (opt.isTemplate === true) {
      const file = await templateService.render(opt.templateName, opt.templateData)
      opt.options.file = file
      return screenshotService.screenshot(opt.options, serviceName)
    }

    return screenshotService.screenshot(opt.options, serviceName)
  }

  /**
   * 执行分片截图
   * @param options - 分片截图参数
   * @param serviceName - 截图服务名称，不提供则随机选择
   * @returns 分片截图base64字符串
   */
  async screenshotChunks (options: ScreenshotChunksOptions, serviceName?: string): Promise<string> {
    const opt = this.getOptions(options)

    if (opt.isTemplate === true) {
      const file = await templateService.render(opt.templateName, opt.templateData)
      opt.options.file = file
      return screenshotService.screenshotChunks(opt.options, serviceName)
    }

    return screenshotService.screenshotChunks(opt.options, serviceName)
  }
}

/**
 * 默认渲染服务实例
 */
export const renderingService = new RenderingService()
