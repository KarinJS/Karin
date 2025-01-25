import { useState, useEffect } from 'react'
import { User } from '@/model/user.model'
import { request } from '@/lib/request'

/** 好友信息接口 */
interface Friend {
  userId: string
  nick: string
  avatar: string
}

/** 群组信息接口 */
interface Group {
  groupId: string
  name: string
  avatar: string
}

/** 默认群参数 */
const defaultGroup = {
  id: 'groupSandbox',
  name: '测试群',
  avatar: 'https://p.qlogo.cn/gh/967068507/967068507/0'
} as const

/** 获取好友列表 */
const getFriendList = async () => {
  const friends = await request.serverPost<Friend[], any>('/api/v1/sandbox/friend/list', {})
  return friends.map(friend => ({
    user_id: friend.userId,
    nickname: friend.nick,
    avatar: friend.avatar
  }))
}

/** 创建默认群组 */
const createDefaultGroup = async () => {
  await request.serverPost('/api/v1/sandbox/group/create', defaultGroup)
}

/** 获取群组列表 */
const getGroupList = async () => {
  const groups = await request.serverPost<Group[], any>('/api/v1/sandbox/group/list', {})
  if (groups.length === 0) {
    await createDefaultGroup()
    return [{
      group_id: defaultGroup.id,
      name: defaultGroup.name,
      avatar: defaultGroup.avatar
    }]
  }
  return groups.map(group => ({
    group_id: group.groupId,
    name: group.name,
    avatar: group.avatar
  }))
}

/** 好友列表 Hook */
export const useFriendList = () => {
  const [data, setData] = useState<User[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<Error | null>(null)

  const fetchFriendList = async () => {
    setLoading(true)
    try {
      const friends = await getFriendList()
      const list: User[] = []
      for (const friend of friends) {
        const user = new User(friend.user_id, friend.nickname, friend.avatar)
        list.push(user)
      }
      setData(list)
    } catch (error) {
      setError(error as Error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchFriendList().catch(console.error)
  }, [])

  return { data, loading, error, refresh: fetchFriendList }
}

/** 群组信息类型 */
interface GroupInfo {
  group_id: string
  name: string
  avatar: string
}

/** 群组列表 Hook */
export const useGroupList = () => {
  const [data, setData] = useState<GroupInfo[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<Error | null>(null)

  const fetchGroupList = async () => {
    setLoading(true)
    try {
      const groups = await getGroupList()
      setData(groups)
    } catch (error) {
      setError(error as Error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchGroupList().catch(console.error)
  }, [])

  return { data, loading, error, refresh: fetchGroupList }
} 