/**
 * `groups.json`中的配置类型
 */
export interface GroupsObjectValue {
  /** 配置键: `Bot:selfId:groupId` */
  key: string
  /** 是否继承全局配置 默认`true` */
  inherit: boolean
  /** 群聊、频道中所有消息冷却时间，单位秒，0则无限制 */
  cd: number
  /** 群聊、频道中 每个人的消息冷却时间，单位秒，0则无限制。注意，开启后所有消息都会进CD，无论是否触发插件。 */
  userCD: number
  /** 机器人响应模式，0-所有 1-仅@机器人 2-仅回应管理员 3-仅回应别名 4-别名或@机器人 5-管理员无限制，成员别名或@机器人 6-仅回应主人 */
  mode: 0 | 1 | 2 | 3 | 4 | 5 | 6
  /** 机器人别名 设置后别名+指令触发机器人 */
  alias: string[]
  /** 白名单插件、功能，只有在白名单中的插件、功能才会响应 `karin-plugin-test:app.js` `karin-plugin-test:测试转发` */
  enable: string[]
  /** 黑名单插件、功能，黑名单中的插件、功能不会响应 `karin-plugin-test:app.js` `karin-plugin-test:测试转发` */
  disable: string[]
  /** 群、频道成员单独黑名单 */
  member_enable: string[]
  /** 群、频道成员单独白名单 */
  member_disable: string[]
}

/**
 * `groups.json` 文件类型
 */
export type Groups = GroupsObjectValue[]
