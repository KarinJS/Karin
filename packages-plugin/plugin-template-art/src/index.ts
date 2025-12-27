import fs from 'fs'
import axios from 'axios'
import art from '@karinjs/art-template'
import { LRUCache } from '@karinjs/utils'
import { templateService } from '@karinjs/rendering'

/** 模板内容缓存，容量 20，TTL 5 分钟 */
const cache = new LRUCache<string, string>(20, 5 * 60 * 1000)

/**
 * 获取模板内容（带缓存）
 * @param template - 模板路径或 URL
 * @returns 模板内容
 */
const getTemplateContent = async (template: string): Promise<string> => {
  /** 先检查缓存 */
  const cached = cache.get(template)
  if (cached) return cached

  /** file:// 或 file:/// 协议 */
  if (template.startsWith('file://') || template.startsWith('file:///')) {
    const filePath = template.replace(/^file:\/\/\/?/, '')
    if (!fs.existsSync(filePath)) {
      throw new Error(`art-template 文件不存在: ${template}`)
    }
    const content = fs.readFileSync(filePath, 'utf-8')
    cache.set(template, content)
    return content
  }

  /** HTTP(S) 请求 */
  if (template.startsWith('https://') || template.startsWith('http://')) {
    const response = await axios.get<string>(template)
    const content = response.data
    cache.set(template, content)
    return content
  }

  /** 本地文件路径 */
  if (fs.existsSync(template)) {
    const content = fs.readFileSync(template, 'utf-8')
    cache.set(template, content)
    return content
  }

  /** 直接传入的模板内容 */
  cache.set(template, template)
  return template
}

export const registerService = async () => {
  const engine = 'art-template'
  templateService.register(engine, {
    engine,
    renderer: async (template: string, data: Record<string, any>) => {
      const content = await getTemplateContent(template)
      return art.render(content, data)
    },
  })
}
