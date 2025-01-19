import useUser from '@/hooks/sandbox/user'
import type { Message as MessageType } from '@/model/message.model'
import clsx from 'clsx'

interface MessageItemProps {
  id: number
  sender_id: number
  content: MessageType
  time: number
  align?: 'left' | 'right'
}

const NormalMessage: React.FC<{ content: string }> = props => {
  return (
    <div className="flex flex-col bg-zinc-100 dark:bg-zinc-800 rounded-lg p-3 max-w-80">
      {props.content}
    </div>
  )
}

const MessageItem: React.FC<MessageItemProps> = props => {
  const { id, sender_id, content, time, align = 'left' } = props
  const { user: sender } = useUser(sender_id)
  let ContentNode = <NormalMessage content={content.toString()} />

  return (
    <div
      className={clsx('flex items-start gap-3 p-4', align === 'right' ? 'flex-row-reverse' : '')}
      key={id}
    >
      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-black">
        <img
          src={sender?.avatar}
          alt={sender?.nickname}
          className="w-full h-full object-cover rounded-full"
        />
      </div>
      <div
        className={clsx(
          'group flex flex-col gap-1 text-sm',
          align === 'right' ? 'items-end' : 'items-start',
        )}
      >
        <div
          className={clsx(
            'flex items-center gap-2 select-none text-zinc-500 dark:text-zinc-400',
            align === 'right' ? 'flex-row-reverse' : '',
          )}
        >
          <div className="text-sm">{sender?.nickname}</div>
          <div className="text-xs opacity-0 group-hover:opacity-100">
            {new Date(time).toLocaleTimeString()}
          </div>
        </div>

        {ContentNode}
      </div>
    </div>
  )
}

export default MessageItem
