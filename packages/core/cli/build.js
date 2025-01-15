/**
 * @description 生成`exports`
 */
import fs from 'node:fs'
import path from 'node:path'
import { execSync } from 'node:child_process'

const root = './dist/module'

const init = (cwd, isDev = false) => {
  const exports = {}

  exports['.'] = {
    import: isDev ? './src/index.ts' : './dist/index.js',
    types: './dist/index.d.ts',
  }

  exports['./dir'] = {
    import: './dist/root.js',
    types: './dist/root.d.ts',
  }

  exports['./cli'] = {
    import: './dist/cli/index.js',
    types: './dist/cli/index.d.ts',
    require: './dist/cli/index.cjs',
  }

  const files = fs.readdirSync(`${cwd}/exports/module`)

  for (const file of files) {
    /** 文件名称 不带后缀 */
    const filename = path.basename(file, '.ts')
    /** 类型文件路径 */
    const typeFile = `${root}/${filename}.d.ts`

    const cjs = `${root}/${filename}.cjs`
    const esm = `${root}/${filename}.js`

    /** 如果碰到文件名称带`-`的，去掉前面的`-`，再添加一个 */
    if (filename.includes('-')) {
      const key = filename.split('-')[1]
      exports[`./${key}`] = {
        import: esm,
        types: typeFile,
        require: cjs,
      }
    }

    exports[`./${filename}`] = {
      import: esm,
      types: typeFile,
      require: cjs,
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

/**
 * 生成pm2入口文件
 */
export const pm2 = () => {
  const file = process.cwd() + '/dist/cli/pm2.js'
  fs.writeFileSync(file, 'import \'node-karin\'')
}

/**
 * @description 生成`exports`
 * @param {boolean} isDev - 是否是开发环境
 */
export const main = (isDev = false) => {
  const cwd = process.cwd()
  const file = `${cwd}/package.json`
  const pkg = JSON.parse(fs.readFileSync(file, 'utf-8'))

  pkg.exports = init(cwd, isDev)
  pkg.main = pkg.exports['.'].import
  pkg.types = pkg.exports['.'].types

  fs.writeFileSync(file, JSON.stringify(pkg, null, 2))
  execSync('npm run sort', { stdio: 'inherit', cwd })

  sort(file)
  pm2()
}

const isDev = process.argv?.[2]?.includes('dev')
main(isDev)
