import { EventEmitter } from '../src'

/**
 * 定义应用中的事件类型映射
 */
interface AppEvents {
  // 用户相关事件
  'user.login': [userId: number, username: string]
  'user.logout': [userId: number]

  // 系统相关事件
  'system.start': [timestamp: number]
  'system.shutdown': [code: number, reason: string]
}

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

// 使用正则表达式字符串监听所有用户相关事件
events.on('/^user\\./', (...args) => {
  const [userId] = args
  console.log(`用户事件触发: 用户ID ${userId}`)
})

// 添加自定义事件监听器
events.on('custom-event', (...args) => {
  console.log('自定义事件被触发，参数:', args)
})

// 触发事件
console.log('===== 触发预定义事件 =====')
events.emit('user.login', 1001, 'alice')
events.emit('user.logout', 1001)
events.emit('user.logout', 1002) // 不会有输出，因为监听器已被移除

// 触发自定义事件
console.log('\n===== 触发自定义事件 =====')
events.emit('custom-event', 'hello', 'world')

// 创建自定义事件实例
console.log('\n===== 使用自定义事件实例 =====')
const loginEvent = events.createEvent<AppEvents>()

// 添加监听器
loginEvent.on('user.login', (userId, username) => {
  console.log(`自定义事件监听器: 用户 ${username}(ID: ${userId}) 登录`)
})

// 通过自定义事件实例触发
loginEvent.emit('user.login', 1002, 'bob')

// 使用em方法同时触发父级和自定义事件
console.log('\n===== 使用em方法触发父级和自定义事件 =====')
loginEvent.em('user.login', 1003, 'charlie')

// 命名空间管理
console.log('\n===== 命名空间管理 =====')
console.log(`移除前 user.login 事件监听器数量: ${events.listenerCount('user.login')}`)
events.removeNamespaceListeners('user')
console.log(`移除后 user.login 事件监听器数量: ${events.listenerCount('user.login')}`)

// 自定义事件实例不受影响
loginEvent.emit('user.login', 1004, 'dave')
