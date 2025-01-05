/**
 * `package.json` 现有规则是适配`tsx`的
 * - 编译后需要将以下规则修改，适配`js`
 * - `main` 指向 `lib/index.js`
 * - `types` 指向 `lib/index.d.ts`
 * - `exports` 中的 `import` 指向 `lib/module/*.js`
 */
import fs from 'node:fs'
import path from 'node:path'

const main = () => {
  const root = 'lib/index.js'
  const types = 'packages/module'
  return { root, types }
}

const init = (cwd) => {
  const exports = {}
  const { root, types } = main()

  exports['.'] = {
    import: `./${root}`,
    types: './lib/index.d.ts',
  }

  const files = fs.readdirSync(`${cwd}/src/packages/module`)

  for (const file of files) {
    /** 文件名称 不带后缀 */
    const filename = path.basename(file, '.ts')
    /** 类型文件路径 */
    const typeFile = `./${types}/${filename}.d.ts`
    /** esm导入文件路径 */
    const importFile = `./packages/module/${filename}.js`
    /** cjs导入文件路径 */
    const requireFile = importFile.replace('.js', '.cjs')

    /** 如果碰到文件名称带`-`的，去掉前面的`-`，再添加一个 */
    if (filename.includes('-')) {
      const key = filename.split('-')[1]
      exports[`./${key}`] = {
        import: importFile,
        types: typeFile,
        require: requireFile,
      }
    }

    exports[`./${filename}`] = {
      import: importFile,
      types: typeFile,
      require: requireFile,
    }
  }

  return exports
}

const root = process.env.INIT_CWD || process.cwd()
const file = `${root}/package.json`
const pkg = JSON.parse(fs.readFileSync(file, 'utf-8'))

pkg.exports = init(root)
pkg.main = pkg.exports['.'].import
pkg.types = pkg.exports['.'].types

fs.writeFileSync(file, JSON.stringify(pkg, null, 2))
