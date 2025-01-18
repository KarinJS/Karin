import type { FileList } from '@/types/config'
import { config, adapter, groups, privates, render, redis, pm2, env } from '@/utils/config'

export interface FieldsBase {
  /** 字段名 */
  key: string
  /** 字段类型 */
  type: unknown
  /** 字段标题 */
  title: string
  /** 字段描述 */
  description: string
  /** 字段内容 */
  content: unknown
}

export interface FieldsString extends FieldsBase {
  type: 'string'
  content: string
}

export interface FieldsStringArray extends FieldsBase {
  type: 'string[]'
  content: string[]
}

export interface FieldsBoolean extends FieldsBase {
  type: 'boolean'
  content: boolean
}

export interface FieldsBooleanArray extends FieldsBase {
  type: 'boolean[]'
  content: boolean[]
}

export interface FieldsNumber extends FieldsBase {
  type: 'number'
  content: number
}

export interface FieldsNumberArray extends FieldsBase {
  type: 'number[]'
  content: number[]
}

export interface FieldsArray extends FieldsBase {
  type: 'array'
  content: Fields[][]
}

export interface FieldsObject extends FieldsBase {
  type: 'object'
  content: Fields[]
}

export type Fields = FieldsString | FieldsStringArray | FieldsBoolean | FieldsNumber | FieldsArray | FieldsObject

/**
 * 返回结构类型
 */
export interface getConfigReturn {
  /** 文件名 */
  name: string
  /** 文件标题 */
  title: string
  /** 文件描述 */
  description: string
  /** 文件类型 */
  type: 'json' | 'yaml' | 'env'
  /** 显示在前端的字段 */
  fields: Fields[]
}

/**
 * 获取基本配置文件列表
 * @param config 配置
 * @returns 配置文件列表
 */
