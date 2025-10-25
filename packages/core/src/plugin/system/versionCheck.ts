import { satisfies } from '@/utils/system'

/** 版本比较（仅 X.Y.Z） */
const cmpVer = (a: string, b: string): number => {
  const pa = a.split('.').map(n => parseInt(n, 10) || 0)
  const pb = b.split('.').map(n => parseInt(n, 10) || 0)
  if (pa[0] !== pb[0]) return pa[0] - pb[0]
  if (pa[1] !== pb[1]) return pa[1] - pb[1]
  return pa[2] - pb[2]
}

/** 归一化版本核心（处理 x/* 通配符为 0） */
const normalizeCore = (v: string): string | null => {
  const core = v.replace(/[xX*]/g, '0')
  const m = core.match(/\d+\.\d+\.\d+/)
  return m ? m[0] : null
}

/** >x.y.z 的下界取 x.y.(z+1)，其它操作符取核心版本即可 */
const nextPatchIfGreater = (op: string, core: string): string => {
  if (op !== '>') return core
  const [maj, min, pat] = core.split('.').map(n => parseInt(n, 10) || 0)
  return `${maj}.${min}.${pat + 1}`
}

const calcLowerBoundSingle = (range: string): string | null => {
  const tokens = range
    .split(/\s+/)
    .map(t => t.trim())
    .filter(t => t && t !== '&&')

  const candidates: string[] = []

  for (const tk of tokens) {
    const m = tk.match(/^(\^|>=|>|~)?(.+)$/)
    const op = m?.[1] || ''
    const ver = (m?.[2] || tk).trim()

    const core = normalizeCore(ver)
    if (!core) continue

    // 只对 '>' 做 +1，其它保持核心版本作为候选
    const candidate = op === '>' ? nextPatchIfGreater(op, core) : core
    candidates.push(candidate)
  }

  // 选出满足整个范围的最小候选
  let lower: string | null = null
  for (const v of candidates) {
    if (!satisfies(range, v)) continue
    if (!lower || cmpVer(v, lower) < 0) {
      lower = v
    }
  }
  return lower
}

// 支持 "A || B"：选两个分支里更小的满足版本
const calcLowerBoundBySatisfies = (range: string): string | null => {
  const parts = range.split('||').map(s => s.trim()).filter(Boolean)
  if (parts.length <= 1) return calcLowerBoundSingle(range)

  let best: string | null = null
  for (const part of parts) {
    const lb = calcLowerBoundSingle(part)
    if (lb && (!best || cmpVer(lb, best) < 0)) {
      best = lb
    }
  }
  return best
}

type Item = { name: string; engines: string }

export const createPluginMismatchReporter = () => {
  const items: Item[] = []
  let maxRequired: string | null = null

  /** 添加不匹配项 */
  const add = (name: string, engines: string) => {
    items.push({ name, engines })
    const lower = calcLowerBoundBySatisfies(engines)
    if (lower) {
      if (!maxRequired || cmpVer(lower, maxRequired) > 0) {
        maxRequired = lower
      }
    }
  }

  /** 打印不匹配项 */
  const flush = async (shouldPrint = true, currentVersion?: string) => {
    if (!items.length || !shouldPrint) return

    const lines: string[] = []

    lines.push(logger.yellow('⚠ 以下插件版本不匹配当前 Karin 版本:'))
    lines.push('')

    for (const it of items) {
      lines.push(logger.yellow(`  ${logger.blue(it.name)}: ${it.engines}`))
    }

    lines.push('')
    lines.push(logger.yellow('dependencies:'))

    if (maxRequired) {
      if (currentVersion && cmpVer(currentVersion, maxRequired) < 0) {
        lines.push(`  ${logger.green('node-karin:')} ${logger.gray(currentVersion)} -> ${logger.cyan(maxRequired)}`)
        lines.push('')
        lines.push(logger.white(`为达到此部分插件的最低运行要求，建议执行：${logger.yellow(`pnpm up node-karin@${maxRequired}`)}`))
      } else if (!currentVersion) {
        lines.push(`  ${logger.green('node-karin:')} ${logger.cyan(maxRequired)}`)
        lines.push('')
        lines.push(logger.white(`为达到此部分插件的最低运行要求，建议执行：${logger.yellow(`pnpm up node-karin@${maxRequired}`)}`))
      }
    }

    console.log(lines.join('\n'))
  }

  return { add, flush }
}
