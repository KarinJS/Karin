/*
 * YamlEditor - 一个用于编辑 YAML 文件的类
 * 本代码由 ChatGPT4 提供
 * https://github.com/OpenAI
 */
import fs from 'fs'
import Yaml from 'yaml'
import lodash from 'lodash'
import logger from './logger'

export class YamlEditor {
  filePath: string
  document!: Yaml.Document
  constructor (filePath: string) {
    this.filePath = filePath
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
   * @param path - 路径，用点号分隔，例如：'a.b.c'
   */
  get (path: string) {
    try {
      if (!path) return this.document.toJSON()
      return lodash.get(this.document.toJSON(), path)
    } catch (error) {
      logger.error(`[YamlEditor] 获取数据时出错：${error}`)
      return null
    }
  }

  /**
   * 设置指定路径的值
   * @param path - 路径，用点号分隔，例如：'a.b.c'
   * @param value - 要设置的值
   */
  set (path: string | string[], value: string | boolean) {
    try {
      path = typeof path === 'string' ? path.split('.') : path
      this.document.setIn(path, value)
    } catch (error) {
      logger.error(`[YamlEditor] 设置数据时出错：${error}`)
      return null
    }
  }

  /**
   * 向指定路径添加新值
   * @param path - 路径，用点号分隔，例如：'a.b.c'
   * @param value - 要添加的值
   */
  add (path: string | string[], value: string) {
    try {
      path = typeof path === 'string' ? path.split('.') : path
      this.document.addIn(path, value)
      logger.debug(`[YamlEditor] 已在 ${path} 添加新的值`)
    } catch (error) {
      logger.error(`[YamlEditor] 添加数据时出错：${error}`)
    }
  }

  /**
   * 删除指定路径
   * @param path - 路径，用点号分隔，例如：'a.b.c'
   * @returns 是否删除成功
   */
  del (path: string | string[]) {
    try {
      path = typeof path === 'string' ? path.split('.') : path
      this.document.deleteIn(path)
      return true
    } catch (error) {
      logger.error(`[YamlEditor] 删除数据时出错：${error}`)
      return false
    }
  }

  /**
   * 向指定路径的数组添加新值，可以选择添加到数组的开始或结束
   * @param path - 路径，用点号分隔，例如：'a.b.c'
   * @param value - 要添加的值
   * @param prepend - 如果为 true，则添加到数组的开头，否则添加到末尾
   */
  append (path: string | string[], value: string, prepend = false) {
    try {
      path = typeof path === 'string' ? path.split('.') : path || []
      let current = this.document.getIn(path)
      if (!current) {
        current = new Yaml.YAMLSeq()
        this.document.setIn(path, current)
      } else if (!(current instanceof Yaml.YAMLSeq)) {
        throw new Error('[YamlEditor] 指定的路径不是数组')
      } else {
        if (prepend) {
          current.items.unshift(value)
        } else {
          current.add(value)
        }
      }
      logger.debug(`[YamlEditor] 已向 ${path} 数组${prepend ? '开头' : '末尾'}添加新元素：${value}`)
    } catch (error) {
      logger.error(`[YamlEditor] 向数组添加元素时出错：${error}`)
    }
  }

  /**
   * 检查指定路径的键是否存在
   * @param path - 路径，用点号分隔
   */
  has (path: string | string[]) {
    try {
      path = typeof path === 'string' ? path.split('.') : path
      return this.document.hasIn(path)
    } catch (error) {
      logger.error(`[YamlEditor] 检查路径是否存在时出错：${error}`)
      return false
    }
  }

  /**
   * 查询指定路径中是否包含指定的值
   * @param path - 路径，用点号分隔
   * @param value - 要查询的值
   */
  hasVal (path: string | string[], value: any): boolean {
    try {
      path = typeof path === 'string' ? path.split('.') : path
      const current = this.document.getIn(path)
      if (!current) return false

      /** 检查当前节点是否包含指定的值 */
      if (current instanceof Yaml.YAMLSeq) {
        /** 如果是序列，遍历序列查找值 */
        return current.items.some(item => lodash.isEqual(item.toJSON(), value))
      } else if (current instanceof Yaml.YAMLMap) {
        /** 如果是映射，检查每个值 */
        return Array.from((current as any).values()).some((v: any) => lodash.isEqual(v.toJSON(), value))
      } else {
        /** 否则，直接比较值 */
        return lodash.isEqual(current, value)
      }
    } catch (error) {
      logger.error(`[YamlEditor] 检查路径 ${path} 是否包含值时出错：${error}`)
      return false
    }
  }

  /**
   * 向根节点新增元素，如果根节点不是数组，则将其转换为数组再新增元素
   * @param value - 要新增的元素
   */
  pusharr (value: any) {
    try {
      if (!(this.document.contents instanceof Yaml.YAMLSeq)) {
        // 如果根节点不是数组，则将其转换为数组
        this.document.contents = new Yaml.YAMLSeq()
        logger.debug('[YamlEditor] 根节点已转换为数组')
      }
      this.document.contents.add(value)
      logger.debug('[YamlEditor] 已向根节点数组新增元素：', value)
    } catch (error) {
      logger.error(`[YamlEditor] 向根节点数组新增元素时出错：${error}`)
      return false
    }
  }

  /**
   * 根据索引从根节点数组删除元素
   * @param index - 要删除元素的索引
   */
  delarr (index: number): boolean {
    try {
      if (!(this.document.contents instanceof Yaml.YAMLSeq)) {
        throw new Error('[YamlEditor] 根节点不是数组')
      }
      if (index < 0 || index >= this.document.contents.items.length) {
        throw new Error('[YamlEditor] 索引超出范围')
      }
      this.document.contents.items.splice(index, 1)
      logger.debug('[YamlEditor] 已根据索引从根节点数组删除元素，索引：', index)
      return true
    } catch (error) {
      logger.error(`[YamlEditor] 根据索引删除根节点数组元素时出错：${error}`)
      return false
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
