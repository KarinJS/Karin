import neostandard from 'neostandard'

const data = neostandard({
  ignores: ['node_modules', 'temp', 'logs', 'data'],
  globals: ['logger', 'NodeJS'],
  ts: true,
})

/** 关闭驼峰命名 */
data.forEach((val, index) => {
  if (val?.rules?.['camelcase']) data[index].rules['camelcase'] = ['off']
})

export default data
