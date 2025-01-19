import { router } from '../router'
import { createSuccessResponse } from '@/server/utils/response'
import { config, adapter, groups, privates, render, pm2, redis, env } from '@/utils/config'

import type { Component } from '@/types/Components'
import type { RequestHandler } from 'express'

/**
 * 数组转输入框
 */
export const arrayToInput = (items: string[]): Component[] => {
  return items.map((item) => ({
    type: 'input',
    required: true,
    editable: true,
    removable: true,
    default: item
  }))
}

/**
 * 获取基本配置
 * @returns 基础配置结构
 */
const getBasicConfig = (): Component[] => {
  const cfg = config()

  const list: Component[] = [
    {
      type: 'section',
      label: '权限管理',
      children: [
        {
          type: 'array',
          label: '主人列表',
          field: 'master',
          items: arrayToInput(cfg.master)
        },
        {
          type: 'array',
          label: '管理员列表',
          field: 'admin',
          items: arrayToInput(cfg.admin)
        }
      ]
    },
    {
      type: 'section',
      label: '用户管理',
      children: [
        {
          type: 'array',
          label: '用户白名单',
          field: 'user.enable_list',
          items: arrayToInput(cfg.user?.enable_list || [])
        },
        {
          type: 'array',
          label: '用户黑名单',
          field: 'user.disable_list',
          items: arrayToInput(cfg.user?.disable_list || [])
        },
      ]
    },
    {
      type: 'section',
      label: '好友管理',
      children: [
        {
          type: 'array',
          label: '好友白名单',
          field: 'friend.enable_list',
          items: arrayToInput(cfg.friend?.enable_list || [])
        },
        {
          type: 'array',
          label: '好友黑名单',
          field: 'friend.disable_list',
          items: arrayToInput(cfg.friend?.disable_list || [])
        },
        {
          type: 'array',
          label: '好友日志白名单',
          field: 'friend.log_enable_list',
          items: arrayToInput(cfg.friend?.log_enable_list || [])
        },
        {
          type: 'array',
          label: '好友日志黑名单',
          field: 'friend.log_disable_list',
          items: arrayToInput(cfg.friend?.log_disable_list || [])
        }
      ]
    },
    {
      type: 'section',
      label: '群管理',
      children: [
        {
          type: 'array',
          label: '群白名单',
          field: 'group.enable_list',
          items: arrayToInput(cfg.group?.enable_list || [])
        },
        {
          type: 'array',
          label: '群黑名单',
          field: 'group.disable_list',
          items: arrayToInput(cfg.group?.disable_list || [])
        },
        {
          type: 'array',
          label: '群日志白名单',
          field: 'group.log_enable_list',
          items: arrayToInput(cfg.group?.log_enable_list || [])
        },
        {
          type: 'array',
          label: '群日志黑名单',
          field: 'group.log_disable_list',
          items: arrayToInput(cfg.group?.log_disable_list || [])
        },
      ]
    },
    {
      type: 'section',
      label: '频道私信管理',
      children: [
        {
          type: 'array',
          label: '私信白名单',
          field: 'directs.enable_list',
          items: arrayToInput(cfg.directs?.enable_list || [])
        },
        {
          type: 'array',
          label: '私信黑名单',
          field: 'directs.disable_list',
          items: arrayToInput(cfg.directs?.disable_list || [])
        },
        {
          type: 'array',
          label: '私信日志白名单',
          field: 'directs.log_enable_list',
          items: arrayToInput(cfg.directs?.log_enable_list || [])
        },
        {
          type: 'array',
          label: '私信日志黑名单',
          field: 'directs.log_disable_list',
          items: arrayToInput(cfg.directs?.log_disable_list || [])
        }
      ]
    },
    {
      type: 'section',
      label: '频道管理',
      children: [
        {
          type: 'array',
          label: '频道白名单',
          field: 'guilds.enable_list',
          items: arrayToInput(cfg.guilds?.enable_list || [])
        },
        {
          type: 'array',
          label: '频道黑名单',
          field: 'guilds.disable_list',
          items: arrayToInput(cfg.guilds?.disable_list || [])
        },
        {
          type: 'array',
          label: '频道日志白名单',
          field: 'guilds.log_enable_list',
          items: arrayToInput(cfg.guilds?.log_enable_list || [])
        },
        {
          type: 'array',
          label: '频道日志黑名单',
          field: 'guilds.log_disable_list',
          items: arrayToInput(cfg.guilds?.log_disable_list || [])
        }
      ]
    },
    {
      type: 'section',
      label: '子频道管理',
      children: [
        {
          type: 'array',
          label: '子频道白名单',
          field: 'channels.enable_list',
          items: arrayToInput(cfg.channels?.enable_list || [])
        },
        {
          type: 'array',
          label: '子频道黑名单',
          field: 'channels.disable_list',
          items: arrayToInput(cfg.channels?.disable_list || [])
        },
        {
          type: 'array',
          label: '子频道日志白名单',
          field: 'channels.log_enable_list',
          items: arrayToInput(cfg.channels?.log_enable_list || [])
        },
        {
          type: 'array',
          label: '子频道日志黑名单',
          field: 'channels.log_disable_list',
          items: arrayToInput(cfg.channels?.log_disable_list || [])
        }
      ]
    }
  ]

  return list
}

