import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

import type { Op } from 'quill'

import type { Elements } from '@/types/segment'
import type { EmojiValue } from '@/components/sandbox/chat_input/formats/emoji_blot'
import type { ImageValue } from '@/components/sandbox/chat_input/formats/image_blot'
import type { ReplyBlockValue } from '@/components/sandbox/chat_input/formats/reply_blot'

/**
 * 根据路径获取页面标题
 * @param pathname location.pathname 页面路由
 * @returns 页面标题
 */
export const getPageTitle = (pathname: string) => {
  const map = {
    '/': '基础信息',
    '/config': '配置信息',
    '/plugins/list': '插件市场',
    '/plugins/:name': '插件配置',
    '/sandbox': '沙箱调试',
    '/sandbox/chat': '沙箱 | [聊天]',
    '/sandbox/contact': '沙箱 | [联系人]',
    '/about': '关于我们',
    '/login': '登录'
  } as Record<string, string>

  return `${map?.[pathname] ?? '无人问津的角落...'}`
}

export function cn (...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

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

/**
 * 生成随机字符串
 * @param name 名称
 * @param length 长度
 * @returns 随机字符串
 */
export const getRandomString = (length = 5) => {
  const seed = Math.random().toString(36).substring(2, 15)
  return seed.substring(0, length)
}

/**
 * 将 ISO 8601 格式的时间转换为相对时间（xx天前）
 * @param isoString ISO 8601 格式的时间字符串
 * @returns 相对时间字符串
 */
export function formatTimeAgo (isoString: string): string {
  if (!isoString) return '未知时间'

  const date = new Date(isoString)
  const now = new Date()
  const diffTime = Math.abs(now.getTime() - date.getTime())
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

  // 处理今天和昨天
  if (diffDays === 0) return '今天'
  if (diffDays === 1) return '昨天'

  // 处理一周内
  if (diffDays < 7) return `${diffDays}天前`

  // 处理一个月内
  if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7)
    return `${weeks}周前`
  }

  // 处理一年内
  if (diffDays < 365) {
    const months = Math.floor(diffDays / 30)
    return `${months}月前`
  }

  // 超过一年显示"1年前"
  return '1年前'
}

/**
 * 格式化数字，将大于1000的数字转换为k/M单位
 * @param num 要格式化的数字
 * @returns 格式化后的字符串
 * @example
 * formatNumber(5386) // => "5.4k"
 * formatNumber(6140) // => "6.1k"
 * formatNumber(999) // => "999"
 * formatNumber(1000000) // => "1M"
 */
export function formatNumber (num: number): string {
  if (!num || num < 0) return '0'

  if (num < 1000) return num.toString()

  if (num < 1000000) {
    // 先除以100获取两位小数
    const twoDecimal = num / 100
    // 向下取整得到第一位小数
    const firstDecimal = Math.floor(twoDecimal) / 10
    // 第二位小数四舍五入
    const value = Math.round(firstDecimal * 10) / 10
    // 如果小数部分为0，则去掉小数部分
    return value.toFixed(1).endsWith('.0') ? `${Math.floor(value)}k` : `${value.toFixed(1)}k`
  }

  // 同样的逻辑处理百万级数字
  const twoDecimal = num / 100000
  const firstDecimal = Math.floor(twoDecimal) / 10
  const value = Math.round(firstDecimal * 10) / 10
  return value.toFixed(1).endsWith('.0') ? `${Math.floor(value)}M` : `${value.toFixed(1)}M`
}
