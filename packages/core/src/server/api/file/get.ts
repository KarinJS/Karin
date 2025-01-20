import { router } from '../router'
import { createSuccessResponse } from '@/server/utils/response'
import { config, adapter, groups, privates, render, pm2, redis, env } from '@/utils/config'

import type { RequestHandler } from 'express'
import type { FormField } from '@/types/Components'
import type { Groups, Privates } from '@/types/config'

/**
 * 将字符串数组转换为数组配置
 */
const arrayTotext = (items: string[]) =>
  ({
    type: 'array',
    elementType: 'text',
    defaultValue: items[0] || '',
  }) as const

type ConfigValue =
  | ReturnType<typeof config>
  | ReturnType<typeof adapter>
  | ReturnType<typeof render>
  | ReturnType<typeof pm2>
  | ReturnType<typeof redis>
  | ReturnType<typeof env>
  | { privates: Privates }
  | { groups: Groups }

type GetConfig = () => {
  struct: FormField[]
  value: ConfigValue
}

/**
 * 获取基本配置
 * @returns 基础配置结构
 */
const getBasicConfig: GetConfig = () => {
  const cfg = config()

  const list: FormField[] = [
    {
      type: 'section',
      label: '权限管理',
      key: 'permission',
      children: [
        {
          ...arrayTotext(cfg.master),
          label: '主人列表',
          key: 'master',
        },
        {
          ...arrayTotext(cfg.admin),
          label: '管理员列表',
          key: 'admin',
        },
      ],
    },
    {
      type: 'section',
      label: '用户管理',
      key: 'user',
      children: [
        {
          ...arrayTotext(cfg.user?.enable_list || []),
          label: '用户白名单',
          key: 'user.enable_list',
        },
        {
          ...arrayTotext(cfg.user?.disable_list || []),
          label: '用户黑名单',
          key: 'user.disable_list',
        },
      ],
    },
    {
      type: 'section',
      label: '好友管理',
      key: 'friend',
      children: [
        {
          type: 'switch',
          label: '是否启用好友消息事件',
          key: 'friend.enable',
          defaultValue: cfg.friend?.enable ?? false,
        },
        {
          ...arrayTotext(cfg.friend?.enable_list || []),
          label: '好友白名单',
          key: 'friend.enable_list',
        },
        {
          ...arrayTotext(cfg.friend?.disable_list || []),
          label: '好友黑名单',
          key: 'friend.disable_list',
        },
        {
          ...arrayTotext(cfg.friend?.log_enable_list || []),
          label: '好友日志白名单',
          key: 'friend.log_enable_list',
        },
        {
          ...arrayTotext(cfg.friend?.log_disable_list || []),
          label: '好友日志黑名单',
          key: 'friend.log_disable_list',
        },
      ],
    },
    {
      type: 'section',
      label: '群管理',
      key: 'group',
      children: [
        {
          type: 'switch',
          label: '是否启用群消息事件',
          key: 'group.enable',
          defaultValue: cfg.group?.enable ?? false,
        },
        {
          ...arrayTotext(cfg.group?.enable_list || []),
          label: '群白名单',
          key: 'group.enable_list',
        },
        {
          ...arrayTotext(cfg.group?.disable_list || []),
          label: '群黑名单',
          key: 'group.disable_list',
        },
        {
          ...arrayTotext(cfg.group?.log_enable_list || []),
          label: '群日志白名单',
          key: 'group.log_enable_list',
        },
        {
          ...arrayTotext(cfg.group?.log_disable_list || []),
          label: '群日志黑名单',
          key: 'group.log_disable_list',
        },
      ],
    },
    {
      type: 'section',
      label: '频道私信管理',
      key: 'directs',
      children: [
        {
          type: 'switch',
          label: '是否启用私信消息事件',
          key: 'directs.enable',
          defaultValue: cfg.directs?.enable ?? false,
        },
        {
          ...arrayTotext(cfg.directs?.enable_list || []),
          label: '私信白名单',
          key: 'directs.enable_list',
        },
        {
          ...arrayTotext(cfg.directs?.disable_list || []),
          label: '私信黑名单',
          key: 'directs.disable_list',
        },
        {
          ...arrayTotext(cfg.directs?.log_enable_list || []),
          label: '私信日志白名单',
          key: 'directs.log_enable_list',
        },
        {
          ...arrayTotext(cfg.directs?.log_disable_list || []),
          label: '私信日志黑名单',
          key: 'directs.log_disable_list',
        },
      ],
    },
    {
      type: 'section',
      label: '频道管理',
      key: 'guilds',
      children: [
        {
          type: 'switch',
          label: '是否启用频道消息事件',
          key: 'guilds.enable',
          defaultValue: cfg.guilds?.enable ?? false,
        },
        {
          ...arrayTotext(cfg.guilds?.enable_list || []),
          label: '频道白名单',
          key: 'guilds.enable_list',
        },
        {
          ...arrayTotext(cfg.guilds?.disable_list || []),
          label: '频道黑名单',
          key: 'guilds.disable_list',
        },
        {
          ...arrayTotext(cfg.guilds?.log_enable_list || []),
          label: '频道日志白名单',
          key: 'guilds.log_enable_list',
        },
        {
          ...arrayTotext(cfg.guilds?.log_disable_list || []),
          label: '频道日志黑名单',
          key: 'guilds.log_disable_list',
        },
      ],
    },
    {
      type: 'section',
      label: '子频道管理',
      key: 'channels',
      children: [
        {
          type: 'switch',
          label: '是否启用子频道消息事件',
          key: 'channels.enable',
          defaultValue: cfg.channels?.enable ?? false,
        },
        {
          ...arrayTotext(cfg.channels?.enable_list || []),
          label: '子频道白名单',
          key: 'channels.enable_list',
        },
        {
          ...arrayTotext(cfg.channels?.disable_list || []),
          label: '子频道黑名单',
          key: 'channels.disable_list',
        },
        {
          ...arrayTotext(cfg.channels?.log_enable_list || []),
          label: '子频道日志白名单',
          key: 'channels.log_enable_list',
        },
        {
          ...arrayTotext(cfg.channels?.log_disable_list || []),
          label: '子频道日志黑名单',
          key: 'channels.log_disable_list',
        },
      ],
    },
  ]

  return {
    struct: list,
    value: cfg,
  }
}

