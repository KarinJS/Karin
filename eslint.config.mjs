import neostandard from 'neostandard'

export default neostandard({
  ts: true,
  globals: ['logger'],
  ignores: ['node_modules', 'temp', 'logs', 'data', 'lib', 'packages/module'],
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
  return val
})
