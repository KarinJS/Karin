import { createHttpManager, OneBotSegmentType } from '../src'

/**
 * 演示如何构建各种复杂消息
 */
async function main () {
  try {
    // 创建HTTP管理器
    const httpManager = createHttpManager()

    // 创建HTTP客户端连接
    const client = await httpManager.createClient({
      self_id: 123456789, // 机器人QQ号
      httpHost: 'http://localhost:5700', // OneBot实现的HTTP地址
      timeout: 10000,
    })

    console.log('连接成功！')

    // 构建纯文本消息
    const textMessage = [
      { type: OneBotSegmentType.Text, data: { text: '这是一条纯文本消息' } },
    ]
    console.log('纯文本消息:', textMessage)

    // 构建图片消息
    const imageMessage = [
      { type: OneBotSegmentType.Text, data: { text: '这是一张图片：' } },
      {
        type: OneBotSegmentType.Image,
        data: {
          file: 'https://example.com/image.jpg',
          // 可选参数
          cache: 1,
          proxy: 1,
          timeout: 5000,
        },
      },
    ]
    console.log('图片消息:', imageMessage)

    // 构建@消息
    const atMessage = [
      { type: OneBotSegmentType.At, data: { qq: '987654321' } },
      { type: OneBotSegmentType.Text, data: { text: ' 看过来！' } },
    ]
    console.log('@某人消息:', atMessage)

    // 构建表情消息
    const faceMessage = [
      { type: OneBotSegmentType.Text, data: { text: '表情：' } },
      { type: OneBotSegmentType.Face, data: { id: '123' } },
    ]
    console.log('表情消息:', faceMessage)

    // 构建复杂混合消息
    const mixedMessage = [
      { type: OneBotSegmentType.Text, data: { text: '这是一条复杂消息' } },
      { type: OneBotSegmentType.Face, data: { id: '123' } },
      { type: OneBotSegmentType.Text, data: { text: ' 看图：' } },
      { type: OneBotSegmentType.Image, data: { file: 'https://example.com/image.jpg' } },
      { type: OneBotSegmentType.At, data: { qq: 'all' } },
      { type: OneBotSegmentType.Text, data: { text: ' 都看看！' } },
    ]
    console.log('混合消息:', mixedMessage)

    // 构建回复消息
    const replyMessage = [
      { type: OneBotSegmentType.Reply, data: { id: '12345678' } },
      { type: OneBotSegmentType.Text, data: { text: '这是回复某条消息' } },
    ]
    console.log('回复消息:', replyMessage)

    // 构建链接分享消息
    const shareMessage = [
      {
        type: OneBotSegmentType.Share,
        data: {
          url: 'https://example.com',
          title: '示例网站',
          content: '这是一个示例网站',
          image: 'https://example.com/logo.png',
        },
      },
    ]
    console.log('链接分享:', shareMessage)

    // 构建JSON消息
    const jsonMessage = [
      {
        type: OneBotSegmentType.Json,
        data: {
          data: JSON.stringify({
            app: 'com.tencent.miniapp',
            desc: '小程序示例',
            view: 'view',
            ver: '1.0.0.0',
            prompt: '示例卡片',
            meta: {
              detail: { title: '示例标题', content: '示例内容' },
            },
          }),
        },
      },
    ]
    console.log('JSON消息:', jsonMessage)

    // 发送混合消息示例
    const groupId = 12345678
    console.log(`尝试发送混合消息到群 ${groupId}...`)

    try {
      const result = await client.sendGroupMsg(
        groupId,
        [
          { type: OneBotSegmentType.Text, data: { text: '这是一条测试消息，包含：\n' } },
          { type: OneBotSegmentType.Face, data: { id: '123' } },
          { type: OneBotSegmentType.Text, data: { text: '\n还有一张图片：' } },
          { type: OneBotSegmentType.Image, data: { file: 'https://example.com/test.jpg' } },
        ]
      )
      console.log('消息发送成功，消息ID:', result.message_id)
    } catch (error) {
      console.error('消息发送失败:', error)
    }

    // 关闭连接
    httpManager.closeAllClients()
  } catch (error) {
    console.error('错误:', error)
  }
}

main()
