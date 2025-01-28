import { Component } from './base'
import { ComponentType, InputDataType, } from '@/types/Components'
import type { InputProps, ValidationRule } from '@/types/Components'

class Input extends Component {
  config: InputProps = { key: '', type: 'text' }

  constructor (key: string) {
    super(ComponentType.INPUT)
    this.config.key = key
  }

  /**
   * 内部属性 仅在`options`中可手动设置，其他方法请不要调用
   */
  _type (dataType: InputDataType) {
    // 映射 InputDataType 到 HTML input type
    const typeMap: Record<InputDataType, InputProps['type']> = {
      [InputDataType.STRING]: 'text',
      [InputDataType.NUMBER]: 'text',
      [InputDataType.BOOLEAN]: 'text',
      [InputDataType.DATE]: 'text',
      [InputDataType.TIME]: 'text',
      [InputDataType.DATETIME]: 'text',
      [InputDataType.EMAIL]: 'email',
      [InputDataType.URL]: 'url',
      [InputDataType.TEL]: 'tel',
      [InputDataType.PASSWORD]: 'password',
      [InputDataType.COLOR]: 'text',
      [InputDataType.JSON]: 'text'
    }

    if (!typeMap[dataType]) return this
    this.config.type = typeMap[dataType]
    return this
  }

  /**
   * 设置标签
   */
  label (label: string) {
    this.config.label = label
    return this
  }

  /**
   * 设置占位符
   */
  placeholder (placeholder: string) {
    this.config.placeholder = placeholder
    return this
  }

  /**
   * 设置验证规则
   */
  validate (rules: ValidationRule | ValidationRule[]) {
    /** regex转字符串 */
    if (!Array.isArray(rules)) rules = [rules]
    rules.forEach(rule => {
      if (rule.regex && rule.regex instanceof RegExp) {
        rule.regex = rule.regex.toString()
      }
    })

    this.config.validate = rules
    return this
  }

  /**
   * 设置大小
   * @param size 大小
   * @returns 输入框构建器
   */
  size (size: 'sm' | 'md' | 'lg') {
    this.config.size = size
    return this
  }

  /**
   * 设置颜色
   */
  color (color: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger') {
    this.config.color = color
    return this
  }

  /**
   * 设置是否必填
   */
  required (required: boolean = true) {
    this.config.isRequired = required
    return this
  }

  /**
   * 设置清除按钮
   */
  clearable (clearable: boolean = true) {
    this.config.isClearable = clearable
    return this
  }

  /**
   * 设置描述
   */
  description (description: string) {
    this.config.description = description
    return this
  }

  /**
   * 自定义参数
   */
  options (options: InputProps) {
    this.config = options
    return this
  }

  /**
   * 转换为字符串
   */
  toString () {
    return JSON.stringify({ componentType: this.componentType, ...this.config })
  }
}

/**
 * 输入框
 */
