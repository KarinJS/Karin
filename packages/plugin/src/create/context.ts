/**
 * 上下文管理 - 极简版
 * @module create/context
 */

let ctx: { pkg: string, file: string } | null = null

export const setContext = (pkg: string, file: string) => { ctx = { pkg, file } }
export const getContext = () => ctx ?? { pkg: 'unknown', file: 'unknown' }
export const clearContext = () => { ctx = null }

export async function withContext<T> (pkg: string, file: string, fn: () => T | Promise<T>): Promise<T> {
  const prev = ctx
  ctx = { pkg, file }
  try { return await fn() }
  finally { ctx = prev }
}
