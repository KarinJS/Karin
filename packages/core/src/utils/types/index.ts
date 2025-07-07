/**
 * 处理布尔值
 * @param val 值
 * @param defaultValue 默认值 可选
 * @returns 返回布尔值
 */
export const bool = <T> (
  val: unknown,
  defaultValue?: T
): T extends unknown ? T : boolean | null => {
  if (typeof val === 'boolean') return val as any
  if (defaultValue !== undefined) return defaultValue as any
  return null as any
}

/**
 * 处理数字值
 * @param val 值
 * @param defaultValue 默认值 可选
 * @returns 返回数字值
 */
export const number = <T> (
  val: unknown,
  defaultValue?: T
): T extends unknown ? T : number | null => {
  if (typeof val === 'number' && !isNaN(val)) return val as any
  if (defaultValue !== undefined) return defaultValue as any
  return null as any
}

/**
 * 处理字符串值
 * @param val 值
 * @param defaultValue 默认值 可选
 * @returns 返回字符串值
 */
export const string = <T> (
  val: unknown,
  defaultValue?: T
): T extends unknown ? T : string | null => {
  if (typeof val === 'string') return val as any
  if (defaultValue !== undefined) return defaultValue as any
  return null as any
}

/**
 * 处理数组值
 * @param val 值
 * @param defaultValue 默认值 可选
 * @returns 返回数组值
 */
export const array = <T> (
  val: unknown,
  defaultValue?: T
): T extends unknown[] ? T : unknown[] | null => {
  if (Array.isArray(val)) return val as any
  if (defaultValue !== undefined) return defaultValue as any
  return null as any
}
