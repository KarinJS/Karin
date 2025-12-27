/**
 * Accept DSL - 极简版
 * @module create/accept
 */

import { registry } from '../api/registry'
import { getContext } from './context'
import type { AcceptCallback, AcceptOptions } from '../types'

export interface AcceptInstance {
  event: string
  callback: AcceptCallback
  options: AcceptOptions
}

export function accept (
  event: string,
  callback: AcceptCallback,
  opts: Partial<AcceptOptions> = {}
): string {
  const ctx = getContext()
  const instance: AcceptInstance = {
    event,
    callback,
    options: { event, priority: opts.priority ?? 0 },
  }
  return registry.register('accept', instance, ctx.pkg, ctx.file, {
    priority: opts.priority,
    metadata: { event },
  })
}

accept.create = (opts: AcceptOptions) => (cb: AcceptCallback) => accept(opts.event, cb, opts)