/**
 * 获取适配器配置
 * @returns 适配器配置结构
 */
const getAdapterConfig: GetConfig = () => {
  const cfg = adapter()

  const list: FormField[] = [
    {
      type: 'section',
      label: 'Console适配器',
      key: 'console',
      children: [
        {
          type: 'switch',
          label: '本地访问',
          description: '是否为只允许本地访问',
          key: 'console.isLocal',
        },
        {
          type: 'text',
          label: '访问令牌',
          description: '如果非本地访问，则需要设置token',
          key: 'console.token',
          defaultValue: cfg.console?.token,
        },
        {
          type: 'text',
          label: '资源地址',
          description: '打印的资源地址',
          key: 'console.host',
          defaultValue: cfg.console?.host,
        },
      ],
    },
    {
      type: 'section',
      label: 'OneBot适配器',
      key: 'onebot',
      children: [
        {
          type: 'object',
          label: 'WebSocket服务器',
          key: 'onebot.ws_server',
          fields: [
            {
              type: 'switch',
              label: '启用',
              description: '是否启用WebSocket服务器',
              key: 'enable',
            },
            {
              type: 'number',
              label: '超时时间',
              description: 'OneBot发送请求超时时间',
              key: 'timeout',
              defaultValue: cfg.onebot?.ws_server?.timeout ?? 5000,
            },
          ],
        },
        {
          type: 'objectArray',
          label: 'WebSocket客户端',
          key: 'onebot.ws_client',
          fields: [
            {
              type: 'switch',
              label: '启用',
              key: 'enable',
              defaultValue: false,
            },
            {
              type: 'text',
              label: 'WebSocket地址',
              key: 'url',
              required: false,
            },
            {
              type: 'text',
              label: '鉴权令牌',
              key: 'token',
              required: false,
            },
          ],
        },
        {
          type: 'objectArray',
          label: 'HTTP服务器',
          key: 'onebot.http_server',
          fields: [
            {
              type: 'switch',
              label: '启用',
              key: 'enable',
              defaultValue: false,
            },
            {
              type: 'text',
              label: 'QQ号',
              key: 'self_id',
              required: false,
            },
            {
              type: 'text',
              label: '服务地址',
              key: 'url',
              required: false,
            },
            {
              type: 'text',
              label: '鉴权令牌',
              key: 'token',
              required: false,
            },
          ],
        },
      ],
    },
  ]

  return {
    struct: list,
    value: cfg,
  }
}

