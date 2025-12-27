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
  // 参数验证
  if (typeof pkg !== 'string' || !pkg.trim()) {
    throw new Error('[context] setContext: pkg must be a non-empty string')
  }
  if (typeof file !== 'string' || !file.trim()) {
    throw new Error('[context] setContext: file must be a non-empty string')
  }
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
  // 防御性检查
  if (typeof fn !== 'function') {
    throw new Error('withContext: fn must be a function')
  }

  const prev = currentContext
  setContext(pkg, file)
  try {
    return await fn()
  } finally {
    currentContext = prev
  }
}
