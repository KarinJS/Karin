import { EventEmitter } from '../src'

/**
 * 定义一个聊天应用的事件类型映射
 */
interface ChatEvents {
  // 消息相关事件
  'message.send': [messageId: string, content: string, sender: string]
  'message.receive': [messageId: string, content: string, sender: string]
  'message.read': [messageId: string, reader: string]
  'message.delete': [messageId: string, deleter: string]

  // 用户状态事件
  'user.online': [userId: string]
  'user.offline': [userId: string]
  'user.typing': [userId: string, channelId: string]

  // 频道事件
  'channel.create': [channelId: string, name: string, creator: string]
  'channel.join': [channelId: string, userId: string]
  'channel.leave': [channelId: string, userId: string]
}

/**
 * 创建一个简单的聊天应用模拟
 */
class ChatApp {
  private events = new EventEmitter<ChatEvents>()
  private messageEvents = this.events.createEvent<ChatEvents>()
  private userEvents = this.events.createEvent<ChatEvents>()
  private channelEvents = this.events.createEvent<ChatEvents>()

  constructor () {
    this.setupEventHandlers()
  }

  /**
   * 设置事件处理程序
   */
  private setupEventHandlers () {
    // 消息事件处理
    this.messageEvents.on('message.send', (messageId, content, sender) => {
      console.log(`[消息发送] ID: ${messageId}, 发送者: ${sender}, 内容: ${content}`)
      // 模拟消息接收
      setTimeout(() => {
        this.messageEvents.emit('message.receive', messageId, content, sender)
      }, 500)
    })

    this.messageEvents.on('message.receive', (messageId, content, sender) => {
      console.log(`[消息接收] ID: ${messageId}, 发送者: ${sender}, 内容: ${content}`)
    })

    // 使用正则表达式监听所有消息相关事件
    this.events.on('/^message\\./', (...args) => {
      const [messageId] = args
      console.log(`[消息事件] 消息ID: ${messageId} 发生了事件`)
    })

    // 用户状态事件处理
    this.userEvents.on('user.online', (userId) => {
      console.log(`[用户上线] ID: ${userId}`)
    })

    this.userEvents.on('user.offline', (userId) => {
      console.log(`[用户下线] ID: ${userId}`)
    })

    this.userEvents.on('user.typing', (userId, channelId) => {
      console.log(`[用户输入中] 用户: ${userId}, 频道: ${channelId}`)
    })

    // 频道事件处理
    this.channelEvents.on('channel.create', (channelId, name, creator) => {
      console.log(`[频道创建] ID: ${channelId}, 名称: ${name}, 创建者: ${creator}`)
    })

    this.channelEvents.on('channel.join', (channelId, userId) => {
      console.log(`[加入频道] 频道: ${channelId}, 用户: ${userId}`)
    })

    // 自定义事件处理
    this.events.on('app.error', (code, message) => {
      console.error(`[错误] 代码: ${code}, 消息: ${message}`)
    })
  }

  /**
   * 模拟用户发送消息
   */
  public sendMessage (messageId: string, content: string, sender: string) {
    this.messageEvents.em('message.send', messageId, content, sender)
  }

  /**
   * 模拟用户阅读消息
   */
  public readMessage (messageId: string, reader: string) {
    this.messageEvents.emit('message.read', messageId, reader)
  }

  /**
   * 模拟用户状态变化
   */
  public setUserStatus (userId: string, isOnline: boolean) {
    const eventName = isOnline ? 'user.online' : 'user.offline'
    this.userEvents.em(eventName, userId)
  }

  /**
   * 模拟用户正在输入
   */
  public userTyping (userId: string, channelId: string) {
    this.userEvents.emit('user.typing', userId, channelId)
  }

  /**
   * 模拟创建频道
   */
  public createChannel (channelId: string, name: string, creator: string) {
    this.channelEvents.em('channel.create', channelId, name, creator)
  }

  /**
   * 模拟用户加入频道
   */
  public joinChannel (channelId: string, userId: string) {
    this.channelEvents.emit('channel.join', channelId, userId)
  }

  /**
   * 模拟错误情况
   */
  public triggerError (code: number, message: string) {
    this.events.emit('app.error', code, message)
  }

  /**
   * 获取事件统计信息
   */
  public getEventStats () {
    return {
      totalEvents: this.events.eventNames().length,
      messageEventListeners: this.messageEvents.listenerCount('message.send') +
        this.messageEvents.listenerCount('message.receive') +
        this.messageEvents.listenerCount('message.read') +
        this.messageEvents.listenerCount('message.delete'),
      userEventListeners: this.userEvents.listenerCount('user.online') +
        this.userEvents.listenerCount('user.offline') +
        this.userEvents.listenerCount('user.typing'),
      channelEventListeners: this.channelEvents.listenerCount('channel.create') +
        this.channelEvents.listenerCount('channel.join') +
        this.channelEvents.listenerCount('channel.leave'),
    }
  }

  /**
   * 清理所有事件
   */
  public cleanup () {
    this.events.clear()
    this.messageEvents.clear()
    this.userEvents.clear()
    this.channelEvents.clear()
  }
}

// 使用聊天应用
const chatApp = new ChatApp()

// 模拟用户活动
console.log('===== 聊天应用事件演示 =====')

// 用户上线
chatApp.setUserStatus('user1', true)
chatApp.setUserStatus('user2', true)

// 创建频道
chatApp.createChannel('channel1', '一般讨论', 'user1')

// 用户加入频道
chatApp.joinChannel('channel1', 'user2')

// 用户输入
chatApp.userTyping('user1', 'channel1')

// 发送消息
chatApp.sendMessage('msg1', '你好，大家好！', 'user1')

// 阅读消息
setTimeout(() => {
  chatApp.readMessage('msg1', 'user2')

  // 用户下线
  chatApp.setUserStatus('user1', false)

  // 显示事件统计
  console.log('\n===== 事件统计 =====')
  console.log(chatApp.getEventStats())

  // 清理
  chatApp.cleanup()
  console.log('\n事件已清理')
}, 1000)
