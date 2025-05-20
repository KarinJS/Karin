/**
 * `privates.json`文件中数组元素的类型
 */
export interface PrivatesObjectValue {
  /** 配置键 `Bot:selfId:userId` */
  key: string
  /** 是否继承全局配置 默认`true` */
  inherit: boolean
  /** 好友消息冷却时间，单位秒，0则无限制 */
  cd: number
  /** 机器人响应模式，0-所有 2-仅回应管理员 3-仅回应别名 5-管理员无限制，非管理员别名 6-仅回应主人 */
  mode: 0 | 2 | 3 | 5 | 6
  /** 机器人别名 设置后别名+指令触发机器人 */
  alias: string[]
  /** 白名单插件、功能，只有在白名单中的插件、功能才会响应 `karin-plugin-test:app.js` `karin-plugin-test:测试转发` */
  enable: string[]
  /** 黑名单插件、功能，黑名单中的插件、功能不会响应 `karin-plugin-test:app.js` `karin-plugin-test:测试转发` */
  disable: string[]
}

/**
 * `privates.json` 类型
 */
export type Privates = PrivatesObjectValue[]
