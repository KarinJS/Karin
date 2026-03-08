import readline from 'node:readline'
import { registerBot, dispatch } from '@karin/core'
import { logger } from '@karin/logger'
import type { AdapterApi, Contact, Element, MessageEvent } from '@karin/types'

// ════ 适配器 API ════

const api: AdapterApi = {
  async sendMessage (_contact: Contact, elements: Element[]) {
    const text = elements.map(el => {
      if (el.type === 'text') return el.text
      return `[${el.type}]`
    }).join('')
    logger.info(`[bot] ${text}`)
    return `msg_${Date.now()}`
  },
  async recallMessage () {
    // no-op
  },
}

registerBot('console', api)

// ════ stdin → MessageEvent ════

const rl = readline.createInterface({ input: process.stdin })

rl.on('line', (line) => {
  const trimmed = line.trim()
  if (!trimmed) return

  const event: MessageEvent = {
    type: 'message',
    selfId: 'console',
    userId: 'user',
    contact: { scene: 'friend', peer: 'user' },
    timestamp: Math.floor(Date.now() / 1000),
    messageId: `msg_${Date.now()}`,
    rawMessage: trimmed,
    elements: [{ type: 'text', text: trimmed }],
  }

  void dispatch(event)
})

logger.info('[console] adapter ready, type a message...')
