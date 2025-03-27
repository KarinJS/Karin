import type { Options, RenderResult, Snapka, SnapkaResult } from './types'

/** 渲染函数类型 */
export interface Render {
  <T extends Options> (options: T): Promise<RenderResult<T>>
  <T extends Snapka> (options: T): Promise<SnapkaResult<T>>
}

let index = 0
const cache: {
  /** 渲染器索引 唯一标识符 */
  index: number
  /** 渲染器ID */
  id: string
  /** 渲染函数 */
  render: Render
}[] = []

/**
 * @description 注册渲染器
 * @param id 渲染器ID
 * @param render 渲染函数
 * @returns 渲染器索引
 */
export const registerRender = (id: string, render: Render) => {
  const i = ++index
  cache.push({ index: i, id, render })
  logger.mark(`[render:${index}] ${logger.green('注册成功')}: ${id}`)
  return i
}

/**
 * @description 卸载渲染器
 * @param index 渲染器索引
 * @returns 是否卸载成功
 */
export const unregisterRender = (index: number) => {
  const app = cache.find(app => app.index === index)
  if (!app) {
    logger.error(`[render] 卸载失败: 不存在索引 ${index}`)
    return false
  }

  cache.splice(cache.findIndex(app => app.index === index), 1)
  logger.mark(`[render] ${logger.yellow('卸载成功')}: ${app.id}`)
  return true
}

/**
 * @description 返回渲染器实例 未键入随机
 * @param id 渲染器ID
 * @returns 渲染器实例
 */
export const getRender = (id?: string | number) => {
  if (cache.length === 0) throw new Error('[调用渲染器失败] 渲染器列表为空')
  if (!id) {
    const app = cache[Math.floor(Math.random() * cache.length)]
    return app
  }

  if (typeof id === 'number') {
    /** 筛选出index一致的渲染器 */
    const app = cache.find(app => app.index === id)
    if (!app) throw new Error(`[调用渲染器失败] 未找到渲染器：${id}`)
    return app
  }

  /** 筛选出id一致的渲染器 */
  const app = cache.find(app => app.id === id)
  if (!app) throw new Error(`[调用渲染器失败] 未找到渲染器：${id}`)
  return app
}

/**
 * @description 调用标准渲染器
 * @param options 渲染器参数
 * @param id 指定渲染器ID
 */
export const callRender = async <T extends Options> (options: T, id?: string) => {
  const res = getRender(id)
  const result = await res.render(Object.assign(options, { encoding: 'base64' }))
  return result
}

/**
 * @description 获取全部渲染器数量
 * @returns 渲染器数量
 */
export const getRenderCount = () => cache.length

/**
 * @description 获取全部渲染器列表
 * @returns 渲染器列表
 */
export const getRenderList = () => {
  /** 重新赋值防止被恶意修改 */
  const list = cache.map(app => app)
  return list
}

/**
 * @description 快速渲染
 * @param data html路径、http地址
 * @returns 返回图片base64或数组
 */
export const renderHtml = (data: string) => {
  return callRender({
    file: data,
    name: 'render',
    encoding: 'base64',
    pageGotoParams: {
      waitUntil: 'networkidle2',
    },
  })
}

/**
 * @description 快速分片渲染
 * @param file html路径、http地址
 * @param multiPage 分片高度 未传递为自动计算
 */
export const renderMultiHtml = (file: string, multiPage?: number | boolean) => {
  if (!multiPage && multiPage !== 0) multiPage = true
  return callRender({
    file,
    name: 'render',
    encoding: 'base64',
    multiPage,
    pageGotoParams: {
      waitUntil: 'networkidle2',
    },
  })
}

class RenderCache {
  /**
   * 注册渲染器
   * @param data 渲染器数据
   * @param data.id 渲染器ID
   * @param data.type 渲染器类型
   * @param ata.render 渲染器标准方法
   * @returns 渲染器索引
   */
  app (data: { id: string, type?: 'image' | string, render: Render }): number {
    return registerRender(data.id, data.render)
  }

  /**
     * 卸载渲染器
     * @param index 渲染器索引
     * @returns 是否卸载成功
     */
  unapp (index: number): boolean {
    return unregisterRender(index)
  }

  /**
     * 返回渲染器实例 未键入id返回第一个
     * @param id 渲染器ID
     * @returns 渲染器实例
     */
  App (id: string = '') {
    return getRender(id)
  }

  /**
     * 调用标准渲染器
     */
  async render<T extends Options> (options: T, id?: string): Promise<RenderResult<T>> {
    return callRender(options, id)
  }

  /**
     * 快速渲染
     * @param data html路径、http地址
     * @returns 返回图片base64或数组
     */
  async renderHtml (data: string) {
    return renderHtml(data)
  }

  /**
     * 快速分片渲染
     * @param data html路径、http地址
     * @param multiPage 分片高度 自动计算传true
     */
  async renderMultiHtml (data: string, multiPage?: number | boolean) {
    return renderMultiHtml(data, multiPage)
  }
}

/**
   * 渲染器管理器
   */
export const render = new RenderCache()

/**
   * @description 即将废弃，请使用 `render`
  */
export const Renderer = render
