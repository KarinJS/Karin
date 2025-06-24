// import { getAllBot } from '@/service/bot'
// import { HttpAdapterOneBot11 } from '../connect'
// import type { AdapterType } from '@/types/adapter/class'

// type val = {
//   apiToken: string | null
//   postToken: string | null
// }

// /** http post bot列表 */
// const botMap = new Map<string, val>()

// /**
//  * @description 注册一个http post bot
//  * @param selfId 机器人ID
//  * @param url 机器人地址
//  * @param apiToken 用于发送Api请求的鉴权Token
//  * @param postToken 用于验证请求合法的Token
//  */
// export const registerHttpBot = async (
//   selfId: string,
//   url: string,
//   apiToken?: string,
//   postToken?: string
// ) => {
//   botMap.set(
//     selfId,
//     {
//       apiToken: apiToken || null,
//       postToken: postToken || null,
//     })

//   logger.debug(`[service][onebot-post][注册Bot] ${selfId}`)
//   const adapter = new HttpAdapterOneBot11(selfId, url)
//   await adapter.init()
// }

// /**
//  * 获取一个http post bot
//  * @param selfId 机器人ID
//  */
// export const getHttpBot = (selfId: string) => {
//   return botMap.get(selfId)
// }

// /**
//  * @description 卸载一个http post bot
//  * @param selfId 机器人ID
//  */
// export const unregisterHttpBot = (selfId: string) => {
//   botMap.delete(selfId)

//   const isHttpOnebot = (bot: AdapterType): bot is HttpAdapterOneBot11 => {
//     return bot.adapter.communication === 'http'
//   }

//   const list = getAllBot().filter(isHttpOnebot)
//   list.forEach(bot => {
//     if (bot.selfId === selfId) {
//       bot?.uninstall()
//     }
//   })
// }

// /**
//  * @description 获取事件验证Token
//  * @param selfId 机器人ID
//  */
// export const getHttpBotPostToken = (selfId: string) => {
//   return botMap.get(selfId)?.postToken
// }

// /**
//  * @description 获取Api请求Token
//  * @param selfId 机器人ID
//  */
// export const getHttpBotApiToken = (selfId: string) => {
//   return botMap.get(selfId)?.apiToken
// }

// /**
//  * 获取全部http post bot selfId
//  */
// export const getAllHttpBotSelfId = () => {
//   return Array.from(botMap.keys())
// }
