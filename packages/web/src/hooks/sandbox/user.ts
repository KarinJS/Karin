import { User } from '@/model/user.model'
import { useEffect, useState } from 'react'
import { request } from '@/lib/request'

// 用于缓存用户信息的 Map
const userCache = new Map<string, User>()

// 更新用户缓存
export const updateUserCache = (user: User) => {
  userCache.set(user.userId, user)
}

// 批量更新好友缓存
export const updateFriendsCache = async () => {
  const friends = await request.serverPost<Array<{ userId: string; nick: string; avatar: string }>, object>('/api/v1/sandbox/friend/list', {})
  friends.forEach(friend => {
    const user = User.fromFriend(friend)
    updateUserCache(user)
  })
}

// 批量更新群组缓存
export const updateGroupsCache = async () => {
  const groups = await request.serverPost<Array<{ groupId: string; name: string; avatar: string }>, object>('/api/v1/sandbox/group/list', {})
  groups.forEach(group => {
    const user = User.fromGroup(group)
    updateUserCache(user)
  })
}

const useUser = (uid: string) => {
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<Error | null>(null)
  const [user, setUser] = useState<User>(() => {
    // 优先从缓存中获取用户信息
    return userCache.get(uid) || new User(uid)
  })

  useEffect(() => {
    const cachedUser = userCache.get(uid)
    if (cachedUser) {
      setUser(cachedUser)
    }
  }, [uid])

  return {
    loading,
    user,
    error,
  }
}

export default useUser