export const getConfig = (): getConfigReturn => {
  const cfg = config()
  return {
    name: 'config',
    title: '基本配置',
    description: 'Bot基本配置选项',
    type: 'json',
    fields: [
      {
        key: 'master',
        type: 'string[]',
        title: '主人列表',
        description: 'Bot的主人列表',
        content: cfg.master,
      },
      {
        key: 'admin',
        type: 'string[]',
        title: '管理员列表',
        description: 'Bot的管理员列表',
        content: cfg.admin,
      },
      {
        key: 'user.enable_list',
        type: 'string[]',
        title: '用户白名单',
        description: '允许使用Bot的用户列表',
        content: cfg.user.enable_list,
      },
      {
        key: 'user.disable_list',
        type: 'string[]',
        title: '用户黑名单',
        description: '禁止使用Bot的用户列表',
        content: cfg.user.disable_list,
      },
      {
        key: 'friend.enable',
        type: 'boolean',
        title: '启用好友消息',
        description: '是否启用好友消息事件',
        content: cfg.friend.enable,
      },
      {
        key: 'friend.enable_list',
        type: 'string[]',
        title: '好友白名单',
        description: '允许交互的好友列表',
        content: cfg.friend.enable_list,
      },
      {
        key: 'friend.disable_list',
        type: 'string[]',
        title: '好友黑名单',
        description: '禁止交互的好友列表',
        content: cfg.friend.disable_list,
      },
      {
        key: 'friend.log_enable_list',
        type: 'string[]',
        title: '好友日志白名单',
        description: '允许打印在控制台的好友消息',
        content: cfg.friend.log_enable_list,
      },
      {
        key: 'friend.log_disable_list',
        type: 'string[]',
        title: '好友日志黑名单',
        description: '不打印在控制台的好友消息',
        content: cfg.friend.log_disable_list,
      },
      {
        key: 'group.enable',
        type: 'boolean',
        title: '启用群消息',
        description: '是否启用群消息事件',
        content: cfg.group.enable,
      },
      {
        key: 'group.enable_list',
        type: 'string[]',
        title: '群白名单',
        description: '允许交互的群列表',
        content: cfg.group.enable_list,
      },
      {
        key: 'group.disable_list',
        type: 'string[]',
        title: '群黑名单',
        description: '禁止交互的群列表',
        content: cfg.group.disable_list,
      },
      {
        key: 'group.log_enable_list',
        type: 'string[]',
        title: '群日志白名单',
        description: '打印在控制台的群消息',
        content: cfg.group.log_enable_list,
      },
      {
        key: 'group.log_disable_list',
        type: 'string[]',
        title: '群日志黑名单',
        description: '不打印在控制台的群消息',
        content: cfg.group.log_disable_list,
      },
      {
        key: 'directs.enable',
        type: 'boolean',
        title: '启用私信消息',
        description: '是否启用私信消息事件',
        content: cfg.directs.enable,
      },
      {
        key: 'directs.enable_list',
        type: 'string[]',
        title: '私信白名单',
        description: '允许私信交互的用户列表',
        content: cfg.directs.enable_list,
      },
      {
        key: 'directs.disable_list',
        type: 'string[]',
        title: '频道私信黑名单',
        description: '禁止使用私信交互的用户列表',
        content: cfg.directs.disable_list,
      },
      {
        key: 'directs.log_enable_list',
        type: 'string[]',
        title: '频道私信日志白名单',
        description: '打印在控制台的频道私信消息',
        content: cfg.directs.log_enable_list,
      },
      {
        key: 'directs.log_disable_list',
        type: 'string[]',
        title: '频道私信日志黑名单',
        description: '不打印在控制台的频道私信消息',
        content: cfg.directs.log_disable_list,
      },
      {
        key: 'guilds.enable',
        type: 'boolean',
        title: '启用频道消息',
        description: '是否启用频道消息事件',
        content: cfg.guilds.enable,
      },
      {
        key: 'guilds.enable_list',
        type: 'string[]',
        title: '频道白名单',
        description: '允许交互的频道列表',
        content: cfg.guilds.enable_list,
      },
      {
        key: 'guilds.disable_list',
        type: 'string[]',
        title: '频道黑名单',
        description: '禁止交互的频道列表',
        content: cfg.guilds.disable_list,
      },
      {
        key: 'guilds.log_enable_list',
        type: 'string[]',
        title: '频道日志白名单',
        description: '打印在控制台的频道消息',
        content: cfg.guilds.log_enable_list,
      },
      {
        key: 'guilds.log_disable_list',
        type: 'string[]',
        title: '频道日志黑名单',
        description: '不打印在控制台的频道消息',
        content: cfg.guilds.log_disable_list,
      },
      {
        key: 'channels.enable',
        type: 'boolean',
        title: '启用子频道消息',
        description: '是否启用子频道消息事件',
        content: cfg.channels.enable,
      },
      {
        key: 'channels.enable_list',
        type: 'string[]',
        title: '子频道消息白名单',
        description: '允许交互的子频道消息列表',
        content: cfg.channels.enable_list,
      },
      {
        key: 'channels.disable_list',
        type: 'string[]',
        title: '子频道消息黑名单',
        description: '禁止交互的子频道消息列表',
        content: cfg.channels.disable_list,
      },
      {
        key: 'channels.log_enable_list',
        type: 'string[]',
        title: '子频道日志白名单',
        description: '打印在控制台的子频道消息',
        content: cfg.channels.log_enable_list,
      },
      {
        key: 'channels.log_disable_list',
        type: 'string[]',
        title: '子频道日志黑名单',
        description: '不打印在控制台的子频道消息',
        content: cfg.channels.log_disable_list,
      },
    ],
  }
}

/**
 * 获取适配器配置
 * @returns 适配器配置文件
 */
