import { createHttpManager, EventKeys, OneBotSegmentType } from '../src'

/**
 * 演示如何创建HTTP服务器接收事件
 */
async function main () {
  try {
    // 创建HTTP管理器
    const httpManager = createHttpManager()

    // 创建一个HTTP客户端作为示例
    const client = await httpManager.createClient({
      self_id: 123456789, // 机器人QQ号
      httpHost: 'http://localhost:5700', // OneBot实现的HTTP地址
      accessToken: 'your_access_token', // 设置相同的令牌用于验证事件
      timeout: 10000,
    })

    console.log('HTTP客户端连接成功')

    // 创建HTTP服务器接收事件
    const serverId = await httpManager.createHttpServer({
      port: 5701, // 监听端口
      host: '0.0.0.0', // 监听主机
      path: '/onebot', // 路径
      accessToken: 'your_access_token', // 与客户端设置相同的令牌用于验证事件
    })

    console.log(`HTTP服务器创建成功，ID: ${serverId}`)

    // 注册消息处理函数
    client.on(EventKeys.message, event => {
      console.log('收到消息事件:', JSON.stringify(event))

      // 根据消息类型处理
      if (event.message_type === 'private') {
        // 私聊消息
        client.sendPrivateMsg(
          event.user_id,
          [{ type: OneBotSegmentType.Text, data: { text: '收到私聊消息' } }]
        )
      } else if (event.message_type === 'group') {
        // 群消息
        client.sendGroupMsg(
          event.group_id,
          [{ type: OneBotSegmentType.Text, data: { text: '收到群消息' } }]
        )
      }
    })

    // 注册通知事件处理
    client.on(EventKeys.notice, event => {
      console.log('收到通知事件:', JSON.stringify(event))
    })

    // 注册请求事件处理
    client.on(EventKeys.request, event => {
      console.log('收到请求事件:', JSON.stringify(event))

      // 自动同意好友请求
      if (event.request_type === 'friend') {
        client.setFriendAddRequest(event.flag, true)
      }
    })

    // 程序退出前关闭所有连接和服务器
    process.on('SIGINT', () => {
      console.log('正在关闭连接和服务器...')
      httpManager.closeAllClients()
      httpManager.closeHttpServer(serverId)
      process.exit(0)
    })
  } catch (error) {
    console.error('错误:', error)
  }
}

main()
