import fs from 'node:fs'
import lodash from 'lodash'
import YAML, { isMap, isSeq, isPair } from 'yaml'

export type YamlValue = string | boolean | number | object | any[]

/** YAML 编辑器 */
export class YamlEditor {
  filePath: string
  doc: YAML.Document
  document: YAML.Document
  constructor (file: string) {
    this.filePath = file
    const data = YAML.parseDocument(fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : file)
    this.doc = data
    this.document = data
  }

  /**
   * 获取指定路径的值
   * @param path - 路径，多个路径使用`.`连接，例如：`a.b.c`
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
   * @param path - 路径，多个路径使用`.`连接，例如：`a.b.c`
   * @param value - 要设置的值 允许的类型：`string`, `boolean`, `number`, `object`, `array`
   * @param isSplit - 是否使用分割路径路径，默认为 `true`
   */
  set (path: string, value: YamlValue, isSplit = true): boolean {
    try {
      const _path = typeof path === 'string' ? (isSplit ? path.split('.') : [path]) : path
      this.document.setIn(_path, value)
      return true
    } catch (error) {
      logger.error(`[YamlEditor] 设置数据时出错：${error}`)
      return false
    }
  }

  /**
   * 向指定路径添加新值
   * @param path - 路径，多个路径使用`.`连接，例如：`a.b.c`
   * @param value - 要添加的值
   * @param isSplit - 是否使用分割路径路径，默认为 `true`
   */
  add (path: string, value: YamlValue, isSplit = true): boolean {
    try {
      const _path = typeof path === 'string' ? (isSplit ? path.split('.') : [path]) : path
      this.document.addIn(_path, value)
      logger.debug(`[YamlEditor] 已在 ${path} 添加新的值`)
      return true
    } catch (error) {
      logger.error(`[YamlEditor] 添加数据时出错：${error}`)
      return false
    }
  }

  /**
   * 删除指定路径
   * @param path - 路径，多个路径使用`.`连接，例如：`a.b.c`
   * @param isSplit - 是否使用分割路径路径，默认为 `true`
   * @returns 是否删除成功
   */
  del (path: string, isSplit = true): boolean {
    try {
      const _path = typeof path === 'string' ? (isSplit ? path.split('.') : [path]) : path
      this.document.deleteIn(_path)
      return true
    } catch (error) {
      logger.error(`[YamlEditor] 删除数据时出错：${error}`)
      return false
    }
  }

  /**
   * 向指定路径的数组添加新值，可以选择添加到数组的开始或结束
   * @param path - 路径，多个路径使用`.`连接，例如：`a.b.c`
   * @param value - 要添加的值
   * @param prepend - 如果为 true，则添加到数组的开头，否则添加到末尾
   * @param isSplit - 是否使用分割路径路径，默认为 `true`
   */
  append (path: string, value: string, prepend = false, isSplit = true): boolean {
    try {
      const _path = typeof path === 'string' ? (isSplit ? path.split('.') : [path]) : path
      let current = this.document.getIn(_path)
      if (!current) {
        current = new YAML.YAMLSeq()
        this.document.setIn(_path, current)
      } else if (!(current instanceof YAML.YAMLSeq)) {
        logger.error('[YamlEditor] 指定的路径不是数组')
        return false
      } else {
        prepend ? current.items.unshift(value) : current.add(value)
      }
      logger.debug(`[YamlEditor] 已向 ${path} 数组${prepend ? '开头' : '末尾'}添加新元素：${value}`)
      return true
    } catch (error) {
      logger.error(`[YamlEditor] 向数组添加元素时出错：${error}`)
      return false
    }
  }

  /**
   * 向指定路径的数组删除值
   * @param path - 路径，多个路径使用`.`连接，例如：`a.b.c`
   * @param value - 要删除的值
   * @param isSplit - 是否使用分割路径路径，默认为 `true`
   */
  remove (path: string, value: YamlValue, isSplit = true): boolean {
    try {
      const _path = typeof path === 'string' ? (isSplit ? path.split('.') : [path]) : path
      const current = this.document.getIn(_path)
      if (!current) {
        logger.error('[YamlEditor] 指定的路径不存在')
        return false
      }
      if (!(current instanceof YAML.YAMLSeq)) {
        logger.error('[YamlEditor] 指定的路径不是数组')
        return false
      }
      const index = current.items.findIndex(item => lodash.isEqual(item.toJSON(), value))
      if (index < 0) {
        logger.error('[YamlEditor] 未找到要删除的值')
        return false
      }
      current.items.splice(index, 1)
      logger.debug(`[YamlEditor] 已从 ${path} 数组删除元素：${value}`)
      return true
    } catch (error) {
      logger.error(`[YamlEditor] 从数组删除元素时出错：${error}`)
      return false
    }
  }

  /**
   * 检查指定路径的键是否存在
   * @param path - 路径，用点号分隔
   * @param isSplit - 是否使用分割路径路径，默认为 `true`
   */
  has (path: string, isSplit = true): boolean {
    try {
      const _path = typeof path === 'string' ? (isSplit ? path.split('.') : [path]) : path
      return this.document.hasIn(_path)
    } catch (error) {
      logger.error(`[YamlEditor] 检查路径是否存在时出错：${error}`)
      return false
    }
  }

