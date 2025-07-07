import { createFile, createLogger, createPkg } from '@/plugin/tools'
import type { OptionsBase } from './options'
import type { Accept, NoticeAndRequest } from '@/types/plugin'

export interface AcceptOptions extends OptionsBase {
}

/**
 * accept
 * @param event 监听事件
 * @param fnc 实现函数
 */
export const accept = <T extends keyof NoticeAndRequest> (
  event: T,
  fnc: (e: NoticeAndRequest[T], next: () => unknown) => Promise<unknown> | unknown,
  options: AcceptOptions = {}
): Accept<T> => {
  const dsbAdapter = options.dsbAdapter || options.notAdapter || []
  const rank = Number(options.rank ?? options.priority)
  return {
    event,
    fnc,
    log: createLogger(options.log, true),
    adapter: Array.isArray(options.adapter) ? options.adapter : [],
    dsbAdapter: Array.isArray(dsbAdapter) ? dsbAdapter : [],
    file: createFile('accept', options.name || 'accept'),
    pkg: createPkg(),
    priority: rank ?? 10000,
  }
}
