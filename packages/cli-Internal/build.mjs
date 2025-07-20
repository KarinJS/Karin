import fs from 'node:fs'
import path from 'node:path'

if (process.argv[4] !== 'development') {
  const file = path.join(process.cwd(), '../core/dist/cli/pm2.js')
  if (fs.existsSync(file)) {
    fs.unlinkSync(file)
  }
  const content = 'import \'node-karin/start\''
  fs.writeFileSync(file, content)
}
