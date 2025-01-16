import neostandard from 'neostandard'
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended'

/** 尾随逗号 */
const commaDangle = (val) => {
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
]

const options = neostandard({
  ts: true,
  ignores,
  globals: ['logger'],
  plugins: {
    ...eslintPluginPrettierRecommended.plugins,
  },
}).map(commaDangle)

export default options