export const getAdapter = (): getConfigReturn => {
  const adapterConfig = adapter()

  return {
    name: 'adapter',
    title: '适配器配置',
    description: '各个适配器的配置选项',
    type: 'json',
    fields: [
      {
        key: 'console.isLocal',
        type: 'boolean',
        title: '本地访问限制',
        description: '是否只允许本地访问控制台',
        content: adapterConfig.console.isLocal,
      },
      {
        key: 'console.token',
        type: 'string',
        title: '控制台令牌',
        description: '非本地访问时的鉴权令牌',
        content: adapterConfig.console.token,
      },
      {
        key: 'console.host',
        type: 'string',
        title: '资源地址',
        description: '控制台打印的资源地址',
        content: adapterConfig.console.host,
      },
      {
        key: 'onebot.ws_server.enable',
        type: 'boolean',
        title: '启用反向WS服务器',
        description: '是否启用OneBot反向WebSocket服务器',
        content: adapterConfig.onebot.ws_server.enable,
      },
      {
        key: 'onebot.ws_server.timeout',
        type: 'number',
        title: '请求超时时间',
        description: 'OneBot请求的超时时间（毫秒）',
        content: adapterConfig.onebot.ws_server.timeout,
      },
      {
        key: 'onebot.ws_client',
        type: 'array',
        title: '正向WS客户端配置',
        description: 'OneBot正向WebSocket客户端配置列表',
        content: adapterConfig.onebot.ws_client.map((client, index) => [
          {
            key: `onebot.ws_client.${index}.enable`,
            type: 'boolean',
            title: '启用状态',
            description: '是否启用该正向WS连接',
            content: client.enable,
          },
          {
            key: `onebot.ws_client.${index}.url`,
            type: 'string',
            title: 'WS地址',
            description: '正向WebSocket连接地址',
            content: client.url,
          },
          {
            key: `onebot.ws_client.${index}.token`,
            type: 'string',
            title: '鉴权令牌',
            description: '正向WebSocket连接的鉴权令牌',
            content: client.token,
          },
        ]),
      },
      {
        key: 'onebot.http_server',
        type: 'array',
        title: 'HTTP服务器配置',
        description: 'OneBot HTTP服务器配置列表',
        content: adapterConfig.onebot.http_server.map((server, index) => [
          {
            key: `onebot.http_server.${index}.enable`,
            type: 'boolean',
            title: '启用状态',
            description: '是否启用该HTTP服务',
            content: server.enable,
          },
          {
            key: `onebot.http_server.${index}.self_id`,
            type: 'string',
            title: 'QQ号',
            description: '正向HTTP服务的QQ号',
            content: server.self_id,
          },
          {
            key: `onebot.http_server.${index}.url`,
            type: 'string',
            title: '服务地址',
            description: 'HTTP服务的地址',
            content: server.url,
          },
          {
            key: `onebot.http_server.${index}.token`,
            type: 'string',
            title: '鉴权令牌',
            description: 'HTTP服务的鉴权令牌',
            content: server.token,
          },
        ]),
      },
    ],
  }
}

/**
 * 获取群聊、频道事件配置
 * @returns 群聊、频道事件配置文件
 */
export const getGroups = (): getConfigReturn => {
  const cfg = groups()
  return {
    name: 'groups',
    title: '群聊、频道事件配置',
    description: '群聊、频道事件配置',
    type: 'json',
    fields: Object.entries(cfg).flatMap(([groupKey, value]) => [
      {
        key: `${groupKey}.cd`,
        type: 'number',
        title: '全部消息冷却时间',
        description: '单位秒，0则无限制',
        content: value.cd,
      },
      {
        key: `${groupKey}.userCD`,
        type: 'number',
        title: '群聊中每个用户的冷却时间',
        description: '单位秒，0则无限制。注意，开启后所有消息都会进CD，无论是否触发插件',
        content: value.userCD,
      },
      {
        key: `${groupKey}.mode`,
        type: 'number',
        title: '机器人响应模式',
        description: '0-所有 1-仅@机器人 2-仅回应管理员 3-仅回应别名 4-别名或@机器人 5-管理员无限制，成员别名或@机器人 6-仅回应主人',
        content: value.mode,
      },
      {
        key: `${groupKey}.alias`,
        type: 'string[]',
        title: '机器人别名',
        description: '别名+指令触发机器人',
        content: value.alias,
      },
      {
        key: `${groupKey}.enable`,
        type: 'string[]',
        title: '白名单插件、功能',
        description: '白名单中的插件、功能会响应: `karin-plugin-test:app.js` `karin-plugin-test:测试转发`',
        content: value.enable,
      },
      {
        key: `${groupKey}.disable`,
        type: 'string[]',
        title: '黑名单插件、功能',
        description: '黑名单中的插件、功能不会响应: `karin-plugin-test:app.js` `karin-plugin-test:测试转发`',
        content: value.disable,
      },
      {
        key: `${groupKey}.memberEnable`,
        type: 'string[]',
        title: '成员启用列表',
        description: '群、频道成员单独白名单',
        content: value.memberEnable,
      },
      {
        key: `${groupKey}.memberDisable`,
        type: 'string[]',
        title: '成员禁用列表',
        description: '群、频道成员单独白名单',
        content: value.memberDisable,
      },
    ]),
  }
}

