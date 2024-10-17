import fs from 'node:fs'
import Yaml from 'yaml'
import { YamlEditor } from '../config/yamlEditor'

type Comment = Record<string, string | { type: 'start' | 'end'; text: string }>

const yamlNew = {
  /**
   * 传入yaml文件路径 自动读取并解析
   * @param path yaml文件路径
   */
  read: (path: string) => {
    const data = fs.readFileSync(path, 'utf-8')
    return Yaml.parse(data)
  },
  /**
   * 保存并写入注释
   * @param path 保存的路径
   * @param value 保存的数据
   * @param commentConfig 注释配置文件路径或json
   */
  save: (path: string, value: any, commentConfig?: string) => {
    if (!commentConfig) {
      fs.writeFileSync(path, Yaml.stringify(value))
      return
    }

    const editor = new YamlEditor(Yaml.stringify(value))
    const comment = JSON.parse(fs.existsSync(commentConfig) ? fs.readFileSync(commentConfig, 'utf8') : commentConfig) as Comment

    for (const [key, value] of Object.entries(comment)) {
      try {
        if (typeof value === 'object') {
          editor.comment(key, value.text, value.type === 'start')
        } else if (typeof value === 'string') {
          editor.comment(key, value, true)
        }
      } catch (error: any) {
        logger.error(`[YamlEditor] 添加注释时出错，已跳过：${error.stack || error.message || error}`)
      }
    }

    fs.writeFileSync(path, editor.document.toString())
  },
}

export const yaml = Object.assign(Yaml, yamlNew)
