// import type { Middleware } from '@/core/plugin'

// /**
//  * @description 中间件处理器
//  * @param cache 中间件缓存
//  * @param args 参数
//  * @returns 返回是否退出 `true` 退出
//  */
// export const MiddlewareHandler = async (cache: Middleware[], ...args: any): Promise<boolean> => {
//   /** 先调用中间件 */
//   for (const info of cache) {
//     try {
//       let next = false
//       let exit = false
//       const nextFn = () => { next = true }
//       const exitFn = () => { exit = true }

//       const arg = [...args, nextFn, exitFn]
//       await (info as any).fnc(...arg)

//       if (exit) {
//         logger.debug(`[中间件][${info.type}][${info.info.name}][${info.file.basename}] 主动操作退出`)
//         return true
//       }

//       if (!next) return true
//     } catch (error) {
//       logger.error(`[中间件][${info.type}] 调用失败，已跳过`)
//       logger.error(error)
//       continue
//     }
//   }

//   return false
// }
