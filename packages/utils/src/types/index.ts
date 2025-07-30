/**
 * 处理布尔值
 * @param val 值
 * @param defaultValue 默认值 可选
 * @returns 返回布尔值
 */
export const bool = <T extends unknown = boolean> (
  val: unknown,
  defaultValue?: unknown
): T => {
  if (typeof val === 'boolean') return val as T
  if (defaultValue !== undefined) return defaultValue as T
  return Boolean(val) as T
}

/**
 * 处理数字值
 * @param val 值
 * @param defaultValue 默认值 可选
 * @returns 返回数字值
 */
export const number = <T extends unknown = number> (
  val: unknown,
  defaultValue?: unknown
): T => {
  if (typeof val === 'number' && !isNaN(val)) return val as T
  if (defaultValue !== undefined) return defaultValue as T
  const num = Number(val)
  return (isNaN(num) ? 0 : num) as T
}

/**
 * 处理字符串值
 * @param val 值
 * @param defaultValue 默认值 可选
 * @returns 返回字符串值
 */
export const string = <T extends unknown = string> (
  val: unknown,
  defaultValue?: unknown
): T => {
  if (typeof val === 'string') return val as T
  if (defaultValue !== undefined) return defaultValue as T
  return (String(val) || '') as T
}

/**
 * 处理数组值
 * @param val 值
 * @param defaultValue 默认值 可选
 * @returns 返回数组值
 */
export const array = <T extends unknown[] = any[]> (
  val: unknown,
  defaultValue?: unknown[]
): T => {
  if (Array.isArray(val)) return val as T
  if (defaultValue !== undefined) return defaultValue as T
  return [] as unknown[] as T
}