/**
 * 获取适配器配置
 * @returns 适配器配置结构
 */
const getAdapterConfig = (): Component[] => {
  const cfg = adapter()

  return [
    {
      type: 'title',
      text: '适配器配置'
    },
    {
      type: 'section',
      label: 'Console适配器',
      children: [
        {
          type: 'switch',
          label: '本地访问',
          description: '是否为只允许本地访问',
          field: 'console.isLocal',
          checked: cfg.console?.isLocal ?? false
        },
        {
          type: 'input',
          label: '访问令牌',
          description: '如果非本地访问，则需要设置token',
          field: 'console.token',
          required: false,
          defaultValue: cfg.console?.token
        },
        {
          type: 'input',
          label: '资源地址',
          description: '打印的资源地址',
          field: 'console.host',
          required: true,
          defaultValue: cfg.console?.host
        }
      ]
    },
    {
      type: 'section',
      label: 'OneBot适配器',
      children: [
        {
          type: 'section',
          label: 'WebSocket服务器',
          children: [
            {
              type: 'switch',
              label: '启用',
              description: '是否启用WebSocket服务器',
              field: 'onebot.ws_server.enable',
              checked: cfg.onebot?.ws_server?.enable ?? false
            },
            {
              type: 'number',
              label: '超时时间',
              description: 'OneBot发送请求超时时间',
              field: 'onebot.ws_server.timeout',
              defaultValue: cfg.onebot?.ws_server?.timeout ?? 5000
            }
          ]
        },
        {
          type: 'array',
          label: 'WebSocket客户端',
          field: 'onebot.ws_client',
          items: [
            {
              type: 'switch',
              label: '启用',
              field: 'enable',
              checked: false
            },
            {
              type: 'input',
              label: 'WebSocket地址',
              field: 'url',
              required: true
            },
            {
              type: 'input',
              label: '鉴权令牌',
              field: 'token',
              required: true
            }
          ]
        },
        {
          type: 'array',
          label: 'HTTP服务器',
          field: 'onebot.http_server',
          items: [
            {
              type: 'switch',
              label: '启用',
              field: 'enable',
              checked: false
            },
            {
              type: 'input',
              label: 'QQ号',
              field: 'self_id',
              required: true
            },
            {
              type: 'input',
              label: '服务地址',
              field: 'url',
              required: true
            },
            {
              type: 'input',
              label: '鉴权令牌',
              field: 'token',
              required: true
            }
          ]
        }
      ]
    }
  ]
}

