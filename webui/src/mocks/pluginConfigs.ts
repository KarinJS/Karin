import type { FormSchema } from '../components/schema-form'

/**
 * 插件配置 Schema 映射
 * key 为插件 ID，value 为该插件的配置 Schema
 * 没有出现在这里的插件表示不需要配置页面
 */
export const pluginConfigSchemas: Record<string, FormSchema> = {
  'karin-plugin-example': {
    version: '1.0',
    id: 'karin-plugin-example-config',
    title: '示例插件配置',
    description: '配置示例插件的基础功能和行为',
    options: {
      columns: 2,
      submit: {
        text: '保存配置',
        position: 'top',
      },
    },
    fields: [
      {
        key: '_layout',
        type: 'accordion',
        options: {
          defaultExpanded: ['general', 'reply'],
          selectionMode: 'multiple',
          variant: 'splitted',
          items: [
            {
              key: 'general',
              title: '常规设置',
              subtitle: '插件的基本运行参数',
              icon: 'settings',
              iconColor: 'primary',
              fields: [
                {
                  key: 'enable',
                  type: 'switch',
                  label: '启用插件',
                  tooltip: '关闭后插件将不再响应任何消息',
                  defaultValue: true,
                  options: { color: 'success' },
                  layout: { span: 1 },
                },
                {
                  key: 'debug',
                  type: 'switch',
                  label: '调试模式',
                  tooltip: '打开后将输出详细的日志信息',
                  defaultValue: false,
                  options: { color: 'warning' },
                  layout: { span: 1 },
                },
                {
                  key: 'prefix',
                  type: 'text',
                  label: '命令前缀',
                  description: '触发命令的前缀字符',
                  placeholder: '例如：#、/、!',
                  defaultValue: '#',
                  layout: { span: 1 },
                },
                {
                  key: 'cooldown',
                  type: 'number',
                  label: '冷却时间 (秒)',
                  description: '同一用户连续触发命令的间隔',
                  defaultValue: 5,
                  options: { min: 0, max: 3600 },
                  layout: { span: 1 },
                },
                {
                  key: 'priority',
                  type: 'slider',
                  label: '优先级',
                  description: '数值越小优先级越高',
                  defaultValue: 100,
                  options: {
                    min: 1,
                    max: 999,
                    step: 1,
                    showValue: true,
                    color: 'primary',
                  },
                  layout: { span: 2 },
                },
              ],
            },
            {
              key: 'reply',
              title: '回复设置',
              subtitle: '配置消息回复的行为',
              icon: 'message-circle',
              iconColor: 'secondary',
              fields: [
                {
                  key: 'replyMode',
                  type: 'radio-group',
                  label: '回复方式',
                  defaultValue: 'text',
                  options: {
                    orientation: 'horizontal',
                    color: 'primary',
                    items: [
                      { label: '文本', value: 'text' },
                      { label: '图片', value: 'image' },
                      { label: '转发', value: 'forward' },
                    ],
                  },
                  layout: { span: 2 },
                },
                {
                  key: 'atSender',
                  type: 'switch',
                  label: '回复时 @发送者',
                  defaultValue: true,
                  options: { color: 'primary' },
                  layout: { span: 1 },
                },
                {
                  key: 'quoteReply',
                  type: 'switch',
                  label: '引用原消息',
                  defaultValue: false,
                  options: { color: 'primary' },
                  layout: { span: 1 },
                },
                {
                  key: 'welcomeMsg',
                  type: 'textarea',
                  label: '欢迎消息模板',
                  description: '支持变量：{user}、{group}',
                  placeholder: '你好 {user}，欢迎使用示例插件！',
                  options: { rows: 3, maxLength: 500 },
                  layout: { span: 2 },
                },
              ],
            },
            {
              key: 'blacklist',
              title: '黑名单',
              subtitle: '配置不响应的用户和群组',
              icon: 'shield-off',
              iconColor: 'danger',
              fields: [
                {
                  key: 'blackUsers',
                  type: 'list',
                  label: '用户黑名单',
                  description: '添加不响应的用户 ID',
                  options: {
                    itemType: 'text',
                    addButtonText: '添加用户',
                    sortable: false,
                    itemPlaceholder: '输入用户 ID',
                    maxItems: 50,
                  },
                  layout: { span: 2 },
                },
                {
                  key: 'blackGroups',
                  type: 'list',
                  label: '群组黑名单',
                  description: '添加不响应的群组 ID',
                  options: {
                    itemType: 'text',
                    addButtonText: '添加群组',
                    sortable: false,
                    itemPlaceholder: '输入群组 ID',
                    maxItems: 50,
                  },
                  layout: { span: 2 },
                },
              ],
            },
          ],
        },
      },
    ],
  },

  'custom-script-weather': {
    version: '1.0',
    id: 'weather-script-config',
    title: '天气脚本配置',
    description: '配置天气查询服务的参数',
    options: {
      columns: 2,
      submit: {
        text: '保存配置',
        position: 'top',
      },
    },
    fields: [
      {
        key: '_info',
        type: 'alert',
        options: {
          variant: 'info',
          title: '提示',
          content: '请先前往天气服务商获取 API Key，然后在下方填写。',
        },
      },
      {
        key: '_tabs',
        type: 'tabs',
        options: {
          variant: 'underlined',
          items: [
            {
              key: 'api',
              title: 'API 设置',
              icon: 'cloud',
              fields: [
                {
                  key: 'apiProvider',
                  type: 'select',
                  label: '天气服务商',
                  defaultValue: 'openweather',
                  options: {
                    items: [
                      { label: 'OpenWeatherMap', value: 'openweather' },
                      { label: '和风天气', value: 'qweather' },
                      { label: '心知天气', value: 'seniverse' },
                    ],
                  },
                },
                {
                  key: 'apiKey',
                  type: 'password',
                  label: 'API Key',
                  description: '天气服务商提供的 API 密钥',
                  placeholder: '输入您的 API Key',
                  rules: [{ type: 'required', message: 'API Key 不能为空' }],
                },
                {
                  key: 'cacheDuration',
                  type: 'number',
                  label: '缓存时间 (分钟)',
                  description: '天气数据的缓存时长，减少 API 调用次数',
                  defaultValue: 30,
                  options: { min: 5, max: 1440 },
                },
                {
                  key: 'units',
                  type: 'radio-group',
                  label: '温度单位',
                  defaultValue: 'metric',
                  options: {
                    orientation: 'horizontal',
                    color: 'primary',
                    items: [
                      { label: '摄氏度 (°C)', value: 'metric' },
                      { label: '华氏度 (°F)', value: 'imperial' },
                    ],
                  },
                },
              ],
            },
            {
              key: 'display',
              title: '显示设置',
              icon: 'eye',
              fields: [
                {
                  key: 'showWeatherIcon',
                  type: 'switch',
                  label: '显示天气图标',
                  defaultValue: true,
                  options: { color: 'success' },
                },
                {
                  key: 'showHumidity',
                  type: 'switch',
                  label: '显示湿度',
                  defaultValue: true,
                  options: { color: 'success' },
                },
                {
                  key: 'showWind',
                  type: 'switch',
                  label: '显示风力信息',
                  defaultValue: true,
                  options: { color: 'success' },
                },
                {
                  key: 'showForecast',
                  type: 'switch',
                  label: '显示天气预报',
                  description: '展示未来几天的天气预报',
                  defaultValue: false,
                  options: { color: 'primary' },
                },
                {
                  key: 'forecastDays',
                  type: 'slider',
                  label: '预报天数',
                  description: '显示未来多少天的天气',
                  defaultValue: 3,
                  options: {
                    min: 1,
                    max: 7,
                    step: 1,
                    showSteps: true,
                    showValue: true,
                    color: 'secondary',
                  },
                },
              ],
            },
            {
              key: 'defaults',
              title: '默认城市',
              icon: 'map-pin',
              fields: [
                {
                  key: 'defaultCity',
                  type: 'text',
                  label: '默认城市',
                  description: '用户未指定城市时使用的默认值',
                  placeholder: '例如：北京',
                  defaultValue: '北京',
                },
                {
                  key: 'favoriteCities',
                  type: 'tags-input',
                  label: '常用城市',
                  description: '添加常用城市，方便快速查询',
                  defaultValue: ['北京', '上海', '广州'],
                  options: {
                    maxTags: 20,
                    color: 'primary',
                    placeholder: '输入城市名...',
                  },
                },
              ],
            },
          ],
        },
      },
    ],
  },

  'direct-link-game': {
    version: '1.0',
    id: 'game-script-config',
    title: '小游戏配置',
    description: '配置小游戏集合的参数和规则',
    options: {
      columns: 1,
      submit: {
        text: '保存配置',
        position: 'top',
      },
    },
    fields: [
      {
        key: '_tabs',
        type: 'tabs',
        options: {
          variant: 'bordered',
          items: [
            {
              key: 'general',
              title: '通用设置',
              icon: 'settings',
              fields: [
                {
                  key: 'enableAll',
                  type: 'switch',
                  label: '启用所有游戏',
                  tooltip: '一键开启/关闭所有小游戏',
                  defaultValue: true,
                  options: { color: 'success' },
                },
                {
                  key: 'maxConcurrent',
                  type: 'number',
                  label: '最大同时进行游戏数',
                  description: '同一群组中同时进行的游戏数量上限',
                  defaultValue: 3,
                  options: { min: 1, max: 10 },
                },
                {
                  key: 'gameTimeout',
                  type: 'number',
                  label: '游戏超时 (秒)',
                  description: '超过此时间未操作自动结束游戏',
                  defaultValue: 300,
                  options: { min: 60, max: 3600 },
                },
                {
                  key: 'rankingSize',
                  type: 'slider',
                  label: '排行榜显示数量',
                  description: '排行榜显示前多少名玩家',
                  defaultValue: 10,
                  options: {
                    min: 5,
                    max: 50,
                    step: 5,
                    showSteps: true,
                    showValue: true,
                    color: 'warning',
                    marks: [
                      { value: 5, label: '5' },
                      { value: 25, label: '25' },
                      { value: 50, label: '50' },
                    ],
                  },
                },
              ],
            },
            {
              key: 'guessNumber',
              title: '猜数字',
              icon: 'hash',
              fields: [
                {
                  key: 'guessNumber.enable',
                  type: 'switch',
                  label: '启用猜数字游戏',
                  defaultValue: true,
                  options: { color: 'success' },
                },
                {
                  key: 'guessNumber.maxAttempts',
                  type: 'number',
                  label: '最大猜测次数',
                  defaultValue: 10,
                  options: { min: 3, max: 50 },
                },
                {
                  key: 'guessNumber.range',
                  type: 'select',
                  label: '数字范围',
                  defaultValue: '1-100',
                  options: {
                    items: [
                      { label: '1 - 100', value: '1-100' },
                      { label: '1 - 500', value: '1-500' },
                      { label: '1 - 1000', value: '1-1000' },
                    ],
                  },
                },
                {
                  key: 'guessNumber.showHint',
                  type: 'switch',
                  label: '显示范围提示',
                  description: '每次猜测后提示当前有效范围',
                  defaultValue: true,
                  options: { color: 'primary' },
                },
              ],
            },
            {
              key: 'idiom',
              title: '成语接龙',
              icon: 'book-open',
              fields: [
                {
                  key: 'idiom.enable',
                  type: 'switch',
                  label: '启用成语接龙',
                  defaultValue: true,
                  options: { color: 'success' },
                },
                {
                  key: 'idiom.timeout',
                  type: 'number',
                  label: '单轮超时 (秒)',
                  description: '每位玩家答题的限时',
                  defaultValue: 30,
                  options: { min: 10, max: 120 },
                },
                {
                  key: 'idiom.difficulty',
                  type: 'radio-group',
                  label: '难度',
                  defaultValue: 'normal',
                  options: {
                    orientation: 'horizontal',
                    color: 'warning',
                    items: [
                      { label: '简单', value: 'easy' },
                      { label: '普通', value: 'normal' },
                      { label: '困难', value: 'hard' },
                    ],
                  },
                },
                {
                  key: 'idiom.allowHomophone',
                  type: 'switch',
                  label: '允许谐音',
                  description: '接龙时是否允许使用谐音字',
                  defaultValue: false,
                  options: { color: 'secondary' },
                },
              ],
            },
            {
              key: 'scoring',
              title: '积分系统',
              icon: 'trophy',
              fields: [
                {
                  key: 'scoring.enable',
                  type: 'switch',
                  label: '启用积分系统',
                  defaultValue: true,
                  options: { color: 'success' },
                },
                {
                  key: 'scoring.winPoints',
                  type: 'number',
                  label: '胜利积分',
                  description: '赢得游戏获得的积分',
                  defaultValue: 10,
                  options: { min: 1, max: 100 },
                },
                {
                  key: 'scoring.participatePoints',
                  type: 'number',
                  label: '参与积分',
                  description: '参与游戏获得的积分',
                  defaultValue: 2,
                  options: { min: 0, max: 50 },
                },
                {
                  key: 'scoring.dailyLimit',
                  type: 'number',
                  label: '每日积分上限',
                  description: '每天最多可获得的积分',
                  defaultValue: 100,
                  options: { min: 10, max: 1000 },
                },
              ],
            },
          ],
        },
      },
    ],
  },
}

