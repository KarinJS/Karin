import neostandard, { resolveIgnoresFromGitignore } from 'neostandard'

const data = neostandard({
  ignores: resolveIgnoresFromGitignore(),
  globals: ['logger'],
})

const newData = []

data.forEach(val => {
  // 驼峰命名规则关闭
  if (val.rules['camelcase']) {
    val.rules['camelcase'] = ['off']
  }

  // 排除掉plugins
  if (Array.isArray(val.ignores)) {
    val.ignores = val.ignores.filter((v) => !v.includes('plugins'))
  }
  newData.push(val)
})

export default newData