/**
 * 获取群聊和频道配置
 */
const getGroupsConfig = (): Component[] => {
  const cfg = groups()

  const list: Component[] = []

  Object.entries(cfg).forEach(([key, value]) => {
    list.push({
      type: 'section',
      label: key,
      children: [
        {
          type: 'number',
          label: '全局消息冷却',
          field: `${key}.cd`,
          defaultValue: value.cd
        },
        {
          type: 'number',
          label: '用户消息冷却',
          field: `${key}.userCD`,
          defaultValue: value.userCD
        },
        {
          type: 'radio',
          label: '响应模式',
          field: `${key}.mode`,
          options: [
            { label: '响应所有消息', value: 0, checked: value.mode === 0 },
            { label: '仅@机器人', value: 1, checked: value.mode === 1 },
            { label: '仅回应管理员', value: 2, checked: value.mode === 2 },
            { label: '仅回应别名', value: 3, checked: value.mode === 3 },
            { label: '别名或@机器人', value: 4, checked: value.mode === 4 },
            { label: '管理员无限制，成员别名或@', value: 5, checked: value.mode === 5 },
            { label: '仅回应主人', value: 6, checked: value.mode === 6 }
          ],
        },
        {
          type: 'array',
          label: '机器人别名',
          field: `${key}.alias`,
          items: arrayToInput(value.alias || [])
        },
        {
          type: 'array',
          label: '插件白名单',
          field: `${key}.enable`,
          items: arrayToInput(value.enable || [])
        },
        {
          type: 'array',
          label: '插件黑名单',
          field: `${key}.disable`,
          items: arrayToInput(value.disable || [])
        },
        {
          type: 'array',
          label: '成员单独白名单',
          field: `${key}.memberEnable`,
          items: arrayToInput(value.memberEnable || [])
        },
        {
          type: 'array',
          label: '成员单独黑名单',
          field: `${key}.memberDisable`,
          items: arrayToInput(value.memberDisable || [])
        }
      ]
    })
  })

  return list
}

/**
 * 获取好友和频道私信配置
 */
const getPrivatesConfig = (): Component[] => {
  const cfg = privates()

  const list: Component[] = []

  Object.entries(cfg).forEach(([key, value]) => {
    list.push({
      type: 'section',
      label: key,
      children: [
        {
          type: 'number',
          label: '消息冷却',
          field: `${key}.cd`,
          defaultValue: value.cd
        },
        {
          type: 'radio',
          label: '响应模式',
          field: `${key}.mode`,
          options: [
            { label: '响应所有消息', value: 0, checked: value.mode === 0 },
            { label: '仅回应管理员', value: 2, checked: value.mode === 2 },
            { label: '仅回应别名', value: 3, checked: value.mode === 3 },
            { label: '管理员无限制，非管理员别名', value: 5, checked: value.mode === 5 },
            { label: '仅回应主人', value: 6, checked: value.mode === 6 }
          ]
        },
        {
          type: 'array',
          label: '机器人别名',
          field: `${key}.alias`,
          items: arrayToInput(value.alias || [])
        },
        {
          type: 'array',
          label: '插件白名单',
          field: `${key}.enable`,
          items: arrayToInput(value.enable || [])
        },
        {
          type: 'array',
          label: '插件黑名单',
          field: `${key}.disable`,
          items: arrayToInput(value.disable || [])
        }
      ]
    })
  })

  return list
}

/**
 * 获取渲染配置
 */
