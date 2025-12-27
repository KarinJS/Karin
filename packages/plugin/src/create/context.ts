/**
 * 上下文管理
 * @module create/context
 */

/** 当前注册上下文 */
interface RegisterContext {
  /** 当前包名 */
  pkg: string
  /** 当前文件 */
  file: string
}

let currentContext: RegisterContext | null = null

/**
 * 设置当前上下文
 */
export function setContext (pkg: string, file: string): void {
  currentContext = { pkg, file }
}

/**
 * 获取当前上下文
 */
export function getContext (): RegisterContext {
  if (!currentContext) {
    return { pkg: 'unknown', file: 'unknown' }
  }
  return currentContext
}

/**
 * 清除上下文
 */
export function clearContext (): void {
  currentContext = null
}

/**
 * 在上下文中执行
 */
export async function withContext<T> (
  pkg: string,
  file: string,
  fn: () => T | Promise<T>
): Promise<T> {
  const prev = currentContext
  setContext(pkg, file)
  try {
    return await fn()
  } finally {
    currentContext = prev
  }
}
