import { useParams } from 'react-router-dom'
import MessageItem from '@/components/sandbox/message_item'
import useMessages from '@/hooks/sandbox/message'
import { useEffect, useRef, useMemo, useCallback } from 'react'
import useUser from '@/hooks/sandbox/user'
import { Message } from '@/model/message.model'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable'
import ChatInput from '@/components/sandbox/chat_input'

const ChatDetail = () => {
  const { id, type } = useParams<{ id: string; type: string }>()
  const message = useMessages()
  const messages = message.useWatch()
  const currentMessage = useMemo(() =>
    messages.find(item => item.user_id === id),
    [messages, id]
  )
  const endRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  // const [content, setContent] = useState('')
  const { user } = useUser(id!)
  const positionRef = useRef<{
    scrollHeight: number
    clientHeight: number
    scrollTop: number
  }>({
    scrollHeight: 0,
    clientHeight: 0,
    scrollTop: 0,
  })
  useEffect(() => {
    if (containerRef.current) {
      if (
        positionRef.current.scrollTop + positionRef.current.clientHeight >=
        positionRef.current.scrollHeight
      ) {
        setTimeout(() => {
          endRef.current?.scrollIntoView({ behavior: 'smooth' })
        }, 0)
      }
    }
  }, [currentMessage])
  const onScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    positionRef.current = {
      scrollHeight: e.currentTarget.scrollHeight,
      clientHeight: e.currentTarget.clientHeight,
      scrollTop: e.currentTarget.scrollTop,
    }
  }, [])

  const dragEvent = useCallback((e: DragEvent) => {
    e.preventDefault()
    // for (const f of e.dataTransfer!.files) {
    // }
  }, [])
  useEffect(() => {
    document.addEventListener('drop', dragEvent)
    return () => {
      document.removeEventListener('drop', dragEvent)
    }
  }, [id])
  // const onSendKey = async (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
  //   if (e.key === 'Enter') {
  //     e.preventDefault()
  //     if (content.trim() === '') {
  //       return
  //     }
  //     try {
  //       setContent('')
  //       setTimeout(() => {
  //         endRef.current?.scrollIntoView({ behavior: 'smooth' })
  //       }, 0)
  //     } catch (error) {
  //       console.error(error)
  //     }
  //     return
  //   }
  // }

  const getTitle = () => {
    switch (type) {
      case 'friend':
        return '好友聊天'
      case 'group':
        return '群聊'
      default:
        return '聊天'
    }
  }

  return (
    <ResizablePanelGroup direction="vertical" className="h-full flex flex-col overflow-hidden">
      <div className="pt-5 pb-2 px-5 border-b border-zinc-100 dark:border-zinc-800 flex-grow-0 flex-shrink-0 select-none app-drag">
        <div>{getTitle()} - {user?.nickname}</div>
      </div>
      <ResizablePanel>
        <div className="h-full overflow-y-auto" ref={containerRef} onScroll={onScroll}>
          {currentMessage?.messages.map(item => {
            return (
              <MessageItem
                key={item.messageId}
                id={item.messageId}
                sender_id={item.sender.id}
                content={new Message(item)}
                time={item.time}
                align={'left'}
              />
            )
          })}
          <div ref={endRef} className="h-1" />
        </div>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel className="flex flex-col" defaultSize={30} minSize={24} maxSize={46}>
        <ChatInput />
      </ResizablePanel>
    </ResizablePanelGroup>
  )
}

export default ChatDetail
