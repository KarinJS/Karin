import chokidar from 'chokidar'

const watcher = chokidar.watch([
  'file/file.ts',
  'file/index.ts',
], { cwd: 'packages/utils/src' })

watcher.on('change', (path) => {
  console.log(`File ${path} has been changed`)
})
