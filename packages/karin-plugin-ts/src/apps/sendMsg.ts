import { config } from '@/utils'
import { karin, segment, common } from 'node-karin'

/** 一言api */
export const yiyanApi = karin.command(/^#一言$/, async (e) => {
  const { yiyanApi } = config()
  await e.reply(segment.image(yiyanApi))
}, {
  name: '一言api',
})

/**
 * 发送主动消息插件demo
 * 触发指令: #测试主动消息
 */
export const sendMsg = karin.command(/^#测试主动消息$/, async (e) => {
  /** Bot的id 哪个Bot发就填哪个的 */
  const selfId = e.selfId

  /** 发送目标 */
  const contact = e.contact

  /** 发送内容 */
  const messages = [
    '✨ 哇！这是一条超可爱的主动消息，10秒后就会神秘消失哦~ ✨',
    '🌸 叮咚！我主动找你聊天啦，可惜10秒后我就要溜走啦~ 🌸',
    '🎀 你好呀！这是一条会自己跑掉的消息，倒计时10秒开始！🎀',
    '🍭 突然出现的甜甜消息！别急着回复，10秒后我就消失啦~ 🍭',
  ]
  const randomMsg = messages[Math.floor(Math.random() * messages.length)]
  const text = `\n${randomMsg}`

  /** 发送消息 */
  const { messageId } = await karin.sendMsg(selfId, contact, text, { recallMsg: 10 })

  /** 打印返回的消息ID */
  console.log(`✅ 消息已送达，消息ID：${messageId}`)
  return true
}, {
  /** 插件优先级 */
  priority: 9999,

  /** 插件触发是否打印触发日志 */
  log: true,

  /** 插件名称 */
  name: '可爱主动消息demo',

  /** 谁可以触发这个插件 'all' | 'master' | 'admin' | 'group.owner' | 'group.admin' */
  permission: 'all',
})

/**
 * 转发插件demo
 * 触发指令: #测试转发
 */
export const forwardMessage = karin.command(/^#测试转发$/, async (e) => {
  /** 定义具体的转发消息 */
  const message = [
    segment.text('🌟 这是转发的第一条消息 🌟'),
    segment.text('✨ 这是转发的第二条消息 ✨'),
    segment.text('💖 这是转发的最后一条消息 💖'),
  ]

  /** 构建转发消息体 */
  const content = common.makeForward(message, e.selfId, e.bot.account.name)

  /** 发送转发消息 */
  await e.bot.sendForwardMsg(e.contact, content)

  /** 返回true 插件将不再继续执行下一个插件 */
  return true
}, {
  /** 插件优先级 */
  priority: 9999,

  /** 插件触发是否打印触发日志 */
  log: true,

  /** 插件名称 */
  name: '可爱转发demo',

  /** 谁可以触发这个插件 'all' | 'master' | 'admin' | 'group.owner' | 'group.admin' */
  permission: 'all',
})

/**
 * 随机表情包插件demo
 * 触发指令: #随机表情
 */
export const randomEmoji = karin.command(/^#随机表情$/, async (e) => {
  /** 表情包URL数组 */
  const emojiUrls = [
    'https://i.imgur.com/XaUdU2C.gif',
    'https://i.imgur.com/wF2RkHB.gif',
    'https://i.imgur.com/7voHalT.jpg',
    'https://i.imgur.com/QMlZUdZ.gif',
    'https://i.imgur.com/o2JQjAn.gif',
  ]

  /** 随机选择一个表情包 */
  const randomUrl = emojiUrls[Math.floor(Math.random() * emojiUrls.length)]

  /** 构建消息 */
  const message = [
    segment.text('🎉 随机表情包来啦！'),
    segment.image(randomUrl),
  ]

  /** 发送消息 */
  await e.reply(message)

  return true
}, {
  priority: 9999,
  log: true,
  name: '随机表情包demo',
  permission: 'all',
})

/**
 * 每日一言插件demo
 * 触发指令: #每日一言
 */
export const dailyQuote = karin.command(/^#每日一言$/, async (e) => {
  /** 每日一言数组 */
  const quotes = [
    '今天也是充满希望的一天！加油！✨',
    '人生就像一盒巧克力，你永远不知道下一块是什么味道。🍫',
    '微笑是世界上最美丽的语言。😊',
    '成功不是终点，失败也不是终结，重要的是继续前进的勇气。🚀',
    '做自己的太阳，不必仰望别人！💫',
    '生活就像骑自行车，想保持平衡就得前进。🚲',
    '最重要的是爱自己，因为这样你的灵魂才会发光。💖',
  ]

  /** 随机选择一条一言 */
  const randomQuote = quotes[Math.floor(Math.random() * quotes.length)]

  /** 构建消息 */
  const message = [
    segment.text(`💭 每日一言：${randomQuote}`),
  ]

  /** 发送消息 */
  await e.reply(message)

  return true
}, {
  priority: 9999,
  log: true,
  name: '每日一言demo',
  permission: 'all',
})

/**
 * 天气预报插件demo
 * 触发指令: #今日天气
 */
export const weatherForecast = karin.command(/^#今日天气$/, async (e) => {
  /** 模拟天气数据 */
  const weathers = [
    '☀️ 晴天，温度25°C，适合出门玩耍~',
    '🌧️ 小雨，温度18°C，记得带伞哦！',
    '⛅ 多云，温度22°C，阴晴不定的一天~',
    '🌫️ 雾天，温度15°C，能见度较低，出行注意安全！',
    '🌤️ 局部晴朗，温度20°C，偶有小云朵遮挡阳光~',
  ]

  /** 随机选择一条天气预报 */
  const randomWeather = weathers[Math.floor(Math.random() * weathers.length)]

  /** 构建消息 */
  const message = [
    segment.text(`🌈 今日天气预报：${randomWeather}`),
  ]

  /** 发送消息 */
  await e.reply(message)

  return true
}, {
  priority: 9999,
  log: true,
  name: '天气预报demo',
  permission: 'all',
})
