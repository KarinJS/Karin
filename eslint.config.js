import neostandard from 'neostandard'

export default neostandard({
  ignores: ['node_modules', 'temp', 'logs', 'data', 'src/public', 'lib/public'],
  globals: ['logger', 'NodeJS'],
  ts: true,
}).map(val => {
  if (val?.rules?.['@stylistic/comma-dangle']?.[0] === 'warn') {
    val.rules['@stylistic/comma-dangle'] = [
      'warn',
      {
        arrays: 'always-multiline',
        enums: 'always-multiline',
        exports: 'always-multiline',
        imports: 'always-multiline',
        objects: 'always-multiline',
      },
    ]
    return val
  }

  /** 关闭驼峰命名: 追随已有标准 更自由的命名风格 */
  if (val?.rules?.['camelcase']) val.rules['camelcase'] = ['off']

  /** 禁用 react/no-is-mounted 规则 */
  if (val?.rules) val.rules['react/no-is-mounted'] = 'off'

  return val
})
