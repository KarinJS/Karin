import type { PkgData } from '@/utils/fs/pkg'
import type { PkgInfo, PluginFile, PluginFncTypes } from '@/types/plugin'

// /**
//  * 创建日志方法
//  * @param enable 是否启用
//  * @param isBot 是否为bot
//  */
// export const createLogger = <T extends boolean> (
//   enable?: boolean,
//   isBot?: T
// ): T extends true ? (id: string, log: string) => void : (log: string) => void => {
//   if (isBot) {
//     const fnc = enable === false
//       ? (id: string, log: string) => logger.bot('debug', id, log)
//       : (id: string, log: string) => logger.bot('mark', id, log)
//     return fnc as any
//   }

//   return enable === false
//     ? (log: string) => logger.debug(log)
//     : (log: string) => logger.mark(log)
// }

/**
 * 创建插件文件对象
 * @param type - 文件类型
 */
export const createFile = <T extends PluginFncTypes> (
  type: T,
  name: string
): PluginFile<T> => {
  return {
    absPath: '',
    basename: '',
    dirname: '',
    method: '',
    type,
    name,
  }
}

/**
 * 创建插件pkg对象
 */
export const createPkg = (): PkgInfo => {
  return {
    name: '',
    apps: [],
    dir: '',
    id: -1,
    pkgData: {} as PkgData,
    pkgPath: '',
    type: 'app',
    allApps: [],
  }
}