/**
 * 插件配置初始数据映射
 * key 为插件 ID，value 为该插件的当前配置数据
 */
export const pluginConfigData: Record<string, Record<string, unknown>> = {
  'karin-plugin-example': {
    enable: true,
    debug: false,
    prefix: '#',
    cooldown: 5,
    priority: 100,
    replyMode: 'text',
    atSender: true,
    quoteReply: false,
    welcomeMsg: '你好 {user}，欢迎使用示例插件！',
    blackUsers: ['100001', '100002'],
    blackGroups: ['200001'],
  },

  'custom-script-weather': {
    apiProvider: 'qweather',
    apiKey: '',
    cacheDuration: 30,
    units: 'metric',
    showWeatherIcon: true,
    showHumidity: true,
    showWind: true,
    showForecast: false,
    forecastDays: 3,
    defaultCity: '北京',
    favoriteCities: ['北京', '上海', '广州', '深圳'],
  },

  'direct-link-game': {
    enableAll: true,
    maxConcurrent: 3,
    gameTimeout: 300,
    rankingSize: 10,
    guessNumber: {
      enable: true,
      maxAttempts: 10,
      range: '1-100',
      showHint: true,
    },
    idiom: {
      enable: true,
      timeout: 30,
      difficulty: 'normal',
      allowHomophone: false,
    },
    scoring: {
      enable: true,
      winPoints: 10,
      participatePoints: 2,
      dailyLimit: 100,
    },
  },
}
