import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { errorHandler } from './error'

vi.mock('./listeners', () => ({ listeners: { emit: vi.fn() } }))

describe('printMissing', () => {
  const error = vi.fn()

  beforeEach(() => {
    vi.stubGlobal('logger', { error, red: (s: string) => s, yellow: (s: string) => s })
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    error.mockClear()
  })

  it('手动安装提示使用 pnpm add 与示例保持一致', () => {
    errorHandler.loaderPlugin('karin-plugin-foo', '/plugins/foo/index.js', "Cannot find package 'lodash' imported from /plugins/foo/index.js")
    errorHandler.printMissing()

    const message = error.mock.calls[0][0] as string
    expect(message).toContain('pnpm add 依赖名称 -w')
    expect(message).toContain('pnpm add lodash -w')
    expect(message).not.toMatch(/pnpm i[mn]stall 依赖名称/)
  })
})
