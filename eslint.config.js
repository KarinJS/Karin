import neostandard, { resolveIgnoresFromGitignore } from 'neostandard'

const data = neostandard({
  ignores: resolveIgnoresFromGitignore(),
  globals: ['logger'],
  ts: true,
})

const newData = []

data.forEach(val => {
  // 驼峰命名规则关闭
  if (val.rules['camelcase']) {
    val.rules['camelcase'] = ['off']
  }

  // 排除掉plugins dist
  if (Array.isArray(val.ignores)) {
    val.ignores = val.ignores.filter((v) => !v.includes('plugins') && !v.includes('dist'))
  }
  newData.push(val)
})

export default newData
