/**
 * 类插件使用示例
 * @description 展示如何使用 Plugin 基类创建类式插件
 */
import { Plugin } from './class'

/**
 * 示例：天气查询插件
 */
export class WeatherPlugin extends Plugin {
  constructor () {
    super({
      name: '天气查询',
      desc: '查询城市天气信息',
      event: 'message', // 监听所有消息事件
      priority: 1000,
      rule: [
        {
          reg: /^#天气\s*(.+)$/,
          fnc: 'queryWeather', // 方法名
          name: '查询天气',
          permission: 'all',
          log: true,
        },
        {
          reg: /^#weather\s*(.+)$/,
          fnc: 'queryWeatherEn', // 使用方法名字符串
          name: '查询天气(英文)',
          event: 'message.group', // 只在群聊中生效
        },
      ],
    })
  }

  /**
   * 查询天气方法
   */
  async queryWeather () {
    // this.e 是当前消息事件对象
    const city = this.e.raw_message?.match(/^#天气\s*(.+)$/)?.[1]

    if (!city) {
      await this.reply('请输入城市名称')
      return
    }

    // 模拟查询天气
    const weather = {
      city,
      temperature: '25°C',
      weather: '晴天',
    }

    await this.reply(`${weather.city}的天气：${weather.weather}，温度：${weather.temperature}`)
  }

  /**
   * 英文查询天气
   */
  async queryWeatherEn () {
    const city = this.e.raw_message?.match(/^#weather\s*(.+)$/)?.[1]

    if (!city) {
      await this.reply('Please enter city name')
      return
    }

    await this.reply(`Weather in ${city}: Sunny, 25°C`)
  }
}

/**
 * 示例：管理插件
 */
export class AdminPlugin extends Plugin {
  constructor () {
    super({
      name: '管理插件',
      desc: '提供群管理功能',
      event: 'message.group',
      priority: 500,
      rule: [
        {
          reg: /^#禁言\s*(\d+)$/,
          fnc: 'mute',
          name: '禁言',
          permission: 'admin', // 需要管理员权限
          authFailMsg: '权限不足，仅管理员可操作',
        },
        {
          reg: /^#解除禁言\s*(\d+)$/,
          fnc: 'unmute',
          name: '解除禁言',
          permission: 'admin',
        },
      ],
    })
  }

  /**
   * 禁言用户
   */
  async mute () {
    const userId = this.e.raw_message?.match(/^#禁言\s*(\d+)$/)?.[1]

    if (!userId) {
      await this.reply('请输入要禁言的用户ID')
      return
    }

    // 实现禁言逻辑
    await this.reply(`已禁言用户 ${userId}`)
  }

  /**
   * 解除禁言
   */
  async unmute () {
    const userId = this.e.raw_message?.match(/^#解除禁言\s*(\d+)$/)?.[1]

    if (!userId) {
      await this.reply('请输入要解除禁言的用户ID')
      return
    }

    // 实现解除禁言逻辑
    await this.reply(`已解除禁言用户 ${userId}`)
  }
}

/**
 * 使用方式：
 *
 * 1. 在插件文件中导出类：
 * ```ts
 * export class MyPlugin extends Plugin {
 *   constructor() {
 *     super({ ... })
 *   }
 * }
 * ```
 *
 * 2. 插件系统会自动识别并加载：
 * ```ts
 * import * as module from './plugin.js'
 * const commands = loadClassPluginsFromModule(module)
 * ```
 *
 * 3. 注册到插件缓存：
 * ```ts
 * for (const command of commands) {
 *   pluginCache.register(command)
 * }
 * ```
 */
