import { Button } from '@heroui/button'
import type { Range } from 'quill'
import 'quill/dist/quill.core.css'
import { useRef, useEffect } from 'react'
import toast from 'react-hot-toast'
import { useCustomQuill } from '@/hooks/sandbox/use_custom_quill'
import { quillToMessage } from '@/lib/utils'

import AudioInsert from './components/audio_insert'
import DiceInsert from './components/dice_insert'
import EmojiPicker from './components/emoji_picker'
import FileInsert from './components/file_insert'
import ImageInsert from './components/image_insert'
import MusicInsert from './components/music_insert'
import ReplyInsert from './components/reply_insert'
import RPSInsert from './components/rps_insert'
import VideoInsert from './components/video_insert'
import EmojiBlot from './formats/emoji_blot'
import ReplyBlock from './formats/reply_blot'
import type { EmojiValue } from './formats/emoji_blot'
import ImageBlot from './formats/image_blot'
import useSendMessage from '@/hooks/sandbox/use_send_message'
import { useParams } from 'react-router-dom'

const ChatInput = () => {
  const memorizedRange = useRef<Range | null>(null)
  const formats: string[] = ['image', 'emoji', 'reply']
  const modules = {
    toolbar: '#toolbar',
  }

  const formatsRegistered = useRef(false)

  const { quillRef, quill, Quill } = useCustomQuill({
    modules,
    formats,
    placeholder: '',
  })

  const { sendMessage } = useSendMessage()
  const { type = 'friend', id } = useParams<{ type: 'friend' | 'group'; id: string }>()

  useEffect(() => {
    if (!formatsRegistered.current) {
      Quill.register({
        'formats/emoji': EmojiBlot,
        'formats/reply': ReplyBlock
      })
      formatsRegistered.current = true
    }

    if (!quillRef.current) {
      // 初始化 Quill 编辑器的代码
    }
  }, [])

  if (Quill && !quill && !formatsRegistered.current) {
    Quill.register('formats/emoji', EmojiBlot)
    Quill.register('formats/image', ImageBlot, true)
    Quill.register('formats/reply', ReplyBlock)
    formatsRegistered.current = true
  }

  if (quill) {
    quill.on('selection-change', range => {
      if (range) {
        const editorContent = quill.getContents()
        const firstOp = editorContent.ops[0]

        if (
          typeof firstOp?.insert !== 'string' &&
          firstOp?.insert?.reply &&
          range.index === 0 &&
          range.length !== quill.getLength()
        ) {
          quill.setSelection(1, Quill.sources.SILENT)
        }
      }
    })

    quill.on('text-change', () => {
      const editorContent = quill.getContents()
      const firstOp = editorContent.ops[0]
      if (
        firstOp &&
        typeof firstOp.insert !== 'string' &&
        firstOp.insert?.reply &&
        quill.getLength() === 1
      ) {
        quill.insertText(1, '\n', Quill.sources.SILENT)
      }
    })

    quill.on('editor-change', (eventName: string) => {
      if (eventName === 'text-change') {
        const editorContent = quill.getContents()
        const firstOp = editorContent.ops[0]
        if (
          firstOp &&
          typeof firstOp.insert !== 'string' &&
          firstOp.insert?.reply &&
          quill.getLength() === 1
        ) {
          quill.insertText(1, '\n', Quill.sources.SILENT)
        }
      }
    })

    quill.root.addEventListener('compositionstart', () => {
      const editorContent = quill.getContents()
      const firstOp = editorContent.ops[0]
      if (
        firstOp &&
        typeof firstOp.insert !== 'string' &&
        firstOp.insert?.reply &&
        quill.getLength() === 1
      ) {
        quill.insertText(1, '\n', Quill.sources.SILENT)
      }
    })
  }

  const onOpenChange = (open: boolean) => {
    if (open) {
      const selection = quill?.getSelection()
      if (selection) memorizedRange.current = selection
    }
  }

  const insertImage = (url: string) => {
    const selection = memorizedRange.current || quill?.getSelection()
    quill?.deleteText(selection?.index || 0, selection?.length || 0)
    quill?.insertEmbed(selection?.index || 0, 'image', {
      src: url,
      alt: '图片',
    })
    quill?.setSelection((selection?.index || 0) + 1, 0)
  }
  function insertReplyBlock (messageId: string) {
    const isNumberReg = /^(?:0|(?:-?[1-9]\d*))$/
    if (!isNumberReg.test(messageId)) {
      toast.error('请输入正确的消息ID')
      return
    }
    const editorContent = quill?.getContents()
    const firstOp = editorContent?.ops[0]
    const currentSelection = quill?.getSelection()
    if (firstOp && typeof firstOp.insert !== 'string' && firstOp.insert?.reply) {
      const delta = quill?.getContents()
      if (delta) {
        delta.ops[0] = {
          insert: { reply: { messageId } },
        }
        quill?.setContents(delta, Quill.sources.USER)
      }
    } else {
      quill?.insertEmbed(0, 'reply', { messageId }, Quill.sources.USER)
    }
    quill?.setSelection((currentSelection?.index || 0) + 1, 0)
    quill?.blur()
  }
  const onInsertEmoji = (emoji: EmojiValue) => {
    const selection = memorizedRange.current || quill?.getSelection()
    quill?.deleteText(selection?.index || 0, selection?.length || 0)
    quill?.insertEmbed(selection?.index || 0, 'emoji', {
      alt: emoji.alt,
      src: emoji.src,
      id: emoji.id,
    })
    quill?.setSelection((selection?.index || 0) + 1, 0)
  }

  const getChatMessage = () => {
    const delta = quill?.getContents()
    const ops =
      delta?.ops?.filter(op => {
        return op.insert !== '\n'
      }) ?? []
    const messages: Record<string, any>[] = ops.map(op => {
      return quillToMessage(op)
    })
    return messages
  }

  const handleSendMessage = async () => {
    const messages = getChatMessage()
    try {
      await sendMessage({
        type,
        targetId: id!,
        elements: messages
      })
      // 清空输入框
      quill?.setContents([])
    } catch (err) {
      toast.error('发送失败')
    }
  }

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div id="toolbar" className="!border-none flex gap-2 p-1">
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
      <div ref={quillRef} className="!text-base flex-1 px-1 overflow-hidden" spellCheck={false} />
      <div className="p-2 flex justify-end">
        <Button
          color="primary"
          size="sm"
          onPress={handleSendMessage}
          className="ml-auto"
        >
          发送
        </Button>
      </div>
    </div>
  )
}

export default ChatInput
