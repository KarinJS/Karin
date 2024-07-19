import neostandard from 'neostandard'

const data = neostandard({
  ignores: ['node_modules', 'temp', 'logs', 'data'],
  globals: ['logger', 'NodeJS'],
  ts: true,
})

const newData = []

data.forEach(val => {
  // 驼峰命名规则关闭
  if (val?.rules?.['camelcase']) val.rules['camelcase'] = ['off']
  newData.push(val)
})

export default newData
