import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

import {
  Bot,
  registerBot,
  unregisterBot,
  getBot,
  getAllBot,
  getAllBotID,
  getBotCount,
  getAllBotList,
  sendMsg,
} from '../src/index'

vi.mock('@karinjs/logger', () => ({
  logger: {
    bot: vi.fn(),
    error: vi.fn(),
    warn: vi.fn(),
    green: (s: string) => s,
  },
}))

vi.mock('@karinjs/adapter', () => ({
  createRawMessage: (elements: Array<any>) => ({
    raw: elements
      .map((e) => (typeof e === 'string' ? e : e?.data?.text ?? ''))
      .join(''),
  }),
  makeMessage: (elements: any) => {
    if (Array.isArray(elements)) return elements
    return [{ type: 'text', data: { text: String(elements) } }]
  },
}))

vi.mock('@karinjs/adapter/hooks', () => ({
  coreHooks: {
    sendMsg: {
      beforeMessage: vi.fn().mockResolvedValue(true),
      afterMessage: vi.fn().mockResolvedValue(undefined),
      beforeForward: vi.fn().mockResolvedValue(true),
      afterForward: vi.fn().mockResolvedValue(undefined),
    },
  },
}))

vi.mock('@karinjs/events', () => {
  const __emits: Array<{ name: string; payload: any }> = []
  const emitter = {
    emit: (name: string, payload: any) => {
      __emits.push({ name, payload })
    },
  }
  return { emitter, __emits }
})

vi.mock('@karinjs/envs', () => ({
  SEND_MSG: 'SEND_MSG',
}))

vi.mock('@karinjs/bot', async () => {
  const mod = await import('../src/index')
  return mod as any
})

const createFakeAdapter = (overrides: Partial<any> = {}) => {
  const state: any = {
    recallCalls: [] as Array<{ contact: any; messageId: string }>,
    sendAttempts: 0,
  }
  const adapter: any = {
    selfId: overrides.selfId ?? 'bot-1',
    status: overrides.status ?? 'online',
    adapter: {
      protocol: overrides.protocol ?? ('fake' as any),
      name: overrides.name ?? 'fake-adapter',
      address: overrides.address ?? 'ws://fake',
      communication: overrides.communication ?? undefined,
    },
    account: {
      name: overrides.accountName ?? 'FakeAccount',
      events: { sent: { message: 0, forward: 0 } },
    },
    sendMsg: async (
      contact: any,
      elements: Array<any>,
      _retryCount?: number
    ) => {
      state.sendAttempts++
      return {
        messageId: 'mid-1',
        time: 111,
        rawData: 'raw',
        message_id: '',
        messageTime: 111,
      }
    },
    sendForwardMsg: async (_contact: any, _elements: Array<any>, _options?: any) => ({
      messageId: 'fid-1',
      forwardId: 'fid-1',
    }),
    recallMsg: async (contact: any, messageId: string) => {
      state.recallCalls.push({ contact, messageId })
    },
  }
  return { adapter, state }
}

const createRetryAdapter = () => {
  const { adapter, state } = createFakeAdapter()
  adapter.sendMsg = async (_c: any, _e: Array<any>, _r?: number) => {
    state.sendAttempts++
    if (state.sendAttempts === 1) throw new Error('fail once')
    return {
      messageId: 'mid-ok',
      time: 222,
      rawData: 'raw2',
      message_id: '',
      messageTime: 222,
    }
  }
  return { adapter, state }
}

