import { createHttpRenderClient } from './connect/http'
import { createWebSocketRenderClient } from './connect/client'

export type * from './core/types'

/**
 * @internal
 * @description 初始化渲染器
 */
export const initRender = async () => {
  createHttpRenderClient()
  createWebSocketRenderClient()
  await import('./connect/server')
}
