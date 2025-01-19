import { User } from '@/model/user.model'
import clsx from 'clsx'
import { useEffect, useState } from 'react'
import { IoChevronForward } from 'react-icons/io5'
import { useMatch, useNavigate } from 'react-router-dom'
import { Image } from '@heroui/image'

interface ContactItemProps {
  id: number
  name: string
  avatar: string
  description: string
}

const getFriendList = async () => {
  return [
    {
      user_id: 1,
    },
    {
      user_id: 2,
    },
  ]
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
  const [data, setData] = useState<User[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<Error | null>(null)
  const fetchFriendList = async () => {
    setLoading(true)
    try {
      const res = await getFriendList()
      const list: User[] = []
      for await (const user of res) {
        const u = new User(user.user_id)
        await u.refresh()
        list.push(u)
      }
      setData(list)
    } catch (error) {
      setError(error as Error)
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => {
    fetchFriendList().catch(error => {
      console.error(error)
    })
  }, [])
  return (
    <div>
      {loading && <div className="text-center text-xs mt-2">加载中...</div>}
      {error && <div>加载失败</div>}
      {data.map(user => (
        <ContactItem
          key={user.user_id}
          id={user.user_id}
          name={user.nickname}
          avatar={user.avatar}
          description={user.signature}
        />
      ))}
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
    </div>
  )
}

export default ContactList
