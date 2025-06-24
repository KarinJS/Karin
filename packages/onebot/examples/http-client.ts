import { createHttpManager, OneBotSegmentType, EventKeys } from '../src'

/**
 * 演示如何创建HTTP客户端连接到OneBot服务端
 */
async function main () {
  try {
    // 创建HTTP管理器
    const httpManager = createHttpManager()

    // 创建HTTP客户端连接
    const client = await httpManager.createClient({
      self_id: 123456789, // 机器人QQ号
      httpHost: 'http://localhost:5700', // OneBot实现的HTTP地址
      OneBotAccessToken: 'your_access_token', // 可选，访问令牌
      heartbeat: 5000, // 心跳间隔，默认5000ms
      timeout: 10000, // 超时时间，默认10000ms
    })

    console.log('连接成功！机器人信息:', client.self)

    // 注册消息事件处理
    client.on(EventKeys.message, event => {
      if (event.message_type === 'private') {
        console.log('收到私聊消息:', event.message)

        // 回复消息
        client.sendPrivateMsg(
          event.user_id,
          [{ type: OneBotSegmentType.Text, data: { text: `你发送了: ${JSON.stringify(event.message)}` } }]
        )
      }
    })

    // 使用API发送群消息
    await client.sendGroupMsg(
      12345678,
      [{ type: OneBotSegmentType.Text, data: { text: 'Hello, OneBot!' } }]
    )

    // 程序退出前关闭所有连接
    process.on('SIGINT', () => {
      console.log('正在关闭连接...')
      httpManager.closeAllClients()
      process.exit(0)
    })
  } catch (error) {
    console.error('连接失败:', error)
  }
}

main()