export const input = {
  /**
   * 创建基础输入框
   * @param key 唯一标识符
   */
  create: (key: string) => new Input(key),
  /**
   * 字符串
   * @param key 唯一标识符
   */
  string: (key: string) => {
    const fnc = new Input(key)._type(InputDataType.STRING)
    return fnc
      .label('字符串')
      .placeholder('请输入字符串')
      .required()
      .clearable()
      .color('primary')
  },
  /**
   * 数字
   * @param key 唯一标识符
   */
  number: (key: string) => {
    const fnc = new Input(key)._type(InputDataType.NUMBER)
    return fnc
      .label('数字')
      .placeholder('请输入数字')
      .required()
      .clearable()
      .color('primary')
      .validate([
        {
          min: 0,
          max: 100,
          error: '数字应在0-100之间'
        }
      ])
  },
  /**
   * 布尔值
   * @param key 唯一标识符
   */
  boolean: (key: string) => {
    const fnc = new Input(key)._type(InputDataType.BOOLEAN)
    return fnc
      .label('布尔值')
      .placeholder('请输入布尔值')
      .required()
      .clearable()
      .color('primary')
      .validate([
        {
          regex: /^(true|false)$/,
          error: '请输入有效的布尔值'
        }
      ])
  },
  /**
   * 日期
   * @param key 唯一标识符
   */
  date: (key: string) => {
    const fnc = new Input(key)._type(InputDataType.DATE)
    return fnc
      .label('日期')
      .placeholder('请输入日期')
      .required()
      .clearable()
      .color('primary')
      .validate([
        {
          regex: /^\d{4}-\d{2}-\d{2}$/,
          error: '请输入有效的日期格式'
        }
      ])
  },
  /**
   * 时间
   * @param key 唯一标识符
   */
  time: (key: string) => {
    const fnc = new Input(key)._type(InputDataType.TIME)
    return fnc
      .label('时间')
      .placeholder('请输入时间')
      .required()
      .clearable()
      .color('primary')
      .validate([
        {
          regex: /^\d{2}:\d{2}:\d{2}$/,
          error: '请输入有效的时间格式'
        }
      ])
  },
  /**
   * 日期时间
   * @param key 唯一标识符
   */
  datetime: (key: string) => {
    const fnc = new Input(key)._type(InputDataType.DATETIME)
    return fnc
      .label('日期时间')
      .placeholder('请输入日期时间')
      .required()
      .clearable()
      .color('primary')
      .validate([
        {
          regex: /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/,
          error: '请输入有效的日期时间格式'
        }
      ])
  },
  /**
   * 邮箱
   * @param key 唯一标识符
   */
  email: (key: string) => {
    const fnc = new Input(key)._type(InputDataType.EMAIL)
    return fnc
      .label('邮箱')
      .placeholder('请输入邮箱')
      .required()
      .clearable()
      .color('primary')
      .validate([
        {
          regex: '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$',
          error: '请输入有效的邮箱地址'
        },
        {
          minLength: 5,
          maxLength: 50,
          error: '邮箱长度应在5-50个字符之间'
        }
      ])
  },
  /**
   * URL
   * @param key 唯一标识符
   */
  url: (key: string) => {
    const fnc = new Input(key)._type(InputDataType.URL)
    return fnc
      .label('URL')
      .placeholder('请输入URL')
      .required()
      .clearable()
      .color('primary')
      .validate([
        {
          regex: /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/,
          error: '请输入有效的URL地址'
        }
      ])
  },
  /**
   * 电话
   * @param key 唯一标识符
   */
  tel: (key: string) => {
    const fnc = new Input(key)._type(InputDataType.TEL)
    return fnc
      .label('电话')
      .placeholder('请输入电话')
      .required()
      .clearable()
      .color('primary')
      .validate([
        {
          regex: /^1[3-9]\d{9}$/,
          error: '请输入有效的手机号码'
        }
      ])
  },
  /**
   * 密码
   * @param key 唯一标识符
   */
  password: (key: string) => {
    const fnc = new Input(key)._type(InputDataType.PASSWORD)
    return fnc
      .label('密码')
      .placeholder('请输入密码')
      .required()
      .clearable()
      .color('primary')
      .validate({
        minLength: 1,
        error: '密码长度不能小于1位'
      })
  },
  /**
   * 颜色
   * @param key 唯一标识符
   */
  color: (key: string) => {
    const fnc = new Input(key)._type(InputDataType.COLOR)
    return fnc
      .label('颜色')
      .placeholder('请输入颜色')
      .required()
      .clearable()
      .color('primary')
      .validate([
        {
          regex: /^#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})$/,
          error: '请输入有效的颜色格式'
        }
      ])
  },
  /**
   * JSON
   * @param key 唯一标识符
   */
  json: (key: string) => {
    const fnc = new Input(key)._type(InputDataType.JSON)
    return fnc
      .label('JSON')
      .placeholder('请输入JSON')
      .required()
      .clearable()
      .color('primary')
      .validate([
        {
          regex: /^[^{}]*$/,
          error: '请输入有效的JSON格式'
        }
      ])
  },
  /**
   * 自定义参数
   * @param key 键
   * @param options 参数
   * @returns 输入框构建器
   */
  options: (key: string, options: InputProps) => new Input(key).options(options)
}

// console.log(JSON.parse(input.number('number').toString()))
