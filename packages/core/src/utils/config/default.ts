import { existsSync } from 'node:fs'
import { writeFile } from 'node:fs/promises'
import { basePath } from '@/root'

/**
 * @description 默认配置
 */
const defaultConfig = Object.freeze({
  adapter: {
    console: {
      isLocal: true,
      token: '',
      host: '',
    },
    onebot: {
      ws_server: {
        enable: true,
        timeout: 120,
      },
      ws_client: [
        {
          enable: false,
          url: 'ws://127.0.0.1:7778',
          token: '',
        },
      ],
      http_server: [
        {
          enable: false,
          self_id: 'default',
          url: 'http://127.0.0.1:6099',
          token: '',
        },
      ],
    },
  },
  config: {
    master: [
      'console',
    ],
    admin: [],
    user: {
      enable_list: [],
      disable_list: [],
    },
    friend: {
      enable: true,
      enable_list: [],
      disable_list: [],
      log_enable_list: [],
      log_disable_list: [],
    },
    group: {
      enable: true,
      enable_list: [],
      disable_list: [],
      log_enable_list: [],
      log_disable_list: [],
    },
    directs: {
      enable: true,
      enable_list: [],
      disable_list: [],
      log_enable_list: [],
      log_disable_list: [],
    },
    guilds: {
      enable: true,
      enable_list: [],
      disable_list: [],
      log_enable_list: [],
      log_disable_list: [],
    },
    channels: {
      enable: true,
      enable_list: [],
      disable_list: [],
      log_enable_list: [],
      log_disable_list: [],
    },
  },
  groups: {
    default: {
      cd: 0,
      mode: 0,
      alias: [],
      enable: [],
      disable: [],
      member_enable: [],
      member_disable: [],
    },
    'Bot:selfId': {
      cd: 0,
      mode: 0,
      alias: [],
      enable: [],
      disable: [],
      member_enable: [],
      member_disable: [],
    },
    'Bot:selfId:groupId': {
      cd: 0,
      mode: 0,
      alias: [],
      enable: [],
      disable: [],
      member_enable: [],
      member_disable: [],
    },
    'Bot:selfId:guildId': {
      cd: 0,
      mode: 0,
      alias: [],
      enable: [],
      disable: [],
      member_enable: [],
      member_disable: [],
    },
    'Bot:selfId:guildId:channelId': {
      cd: 0,
      mode: 0,
      alias: [],
      enable: [],
      disable: [],
      member_enable: [],
      member_disable: [],
    },
  },
  pm2: {
    lines: 1000,
    apps: [
      {
        name: 'karin',
        script: 'index.js',
        autorestart: true,
        max_restarts: 60,
        max_memory_restart: '1G',
        restart_delay: 2000,
        merge_logs: true,
        error_file: './@karinjs/logs/pm2_error.log',
        out_file: './@karinjs/logs/pm2_out.log',
      },
    ],
  },
  privates: {
    default: {
      cd: 0,
      mode: 0,
      alias: [],
      enable: [],
      disable: [],
    },
    'Bot:selfId': {
      cd: 0,
      mode: 0,
      alias: [],
      enable: [],
      disable: [],
    },
    'Bot:selfId:userId': {
      cd: 0,
      mode: 0,
      alias: [],
      enable: [],
      disable: [],
    },
  },
  redis: {
    url: 'redis://127.0.0.1:6379',
    username: '',
    password: '',
    database: 0,
  },
  render: {
    ws_server: {
      enable: true,
    },
    ws_client: [
      {
        enable: false,
        url: 'ws://127.0.0.1:7005',
        token: '123456',
      },
    ],
    http_server: [
      {
        enable: false,
        url: 'http://127.0.0.1:7005',
        token: '123456',
      },
    ],
  },
})

await Promise.all(Object.keys(defaultConfig).map(async (key) => {
  const file = `${basePath}/config/${key}.json`
  if (existsSync(file)) return
  const data = JSON.stringify(defaultConfig[key as keyof typeof defaultConfig], null, 2)
  await writeFile(file, data, 'utf-8')
  return true
}))

export { defaultConfig }
