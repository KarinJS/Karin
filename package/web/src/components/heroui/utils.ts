import type { InputProps } from '@heroui/input'
import type { ValidationRule } from 'node-karin'

/**
 * 创建组件返回数据
 * @param initialValues - 初始值
 * @returns 组件数据
 */
export const createResult = (initialValues: Record<string, any> = {}) => {
  /** 传递给后端的对象 */
  const result = { ...initialValues }
  return result
}

/**
 * 验证输入值是否符合规则
 * @param value - 需要验证的值
 * @param rule - 验证规则
 * @returns 错误信息或验证通过
 */
export const validateValue = (value: string, rule: ValidationRule): string | null => {
  if (rule.min !== undefined || rule.max !== undefined) {
    const numericValue = Number(value)
    if (Number.isNaN(numericValue)) return rule.error || '请输入有效数字'
    if (rule.min !== undefined && numericValue < rule.min) return rule.error || `最小值不能小于 ${rule.min}`
    if (rule.max !== undefined && numericValue > rule.max) return rule.error || `最大值不能超过 ${rule.max}`
  }

  if (rule.regex) {
    try {
      const regExp = typeof rule.regex === 'string'
        ? new RegExp(rule.regex.replace(/^\/|\/$/g, ''))
        : rule.regex
      if (!regExp.test(value)) return rule.error || '格式不符合要求'
    } catch (e) {
      console.error('Invalid regex:', rule.regex)
      return '无效的验证规则'
    }
  }

  if (rule.minLength && value.length < rule.minLength) {
    return rule.error || `内容长度不能少于 ${rule.minLength} 个字符`
  }
  if (rule.maxLength && value.length > rule.maxLength) {
    return rule.error || `内容长度不能超过 ${rule.maxLength} 个字符`
  }

  return null
}

/**
 * 创建验证处理器
 * @param rules - 验证规则数组
 * @returns 验证处理函数
 */
export const createValidator = (rules: ValidationRule[]): InputProps['validate'] => {
  return (value: string) => {
    for (const rule of rules) {
      const error = validateValue(value, rule)
      if (error) return error
    }
    return true
  }
}