/**
 * 获取群聊和频道配置
 */
const getGroupsConfig: GetConfig = () => {
  const cfg = groups()

  const list: FormField[] = [
    {
      type: 'section',
      label: '群聊和频道',
      key: 'groups',
      children: [
        {
          type: 'objectArray',
          label: '群聊和频道',
          description: '群聊和频道配置',
          key: 'groups',
          fields: [
            {
              type: 'text',
              label: '配置键',
              key: 'key',
              required: false,
            },
            {
              type: 'number',
              label: '全局消息冷却',
              key: 'cd',
              defaultValue: 0,
            },
            {
              type: 'number',
              label: '用户消息冷却',
              key: 'userCD',
              defaultValue: 0,
            },
            {
              type: 'radio',
              label: '响应模式',
              key: 'mode',
              options: [
                { label: '响应所有消息', value: 0 },
                { label: '仅@机器人', value: 1 },
                { label: '仅回应管理员', value: 2 },
                { label: '仅回应别名', value: 3 },
                { label: '别名或@机器人', value: 4 },
                { label: '管理员无限制，成员别名或@', value: 5 },
                { label: '仅回应主人', value: 6 },
              ],
            },
            {
              type: 'array',
              elementType: 'text',
              label: '机器人别名',
              key: 'alias',
              defaultValue: '',
            },
            {
              type: 'array',
              elementType: 'text',
              label: '插件白名单',
              key: 'enable',
              defaultValue: '',
            },
            {
              type: 'array',
              elementType: 'text',
              label: '插件黑名单',
              key: 'disable',
              defaultValue: '',
            },
            {
              type: 'array',
              elementType: 'text',
              label: '成员单独白名单',
              key: 'memberEnable',
              defaultValue: '',
            },
            {
              type: 'array',
              elementType: 'text',
              label: '成员单独黑名单',
              key: 'memberDisable',
              defaultValue: '',
            },
          ],
        },
      ],
    },
  ]

  /** 转数组 因为获取到的是对象缓存 处理过的 原始数据为数组 */
  const configArray = Object.entries(cfg).map(([key, value]) => ({
    ...value,
  }))

  return {
    struct: list,
    value: { groups: configArray },
  }
}

/**
 * 获取好友和频道私信配置
 */
const getPrivatesConfig: GetConfig = () => {
  const cfg = privates()

  const list: FormField[] = [
    {
      type: 'objectArray',
      label: '好友和频道私信',
      key: 'privates',
      fields: [
        {
          type: 'section',
          label: '占位符',
          key: 'privates',
          children: [
            {
              type: 'text',
              label: '配置键',
              key: 'key',
              required: false,
            },
            {
              type: 'number',
              label: '全局消息冷却',
              key: 'cd',
              defaultValue: 0,
            },
            {
              type: 'radio',
              label: '响应模式',
              key: 'mode',
              options: [
                { label: '响应所有消息', value: 0 },
                { label: '仅回应管理员', value: 2 },
                { label: '仅回应别名', value: 3 },
                { label: '管理员无限制，非管理员别名', value: 5 },
                { label: '仅回应主人', value: 6 },
              ],
            },
            {
              type: 'array',
              elementType: 'text',
              label: '机器人别名',
              key: 'alias',
              defaultValue: '',
            },
            {
              type: 'array',
              elementType: 'text',
              label: '插件白名单',
              key: 'enable',
              defaultValue: '',
            },
            {
              type: 'array',
              elementType: 'text',
              label: '插件黑名单',
              key: 'disable',
              defaultValue: '',
            },
          ],
        }
      ],
    },
  ]

  /** 转数组 因为获取到的是对象缓存 处理过的 原始数据为数组 */
  const configArray = Object.entries(cfg).map(([_, value]) => ({
    ...value,
  }))

  return {
    struct: list,
    value: { privates: configArray },
  }
}

/**
 * 获取渲染配置
 */
