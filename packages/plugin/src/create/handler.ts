/**
 * Handler DSL - 极简版
 */

import { registry } from '../api/registry'
import { getContext } from './context'
import type { HandlerCallback, HandlerOptions } from '../types'

export interface HandlerInstance {
  key: string
  callback: HandlerCallback
  options: HandlerOptions
}

export function handler (key: string, callback: HandlerCallback, opts: Partial<HandlerOptions> = {}): string {
  const ctx = getContext()
  const instance: HandlerInstance = {
    key,
    callback,
    options: { key, priority: opts.priority ?? 0 },
  }
  return registry.register('handler', instance, ctx.pkg, ctx.file, {
    priority: opts.priority,
    metadata: { key },
  })
}

handler.create = (opts: HandlerOptions) => (cb: HandlerCallback) => handler(opts.key, cb, opts)
