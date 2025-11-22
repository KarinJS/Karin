import { describe, it, expect, vi } from 'vitest'
import { ffmpeg, ffprobe, ffplay } from './ffmpeg'

vi.mock('./exec', () => ({
  exec: vi.fn(async (cmd: string) => ({ status: true, stdout: cmd })),
}))

describe('system/ffmpeg', () => {
  it('uses env path override and strips default prefix', async () => {
    const old = process.env.FFMPEG_PATH
    process.env.FFMPEG_PATH = 'C:/bin/ffmpeg.exe'
    const res = await ffmpeg('ffmpeg -i a b')
    expect(res.stdout.startsWith('"C:/bin/ffmpeg.exe"')).toBe(true)
    process.env.FFMPEG_PATH = old
  })
  it('ffprobe and ffplay construct commands', async () => {
    const r1 = await ffprobe('-version')
    expect(r1.stdout.includes('ffprobe')).toBe(true)
    const r2 = await ffplay('-version')
    expect(r2.stdout.includes('ffplay')).toBe(true)
  })
})