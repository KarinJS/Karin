/**
 * 传入一个函数 判断是否是类
 * @param fnc 函数
 */
export const isClass = (fnc: unknown): fnc is Function => {
  return typeof fnc === 'function' && /^class\s/.test(fnc.toString())
}
