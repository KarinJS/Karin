/**
 * Button DSL - 极简版
 */

import { registry } from '../api/registry'
import { getContext } from './context'
import type { ButtonCallback, ButtonOptions } from '../types'

export interface ButtonInstance {
  id: string
  callback: ButtonCallback
  options: ButtonOptions
}

export function button (id: string, callback: ButtonCallback, opts: Partial<ButtonOptions> = {}): string {
  const ctx = getContext()
  const instance: ButtonInstance = {
    id,
    callback,
    options: { id, priority: opts.priority ?? 0 },
  }
  return registry.register('button', instance, ctx.pkg, ctx.file, {
    priority: opts.priority,
    metadata: { id },
  })
}

button.create = (opts: ButtonOptions) => (cb: ButtonCallback) => button(opts.id, cb, opts)
