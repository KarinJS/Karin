import initAdapter from './adapter'
import initConfig from './config'
import initEnv from './env'
import initGroups from './groups'
import initPrivates from './privates'
import initRender from './render'

export * from './adapter'
export * from './config'
export * from './env'
export * from './groups'
export * from './privates'
export * from './render'
export * from './pm2'
export * from './redis'

/**
 * @internal

 * @description 初始全部化配置文件
 * @param dir 配置文件根目录
 */
export const initConfigCache = (dir: string) => {
  initEnv()
  initAdapter(dir)
  initConfig(dir)
  initGroups(dir)
  initPrivates(dir)
  initRender(dir)
}
