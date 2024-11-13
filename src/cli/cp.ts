import fs from 'node:fs'

const root = './src/global.d.ts'
const target = './lib/global.d.ts'
fs.copyFileSync(root, target)

// 如果是开发环境，src、tsconfig.json存在则是开发环境
const isDev = fs.existsSync('./src') && fs.existsSync('./tsconfig.json')
if (isDev) {
  const data = fs.readFileSync('./package.json', 'utf-8')
  const pkg = JSON.parse(data.replace(/\/lib/g, ''))
  delete pkg.peerDependencies
  fs.writeFileSync('./lib/package.json', JSON.stringify(pkg, null, 2))
}