/**
 * 获取好友、频道私信事件配置
 * @returns 好友、频道私信事件配置文件
 */
export const getPrivates = (): getConfigReturn => {
  const cfg = privates()
  return {
    name: 'privates',
    title: '好友、频道私信事件配置',
    description: '好友、频道私信事件配置',
    type: 'json',
    fields: Object.entries(cfg).flatMap(([groupKey, value]) => [
      {
        key: `${groupKey}.cd`,
        type: 'number',
        title: '冷却时间',
        description: '单位秒，0则无限制',
        content: value.cd,
      },
      {
        key: `${groupKey}.mode`,
        type: 'number',
        title: '机器人响应模式',
        description: '0-所有 2-仅回应管理员 3-仅回应别名 5-管理员无限制，非管理员别名 6-仅回应主人',
        content: value.mode,
      },
      {
        key: `${groupKey}.alias`,
        type: 'string[]',
        title: '机器人别名',
        description: '别名+指令触发机器人',
        content: value.alias,
      },
      {
        key: `${groupKey}.enable`,
        type: 'string[]',
        title: '白名单插件、功能',
        description: '白名单中的插件、功能会响应: `karin-plugin-test:app.js` `karin-plugin-test:测试转发`',
        content: value.enable,
      },
      {
        key: `${groupKey}.disable`,
        type: 'string[]',
        title: '黑名单插件、功能',
        description: '黑名单中的插件、功能不会响应: `karin-plugin-test:app.js` `karin-plugin-test:测试转发`',
        content: value.disable,
      },
    ]),
  }
}

/**
 * 获取渲染器配置
 * @returns 渲染器配置文件
 */
export const getRender = (): getConfigReturn => {
  const cfg = render()
  return {
    name: 'render',
    title: '渲染器配置',
    description: '渲染器配置',
    type: 'json',
    fields: [
      {
        key: 'ws_server.enable',
        type: 'boolean',
        title: '启用反向WS服务器',
        description: '是否启用反向WebSocket服务器',
        content: cfg.ws_server.enable,
      },
      {
        key: 'ws_client',
        type: 'array',
        title: '正向WS客户端配置',
        description: '正向WebSocket客户端配置列表',
        content: cfg.ws_client.map((client, index) => [
          {
            key: `ws_client.${index}.enable`,
            type: 'boolean',
            title: '启用状态',
            description: '是否启用该正向WS连接',
            content: client.enable,
          },
          {
            key: `ws_client.${index}.url`,
            type: 'string',
            title: 'WS地址',
            description: '正向WebSocket连接地址',
            content: client.url,
          },
          {
            key: `ws_client.${index}.token`,
            type: 'string',
            title: '鉴权令牌',
            description: '正向WebSocket连接的鉴权令牌',
            content: client.token,
          },
        ]),
      },
      {
        key: 'http_server',
        type: 'array',
        title: 'HTTP服务器配置',
        description: 'HTTP服务器配置列表',
        content: cfg.http_server.map((server, index) => [
          {
            key: `http_server.${index}.enable`,
            type: 'boolean',
            title: '启用状态',
            description: '是否启用该HTTP服务',
            content: server.enable,
          },
          {
            key: `http_server.${index}.url`,
            type: 'string',
            title: '服务地址',
            description: 'HTTP服务的地址',
            content: server.url,
          },
          {
            key: `http_server.${index}.token`,
            type: 'string',
            title: '鉴权令牌',
            description: 'HTTP服务的鉴权令牌',
            content: server.token,
          },
        ]),
      },
    ],
  }
}

