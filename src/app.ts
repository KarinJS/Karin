import { Listeners } from '@/listener/listener'

export let listeners: Listeners

export const run = async () => {
  listeners = new Listeners()
}
