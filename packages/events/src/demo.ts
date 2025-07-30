import { EventEmitter } from './index'

/**
 * 定义应用中的事件类型映射
 */
interface AppEvents {
  // 用户相关事件
  'user.login': [userId: number, username: string]
  'user.logout': [userId: number]
  'user.update': [userId: number, data: Record<string, any>]

  // 系统相关事件
  'system.start': [timestamp: number]
  'system.shutdown': [code: number, reason: string]

  // 消息相关事件
  message: [content: string, sender: string, timestamp: number]
  'message.private': [content: string, sender: string, receiver: string, timestamp: number]
  'message.group': [content: string, sender: string, groupId: string, timestamp: number]
}

/**
 * 演示 EventEmitter 基本功能
 */
function demoBasicFeatures () {
  console.log('===== 基本功能演示 =====')

  // 创建类型安全的事件发射器
  const events = new EventEmitter<AppEvents>()

  // 添加事件监听器
  events.on('user.login', (userId, username) => {
    console.log(`用户登录: ${username}(ID: ${userId})`)
  })

  // 添加一次性事件监听器
  events.once('user.logout', (userId) => {
    console.log(`用户登出: ID ${userId} (这个监听器只会触发一次)`)
  })

  // 触发事件
  events.emit('user.login', 1001, 'alice')
  events.emit('user.login', 1002, 'bob')
  events.emit('user.logout', 1001)
  events.emit('user.logout', 1002) // 不会有输出，因为监听器已被移除

  // 获取事件监听器数量
  console.log(`user.login 事件监听器数量: ${events.listenerCount('user.login')}`)
  console.log(`user.logout 事件监听器数量: ${events.listenerCount('user.logout')}`)
}

/**
 * 演示正则表达式事件名
 */
function demoRegexEvents () {
  console.log('\n===== 正则表达式事件名演示 =====')

  const events = new EventEmitter<AppEvents>()

  // 使用正则表达式字符串监听所有用户相关事件
  events.on('/^user\\./', (...args) => {
    const [userId] = args
    console.log(`用户事件触发: 用户ID ${userId}`)
  })

  events.on('message', async (content, sender, timestamp) => {
    console.log('message', content, sender, timestamp)
  })

  // 添加自定义事件监听器
  events.on('1', (...args) => {
    console.log('自定义事件 "1" 被触发，参数:', args)
  })

  // 触发自定义事件
  events.emit('1', 'hello', 'world')

  // 触发各种事件
  events.emit('user.login', 1001, 'charlie')
  events.emit('user.logout', 1001)
  events.emit('user.update', 1001, { name: 'Charlie Brown' })

  events.emit('message', 'Hello world', 'david', Date.now())
  events.emit('message.private', 'Hi there', 'david', 'emma', Date.now())
  events.emit('message.group', 'Good morning', 'david', 'general', Date.now())

  // 非匹配事件
  events.emit('system.start', Date.now()) // 不会触发正则监听器
}

/**
 * 演示命名空间功能
 */
function demoNamespaces () {
  console.log('\n===== 命名空间功能演示 =====')

  const events = new EventEmitter<AppEvents>()

  // 添加不同命名空间的监听器
  events.on('user.login', (userId, username) => {
    console.log(`用户登录: ${username}(ID: ${userId})`)
  })

  events.on('user.logout', (userId) => {
    console.log(`用户登出: ID ${userId}`)
  })

  events.on('message', (content, sender) => {
    console.log(`收到消息: ${content} (发送者: ${sender})`)
  })

  // 触发事件
  events.emit('user.login', 1001, 'frank')
  events.emit('message', 'Hello', 'frank', Date.now())

  // 移除特定命名空间的所有监听器
  console.log('\n移除 user 命名空间下的所有监听器')
  events.removeNamespaceListeners('user')

  // 尝试再次触发事件
  events.emit('user.login', 1002, 'grace') // 不会有输出，因为监听器已被移除
  events.emit('message', 'Hi again', 'grace', Date.now()) // 仍然有输出，因为不在user命名空间下
}

/**
 * 演示自定义事件
 */
function demoCustomEvents () {
  console.log('\n===== 自定义事件演示 =====')

  const events = new EventEmitter<AppEvents>()

  // 创建自定义事件
  console.log('创建自定义事件:')
  const loginEvent = events.createEvent<AppEvents>()

  // 添加监听器
  loginEvent.on('user.login', (userId, username) => {
    console.log(`自定义事件监听器: 用户 ${username}(ID: ${userId}) 登录`)
  })

  events.on('user.login', (userId, username) => {
    console.log(`全局事件监听器: 用户 ${username}(ID: ${userId}) 登录`)
  })

  // 通过自定义事件实例触发
  loginEvent.emit('user.login', 1001, 'helen')

  // 通过全局事件发射器触发
  events.emit('user.login', 1002, 'ivan')

  // 创建另一个自定义事件
  console.log('\n创建另一个自定义事件:')
  const privateMessageEvent = events.createEvent<AppEvents>()

  // 添加监听器
  privateMessageEvent.on('message.private', (content, sender, receiver) => {
    console.log(`私信: ${sender} 对 ${receiver} 说: ${content}`)
  })

  // 通过自定义事件实例触发
  privateMessageEvent.emit('message.private', 'Hello there', 'jack', 'kate', Date.now())

  // 使用em方法同时触发父级和自定义事件
  console.log('\n使用em方法同时触发父级和自定义事件:')
  events.on('message.private', (content, sender, receiver) => {
    console.log(`全局监听到私信: ${sender} 对 ${receiver} 说: ${content}`)
  })
  privateMessageEvent.em('message.private', 'This works on both', 'jack', 'kate', Date.now())

  // 清理自定义事件
  console.log('\n清理自定义事件:')
  privateMessageEvent.clear()
  console.log(`清理后监听器数量: ${privateMessageEvent.listenerCount('message.private')}`)
}

/**
 * 演示最大监听器数量限制
 */
function demoMaxListeners () {
  console.log('\n===== 最大监听器数量限制演示 =====')

  const events = new EventEmitter<AppEvents>()

  // 设置最大监听器数量为 3
  events.setMaxListeners(3)
  console.log(`当前最大监听器数量: ${events.getMaxListeners()}`)

  // 添加监听器，超过限制会发出警告
  console.log('添加 4 个监听器 (会触发警告):')
  for (let i = 1; i <= 4; i++) {
    events.on('system.start', () => {
      console.log(`系统启动监听器 ${i}`)
    })
  }

  // 获取监听器数量
  console.log(`system.start 事件监听器数量: ${events.listenerCount('system.start')}`)

  // 触发事件
  events.emit('system.start', Date.now())
}

/**
 * 运行所有演示
 */
function runAllDemos () {
  demoBasicFeatures()
  demoRegexEvents()
  demoNamespaces()
  demoCustomEvents()
  demoMaxListeners()
}

// 运行演示
runAllDemos()
