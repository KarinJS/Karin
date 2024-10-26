/**
 * @description 锁定对象的属性，使其不可被修改
 * @param obj 对象
 * @param key 属性
 */
export const lock = <T extends object, K extends keyof T> (obj: T, key: K): void => {
  /** 获取属性描述符 */
  const descriptor = Object.getOwnPropertyDescriptor(obj, key)
  if (descriptor) {
    Object.defineProperty(obj, key, {
      /** 属性是否可枚举 */
      enumerable: true,
      /** 属性描述符是否可配置 */
      configurable: false,
      /** 属性是否可写  */
      writable: false,
      /** 保持原有的值 */
      value: descriptor.value,
    })
  } else {
    throw new Error(`Property ${String(key)} does not exist on the object`)
  }
}
