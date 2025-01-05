/**
 * @description 生成`exports`
 */
import fs from 'node:fs'
import { execSync } from 'node:child_process'
import path from 'node:path'

/**
 * 规则如下
 * - `import` 指向`ts`根入口
 * ` `types` 指向`packages/module/*.d.ts`
 */

const main = () => {
  const root = 'src/index.ts'
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
    /** 导入文件路径 */
    const importFile = `./src/packages/module/${filename}.ts`

    /** 如果碰到文件名称带`-`的，去掉前面的`-`，再添加一个 */
    if (filename.includes('-')) {
      const key = filename.split('-')[1]
      exports[`./${key}`] = {
        import: importFile,
        types: typeFile,
        require: importFile,
      }
    }

    exports[`./${filename}`] = {
      import: importFile,
      types: typeFile,
      require: importFile,
    }
  }

  return exports
}

const sort = (file) => {
  const data = fs.readFileSync(file, 'utf-8')
  /** 浅拷贝 */
  const obj = JSON.parse(data)
  delete obj.exports

  const pkg = { ...obj, exports: JSON.parse(data).exports }
  fs.writeFileSync(file, JSON.stringify(pkg, null, 2))
}

const root = process.env.INIT_CWD || process.cwd()
const file = `${root}/package.json`
const pkg = JSON.parse(fs.readFileSync(file, 'utf-8'))

pkg.exports = init(root)
pkg.main = pkg.exports['.'].import
pkg.types = pkg.exports['.'].types

fs.writeFileSync(file, JSON.stringify(pkg, null, 2))
execSync('npm run sort', { stdio: 'inherit' })

sort(file)
