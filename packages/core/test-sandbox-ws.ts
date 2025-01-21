import WebSocket from 'ws'

/**
 * 测试沙盒API的WebSocket连接
 */
const testSandboxWS = () => {
  // 创建WebSocket连接
  const ws = new WebSocket('ws://localhost:7777/sandbox')

  // 连接打开时的处理
  ws.on('open', () => {
    console.log('已连接到沙盒WebSocket服务器')
  })

  // 接收消息的处理
  ws.on('message', (data) => {
    try {
      const message = JSON.parse(data.toString())
      console.log('收到消息:', message)

      // 如果收到初始化事件
      if (message.action === 'init') {
        console.log('收到初始化事件:', message.param)

        // 这里可以开始测试其他API
        testAPIs()
      }
    } catch (error) {
      console.error('解析消息失败:', error)
    }
  })

  // 错误处理
  ws.on('error', (error) => {
    console.error('WebSocket错误:', error)
  })

  // 连接关闭的处理
  ws.on('close', () => {
    console.log('WebSocket连接已关闭')
  })

  /**
   * 测试各个API
   */
  const testAPIs = async () => {
    try {
      // 创建一个好友
      const createFriendResponse = await fetch('http://localhost:7777/api/v1/sandbox/friend/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          authorization: 'abc123'
        },
        body: JSON.stringify({
          id: 'test-friend-001',
          name: '测试好友',
          avatar: 'https://example.com/avatar.jpg'
        })
      })
      console.log('创建好友结果:', await createFriendResponse.json())

      // 获取好友列表
      const friendListResponse = await fetch('http://localhost:7777/api/v1/sandbox/friend/list', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          authorization: 'abc123'
        }
      })
      console.log('好友列表:', await friendListResponse.json())

      // 测试消息上报
      const createMsgResponse = await fetch('http://localhost:7777/api/v1/sandbox/msg/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          authorization: 'abc123'
        },
        body: JSON.stringify({
          type: 'friend',
          targetId: 'test-friend-001'
        })
      })
      const msgData = await createMsgResponse.json()
      console.log('创建消息索引:', msgData)

      // 上报一条消息
      const webhookResponse = await fetch('http://localhost:7777/api/v1/sandbox/webhook', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          authorization: 'abc123'
        },
        body: JSON.stringify({
          type: 'friend',
          seq: msgData.data.seq,
          messageId: msgData.data.messageId,
          time: msgData.data.time,
          sender: {
            id: 'test-friend-001',
            name: '测试好友',
            role: 'member'
          },
          elements: [
            {
              type: 'text',
              text: '这是一条测试消息'
            }
          ]
        })
      })
      console.log('消息上报结果:', await webhookResponse.json())
    } catch (error) {
      console.error('API测试失败:', error)
    }
  }
}

// 运行测试
testSandboxWS()