/**
 * redis 配置
 * @returns redis 配置文件
 */
export const getRedis = (): getConfigReturn => {
  const cfg = redis()
  return {
    name: 'redis',
    title: 'Redis配置',
    description: 'Redis配置',
    type: 'json',
    fields: [
      {
        key: 'url',
        type: 'string',
        title: 'Redis地址',
        description: 'Redis地址',
        content: cfg.url!,
      },
      {
        key: 'username',
        type: 'string',
        title: 'Redis用户名',
        description: 'Redis用户名',
        content: cfg.username!,
      },
      {
        key: 'password',
        type: 'string',
        title: 'Redis密码',
        description: 'Redis密码',
        content: cfg.password!,
      },
      {
        key: 'database',
        type: 'number',
        title: 'Redis数据库',
        description: 'Redis数据库',
        content: cfg.database!,
      },
    ],
  }
}

/**
 * 获取pm2配置
 * @returns pm2配置文件
 */
export const getPM2 = (): getConfigReturn => {
  const cfg = pm2()
  return {
    name: 'pm2',
    title: 'PM2配置',
    description: 'PM2配置',
    type: 'json',
    fields: [
      {
        key: 'lines',
        type: 'number',
        title: '日志行数',
        description: '日志行数',
        content: cfg.lines,
      },
      {
        key: 'apps',
        type: 'array',
        title: 'PM2应用配置',
        description: 'PM2应用配置',
        content: cfg.apps.map((app, index) => [
          {
            key: `apps.${index}.name`,
            type: 'string',
            title: '应用名称',
            description: '应用名称',
            content: app.name,
          },
          {
            key: `apps.${index}.script`,
            type: 'string',
            title: '入口文件',
            description: '入口文件',
            content: app.script,
          },
          {
            key: `apps.${index}.autorestart`,
            type: 'boolean',
            title: '自动重启',
            description: '自动重启',
            content: app.autorestart,
          },
          {
            key: `apps.${index}.max_restarts`,
            type: 'number',
            title: '最大重启次数',
            description: '最大重启次数',
            content: app.max_restarts,
          },
          {
            key: `apps.${index}.max_memory_restart`,
            type: 'string',
            title: '最大内存重启',
            description: '最大内存重启',
            content: app.max_memory_restart,
          },
          {
            key: `apps.${index}.restart_delay`,
            type: 'number',
            title: '重启延迟',
            description: '重启延迟',
            content: app.restart_delay,
          },
          {
            key: `apps.${index}.merge_logs`,
            type: 'boolean',
            title: '合并日志',
            description: '合并日志',
            content: app.merge_logs,
          },
          {
            key: `apps.${index}.error_file`,
            type: 'string',
            title: '错误日志路径',
            description: '错误日志路径',
            content: app.error_file,
          },
          {
            key: `apps.${index}.out_file`,
            type: 'string',
            title: '输出日志路径',
            description: '输出日志路径',
            content: app.out_file,
          },
        ]),
      },
    ],
  }
}

/**
 * 获取env配置
 * @returns env配置文件
 */
