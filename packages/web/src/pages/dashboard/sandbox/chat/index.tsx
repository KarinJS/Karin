import useMessages from '@/hooks/sandbox/message'
import useUser from '@/hooks/sandbox/user'
import clsx from 'clsx'
import { memo } from 'react'
import { useMatch, useNavigate } from 'react-router-dom'
import { Message } from '@/model/message.model'
import { Image } from '@heroui/image'

interface ChatBoxItemProps {
  id: string
  message: string
  time: number
  unread: number
  type: 'friend' | 'group'
}

const ChatBoxItem: React.FC<ChatBoxItemProps> = props => {
  const { id, message, time, unread, type } = props
  const match = useMatch('/sandbox/chat/:type/:id')
  const navigate = useNavigate()

  const { user: sender } = useUser(id)
  const isActive = match?.params.id === id.toString() && match?.params.type === type

  return (
    <div
      className={clsx(
        'w-full h-[70px] group select-none flex items-center px-3 gap-3 overflow-hidden',
        isActive
          ? 'bg-[rgb(43,160,255)] text-white dark:bg-[rgb(49,108,200)] dark:text-white'
          : 'hover:bg-zinc-100 dark:hover:bg-zinc-800',
      )}
      onClick={() => {
        if (!isActive) {
          navigate(`/sandbox/chat/${type}/${id}`, { replace: true })
        }
      }}
    >
      <div className="w-12 aspect-square rounded-full  overflow-hidden flex-grow-0 flex-shrink-0">
        <Image
          src={sender?.avatar}
          alt={sender?.nickname}
          className="rounded w-full h-full object-cover"
        />
      </div>
      <div className="flex-1 overflow-hidden">
        <div className="flex items-center justify-between mb-1 w-full overflow-hidden">
          <div className="text-sm truncate w-full">{sender?.nickname}</div>
        </div>
        <div
          className={clsx(
            'text-xs truncate w-full h-4',
            isActive ? 'text-white' : 'text-gray-400 dark:text-gray-500',
          )}
        >
          {message}
        </div>
      </div>

      <div className="flex flex-col items-end gap-2 flex-grow-0 flex-shrink-0">
        <div
          className={clsx('text-xs', isActive ? 'text-white' : 'text-gray-400 dark:text-gray-500')}
        >
          {new Date(time).toLocaleDateString()}
        </div>
        {unread ? (
          <div className="text-xs text-white bg-blue-500 rounded-full min-w-5 px-1 py-0.5 flex items-center justify-center dark:bg-blue-700">
            {unread}
          </div>
        ) : (
          <div className="h-[1em]"></div>
        )}
      </div>
    </div>
  )
}

const ChatList = memo(() => {
  const message = useMessages()
  const messages = message.useWatch()

  return (
    <>
      {messages.map(item => (
        <ChatBoxItem
          key={item.user_id}
          id={item.user_id}
          type={item.type}
          message={
            item.messages.length ? new Message(item.messages[item.messages.length - 1]).message : ''
          }
          time={
            item.messages.length
              ? item.messages[item.messages.length - 1].time
              : new Date().getTime()
          }
          unread={0}
        />
      ))}
    </>
  )
})

export default ChatList
