/**
 * 端到端冒烟测试 — 验证 dispatch 完整链路
 */
import { start, dispatch } from 'karin'
import type { MessageEvent } from 'karin'

await start()

console.log('\n--- smoke test ---')

const cases = ['#hello', '#echo 测试消息', '#help', '#nomatch'] as const

for (const raw of cases) {
  console.log(`\n> ${raw}`)
  const event: MessageEvent = {
    type: 'message',
    selfId: 'console',
    userId: 'test-user',
    contact: { scene: 'friend', peer: 'test-user' },
    timestamp: Math.floor(Date.now() / 1000),
    messageId: `test_${Date.now()}`,
    rawMessage: raw,
    elements: [{ type: 'text', text: raw }],
  }
  await dispatch(event)
}

console.log('\n--- smoke test passed ---')
process.exit(0)
