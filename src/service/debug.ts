import { createDebug } from '@/utils/debug/debug'

export const debug = createDebug('core')

global.debug = debug
