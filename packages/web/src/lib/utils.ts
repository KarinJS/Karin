import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

import type { Op } from 'quill'

import type { EmojiValue } from '@/components/sandbox/chat_input/formats/emoji_blot'
import type { ImageValue } from '@/components/sandbox/chat_input/formats/image_blot'
import type { ReplyBlockValue } from '@/components/sandbox/chat_input/formats/reply_blot'

import { type OB11Segment } from '@/types/onebot'

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
export const quillToMessage = (op: Op) => {
  let message: OB11Segment = {
    type: 'text',
    data: {
      text: op.insert as string,
    },
  }
  if (typeof op.insert !== 'string') {
    if (op.insert?.image) {
      message = {
        type: 'image',
        data: {
          file: (op.insert.image as ImageValue).src,
        },
      }
    } else if (op.insert?.emoji) {
      message = {
        type: 'face',
        data: {
          id: (op.insert.emoji as EmojiValue).id,
        },
      }
    } else if (op.insert?.reply) {
      message = {
        type: 'reply',
        data: {
          id: (op.insert.reply as ReplyBlockValue).messageId,
        },
      }
    }
  }
  return message
}