const getRendersConfig: GetConfig = () => {
  const cfg = render()

  const list: FormField[] = [
    {
      type: 'title',
      text: '渲染配置',
      key: 'render-title',
    },
    {
      type: 'section',
      label: 'WebSocket服务器',
      key: 'ws_server',
      children: [
        {
          type: 'switch',
          label: '启用',
          key: 'ws_server.enable',
        },
      ],
    },
  ]

  Object.entries(cfg.ws_client).forEach(([_, value], index) => {
    list.push({
      type: 'objectArray',
      label: `正向ws-${index + 1}`,
      key: 'ws_client',
      fields: [
        {
          type: 'switch',
          label: '启用',
          key: `ws_client.${index}.enable`,
        },
        {
          type: 'text',
          label: 'WebSocket地址',
          key: `ws_client.${index}.url`,
          required: false,
        },
        {
          type: 'text',
          label: '鉴权令牌',
          key: `ws_client.${index}.token`,
          required: false,
        },
      ],
    })
  })

  Object.entries(cfg.http_server).forEach(([_, value], index) => {
    list.push({
      type: 'objectArray',
      label: `反向http-${index + 1}`,
      key: 'http_server',
      fields: [
        {
          type: 'switch',
          label: '启用',
          key: `http_server.${index}.enable`,
        },
        {
          type: 'text',
          label: '服务地址',
          key: `http_server.${index}.url`,
          required: false,
        },
        {
          type: 'text',
          label: '鉴权令牌',
          key: `http_server.${index}.token`,
          required: false,
        },
      ],
    })
  })

  return {
    struct: list,
    value: cfg,
  }
}

/**
 * 获取pm2配置
 */
const getPM2Config: GetConfig = () => {
  const cfg = pm2()

  const list: FormField[] = [
    {
      type: 'title',
      text: 'PM2配置',
      key: 'pm2-title',
    },
    {
      type: 'number',
      label: '日志最多显示多少行',
      key: 'lines',
      defaultValue: cfg.lines,
    },
  ]

  Object.entries(cfg.apps).forEach(([key, value], index) => {
    list.push({
      type: 'objectArray',
      label: `应用名称-${index + 1}`,
      key: `apps.${index}`,
      fields: [
        {
          type: 'text',
          label: '应用名称',
          key: 'name',
          required: false,
        },
        {
          type: 'text',
          label: '入口文件',
          key: 'script',
          required: false,
        },
        {
          type: 'switch',
          label: '自动重启',
          key: 'autorestart',
        },
        {
          type: 'number',
          label: '最大重启次数',
          key: 'max_restarts',
          defaultValue: value.max_restarts,
        },
        {
          type: 'text',
          label: '最大内存重启',
          key: 'max_memory_restart',
          defaultValue: value.max_memory_restart,
        },
        {
          type: 'number',
          label: '重启延迟',
          key: 'restart_delay',
          defaultValue: value.restart_delay,
        },
        {
          type: 'switch',
          label: '合并日志',
          key: 'merge_logs',
        },
        {
          type: 'text',
          label: '错误日志路径',
          key: 'error_file',
          defaultValue: value.error_file,
        },
        {
          type: 'text',
          label: '输出日志路径',
          key: 'out_file',
          defaultValue: value.out_file,
        },
      ],
    })
  })

  return {
    struct: list,
    value: cfg,
  }
}

/**
 * 获取redis配置
 */
const getRedisConfig: GetConfig = () => {
  const cfg = redis()

  const list: FormField[] = [
    {
      type: 'title',
      text: 'Redis配置',
      key: 'redis-title',
    },
    {
      type: 'text',
      label: '连接地址',
      key: 'url',
      required: false,
      defaultValue: cfg.url,
    },
    {
      type: 'text',
      label: '用户名',
      key: 'username',
      defaultValue: cfg.username,
    },
    {
      type: 'text',
      label: '密码',
      key: 'password',
      defaultValue: cfg.password,
    },
    {
      type: 'number',
      label: '数据库索引',
      key: 'database',
      defaultValue: cfg.database,
    },
  ]

  return {
    struct: list,
    value: cfg,
  }
}

/**
 * 获取`.env`配置
 */
