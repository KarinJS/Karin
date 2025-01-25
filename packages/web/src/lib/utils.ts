import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn (...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

import type { Op } from 'quill'

import type { Elements } from '@/types/segment'
import type { EmojiValue } from '@/components/sandbox/chat_input/formats/emoji_blot'
import type { ImageValue } from '@/components/sandbox/chat_input/formats/image_blot'
import type { ReplyBlockValue } from '@/components/sandbox/chat_input/formats/reply_blot'


/**
 * 判断是否为URI
 * @param uri URI
 * @returns 是否为URI
 */
export const isURI = (uri: string) => {
  return /^(http|https|file):\/\/.*/.test(uri)
}

/**
 * 将 Quill Delta 转换为 OneBot 消息
 * @param op Quill Delta
 * @returns OneBot 消息
 * @description 用于将 Quill Delta 转换为 OneBot 消息
 */
export const quillToMessage = (op: Op): Elements => {
  if (typeof op.insert !== 'string') {
    if (op.insert?.image) {
      return {
        type: 'image',
        file: (op.insert.image as ImageValue).src.replace('data:image/', 'base64://'),
      }
    } else if (op.insert?.emoji) {
      return {
        type: 'face',
        id: Number((op.insert.emoji as EmojiValue).id),
      }
    } else if (op.insert?.reply) {
      return {
        type: 'reply',
        messageId: (op.insert.reply as ReplyBlockValue).messageId,
      }
    }
  }

  return {
    type: 'text',
    text: op.insert as string,
  }
}