const getRendersConfig = (): Component[] => {
  const cfg = render()

  const list: Component[] = [
    {
      type: 'title',
      text: '渲染配置'
    },
    {
      type: 'section',
      label: 'WebSocket服务器',
      children: [
        {
          type: 'switch',
          label: '启用',
          field: 'ws_server.enable',
          checked: cfg.ws_server?.enable ?? false
        }
      ]
    }
  ]

  Object.entries(cfg.ws_client).forEach(([_, value], index) => {
    list.push({
      type: 'array',
      label: `正向ws-${index + 1}`,
      field: 'ws_client',
      items: [
        {
          type: 'switch',
          label: '启用',
          field: `ws_client.${index}.enable`,
          checked: value.enable
        },
        {
          type: 'input',
          label: 'WebSocket地址',
          field: `ws_client.${index}.url`,
          required: true
        },
        {
          type: 'input',
          label: '鉴权令牌',
          field: `ws_client.${index}.token`,
          required: false
        }
      ]
    })
  })

  Object.entries(cfg.http_server).forEach(([_, value], index) => {
    list.push({
      type: 'array',
      label: `反向http-${index + 1}`,
      field: 'http_server',
      items: [
        {
          type: 'switch',
          label: '启用',
          field: `http_server.${index}.enable`,
          checked: value.enable
        },
        {
          type: 'input',
          label: '服务地址',
          field: `http_server.${index}.url`,
          required: true
        },
        {
          type: 'input',
          label: '鉴权令牌',
          field: `http_server.${index}.token`,
          required: false
        }
      ]
    })
  })

  return list
}

/**
 * 获取pm2配置
 */
const getPM2Config = (): Component[] => {
  const cfg = pm2()

  const list: Component[] = [
    {
      type: 'title',
      text: 'PM2配置'
    },
    {
      type: 'number',
      label: '日志最多显示多少行',
      field: 'lines',
      defaultValue: cfg.lines
    },
  ]

  Object.entries(cfg.apps).forEach(([key, value], index) => {
    list.push({
      type: 'array',
      label: `应用名称-${index + 1}`,
      field: `apps.${index}`,
      items: [
        {
          type: 'input',
          label: '应用名称',
          field: 'name',
          required: true
        },
        {
          type: 'input',
          label: '入口文件',
          field: 'script',
          required: true
        },
        {
          type: 'switch',
          label: '自动重启',
          field: 'autorestart',
          checked: value.autorestart
        },
        {
          type: 'number',
          label: '最大重启次数',
          field: 'max_restarts',
          defaultValue: value.max_restarts
        },
        {
          type: 'input',
          label: '最大内存重启',
          field: 'max_memory_restart',
          defaultValue: value.max_memory_restart
        },
        {
          type: 'number',
          label: '重启延迟',
          field: 'restart_delay',
          defaultValue: value.restart_delay
        },
        {
          type: 'switch',
          label: '合并日志',
          field: 'merge_logs',
          checked: value.merge_logs
        },
        {
          type: 'input',
          label: '错误日志路径',
          field: 'error_file',
          defaultValue: value.error_file
        },
        {
          type: 'input',
          label: '输出日志路径',
          field: 'out_file',
          defaultValue: value.out_file
        }
      ]
    })
  })

  return list
}

/**
 * 获取redis配置
 */
const getRedisConfig = (): Component[] => {
  const cfg = redis()

  return [
    {
      type: 'title',
      text: 'Redis配置'
    },
    {
      type: 'input',
      label: '连接地址',
      field: 'url',
      required: true,
      defaultValue: cfg.url
    },
    {
      type: 'input',
      label: '用户名',
      field: 'username',
      defaultValue: cfg.username
    },
    {
      type: 'input',
      label: '密码',
      field: 'password',
      defaultValue: cfg.password
    },
    {
      type: 'number',
      label: '数据库索引',
      field: 'database',
      defaultValue: cfg.database
    }
  ]
}

/**
 * 获取`.env`配置
 */
