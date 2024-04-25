module.exports = {
  env: {
    es2021: true,
    node: true
  },
  extends: ['standard'],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  globals: {
    logger: true
  },
  plugins: [
    'import',
    'promise'
  ],
  rules: {
    eqeqeq: ['off'],
    'prefer-const': ['off'],
    'arrow-body-style': 'off',
    camelcase: [0, {
      properties: 'always'
    }],
    'import/no-unresolved': 2,
    'import/named': 2,
    'import/default': 2,
    'import/namespace': 2,
    'promise/always-return': 'error',
    'promise/no-return-wrap': 'error',
    'promise/param-names': 'error',
    'promise/catch-or-return': 'error',
    'promise/no-native': 'off',
    'promise/no-nesting': 'warn',
    'promise/no-promise-in-callback': 'warn',
    'promise/no-callback-in-promise': 'warn',
    'promise/avoid-new': 'off',
    'promise/no-new-statics': 'error',
    'promise/no-return-in-finally': 'warn',
    'promise/valid-params': 'warn',
    'no-unused-vars': ['error', { args: 'all' }]
  },
  settings: {
    'import/resolver': {
      alias: [
        ['#Karin', './lib/index.js']
      ]
    },
    node: {
      version: '>=18.0.0'
    }
  },
  ignorePatterns: [
    '/data/',
    '/logs/',
    '/resources/',
    '/temp/',
    'node_modules/',
    'lib/adapter/kritor/protos/compiled.js'
  ]
}
