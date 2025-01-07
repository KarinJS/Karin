import '@/service/debug'
export * from '@/service/logger'
import '@/service/init'
export * from '@/service/index'
export * from '@/core/karin/index'
export * from '@/utils/message'
export * from '@/utils'
export * from '@/server'
// export { karin as default } from '@/core/karin/index'
export * from '@/packages/onebot'

import { karin } from '@/core/karin/index'
export default karin
