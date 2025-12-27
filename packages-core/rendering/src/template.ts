/**
 * 模板渲染器类型
 */
export type TemplateEngine = 'art-template' | 'vue' | 'react'

/**
 * 模板渲染函数
 * @param template - 模板内容或路径
 * @param data - 模板数据
 * @returns 渲染后的HTML字符串
 */
export type TemplateRenderer = (template: string, data: Record<string, any>) => Promise<string> | string

/**
 * 模板配置
 */
export interface TemplateConfig {
  /** 模板引擎类型 */
  engine: TemplateEngine
  /** 模板渲染器 */
  renderer: TemplateRenderer
}

/**
 * 模板渲染服务
 */
export class TemplateService {
  private templates = new Map<string, TemplateConfig>()

  /**
   * 注册模板
   * @param name - 模板名称
   * @param config - 模板配置
   */
  register (name: string, config: TemplateConfig): void {
    if (this.templates.has(name)) {
      throw new Error(`模板 "${name}" 已经注册`)
    }
    this.templates.set(name, config)
  }

  /**
   * 检查模板是否已注册
   * @param name - 模板名称
   */
  has (name: string): boolean {
    return this.templates.has(name)
  }

  /**
   * 获取模板配置
   * @param name - 模板名称
   */
  get (name: string): TemplateConfig | undefined {
    return this.templates.get(name)
  }

  /**
   * 获取所有已注册的模板名称
   */
  getTemplateNames (): string[] {
    return Array.from(this.templates.keys())
  }

  /**
   * 渲染模板
   * @param name - 模板名称
   * @param data - 模板数据
   * @returns 渲染结果
   */
  async render (name: string, data: Record<string, any>): Promise<string> {
    const config = this.templates.get(name)
    if (!config) {
      throw new Error(`模板 "${name}" 未注册`)
    }

    try {
      const html = await config.renderer(name, data)
      return html
    } catch (error) {
      throw new Error(`渲染模板 "${name}" 失败: ${error instanceof Error ? error.message : String(error)}`)
    }
  }

  /**
   * 注销模板
   * @param name - 模板名称
   * @returns 是否成功注销
   */
  unregister (name: string): boolean {
    return this.templates.delete(name)
  }

  /**
   * 清空所有模板
   */
  clear (): void {
    this.templates.clear()
  }
}

/**
 * 默认模板服务实例
 */
export const templateService = new TemplateService()
