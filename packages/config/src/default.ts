import type { ConfigAdapter, ConfigConfig, ConfigGroups, ConfigPM2, ConfigPrivates, ConfigRedis, ConfigRender } from './types'

/**
 * @description 默认配置
 */
export const defaultConfig: {
  adapter: ConfigAdapter
  config: ConfigConfig
  groups: ConfigGroups
  pm2: ConfigPM2
  redis: ConfigRedis
  render: ConfigRender
  privates: ConfigPrivates
} = Object.freeze({
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
          reconnectTime: 5000,
          reconnectAttempts: 100,
        },
      ],
      http_server: [
        {
          enable: false,
          self_id: 'default',
          url: 'http://127.0.0.1:6099',
          token: '',
          api_token: '',
          post_token: '',
          heartbeat: 5000,
          timeout: 5000,
          reconnectAttempts: 100,
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
  groups: [
    {
      key: 'default',
      inherit: true,
      cd: 0,
      userCD: 0,
      mode: 0,
      alias: [],
      enable: [],
      disable: [],
      member_enable: [],
      member_disable: [],
    },
    {
      key: 'global',
      inherit: true,
      cd: 0,
      userCD: 0,
      mode: 0,
      alias: [],
      enable: [],
      disable: [],
      member_enable: [],
      member_disable: [],
    },
    {
      key: 'Bot:selfId',
      inherit: true,
      cd: 0,
      userCD: 0,
      mode: 0,
      alias: [],
      enable: [],
      disable: [],
      member_enable: [],
      member_disable: [],
    },
    {
      key: 'Bot:selfId:groupId',
      inherit: true,
      cd: 0,
      userCD: 0,
      mode: 0,
      alias: [],
      enable: [],
      disable: [],
      member_enable: [],
      member_disable: [],
    },
    {
      key: 'Bot:selfId:guildId',
      inherit: true,
      cd: 0,
      userCD: 0,
      mode: 0,
      alias: [],
      enable: [],
      disable: [],
      member_enable: [],
      member_disable: [],
    },
    {
      key: 'Bot:selfId:guildId:channelId',
      inherit: true,
      cd: 0,
      userCD: 0,
      mode: 0,
      alias: [],
      enable: [],
      disable: [],
      member_enable: [],
      member_disable: [],
    },
  ],
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
  privates: [
    {
      key: 'default',
      inherit: true,
      cd: 0,
      mode: 0,
      alias: [],
      enable: [],
      disable: [],
    },
    {
      key: 'global',
      inherit: true,
      cd: 0,
      mode: 0,
      alias: [],
      enable: [],
      disable: [],
    },
    {
      key: 'Bot:selfId',
      inherit: true,
      cd: 0,
      mode: 0,
      alias: [],
      enable: [],
      disable: [],
    },
    {
      key: 'Bot:selfId:userId',
      inherit: true,
      cd: 0,
      mode: 0,
      alias: [],
      enable: [],
      disable: [],
    },
  ],
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
        isSnapka: false,
        reconnectTime: 5000,
        heartbeatTime: 30000,
      },
    ],
    http_server: [
      {
        enable: false,
        url: 'http://127.0.0.1:7005',
        token: '123456',
        isSnapka: false,
      },
    ],
  },
})
