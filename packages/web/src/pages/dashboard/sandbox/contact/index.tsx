import clsx from 'clsx'
import { User } from '@/model/user.model'
import { useEffect, useState } from 'react'
import { IoChevronForward } from 'react-icons/io5'
import { useMatch, useNavigate } from 'react-router-dom'
import { Image } from '@heroui/image'
import { request } from '@/lib/request'
import type { Friend } from './detail'
import { useFriendList, useGroupList } from '@/hooks/sandbox/use_contact'

interface ContactItemProps {
  id: string
  name: string
  avatar: string
  description: string
}

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
  await request.serverPost('/api/v1/sandbox/group/create', {
    id: 'groupSandbox',
    name: '测试群',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=group'
  })
}

/** 获取群组列表 */
const getGroupList = async () => {
  const groups = await request.serverPost<any[], any>('/api/v1/sandbox/group/list', {})
  if (groups.length === 0) {
    await createDefaultGroup()
    return [{
      group_id: 'groupSandbox',
      name: '测试群',
      avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=group'
    }]
  }
  return groups.map(group => ({
    group_id: group.groupId,
    name: group.name,
    avatar: group.avatar
  }))
}

const ContactItem: React.FC<ContactItemProps> = props => {
  const { id, name, description, avatar } = props
  const match = useMatch('/sandbox/contact/:id')
  const navigate = useNavigate()
  const isActive = match?.params.id === id.toString()
  return (
    <div
      className={clsx(
        'w-full h-[70px] group select-none flex items-center px-3 gap-3 overflow-hidden',
        isActive
          ? 'bg-zinc-100 dark:bg-zinc-800 dark:bg-opacity-60 dark:text-white'
          : 'hover:bg-zinc-200 dark:hover:bg-zinc-800',
      )}
      onClick={() => {
        if (!isActive) {
          navigate(`/sandbox/contact/${id}`, { replace: true })
        }
      }}
    >
      <div className="w-12 aspect-square rounded-full overflow-hidden flex-grow-0 flex-shrink-0">
        <Image src={avatar} alt={name} className="rounded w-full h-full object-cover" />
      </div>
      <div className="flex-1 overflow-hidden">
        <div className="flex items-center justify-between mb-1 w-full overflow-hidden">
          <div className="text-sm truncate w-full">{name}</div>
        </div>
        <div className={clsx('text-xs truncate w-full text-gray-400 dark:text-gray-500')}>
          {description}
        </div>
      </div>
    </div>
  )
}

interface LinkItemProps {
  href: string
  title: string
}

const LinkItem: React.FC<LinkItemProps> = props => {
  const { href, title } = props
  const match = useMatch(`${href}/*`)
  const navigate = useNavigate()
  const isActive = !!match
  return (
    <div
      className={clsx(
        'w-full px-4 py-2 group select-none flex items-center gap-3 overflow-hidden  transition-all',
        isActive
          ? 'bg-zinc-100 dark:bg-zinc-800 dark:bg-opacity-60 dark:text-white'
          : 'hover:bg-zinc-200 dark:hover:bg-zinc-800',
      )}
      onClick={() => {
        if (!isActive) {
          navigate(href, { replace: true })
        }
      }}
    >
      <div className="text-sm truncate w-full">{title}</div>
      <div>
        <IoChevronForward className="text-gray-400 dark:text-gray-500" />
      </div>
    </div>
  )
}

const FriendList = () => {
  const { data, loading, error } = useFriendList()
  const [expanded, setExpanded] = useState<boolean>(true)

  return (
    <div>
      <div
        className="flex items-center justify-between px-4 py-2 cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="text-sm font-medium">我的好友</div>
        <div className={clsx('transform transition-transform', expanded ? 'rotate-90' : '')}>
          <IoChevronForward className="text-gray-400 dark:text-gray-500" />
        </div>
      </div>
      {expanded && (
        <div>
          {loading && <div className="text-center text-xs mt-2">加载中...</div>}
          {error && <div className="text-center text-xs mt-2 text-red-500">加载失败</div>}
          {data.map(user => (
            <ContactItem
              key={user.userId}
              id={user.userId}
              name={user.nickname}
              avatar={user.avatar}
              description={user.signature || '这个人很懒，什么都没写~'}
            />
          ))}
        </div>
      )}
    </div>
  )
}

const GroupList = () => {
  const { data, loading, error } = useGroupList()
  const [expanded, setExpanded] = useState<boolean>(true)

  return (
    <div>
      <div
        className="flex items-center justify-between px-4 py-2 cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="text-sm font-medium">我的群组</div>
        <div className={clsx('transform transition-transform', expanded ? 'rotate-90' : '')}>
          <IoChevronForward className="text-gray-400 dark:text-gray-500" />
        </div>
      </div>
      {expanded && (
        <div>
          {loading && <div className="text-center text-xs mt-2">加载中...</div>}
          {error && <div className="text-center text-xs mt-2 text-red-500">加载失败</div>}
          {data.map(group => (
            <ContactItem
              key={group.group_id}
              id={group.group_id}
              name={group.name}
              avatar={group.avatar}
              description="群聊"
            />
          ))}
        </div>
      )}
    </div>
  )
}

const ContactList = () => {
  return (
    <div>
      <div className="border-b border-zinc-100 dark:border-zinc-800">
        <LinkItem href="/sandbox/contact/friend_request" title="好友通知" />
        <LinkItem href="/sandbox/contact/group_notice" title="群通知" />
      </div>
      <FriendList />
      <GroupList />
    </div>
  )
}

export default ContactList