const getEnvConfig = (): Component[] => {
  const cfg = env()

  return [
    {
      type: 'title',
      text: '环境变量配置'
    },
    {
      type: 'input',
      label: '是否启用HTTP',
      field: 'HTTP_ENABLE',
      defaultValue: cfg.HTTP_ENABLE
    },
    {
      type: 'input',
      label: 'HTTP监听端口',
      field: 'HTTP_PORT',
      defaultValue: cfg.HTTP_PORT
    },
    {
      type: 'input',
      label: 'HTTP监听地址',
      field: 'HTTP_HOST',
      defaultValue: cfg.HTTP_HOST
    },
    {
      type: 'input',
      label: 'HTTP鉴权秘钥',
      field: 'HTTP_AUTH_KEY',
      defaultValue: cfg.HTTP_AUTH_KEY
    },
    {
      type: 'input',
      label: 'WS服务器鉴权秘钥',
      field: 'WS_SERVER_AUTH_KEY',
      defaultValue: cfg.WS_SERVER_AUTH_KEY
    },
    {
      type: 'input',
      label: '是否启用Redis',
      description: '关闭后将使用内部虚拟Redis',
      field: 'REDIS_ENABLE',
      defaultValue: cfg.REDIS_ENABLE
    },
    {
      type: 'input',
      label: '重启是否调用PM2',
      description: '如果不调用则会直接关机，此配置适合有进程守护的程序',
      field: 'PM2_RESTART',
      defaultValue: cfg.PM2_RESTART
    },
    {
      type: 'radio',
      label: '运行器',
      field: 'RUNNER',
      options: [
        { label: 'Node', value: 'node', checked: cfg.RUNNER === 'node' },
        { label: 'PM2', value: 'pm2', checked: cfg.RUNNER === 'pm2' },
        { label: 'TSX', value: 'tsx', checked: cfg.RUNNER === 'tsx' }
      ]
    },
    {
      type: 'input',
      label: '日志等级',
      field: 'LOG_LEVEL',
      defaultValue: cfg.LOG_LEVEL
    },
    {
      type: 'input',
      label: '日志保留天数',
      field: 'LOG_DAYS_TO_KEEP',
      defaultValue: cfg.LOG_DAYS_TO_KEEP
    },
    {
      type: 'input',
      label: '日志文件最大大小',
      description: '如果此项大于0则启用日志分割',
      field: 'LOG_MAX_LOG_SIZE',
      defaultValue: cfg.LOG_MAX_LOG_SIZE
    },
    {
      type: 'input',
      label: 'logger.fnc颜色',
      field: 'LOG_FNC_COLOR',
      defaultValue: cfg.LOG_FNC_COLOR
    },
    {
      type: 'input',
      label: 'TSX监察者模式',
      field: 'TSX_WATCH',
      defaultValue: cfg.TSX_WATCH
    },
    {
      type: 'input',
      label: 'ffmpeg路径',
      field: 'FFMPEG_PATH',
      defaultValue: cfg.FFMPEG_PATH
    },
    {
      type: 'input',
      label: 'ffprobe路径',
      field: 'FFPROBE_PATH',
      defaultValue: cfg.FFPROBE_PATH
    },
    {
      type: 'input',
      label: 'ffplay路径',
      field: 'FFPLAY_PATH',
      defaultValue: cfg.FFPLAY_PATH
    }
  ]
}

/**
 * 获取配置文件描述
 */
const getFileRouter: RequestHandler = async (req, res) => {
  const { type } = req.body

  let configStructure: Component[]

  switch (type) {
    case 'config':
      configStructure = getBasicConfig()
      break
    case 'adapter':
      configStructure = getAdapterConfig()
      break
    case 'groups':
      configStructure = getGroupsConfig()
      break
    case 'privates':
      configStructure = getPrivatesConfig()
      break
    case 'renders':
      configStructure = getRendersConfig()
      break
    case 'pm2':
      configStructure = getPM2Config()
      break
    case 'redis':
      configStructure = getRedisConfig()
      break
    case 'env':
      configStructure = getEnvConfig()
      break
    default:
      res.status(400).json({ error: '不支持的配置类型' })
      return
  }

  createSuccessResponse(res, configStructure)
}

router.post('/get_file', getFileRouter)