describe('bot package', () => {
  beforeEach(() => {
    vi.useRealTimers()
  })

  afterEach(() => {
    const list = getAllBotList()
    for (const { index } of list) unregisterBot('index', index)
    vi.restoreAllMocks()
  })

  it('registers bot and queries via index/protocol/selfId', () => {
    const comm = { name: 'comm' } as any
    const { adapter } = createFakeAdapter()
    const idx = registerBot(comm as any, adapter as any)
    expect(idx).toBeGreaterThan(0)

    const byIndex = getBot(idx)
    expect(byIndex).toBe(adapter)

    const byProtocol = getBot(adapter.adapter.protocol, true)
    expect(byProtocol).toBe(adapter)

    const bySelfId = getBot(adapter.selfId)
    expect(bySelfId).toBe(adapter)

    const ids = getAllBotID()
    expect(ids).toContain(adapter.selfId)

    expect(getBotCount()).toBe(1)

    expect(getAllBot().length).toBe(1)

    expect(adapter.adapter.communication).toBe(comm)
  })

  it('sendMsg sets message_id, emits SEND_MSG and schedules recall', async () => {
    const { adapter, state } = createFakeAdapter()
    registerBot({} as any, adapter as any)
    const contact = { scene: 'group', peer: 10001 }

    vi.useFakeTimers()

    let msgEmitted = false
    Bot.once('send.msg', () => { msgEmitted = true })

    const result = await sendMsg(adapter.selfId, contact as any, 'hello', {
      recallMsg: 1,
      retryCount: 1,
    })

    expect(result.message_id).toBe(result.messageId)
    expect(msgEmitted).toBe(true)

    expect(adapter.account.events.sent.message).toBe(1)

    await vi.advanceTimersByTimeAsync(1000)
    expect(state.recallCalls.length).toBe(1)
    expect(state.recallCalls[0].messageId).toBe(result.messageId)
  })

  it('wrapBotMethods handles retry and increments counters', async () => {
    const { adapter, state } = createRetryAdapter()
    registerBot({} as any, adapter as any)
    const contact = { scene: 'private', peer: 20002 }

    let msgEmitted = false
    let forwardEmitted = false
    Bot.once('send.msg', () => { msgEmitted = true })
    Bot.once('send.forward', () => { forwardEmitted = true })

    const result = await sendMsg(adapter.selfId, contact as any, [{ type: 'text', text: 'hi' }], {
      retryCount: 1,
    })

    expect(result.messageId).toBe('mid-ok')
    expect(adapter.account.events.sent.message).toBe(2)
    expect(state.sendAttempts).toBe(2)

    await (adapter as any).sendForwardMsg(contact as any, [])
    expect(adapter.account.events.sent.forward).toBe(1)
    expect(msgEmitted).toBe(true)
    expect(forwardEmitted).toBe(true)
  })

  it('unregisters by address and selfId', () => {
    const { adapter } = createFakeAdapter({ selfId: 'bot-x', address: 'ws://x' })
    registerBot({} as any, adapter as any)
    expect(getBotCount()).toBe(1)
    expect(unregisterBot('address', 'bot-x', 'ws://x')).toBe(true)
    expect(getBotCount()).toBe(0)

    const { adapter: a2 } = createFakeAdapter({ selfId: 'bot-y', address: 'ws://y' })
    registerBot({} as any, a2 as any)
    expect(getBotCount()).toBe(1)
    expect(unregisterBot('selfId', 'bot-y')).toBe(true)
    expect(getBotCount()).toBe(0)
  })

  it('getAllBot without state returns all', () => {
    const { adapter } = createFakeAdapter()
    registerBot({} as any, adapter as any)
    const all = getAllBot()
    expect(all.length).toBe(1)
  })

  it('getAllBot with state filters correctly', () => {
    const { adapter } = createFakeAdapter({ status: 'offline', selfId: 'bot-off' })
    registerBot({} as any, adapter as any)
    const offline = Bot.getAllBot('offline')
    expect(offline.length).toBeGreaterThan(0)
  })

  it('unregisterBot invalid type logs and returns false', async () => {
    const res = unregisterBot('invalid' as any, 'x' as any)
    expect(res).toBe(false)
    const { logger } = await import('@karinjs/logger')
    expect(logger.error).toHaveBeenCalled()
  })

  it('remove by index/selfId/address not found returns false', () => {
    expect(unregisterBot('index', 999)).toBe(false)
    expect(unregisterBot('selfId', 'not-exist')).toBe(false)
    expect(unregisterBot('address', 'no-bot', 'ws://none')).toBe(false)
  })

  it('sendMsg with missing bot throws', async () => {
    await expect(sendMsg('missing', { scene: 'private', peer: 1 } as any, 'x')).rejects.toThrow()
  })

  it('beforeMessage false returns empty and no afterMessage', async () => {
    vi.clearAllMocks()
    const { adapter } = createFakeAdapter()
    registerBot({} as any, adapter as any)
    const { coreHooks } = await import('@karinjs/adapter/hooks')
    coreHooks.sendMsg.beforeMessage.mockResolvedValueOnce(false)
    const contact = { scene: 'private', peer: 3 }
    const res = await sendMsg(adapter.selfId, contact as any, 'nope')
    expect(res.messageId).toBe('')
    expect(res.message_id).toBe('')
    expect(coreHooks.sendMsg.afterMessage).not.toHaveBeenCalled()
  })

  it('sendMsg throws without retry triggers catch and logger', async () => {
    const { adapter } = createFakeAdapter()
    adapter.sendMsg = async () => { throw new Error('always fail') }
    registerBot({} as any, adapter as any)
    const contact = { scene: 'private', peer: 5 }
    const { logger } = await import('@karinjs/logger')
    const res = await sendMsg(adapter.selfId, contact as any, 'x', { retryCount: 0 })
    expect(res.messageId).toBe('')
    expect(logger.error).toHaveBeenCalled()
  })

  it('beforeForward false returns empty and no afterForward', async () => {
    vi.clearAllMocks()
    const { adapter } = createFakeAdapter()
    registerBot({} as any, adapter as any)
    const { coreHooks } = await import('@karinjs/adapter/hooks')
    coreHooks.sendMsg.beforeForward.mockResolvedValueOnce(false)
    const contact = { scene: 'private', peer: 7 }
    const res = await (adapter as any).sendForwardMsg(contact as any, [])
    expect(res.forwardId).toBe('')
    expect(coreHooks.sendMsg.afterForward).not.toHaveBeenCalled()
  })

  it('recall not scheduled when recallMsg is falsy', async () => {
    const { adapter, state } = createFakeAdapter()
    registerBot({} as any, adapter as any)
    vi.useFakeTimers()
    await sendMsg(adapter.selfId, { scene: 'private', peer: 9 } as any, 'hi', { retryCount: 1 })
    await vi.advanceTimersByTimeAsync(2000)
    expect(state.recallCalls.length).toBe(0)
  })

  it('emit error is caught inside event dispatch', async () => {
    const { adapter } = createFakeAdapter()
    registerBot({} as any, adapter as any)
    const { emitter } = await import('@karinjs/events')
    vi.spyOn(emitter, 'emit').mockImplementation(() => { throw new Error('emit fail') })
    await expect(sendMsg(adapter.selfId, { scene: 'private', peer: 11 } as any, 'ok')).resolves.toBeDefined()
  })
})
