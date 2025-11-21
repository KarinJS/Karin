import { describe, it, expect, vi } from 'vitest'
import * as http from './http'

vi.mock('axios', () => {
  return {
    default: vi.fn((config) => Promise.resolve({ data: 'ok', status: 200, config })),
  }
})

describe('network/http', () => {
  it('request forwards options to axios', async () => {
    const res = await http.request('https://example.com', { method: 'POST', timeout: 5000, headers: { a: 'b' }, data: { x: 1 } })
    expect(res.status).toBe(200)
    expect(res.data).toBe('ok')
    expect(res.config.method).toBe('POST')
    expect(res.config.timeout).toBe(5000)
    expect(res.config.headers.a).toBe('b')
  })

  it('get, post, put, del set methods', async () => {
    const g = await http.get('https://example.com')
    expect(g.status).toBe(200)
    const p = await http.post('https://example.com', { a: 1 })
    expect(p.status).toBe(200)
    const u = await http.put('https://example.com', { a: 2 })
    expect(u.status).toBe(200)
    const d = await http.del('https://example.com')
    expect(d.status).toBe(200)
  })
})