  /**
   * 查询指定路径中是否包含指定的值
   * @param path - 路径，用点号分隔
   * @param value - 要查询的值
   * @param isSplit - 是否使用分割路径路径，默认为 `true`
   */
  hasval (path: string, value: YamlValue, isSplit = true): boolean {
    try {
      const _path = typeof path === 'string' ? (isSplit ? path.split('.') : [path]) : path
      const current = this.document.getIn(_path)
      if (!current) return false

      /** 检查当前节点是否包含指定的值 */
      if (current instanceof YAML.YAMLSeq) {
        /** 如果是序列，遍历序列查找值 */
        return current.items.some(item => lodash.isEqual(item.toJSON(), value))
      } else if (current instanceof YAML.YAMLMap) {
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
   * 查询指定路径中是否包含指定的值
   * @param path - 路径，用点号分隔
   * @param value - 要查询的值
   * @deprecated 请使用 `hasval` 代替
   */
  hasVal (path: string, value: YamlValue): boolean {
    return this.hasval(path, value)
  }

  /**
   * 向根节点新增元素，如果根节点不是数组，则将其转换为数组再新增元素
   * @param value - 要新增的元素
   */
  pusharr (value: YamlValue): boolean {
    try {
      if (!(this.document.contents instanceof YAML.YAMLSeq)) {
        // 如果根节点不是数组，则将其转换为数组
        this.document.contents = new YAML.YAMLSeq()
        logger.debug('[YamlEditor] 根节点已转换为数组')
      }
      this.document.contents.add(value)
      logger.debug('[YamlEditor] 已向根节点数组新增元素：', value)
      return true
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
      if (!(this.document.contents instanceof YAML.YAMLSeq)) {
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
   * 获取指定路径的pair对象
   * @param path - 路径，多个路径使用`.`连接，例如：`a.b.c`
   * @param isSplit - 是否使用分割路径路径，默认为 `true`
   */
  getpair (path: string, isSplit = true) {
    if (!path) throw new Error('path is required')
    const keys = typeof path === 'string' ? (isSplit ? path.split('.') : [path]) : path
    // 好多any啊，我要当any糕手~
    let pair = this.document.contents as any
    keys.forEach(key => {
      if (isMap(pair)) {
        pair = pair.items.find((item: any) => item.key.value === key)
      } else if (isSeq(pair)) {
        pair = pair.items.find((item: any) => item.value === key)
      } else if (isPair(pair)) {
        pair = (pair as any).value.items.find((item: any) => item.key.value === key)
      }
    })
    return pair
  }

  /**
   * 设置指定键的注释
   * @param path - 路径，多个路径使用`.`连接，例如：`a.b.c`
   * @param comment - 要设置的注释
   * @param prepend - 如果为 true，则添加到注释的开头，否则添加到同一行的末尾
   * @param isSplit - 是否使用分割路径路径，默认为 `true`
   */
  comment (path: string, comment: string, prepend: boolean, isSplit = true) {
    if (!path) throw new Error('[YamlEditor] path 不能为空')
    const pair = this.getpair(path, isSplit)
    if (!pair) throw new Error(`[YamlEditor] 未找到节点 ${path}`)
    comment = ` ${comment}`
    if (prepend) {
      pair.key.commentBefore = comment
    } else {
      pair.key.comment = comment
    }
  }

  /**
   * 删除指定键的注释
   * @param path - 路径，多个路径使用`.`连接，例如：`a.b.c`
   * @param type - 要删除的注释类型，`before` 为注释前，`after` 为注释后，`all` 为全部
   * @param isSplit - 是否使用分割路径路径，默认为 `true`
   */
  uncomment (path: string, type: 'before' | 'after' | 'all' = 'all', isSplit = true) {
    if (!path) throw new Error('[YamlEditor] path 不能为空')
    const pair = this.getpair(path, isSplit)
    if (!pair) throw new Error(`[YamlEditor] 未找到节点 ${path}`)

    if (type === 'all') {
      delete pair.key.comment
      delete pair.key.commentBefore
    } else if (type === 'before') {
      delete pair.key.commentBefore
    } else if (type === 'after') {
      delete pair.key.comment
    }
  }

  /**
   * 检查注释是否存在
   * @param path - 路径，多个路径使用`.`连接，例如：`a.b.c`
   * @param type - 要检查的注释类型，`before` 为注释前，`after` 为注释后
   * @param isSplit - 是否使用分割路径路径，默认为 `true`
   */
  hascomment (path: string, type: 'before' | 'after', isSplit = true) {
    if (!path) throw new Error('[YamlEditor] path 不能为空')
    const pair = this.getpair(path, isSplit)
    if (!pair) throw new Error(`[YamlEditor] 未找到节点 ${path}`)

    if (type === 'before') {
      return !!pair.key.commentBefore
    } else if (type === 'after') {
      return !!pair.key.comment
    }
    return false
  }

  /**
   * 保存文件
   * 保存失败会抛出异常
   */
  save () {
    fs.writeFileSync(this.filePath, this.document.toString())
    logger.debug('[YamlEditor] 文件已保存')
  }
}

/** YAML 工具 */
export const Yaml = () => {
  const yamlNew = {
    /**
     * 传入yaml文件路径 自动读取并解析
     * @param path yaml文件路径
     */
    read: (path: string) => {
      const data = fs.readFileSync(path, 'utf-8')
      return YAML.parse(data)
    },
    /**
     * 保存并写入注释
     * @param path 保存的路径
     * @param value 保存的数据
     * @param commentConfig 注释配置文件路径或json
     */
    save: (path: string, value: any, commentConfig?: string) => {
      if (!commentConfig) {
        fs.writeFileSync(path, YAML.stringify(value))
        return
      }

      const editor = new YamlEditor(YAML.stringify(value))
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

  const yaml = Object.assign(YAML, yamlNew)
  return yaml
}
