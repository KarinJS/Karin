import { describe, it, expect, vi } from 'vitest'
import * as mod from './race'

describe('network/race getFastRegistry', () => {
  it('handles success and catch branch', async () => {
    const spy = vi.spyOn(mod, 'raceRequest')
    spy.mockResolvedValueOnce({ config: { url: 'https://registry.npmjs.com' } } as any)
    const fast = await mod.getFastRegistry()
    expect(typeof fast).toBe('string')
    spy.mockRejectedValueOnce(new Error('fail'))
    const fallback = await mod.getFastRegistry()
    expect(typeof fallback).toBe('string')
    spy.mockRestore()
  })
})
