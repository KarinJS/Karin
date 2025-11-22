import fs from 'node:fs'
import path from 'node:path'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { checkType, filterStringArray, convertAliasToRegex, generateRandomPassword, getValidPassword, getValidUsername, getFfmpegPath } from '../utils'

vi.mock('@karinjs/utils', () => {
  return {
    findCmdPath: vi.fn((cmd: string) => {
      return cmd === 'ffmpeg' ? 'C:/ffmpeg/ffmpeg.exe' : ''
    }),
  }
})

const tmp = (globalThis as any).__TEST_DIRS__.tmpRoot as string

beforeEach(() => {
  fs.mkdirSync(tmp, { recursive: true })
})

afterEach(() => {
  try { fs.rmSync(tmp, { recursive: true, force: true }) } catch { }
})

describe('类型检查 checkType', () => {
  it('类型匹配时返回原值', () => {
    expect(checkType('number', 1, 0)).toBe(1)
  })
  it('类型不匹配时返回默认值', () => {
    expect(checkType('string', 1, 'x')).toBe('x')
  })
  it('支持布尔类型', () => {
    expect(checkType('boolean', true, false)).toBe(true)
  })
})

describe('字符串数组过滤 filterStringArray', () => {
  it('非数组返回空数组', () => {
    expect(filterStringArray(null)).toEqual([])
  })
  it('过滤非字符串与空字符串', () => {
    expect(filterStringArray(['a', 1, '', 'b'])).toEqual(['a', 'b'])
  })
  it('空数组返回空数组', () => {
    expect(filterStringArray([])).toEqual([])
  })
})

describe('别名转正则 convertAliasToRegex', () => {
  it('普通字符串转前缀匹配', () => {
    const result = convertAliasToRegex(['x', 'y'])
    expect(result.map(r => r.source)).toEqual(['^x', '^y'])
  })
  it('解析正则字符串格式', () => {
    const result = convertAliasToRegex(['/(a|b)/i'])
    expect(result[0].source).toBe('(a|b)')
    expect(result[0].flags).toBe('i')
  })
  it('非法正则字符串被忽略', () => {
    const result = convertAliasToRegex(['/('])
    expect(result.length).toBe(0)
  })
  it('异常正则通过捕获处理', () => {
    const result = convertAliasToRegex(['/(a[)/'])
    expect(result.length).toBe(0)
  })
})

describe('随机密码 generateRandomPassword', () => {
  it('默认长度为8位', () => {
    expect(generateRandomPassword()).toHaveLength(8)
  })
  it('支持自定义长度', () => {
    expect(generateRandomPassword(12)).toHaveLength(12)
  })
  it('仅包含十六进制字符', () => {
    const p = generateRandomPassword(10)
    expect(/^[a-f0-9]+$/i.test(p)).toBe(true)
  })
})

describe('密码校验 getValidPassword', () => {
  it('sha256 哈希直接通过', () => {
    const r = getValidPassword('a'.repeat(64))
    expect(r.valid).toBe(true)
    expect(r.value).toBe('a'.repeat(64))
  })
  it('过短密码将生成新密码', () => {
    const r = getValidPassword('123')
    expect(r.valid).toBe(false)
    expect(r.value.length).toBe(8)
  })
  it('复杂密码通过校验', () => {
    const r = getValidPassword('Abcdef12')
    expect(r.valid).toBe(true)
    expect(r.value).toBe('Abcdef12')
  })
  it('仅一种类型的密码不通过', () => {
    const r = getValidPassword('aaaaaaaa')
    expect(r.valid).toBe(false)
  })
  it('非字符串输入返回无效', () => {
    const r = getValidPassword(123 as any)
    expect(r.valid).toBe(false)
  })
  it('仅大写不通过', () => {
    const r = getValidPassword('AAAAAAAA')
    expect(r.valid).toBe(false)
  })
  it('仅数字不通过', () => {
    const r = getValidPassword('12345678')
    expect(r.valid).toBe(false)
  })
  it('仅特殊字符不通过', () => {
    const r = getValidPassword('!!!!!!!!')
    expect(r.valid).toBe(false)
  })
})

describe('用户名校验 getValidUsername', () => {
  it('长度大于6通过', () => {
    const r = getValidUsername('abcdefg')
    expect(r.valid).toBe(true)
    expect(r.value).toBe('abcdefg')
  })
  it('过短用户名将生成新用户名', () => {
    const r = getValidUsername('abc')
    expect(r.valid).toBe(false)
    expect(r.value.length).toBe(8)
  })
  it('非字符串输入返回无效', () => {
    const r = getValidUsername(123 as any)
    expect(r.valid).toBe(false)
  })
})

describe('FFmpeg 路径 getFfmpegPath', () => {
  it('给定存在路径则直接返回', () => {
    const p = path.join(tmp, 'ffmpeg.bin')
    fs.writeFileSync(p, 'x')
    expect(getFfmpegPath(p, 'ffmpeg')).toBe(p)
  })
  it('未提供路径则回退到环境查找', () => {
    expect(getFfmpegPath('', 'ffmpeg')).toMatch(/ffmpeg\.exe$/)
  })
  it('未找到返回空字符串', () => {
    expect(getFfmpegPath('', 'ffplay')).toBe('')
  })
})
