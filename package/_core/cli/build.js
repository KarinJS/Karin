/**
 * @description 生成类型
 */
import fs from 'node:fs'
import path from 'node:path'
import { execSync } from 'node:child_process'

/**
 * 生成pm2入口文件
 */
export const pm2 = () => {
  const file = process.cwd() + '/dist/cli/pm2.js'
  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(file, 'import \'node-karin\'')
}

/**
 * 生成types
 * - 删除root.d.ts中的默认导出
 * - 删除index.d.ts中的root.d.ts导入
 */
export const types = () => {
  const root = './dist/root.d.ts'
  const content = fs.readFileSync(root, 'utf-8')
  const varName = content.match(/(\w+)\s+as\s+default/)[1]
  const rootData = content
    .replace(new RegExp(`declare\\s+const\\s+${varName}\\s*:\\s*{[^}]*}.*`), '')
    .replace(/,?\s*\w+\s+as\s+default/, '')
    .replace(/declare /g, '')

  const index = './dist/index.d.ts'
  const indexContent = fs.readFileSync(index, 'utf-8')
  fs.writeFileSync(index, `import { EventEmitter } from 'node:events';\n${indexContent}`)

  const indexData = fs.readFileSync(index, 'utf-8')
  const lines = indexData.split('\n')

  // 找到第一个非 import/export 行的索引
  let insertIndex = 0
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()
    if (line && !line.startsWith('import ') && !line.startsWith('export ')) {
      insertIndex = i
      break
    }
  }

  const newLines = [
    ...lines.slice(0, insertIndex),
    'import { EventEmitter } from \'node:events\';',
    rootData,
    ...lines.slice(insertIndex),
  ].join('\n').split('\n').map(line => `  ${line}`).join('\n')

  const types = newLines
    .replace(/declare /g, '')
    .replace(/.*from\s+'.*root\.js'.*/g, '')
    .replace(/.*from\s+"\.\/root\.js".*/g, '')

  fs.writeFileSync('../types/index.d.ts', `declare module "node-karin" {\n${types}\n}`)
}

/**
 * @description 生成类型
 */
export const main = () => {
  execSync('npm run sort', { stdio: 'inherit' })
  pm2()
  types()
}

main()
