import { describe, it, expect, vi } from 'vitest'
import { clamp, random, round, average, isEven, percentage } from './calc'

describe('number/calc', () => {
  it('clamp limits value in range', () => {
    expect(clamp(5, 0, 10)).toBe(5)
    expect(clamp(-1, 0, 10)).toBe(0)
    expect(clamp(11, 0, 10)).toBe(10)
  })

  it('random returns deterministic with mocked Math.random', () => {
    const spy = vi.spyOn(Math, 'random').mockReturnValue(0.5)
    expect(random(1, 10)).toBe(6)
    spy.mockRestore()
  })

  it('round rounds to decimals', () => {
    expect(round(1.234, 2)).toBe(1.23)
    expect(round(1.235, 2)).toBe(1.24)
    expect(round(10, 0)).toBe(10)
  })

  it('average computes mean and handles empty', () => {
    expect(average([1, 2, 3, 4, 5])).toBe(3)
    expect(average([])).toBe(0)
  })

  it('isEven checks parity', () => {
    expect(isEven(2)).toBe(true)
    expect(isEven(3)).toBe(false)
  })

  it('percentage computes ratio', () => {
    expect(percentage(75, 200)).toBe(37.5)
    expect(percentage(1, 3, 2)).toBe(33.33)
    expect(percentage(1, 0)).toBe(0)
  })
})
