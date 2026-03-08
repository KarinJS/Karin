import type {
  Event, MessageEvent, Context, AdapterApi, Element,
  CommandEntry, AcceptEntry, HandlerEntry, ButtonEntry, Pipe,
} from '@karin/types'

// ════ 共享状态（其他包可直接 import 读写） ════

export const bots = new Map<string, AdapterApi>()
export const commands: CommandEntry[] = []
export const accepts: AcceptEntry[] = []
export const handlers = new Map<string, HandlerEntry>()
export const buttons = new Map<string, ButtonEntry>()
export const pipes: Pipe[] = []

// ════ Bot 管理 ════

export function registerBot (selfId: string, api: AdapterApi): void {
  bots.set(selfId, api)
}

export function unregisterBot (selfId: string): void {
  bots.delete(selfId)
}

export function getBot (selfId: string): AdapterApi | undefined {
  return bots.get(selfId)
}

export function getBots (): ReadonlyMap<string, AdapterApi> {
  return bots
}

// ════ Pipe 注册 ════

export function pipe (fn: Pipe): void {
  pipes.push(fn)
}

// ════ Dispatch ════

let cmdDirty = true
let accDirty = true

export function markDirty (type: 'command' | 'accept'): void {
  if (type === 'command') cmdDirty = true
  else accDirty = true
}

export async function dispatch (event: Event): Promise<void> {
  const bot = bots.get(event.selfId)
  if (!bot) return

  const ctx: Context = {
    event,
    bot,
    match: null,
    state: {},
    get userId () { return event.userId },
    get selfId () { return event.selfId },
    get contact () { return event.contact },
    reply (content: string | Element[]) {
      const els = typeof content === 'string'
        ? [{ type: 'text' as const, text: content }]
        : content
      return bot.sendMessage(event.contact, els)
    },
  }

  // 管道
  for (const fn of pipes) {
    if (await fn(ctx) === false) return
  }

  // 匹配
  if (event.type === 'message') {
    if (cmdDirty) { commands.sort((a, b) => b.priority - a.priority); cmdDirty = false }
    const msg = (event as MessageEvent).rawMessage
    for (const cmd of commands) {
      const m = cmd.pattern.exec(msg)
      if (!m) continue
      ctx.match = m
      try { await cmd.fn(ctx) } catch (e) { console.error(`[cmd:${cmd.name}]`, e) }
      return
    }
  } else {
    if (accDirty) { accepts.sort((a, b) => b.priority - a.priority); accDirty = false }
    for (const acc of accepts) {
      if (acc.event !== '*' && acc.event !== event.subType) continue
      try { await acc.fn(ctx) } catch (e) { console.error('[accept]', e) }
    }
  }
}

// ════ 按文件清除（HMR 用） ════

export function removeByFile (file: string): void {
  spliceBy(commands, file)
  spliceBy(accepts, file)
  for (const [k, v] of handlers) { if (v.file === file) handlers.delete(k) }
  for (const [k, v] of buttons) { if (v.file === file) buttons.delete(k) }
  cmdDirty = true
  accDirty = true
}

function spliceBy (arr: { file: string }[], file: string): void {
  for (let i = arr.length - 1; i >= 0; i--) {
    if (arr[i].file === file) arr.splice(i, 1)
  }
}
