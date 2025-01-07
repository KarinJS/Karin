import fs from 'node:fs'

const root = process.env.INIT_CWD || process.cwd()
const base = `${root}/packages/types`
const index = `${base}/index.js`
const types = `${base}/index.d.ts`
const pkg = `${base}/package.json`

// 如果输出的命令中包含`prod` 则从`lib`中复制`index.d.ts`
if (process.argv?.[2]?.includes('prod')) {
  fs.copyFileSync(`${root}/lib/index.d.ts`, types)
}

if (fs.existsSync(index)) fs.unlinkSync(index)

const data = fs.readFileSync(types, 'utf-8')
  .replace(/\n/g, '\n  ')
  .replace(/declare /g, '')

fs.writeFileSync(types, `declare module 'node-karin' {\n${data}\n}'`)

const pkgData = JSON.parse(fs.readFileSync(`${root}/package.json`, 'utf-8'))

const typesData = {
  name: '@karinjs/karin-types',
  version: pkgData.version,
  main: '',
  types: 'index.d.ts',
  scripts: {
    pub: 'npm publish --access public',
  },
  publishConfig: {
    access: 'public',
    registry: 'https://registry.npmjs.org',
    files: [
      'index.d.ts',
      'package.json',
    ],
  },
}
fs.writeFileSync(pkg, JSON.stringify(typesData, null, 2))
