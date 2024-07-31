import neostandard from 'neostandard'

export default neostandard({
  ignores: ['node_modules', 'temp', 'logs', 'data'],
  globals: ['logger', 'NodeJS'],
  ts: true,
}).map(val => {
  /** 关闭驼峰命名: 追随已有标准 更自由的命名风格 */
  if (val?.rules?.['camelcase']) val.rules['camelcase'] = ['off']
  return val
})
