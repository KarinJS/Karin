import { createHttpManager, EventKeys, OneBotSegmentType } from '../src'

/**
 * 演示如何使用各种API
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

    // 获取Bot自身信息
    try {
      const loginInfo = await client.getLoginInfo()
      console.log('登录信息:', loginInfo)
    } catch (error) {
      console.error('获取登录信息失败:', error)
    }

    // 获取好友列表
    try {
      const friendList = await client.getFriendList()
      console.log('好友数量:', friendList.length)
      console.log('第一位好友:', friendList[0])
    } catch (error) {
      console.error('获取好友列表失败:', error)
    }

    // 获取群列表
    try {
      const groupList = await client.getGroupList()
      console.log('群聊数量:', groupList.length)

      if (groupList.length > 0) {
        const firstGroup = groupList[0]
        console.log('第一个群信息:', firstGroup)

        // 获取群成员信息
        try {
          const memberList = await client.getGroupMemberList(firstGroup.group_id)
          console.log(`群 ${firstGroup.group_name}(${firstGroup.group_id}) 成员数量:`, memberList.length)

          if (memberList.length > 0) {
            console.log('第一位群成员:', memberList[0])
          }
        } catch (error) {
          console.error('获取群成员列表失败:', error)
        }
      }
    } catch (error) {
      console.error('获取群列表失败:', error)
    }

    // 获取版本信息
    try {
      const versionInfo = await client.getVersionInfo()
      console.log('OneBot版本信息:', versionInfo)
    } catch (error) {
      console.error('获取版本信息失败:', error)
    }

    // 获取状态
    try {
      const status = await client.getStatus()
      console.log('OneBot状态:', status)
    } catch (error) {
      console.error('获取状态失败:', error)
    }

    // 监听api调用
    client.on(EventKeys.sendApi, info => {
      console.log(`API调用: ${info.action}`, info.params)
    })

    client.on(EventKeys.response, info => {
      console.log(`API响应: ${info.action}`, info.data)
    })

    // 发送消息示例
    const userId = 987654321
    console.log(`尝试发送私聊消息给用户 ${userId}...`)

    try {
      const result = await client.sendPrivateMsg(
        userId,
        [{ type: OneBotSegmentType.Text, data: { text: 'API调用测试消息' } }]
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
