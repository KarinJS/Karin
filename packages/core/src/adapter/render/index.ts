export * from './admin/cache'
export * from './admin/template'
export * from './admin/types'
import './connect/client'
import './connect/server'

import { createHttpRenderClient } from './connect/http'
import { createWebSocketRenderClient } from './connect/client'

setTimeout(() => {
  createHttpRenderClient()
  createWebSocketRenderClient()
}, 1000)