export const getEnv = (): getConfigReturn => {
  const cfg = env()
  return {
    name: 'env',
    title: '环境变量配置',
    description: '环境变量配置',
    type: 'env',
    fields: [
      {
        key: 'HTTP_ENABLE',
        type: 'string',
        title: '启用HTTP',
        description: '是否启用HTTP',
        content: cfg.HTTP_ENABLE,
      },
      {
        key: 'HTTP_PORT',
        type: 'string',
        title: 'HTTP端口',
        description: 'HTTP端口',
        content: cfg.HTTP_PORT,
      },
      {
        key: 'HTTP_HOST',
        type: 'string',
        title: 'HTTP地址',
        description: 'HTTP地址',
        content: cfg.HTTP_HOST,
      },
      {
        key: 'HTTP_AUTH_KEY',
        type: 'string',
        title: 'HTTP鉴权秘钥',
        description: 'HTTP鉴权秘钥',
        content: cfg.HTTP_AUTH_KEY,
      },
      {
        key: 'WS_SERVER_AUTH_KEY',
        type: 'string',
        title: 'ws_server鉴权秘钥',
        description: 'ws_server鉴权秘钥',
        content: cfg.WS_SERVER_AUTH_KEY,
      },
      {
        key: 'REDIS_ENABLE',
        type: 'string',
        title: '是否启用Redis',
        description: '是否启用Redis',
        content: cfg.REDIS_ENABLE,
      },
      {
        key: 'PM2_RESTART',
        type: 'string',
        title: '重启是否调用pm2',
        description: '重启是否调用pm2',
        content: cfg.PM2_RESTART,
      },
      {
        key: 'LOG_LEVEL',
        type: 'string',
        title: '日志等级',
        description: '日志等级',
        content: cfg.LOG_LEVEL,
      },
      {
        key: 'LOG_DAYS_TO_KEEP',
        type: 'string',
        title: '日志保留天数',
        description: '日志保留天数',
        content: cfg.LOG_DAYS_TO_KEEP,
      },
      {
        key: 'LOG_MAX_LOG_SIZE',
        type: 'string',
        title: '日志文件最大大小',
        description: '日志文件最大大小',
        content: cfg.LOG_MAX_LOG_SIZE,
      },
      {
        key: 'LOG_FNC_COLOR',
        type: 'string',
        title: 'logger.fnc颜色',
        description: 'logger.fnc颜色',
        content: cfg.LOG_FNC_COLOR,
      },
      {
        key: 'RUNNER',
        type: 'string',
        title: '运行器',
        description: '运行器',
        content: cfg.RUNNER,
      },
      {
        key: 'FFMPEG_PATH',
        type: 'string',
        title: 'ffmpeg路径',
        description: 'ffmpeg路径',
        content: cfg.FFMPEG_PATH,
      },
      {
        key: 'FFPROBE_PATH',
        type: 'string',
        title: 'ffprobe路径',
        description: 'ffprobe路径',
        content: cfg.FFPROBE_PATH,
      },
      {
        key: 'FFPLAY_PATH',
        type: 'string',
        title: 'ffplay路径',
        description: 'ffplay路径',
        content: cfg.FFPLAY_PATH,
      },
    ],
  }
}

type getFileListReturn<T extends FileList | 'env' | 'all'> = T extends 'all' ? getConfigReturn[] : getConfigReturn

/**
 * 获取配置文件列表
 * @returns 配置文件列表
 */
export const getFileList = <T extends FileList | 'env' | 'all'> (type: T): getFileListReturn<T> => {
  if (type === 'config') return getConfig() as getFileListReturn<T>
  if (type === 'adapter') return getAdapter() as getFileListReturn<T>
  if (type === 'env') return getEnv() as getFileListReturn<T>
  if (type === 'pm2') return getPM2() as getFileListReturn<T>
  if (type === 'redis') return getRedis() as getFileListReturn<T>
  if (type === 'render') return getRender() as getFileListReturn<T>
  if (type === 'groups') return getGroups() as getFileListReturn<T>
  if (type === 'privates') return getPrivates() as getFileListReturn<T>

  return [
    getConfig(),
    getAdapter(),
    getEnv(),
    getPM2(),
    getRedis(),
    getRender(),
    getGroups(),
    getPrivates()
  ] as getFileListReturn<T>
}
