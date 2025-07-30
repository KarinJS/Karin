import * as load from './load'
import * as manager from './manager'
import * as register from './register'
export * from './list'
export * from './market'
export * from './types'

/** 插件管理类实例 */
export const plguinManager: {
  /** 插件加载 */
  load: typeof load,
  /** 插件管理 */
  manager: typeof manager,
  /** 插件注册 */
  register: typeof register,
} = {
  load,
  manager,
  register,
}