const getEnvConfig: GetConfig = () => {
  const cfg = env()

  const list: FormField[] = [
    {
      type: 'title',
      text: '环境变量配置',
      key: 'env-title',
    },
    {
      type: 'text',
      label: '是否启用HTTP',
      key: 'HTTP_ENABLE',
      defaultValue: cfg.HTTP_ENABLE,
    },
    {
      type: 'text',
      label: 'HTTP监听端口',
      key: 'HTTP_PORT',
      defaultValue: cfg.HTTP_PORT,
    },
    {
      type: 'text',
      label: 'HTTP监听地址',
      key: 'HTTP_HOST',
      defaultValue: cfg.HTTP_HOST,
    },
    {
      type: 'text',
      label: 'HTTP鉴权秘钥',
      key: 'HTTP_AUTH_KEY',
      defaultValue: cfg.HTTP_AUTH_KEY,
    },
    {
      type: 'text',
      label: 'WS服务器鉴权秘钥',
      key: 'WS_SERVER_AUTH_KEY',
      defaultValue: cfg.WS_SERVER_AUTH_KEY,
    },
    {
      type: 'text',
      label: '是否启用Redis',
      description: '关闭后将使用内部虚拟Redis',
      key: 'REDIS_ENABLE',
      defaultValue: cfg.REDIS_ENABLE,
    },
    {
      type: 'text',
      label: '重启是否调用PM2',
      description: '如果不调用则会直接关机，此配置适合有进程守护的程序',
      key: 'PM2_RESTART',
      defaultValue: cfg.PM2_RESTART,
    },
    {
      type: 'radio',
      label: '运行器',
      key: 'RUNNER',
      options: [
        { label: 'Node', value: 'node' },
        { label: 'PM2', value: 'pm2' },
        { label: 'TSX', value: 'tsx' },
      ],
    },
    {
      type: 'text',
      label: '日志等级',
      key: 'LOG_LEVEL',
      defaultValue: cfg.LOG_LEVEL,
    },
    {
      type: 'text',
      label: '日志保留天数',
      key: 'LOG_DAYS_TO_KEEP',
      defaultValue: cfg.LOG_DAYS_TO_KEEP,
    },
    {
      type: 'text',
      label: '日志文件最大大小',
      description: '如果此项大于0则启用日志分割',
      key: 'LOG_MAX_LOG_SIZE',
      defaultValue: cfg.LOG_MAX_LOG_SIZE,
    },
    {
      type: 'text',
      label: 'logger.fnc颜色',
      key: 'LOG_FNC_COLOR',
      defaultValue: cfg.LOG_FNC_COLOR,
    },
    {
      type: 'text',
      label: 'TSX监察者模式',
      key: 'TSX_WATCH',
      defaultValue: cfg.TSX_WATCH,
    },
    {
      type: 'text',
      label: 'ffmpeg路径',
      key: 'FFMPEG_PATH',
      defaultValue: cfg.FFMPEG_PATH,
    },
    {
      type: 'text',
      label: 'ffprobe路径',
      key: 'FFPROBE_PATH',
      defaultValue: cfg.FFPROBE_PATH,
    },
    {
      type: 'text',
      label: 'ffplay路径',
      key: 'FFPLAY_PATH',
      defaultValue: cfg.FFPLAY_PATH,
    },
  ]

  return {
    struct: list,
    value: cfg,
  }
}

/**
 * 获取配置文件描述
 */
const getFileRouter: RequestHandler = async (req, res) => {
  const { type } = req.body
  let getFunction: GetConfig

  switch (type) {
    case 'config':
      getFunction = getBasicConfig
      break
    case 'adapter':
      getFunction = getAdapterConfig
      break
    case 'groups':
      getFunction = getGroupsConfig
      break
    case 'privates':
      getFunction = getPrivatesConfig
      break
    case 'render':
      getFunction = getRendersConfig
      break
    case 'pm2':
      getFunction = getPM2Config
      break
    case 'redis':
      getFunction = getRedisConfig
      break
    case 'env':
      getFunction = getEnvConfig
      break
    default:
      res.status(400).json({ error: '不支持的配置类型' })
      return
  }

  const { struct: configStructure, value: cfg } = getFunction()

  createSuccessResponse(res, {
    struct: configStructure,
    value: cfg,
  })
}

router.post('/config/get', getFileRouter)
