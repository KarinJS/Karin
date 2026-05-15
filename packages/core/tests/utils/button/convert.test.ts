import { describe, it, expect } from 'vitest'
import { karinToQQBot, qqbotToKarin } from '@/utils/button/convert'
import type { ButtonElement, KeyboardElement } from '@/types/segment'

const makeButton = (overrides: Partial<ButtonElement['data'][number]> = {}): ButtonElement => ({
  type: 'button',
  data: [
    {
      text: 'click me',
      ...overrides,
    },
  ],
})

const makeKeyboard = (rows: KeyboardElement['rows']): KeyboardElement => ({
  type: 'keyboard',
  rows,
})

describe('utils/button/convert — karinToQQBot', () => {
  it('returns one row containing one normal-type button when input is a single button', () => {
    const result = karinToQQBot(makeButton())
    expect(result).toHaveLength(1)
    expect(result[0].buttons).toHaveLength(1)
    const b = result[0].buttons[0]
    expect(b.action.type).toBe(2) // default (no link, no callback)
    expect(b.render_data.label).toBe('click me')
    expect(b.action.permission.type).toBe(2)
  })

  it('detects link buttons (action.type 0)', () => {
    const result = karinToQQBot(makeButton({ link: 'https://example.com' }))
    expect(result[0].buttons[0].action.type).toBe(0)
    expect(result[0].buttons[0].action.data).toBe('https://example.com')
  })

  it('detects callback buttons (action.type 1)', () => {
    const result = karinToQQBot(makeButton({ callback: true, data: 'cb-payload' }))
    expect(result[0].buttons[0].action.type).toBe(1)
    expect(result[0].buttons[0].action.data).toBe('cb-payload')
  })

  it('flips permission.type to 1 for admin-only buttons', () => {
    const result = karinToQQBot(makeButton({ admin: true }))
    expect(result[0].buttons[0].action.permission.type).toBe(1)
  })

  it('forwards specify_user_ids when list is provided', () => {
    const result = karinToQQBot(makeButton({ list: ['1', '2'] }))
    const perm = result[0].buttons[0].action.permission
    expect(perm.type).toBe(0)
    expect(perm.specify_user_ids).toEqual(['1', '2'])
  })

  it('forwards specify_role_ids when role is provided', () => {
    const result = karinToQQBot(makeButton({ role: ['r1'] }))
    const perm = result[0].buttons[0].action.permission
    expect(perm.type).toBe(3)
    expect(perm.specify_role_ids).toEqual(['r1'])
  })

  it('assigns sequential ids across multi-row keyboards', () => {
    const kb = makeKeyboard([
      [{ text: 'a' }, { text: 'b' }],
      [{ text: 'c' }],
    ])
    const result = karinToQQBot(kb)
    expect(result).toHaveLength(2)
    expect(result[0].buttons.map(b => b.id)).toEqual(['0', '1'])
    expect(result[1].buttons.map(b => b.id)).toEqual(['2'])
  })
})

describe('utils/button/convert — qqbotToKarin', () => {
  it('emits a [button:link:...] string for link buttons', () => {
    const qqRows = karinToQQBot(makeButton({ link: 'https://example.com' }))
    const out = qqbotToKarin(qqRows)
    expect(out).toContain('[button:')
    expect(out).toContain('link:https://example.com')
  })

  it('emits callback:true for callback buttons', () => {
    const qqRows = karinToQQBot(makeButton({ callback: true, data: 'cb' }))
    const out = qqbotToKarin(qqRows)
    expect(out).toContain('callback:true')
  })

  it('emits admin:true for admin permission buttons', () => {
    const qqRows = karinToQQBot(makeButton({ admin: true }))
    const out = qqbotToKarin(qqRows)
    expect(out).toContain('admin:true')
  })
})
