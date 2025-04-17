import { request } from '@/lib/request'
import { useCallback } from 'react'

interface CreateMsgSeqResponse {
  seq: number
  time: number
  messageId: string
}

/**
 * 创建消息索引
 */
const createMsgSeq = async (type: 'friend' | 'group', targetId: string) => {
  const data = await request.post('/api/v1/sandbox/msg/create', {
    type,
    targetId,
  })
  return data.data.data as CreateMsgSeqResponse
}

/**
 * 消息上报hook
 */
const useSendMessage = () => {
  const sendMessage = useCallback(async (params: {
    type: 'friend' | 'group'
    targetId: string
    elements: any[]
  }) => {
    const { type, targetId, elements } = params

    // 1. 创建消息索引
    const { seq, time, messageId } = await createMsgSeq(type, targetId)

    // 2. 构建上报数据
    const payload = {
      type,
      seq,
      messageId,
      time,
      sender: {
        id: targetId,
        name: 'Bot',
        role: 'member',
      },
      ...(type === 'group'
        ? {
            groupId: targetId,
            groupName: '群聊',
          }
        : {}),
      elements,
    }

    // 3. 发送消息上报请求
    const res = await request.post('/api/v1/sandbox/webhook', payload)
    return res.data
  }, [])

  return { sendMessage }
}

export default useSendMessage
