import { Card } from '@heroui/card'
import { Divider } from '@heroui/divider'
import { Avatar } from '@heroui/avatar'
import { Button } from '@heroui/button'
import { Input } from '@heroui/input'
import { useState, useRef, useEffect } from 'react'
import {
  Panel,
  PanelGroup,
  PanelResizeHandle
} from 'react-resizable-panels'
import AudioInsert from '../../../../components/sandbox/chat_input/components/audio_insert'
import DiceInsert from '../../../../components/sandbox/chat_input/components/dice_insert'
import EmojiPicker from '../../../../components/sandbox/chat_input/components/emoji_picker'
import FileInsert from '../../../../components/sandbox/chat_input/components/file_insert'
import ImageInsert from '../../../../components/sandbox/chat_input/components/image_insert'
import MusicInsert from '../../../../components/sandbox/chat_input/components/music_insert'
import ReplyInsert from '../../../../components/sandbox/chat_input/components/reply_insert'
import RPSInsert from '../../../../components/sandbox/chat_input/components/rps_insert'
import VideoInsert from '../../../../components/sandbox/chat_input/components/video_insert'
import EmojiBlot from '../../../../components/sandbox/chat_input/formats/emoji_blot'
import ReplyBlock from '../../../../components/sandbox/chat_input/formats/reply_blot'
import type { EmojiValue } from '../../../../components/sandbox/chat_input/formats/emoji_blot'
import ImageBlot from '../../../../components/sandbox/chat_input/formats/image_blot'
import useSendMessage from '@/hooks/sandbox/use_send_message'
import { useParams } from 'react-router-dom'
import type { Range } from 'quill'


// 模拟数据
const mockMessages = [
  {
    id: 1,
    sender: '用户1',
    nickname: '群主大大',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=owner',
    content: '大家好！',
    htmlContent: '大家好！',
    role: 'owner',
    customTitle: ''
  },
  {
    id: 2,
    sender: '用户2',
    nickname: '管理小能手',
    avatar: 'https://api.multiavatar.com/Starcrasher.svg',
    content: '你好啊！',
    htmlContent: '你好啊！',
    role: 'admin',
    customTitle: ''
  }
]

const mockMembers = [
  {
    id: 1,
    name: '用户1',
    nickname: '群主大大',
    groupCard: '快乐群主', // 群名片
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=owner',
    status: 'online',
    role: 'owner', // 群主
    customTitle: '' // 群头衔
  },
  {
    id: 2,
    name: '用户2',
    nickname: '管理小能手',
    groupCard: '', // 空群名片
    avatar: 'https://api.multiavatar.com/Starcrasher.svg',
    status: 'offline',
    role: 'admin', // 管理员
    customTitle: '管理达人' // 群头衔
  },
  {
    id: 3,
    name: '用户3',
    nickname: '快乐群友',
    groupCard: '资深玩家', // 群名片
    avatar: 'https://api.multiavatar.com/JohnDoe.svg',
    status: 'online',
    role: 'member', // 普通成员
    customTitle: '' // 空群头衔
  }
]

