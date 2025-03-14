import neostandard from 'neostandard'

/** 尾随逗号 */
const commaDangle = val => {
  if (val?.rules?.['@stylistic/comma-dangle']?.[0] === 'warn') {
    const rule = val?.rules?.['@stylistic/comma-dangle']?.[1]
    Object.keys(rule).forEach(key => {
      rule[key] = 'always-multiline'
    })
    val.rules['@stylistic/comma-dangle'][1] = rule
  }

  return val
}

/** 忽略的文件 */
const ignores = [
  'node_modules',
  'temp',
  'logs',
  'data',
  'lib',
  'packages/module',
  'packages/core/dist',
  'packages/types/index.d.ts',
  'packages/web/public',
]

const options = neostandard({
  ts: true,
  ignores,
}).map(commaDangle)

export default options
