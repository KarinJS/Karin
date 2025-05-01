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

  /** 三元表达式 */
  if (val?.rules?.['@stylistic/indent']) {
    console.log(val?.rules?.['@stylistic/indent'])
    val.rules['@stylistic/indent'][2] = {
      ...val.rules?.['@stylistic/indent']?.[2],
      flatTernaryExpressions: true,
      offsetTernaryExpressions: false,
    }
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
  '**/dist/**',
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