const GroupChatTest = () => {
  const [message, setMessage] = useState('')
  const [htmlMessage, setHtmlMessage] = useState('')
  const [messages, setMessages] = useState(mockMessages)
  const [isSending, setIsSending] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLDivElement>(null)
  const memorizedRange = useRef<Range | null>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async () => {
    // 检查是否只包含空白字符且不包含图片或表情
    const hasOnlyWhitespace = !htmlMessage.trim()
    const hasMediaContent = htmlMessage.includes('<img') || htmlMessage.includes('data-emoji-id') || htmlMessage.includes('data-dice-value') || htmlMessage.includes('data-rps-value')

    if ((hasOnlyWhitespace && !hasMediaContent) || isSending) return

    setIsSending(true)

    try {
      await new Promise(resolve => setTimeout(resolve, 300))

      const newMessage = {
        id: messages.length + 1,
        sender: '用户1',
        nickname: '群主大大',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=owner',
        content: message,
        htmlContent: htmlMessage,
        role: 'owner',
        customTitle: ''
      }

      setMessages([...messages, newMessage])
      setMessage('')
      setHtmlMessage('')
      if (inputRef.current) {
        inputRef.current.innerHTML = ''
      }
    } finally {
      setIsSending(false)
    }
  }

  // 添加表情处理函数
  const onOpenChange = (open: boolean) => {
    // 暂时空实现,因为我们使用的是 contentEditable 而不是 Quill
  }

  const onInsertEmoji = (emoji: EmojiValue) => {
    if (inputRef.current) {
      const selection = window.getSelection()
      const range = selection?.getRangeAt(0)

      if (range) {
        const img = document.createElement('img')
        img.src = emoji.src
        img.alt = emoji.alt
        img.className = 'inline-block w-5 h-5 align-middle'
        img.dataset.emojiId = emoji.id

        range.deleteContents()
        range.insertNode(img)

        // 移动光标到表情后面
        range.setStartAfter(img)
        range.setEndAfter(img)
        selection?.removeAllRanges()
        selection?.addRange(range)

        // 更新消息内容
        setMessage(inputRef.current.innerHTML)
      }
    }
  }

  // 添加其他功能的处理函数
  const insertImage = async (url: string) => {
    if (inputRef.current) {
      const selection = window.getSelection()
      const range = selection?.getRangeAt(0)

      if (range) {
        const img = document.createElement('img')
        img.src = url
        img.alt = '图片'
        img.className = 'max-w-[200px] max-h-[200px] object-contain'

        range.deleteContents()
        range.insertNode(img)

        // 移动光标到图片后面
        range.setStartAfter(img)
        range.setEndAfter(img)
        selection?.removeAllRanges()
        selection?.addRange(range)

        // 更新消息内容
        setMessage(inputRef.current.innerHTML)
      }
    }
  }

  const insertReplyBlock = (messageId: string) => {
    if (inputRef.current) {
      const selection = window.getSelection()
      const range = selection?.getRangeAt(0)

      if (range) {
        const replyDiv = document.createElement('div')
        replyDiv.className = 'bg-gray-100 p-2 rounded mb-2'
        replyDiv.dataset.replyId = messageId

        const replyMessage = messages.find(msg => msg.id.toString() === messageId)
        if (replyMessage) {
          replyDiv.textContent = `回复 ${replyMessage.nickname}: ${replyMessage.content}`
        }

        range.deleteContents()
        range.insertNode(replyDiv)

        // 移动光标到回复块后面
        range.setStartAfter(replyDiv)
        range.setEndAfter(replyDiv)
        selection?.removeAllRanges()
        selection?.addRange(range)

        // 更新消息内容
        setMessage(inputRef.current.innerHTML)
      }
    }
  }

  const handleFileInsert = async (file: File) => {
    // 这里应该上传文件到服务器,获取URL
    // 暂时模拟一个文件显示
    if (inputRef.current) {
      const selection = window.getSelection()
      const range = selection?.getRangeAt(0)

      if (range) {
        const fileDiv = document.createElement('div')
        fileDiv.className = 'bg-gray-100 p-2 rounded inline-flex items-center gap-2'
        fileDiv.innerHTML = `
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span>${file.name}</span>
        `

        range.deleteContents()
        range.insertNode(fileDiv)

        // 移动光标到文件显示后面
        range.setStartAfter(fileDiv)
        range.setEndAfter(fileDiv)
        selection?.removeAllRanges()
        selection?.addRange(range)

        // 更新消息内容
        setMessage(inputRef.current.innerHTML)
      }
    }
  }

  const handleAudioInsert = () => {
    // 音频插入逻辑
    console.log('Audio insert clicked')
  }

  const handleVideoInsert = () => {
    // 视频插入逻辑
    console.log('Video insert clicked')
  }

  const handleMusicInsert = () => {
    // 音乐插入逻辑
    console.log('Music insert clicked')
  }

  const handleDiceInsert = () => {
    if (inputRef.current) {
      const selection = window.getSelection()
      const range = selection?.getRangeAt(0)

      if (range) {
        const diceSpan = document.createElement('span')
        const randomNum = Math.floor(Math.random() * 6) + 1
        diceSpan.className = 'inline-flex items-center justify-center bg-gray-100 rounded p-1 mx-1'
        diceSpan.innerHTML = `🎲 ${randomNum}`
        diceSpan.dataset.diceValue = randomNum.toString()

        range.deleteContents()
        range.insertNode(diceSpan)

        // 移动光标到骰子后面
        range.setStartAfter(diceSpan)
        range.setEndAfter(diceSpan)
        selection?.removeAllRanges()
        selection?.addRange(range)

        // 更新消息内容
        setMessage(inputRef.current.innerHTML)
      }
    }
  }

  const handleRPSInsert = () => {
    if (inputRef.current) {
      const selection = window.getSelection()
      const range = selection?.getRangeAt(0)

      if (range) {
        const rpsSpan = document.createElement('span')
        const options = ['✌️', '✊', '✋']
        const randomChoice = options[Math.floor(Math.random() * options.length)]
        rpsSpan.className = 'inline-flex items-center justify-center bg-gray-100 rounded p-1 mx-1'
        rpsSpan.innerHTML = randomChoice
        rpsSpan.dataset.rpsValue = randomChoice

        range.deleteContents()
        range.insertNode(rpsSpan)

        // 移动光标到猜拳后面
        range.setStartAfter(rpsSpan)
        range.setEndAfter(rpsSpan)
        selection?.removeAllRanges()
        selection?.addRange(range)

        // 更新消息内容
        setMessage(inputRef.current.innerHTML)
      }
    }
  }

  const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
    setMessage(e.currentTarget.textContent || '')
    setHtmlMessage(e.currentTarget.innerHTML)
  }

  return (
    <div className="h-full bg-[#f2f2f2]">
      <PanelGroup direction="horizontal">
        {/* 左侧聊天区域 */}
        <Panel defaultSize={80} minSize={30}>
          <PanelGroup direction="vertical">
            {/* 消息区域 */}
            <Panel defaultSize={80} minSize={50}>
              <Card className="h-full shadow-none bg-transparent rounded-lg">
                <div className="h-full overflow-y-auto">
                  <div className="p-4">
                    {messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex items-start gap-2 mb-4 ${msg.sender === '用户1' ? 'flex-row-reverse' : ''
                          }`}
                      >
                        <Avatar
                          src={msg.avatar}
                          alt={msg.nickname}
                          className="w-8 h-8 rounded-full ring-2 ring-white shadow-sm flex-shrink-0"
                        />
                        <div className={`flex flex-col ${msg.sender === '用户1' ? 'items-end' : 'items-start'
                          }`}>
                          <div className="flex items-center gap-2 mb-1">
                            {msg.sender === '用户1' ? (
                              // 右侧聊天成员
                              <>
                                {msg.role === 'owner' && (
                                  <span className="text-xs px-1.5 py-0.5 bg-red-100 text-red-600 rounded">群主</span>
                                )}
                                {msg.role === 'admin' && (
                                  <span className="text-xs px-1.5 py-0.5 bg-green-100 text-green-600 rounded">管理员</span>
                                )}
                                {msg.customTitle && (
                                  <span className="text-xs px-1.5 py-0.5 bg-purple-100 text-purple-600 rounded">{msg.customTitle}</span>
                                )}
                                <span className="text-sm text-gray-900">{msg.nickname}</span>
                              </>
                            ) : (
                              // 左侧聊天成员
                              <>
                                <span className="text-sm text-gray-900">{msg.nickname}</span>
                                {msg.role === 'owner' && (
                                  <span className="text-xs px-1.5 py-0.5 bg-red-100 text-red-600 rounded">群主</span>
                                )}
                                {msg.role === 'admin' && (
                                  <span className="text-xs px-1.5 py-0.5 bg-green-100 text-green-600 rounded">管理员</span>
                                )}
                                {msg.customTitle && (
                                  <span className="text-xs px-1.5 py-0.5 bg-purple-100 text-purple-600 rounded">{msg.customTitle}</span>
                                )}
                              </>
                            )}
                          </div>
                          <div
                            className={`p-2 rounded-2xl break-words max-w-[85%] ${msg.sender === '用户1'
                              ? 'bg-primary-500 text-white'
                              : 'bg-white text-gray-700'
                              }`}
                          >
                            <div
                              className="message-content [&_img]:max-w-[200px] [&_img]:max-h-[200px] [&_img]:rounded-lg [&_img]:object-cover [&_img.emoji]:inline-block [&_img.emoji]:w-5 [&_img.emoji]:h-5 [&_img.emoji]:align-middle [&_img.emoji]:m-0"
                              dangerouslySetInnerHTML={{ __html: msg.htmlContent }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                </div>
              </Card>
            </Panel>

            {/* 分隔条 */}
            <PanelResizeHandle className="group h-[1px] relative bg-gray-200 hover:bg-primary-500/20 transition-colors">
              <div className="absolute inset-x-0 top-[-4px] h-[9px] bg-transparent cursor-row-resize" />
            </PanelResizeHandle>

            {/* 工具栏 */}
            <div className="!border-none flex gap-2 p-1">
              <EmojiPicker onInsertEmoji={onInsertEmoji} onOpenChange={onOpenChange} />
              <ImageInsert insertImage={insertImage} onOpenChange={onOpenChange} />
              <ReplyInsert insertReply={insertReplyBlock} />
              <FileInsert />
              <AudioInsert />
              <VideoInsert />
              <MusicInsert />
              <DiceInsert />
              <RPSInsert />
            </div>

            {/* 输入区域 */}
            <Panel defaultSize={20} minSize={15}>
              <Card className="h-full shadow-none bg-transparent">
                <div className="relative h-full">
                  <div
                    ref={inputRef}
                    contentEditable
                    onInput={handleInput}
                    onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => {
                      if (e.key === 'Enter' && !e.shiftKey && !isSending) {
                        e.preventDefault()
                        handleSendMessage()
                      }
                    }}
                    className="h-full w-full overflow-y-auto whitespace-pre-wrap break-words outline-none p-3 pr-[60px] empty:before:content-[attr(data-placeholder)] empty:before:text-gray-400 resize-none rounded-lg bg-white [&_img]:max-w-[200px] [&_img]:max-h-[200px] [&_img]:rounded-lg [&_img]:object-cover [&_img.emoji]:inline-block [&_img.emoji]:w-5 [&_img.emoji]:h-5 [&_img.emoji]:align-middle [&_img.emoji]:m-0"
                    role="textbox"
                    aria-multiline="true"
                    data-placeholder="输入消息..."
                    suppressContentEditableWarning
                  />
                  <Button
                    variant="solid"
                    onClick={handleSendMessage}
                    disabled={!htmlMessage.trim() && !htmlMessage.includes('<img')}
                    className={`absolute right-3 bottom-3 rounded-lg text-white ${(htmlMessage.trim() || htmlMessage.includes('<img')) && !isSending
                      ? 'bg-blue-500 hover:bg-blue-600 cursor-pointer'
                      : 'bg-blue-500 opacity-80 cursor-not-allowed'
                      }`}
                    size="sm"
                  >
                    {isSending ? '发送中...' : '发送'}
                  </Button>
                </div>
              </Card>
            </Panel>
          </PanelGroup>
        </Panel>

        {/* 分隔条 */}
        <PanelResizeHandle className="group w-[1px] relative bg-gray-200 hover:bg-primary-500/20 transition-colors">
          <div className="absolute inset-y-0 left-[-4px] w-[9px] bg-transparent cursor-col-resize" />
        </PanelResizeHandle>

        {/* 右侧成员列表 */}
        <Panel defaultSize={20} minSize={20} maxSize={30}>
          <Card className="h-full shadow-none bg-transparent">
            <div className="h-full overflow-y-auto">
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-base font-medium text-gray-900">群成员</h3>
                  <span className="px-1.5 py-0.5 text-xs text-gray-500 bg-gray-100 rounded-full flex-shrink-0">
                    {mockMembers.length}
                  </span>
                </div>
                <Divider className="my-2" />
                <div className="space-y-0.5">
                  {mockMembers.map((member) => (
                    <div key={member.id} className="flex items-center gap-2 px-2 py-1 rounded hover:bg-gray-50/50 transition-colors cursor-pointer">
                      <Avatar
                        src={member.avatar}
                        alt={member.nickname}
                        className="w-8 h-8 rounded-full flex-shrink-0"
                      />
                      <div className="flex-grow min-w-0 flex items-center justify-between">
                        <span className="text-sm text-gray-900 truncate">
                          {member.groupCard || member.nickname}
                        </span>
                        {member.role !== 'member' && (
                          <span className={`text-[10px] px-1.5 py-0.5 rounded flex-shrink-0 ${member.role === 'owner'
                            ? 'bg-red-100 text-red-600'
                            : 'bg-green-100 text-green-600'
                            }`}>
                            {member.role === 'owner' ? '群主' : '管理员'}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </Panel>
      </PanelGroup>
    </div>
  )
}

export default GroupChatTest 