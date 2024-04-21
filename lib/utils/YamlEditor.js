/*
 * YamlEditor - 一个用于编辑 YAML 文件的类
 * 本代码由 ChatGPT4 提供
 * https://github.com/OpenAI
 */
import { logger } from '#Karin'
import fs from 'fs'
import Yaml from 'yaml'

export default class YamlEditor {
  constructor (filePath) {
    this.filePath = filePath
    this.document = null
    this.load()
  }

  load () {
    try {
      const fileContents = fs.readFileSync(this.filePath, 'utf8')
      this.document = Yaml.parseDocument(fileContents)
      logger.debug('[YamlEditor] 文件加载成功')
    } catch (error) {
      logger.error(`[YamlEditor] 加载文件时出错：${error}`)
    }
  }

  /**
   * 获取指定路径的值
   * @param {string} path - 路径，用点号分隔，例如：'a.b.c'
   * @returns {any}
   */
  get (path) {
    try {
      const keys = path.split('.')
      let current = this.document.contents
      for (const key of keys) {
        if (!current.has(key)) {
          logger.info(`[YamlEditor] 未找到指定的路径：${path}`)
          return undefined
        }
        current = current.get(key)
      }
      return current
    } catch (error) {
      logger.error(`[YamlEditor] 获取数据时出错：${error}`)
    }
  }

  /**
   * 设置指定路径的值
   * @param {string} path - 路径，用点号分隔，例如：'a.b.c'
   * @param {any} value - 要设置的值
   */
  set (path, value) {
    try {
      const keys = path.split('.')
      let current = this.document.contents
      for (let i = 0; i < keys.length - 1; i++) {
        current = current.get(keys[i], true)
      }
      current.set(keys[keys.length - 1], value)
      logger.debug(`[YamlEditor] 已将 ${path} 设置为 ${value}`)
    } catch (error) {
      logger.error(`[YamlEditor] 设置数据时出错：${error}`)
    }
  }

  /**
   * 向指定路径添加新值
   * @param {string} path - 路径，用点号分隔，例如：'a.b.c'
   * @param {any} value - 要添加的值
   */
  add (path, value) {
    try {
      const keys = path.split('.')
      let current = this.document.contents
      for (let i = 0; i < keys.length; i++) {
        if (i === keys.length - 1) {
          current.add({ key: keys[i], value })
        } else if (!current.has(keys[i])) {
          let newNode = new Yaml.YAMLMap()
          current.add({ key: keys[i], value: newNode })
          current = newNode
        } else {
          current = current.get(keys[i])
        }
      }
      logger.debug(`[YamlEditor] 已在 ${path} 添加新的值`)
    } catch (error) {
      logger.error(`[YamlEditor] 添加数据时出错：${error}`)
    }
  }

  /**
   * 删除指定路径的值
   * @param {string} path - 路径，用点号分隔，例如：'a.b.c'
   * @returns {boolean} 是否删除成功
   */
  del (path) {
    try {
      const keys = path.split('.')
      let current = this.document.contents
      for (let i = 0; i < keys.length - 1; i++) {
        current = current.get(keys[i], true)
      }
      current.delete(keys[keys.length - 1])
      logger.debug(`[YamlEditor] 已删除 ${path}`)
      return true
    } catch (error) {
      logger.error(`[YamlEditor] 删除数据时出错：${error}`)
      return false
    }
  }

  /**
   * 向指定路径的数组添加新值，可以选择添加到数组的开始或结束
   * @param {string} path - 路径，用点号分隔，例如：'a.b.c'
   * @param {any} value - 要添加的值
   * @param {boolean} [prepend=false] - 如果为 true，则添加到数组的开头，否则添加到末尾
   */
  append (path, value, prepend = false) {
    try {
      const keys = path.split('.')
      let current = this.document.contents
      for (let i = 0; i < keys.length - 1; i++) {
        current = current.get(keys[i], true)
      }
      const lastKey = keys[keys.length - 1]
      if (!current.get(lastKey)) {
        current.set(lastKey, new Yaml.YAMLSeq())
      }
      let array = current.get(lastKey)
      if (array instanceof Yaml.YAMLSeq) {
        if (prepend) {
          array.items.unshift(value) // 添加到数组的开始
        } else {
          array.add(value) // 添加到数组的末尾
        }
        logger.debug(`[YamlEditor] 已向 ${path} 数组${prepend ? '开头' : '末尾'}添加新元素：${value}`)
      } else {
        throw new Error('[YamlEditor] 指定的路径不是数组')
      }
    } catch (error) {
      logger.error(`[YamlEditor] 向数组添加元素时出错：${error}`)
    }
  }

  /**
   * 保存文件
   */
  save () {
    try {
      fs.writeFileSync(this.filePath, this.document.toString())
      logger.info('[YamlEditor] 文件已保存')
    } catch (error) {
      logger.error(`[YamlEditor] 保存文件时出错：${error}`)
    }
  }
}
