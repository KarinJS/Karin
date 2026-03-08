import {
  commands, accepts, handlers, buttons, markDirty,
} from '@karin/core'
import type { Awaitable, Context, TaskEntry } from '@karin/types'

// ════ 调用栈溯源 ════

const _getCallerFile = function getCallerFile (): string {
  const err = {} as { stack: string }
  Error.captureStackTrace(err, _getCallerFile)
  const lines = err.stack.split('\n')
  for (const line of lines) {
    const match = line.match(/\(?file:\/\/\/(.+?)[?:)]/)
      ?? line.match(/\(?(.+?\.[tj]s)[?:)]/)
    if (match && !match[1].includes('@karin/dsl') && !match[1].includes('@karin\\dsl')) {
      return match[1].replaceAll('\\', '/')
    }
  }
  return 'unknown'
}

// ════ DSL ════

export function command (
  name: string,
  pattern: RegExp | string,
  fn: (ctx: Context) => Awaitable<void>,
  options?: { priority?: number },
): void {
  const file = _getCallerFile()
  const regex = typeof pattern === 'string' ? new RegExp(pattern) : pattern
  commands.push({ name, pattern: regex, fn, priority: options?.priority ?? 0, file })
  markDirty('command')
}

export function accept (
  event: string | '*',
  fn: (ctx: Context) => Awaitable<void>,
  options?: { priority?: number },
): void {
  const file = _getCallerFile()
  accepts.push({ event, fn, priority: options?.priority ?? 0, file })
  markDirty('accept')
}

export function handler (key: string, fn: (ctx: Context) => Awaitable<unknown>): void {
  const file = _getCallerFile()
  handlers.set(key, { key, fn, file })
}

export function task (name: string, cron: string, fn: () => Awaitable<void>): void {
  const file = _getCallerFile()
  const tasks: TaskEntry[] = (globalThis as Record<string, unknown>).__karin_tasks as TaskEntry[] ?? []
    ; (globalThis as Record<string, unknown>).__karin_tasks = tasks
  tasks.push({ name, cron, fn, file })
}

export function button (key: string, fn: (ctx: Context) => Awaitable<void>): void {
  const file = _getCallerFile()
  buttons.set(key, { key, fn, file })
}
