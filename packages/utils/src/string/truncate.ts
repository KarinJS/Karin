/**
 * 截断字符串，如果长度超过指定最大长度，则使用省略符号替代超出部分。
 * 支持 emoji 和多字节字符，不会截断半个字符。
 *
 * @param inputString 要截断的字符串，可选
 * @param options 配置项
 *   - length: 最大长度，默认 30
 *   - omission: 省略符号，默认 "…"
 *   - separator: 分隔符，可为字符串或正则，用于优雅截断
 * @returns 截断后的字符串
 */
export const truncate = (
  inputString: string,
  options?: {
    /** 最大长度，默认 30 */
    length?: number
    /** 省略符号，默认 "…" */
    omission?: string
    /** 分隔符，可为字符串或正则，用于优雅截断 */
    separator?: string | RegExp
  }
): string => {
  /** 默认值 */
  const str = inputString ?? ''
  /** 最大长度 */
  const maxLength = options?.length ?? 30
  /** 省略符 */
  const omission = options?.omission ?? '…'
  /** 分隔符 */
  const separator = options?.separator

  // 使用 Intl.Segmenter 分割字符串为 grapheme cluster，emoji 安全
  const graphemes = [...new Intl.Segmenter('en', { granularity: 'grapheme' }).segment(str)].map(s => s.segment)

  /** 如果总长度小于等于最大长度，直接返回原字符串 */
  if (graphemes.length <= maxLength) return str

  /** 计算截断位置，如果省略符长度超过最大长度，则直接返回省略符 */
  const endIndex = maxLength - omission.length
  if (endIndex < 1) return omission

  /** 截断字符串 */
  let result = graphemes.slice(0, endIndex).join('')

  /** 处理 separator（可选） */
  if (separator !== undefined) {
    if (separator instanceof RegExp) {
      const match = result.match(new RegExp(separator.source + '$'))
      if (match?.index !== undefined) result = result.slice(0, match.index)
    } else {
      const index = result.lastIndexOf(separator)
      if (index > -1) result = result.slice(0, index)
    }
  }

  /** 返回最终结果 */
  return result + omission
}

/**
 * 检查值是否为对象
 * @param value 要检查的值
 * @returns 如果值是对象则返回 true，否则返回 false
 */
export const isObject = <T = object> (value: unknown): value is T => {
  const type = typeof value
  return value != null && (type === 'object' || type === 'function')
}
