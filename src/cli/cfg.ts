#!/usr/bin/env node

/**
 * @description 入口函数
 */
export const main = async () => {
  const fs = await import('fs').then((res) => res.default)

  /** 创建入口 */
  fs.writeFileSync(`${process.cwd()}/index.js`, 'import(\'node-karin\').then(karin => karin.run())\n')

  /** 创建pnpm工作区配置 */
  fs.writeFileSync(`${process.cwd()}/pnpm-workspace.yaml`, 'packages:\n  - \'plugins/**\'\n')

  /** 根据当前npm源来决定是否设置镜像源 */
  const { exec } = await import('@/utils/system/exec')
  const { stdout } = await exec('npm config get registry')
  if (!stdout || stdout.includes('registry.npmjs.org')) return

  const list = [
    'node_sqlite3_binary_host_mirror=https://registry.npmmirror.com/-/binary/sqlite3',
    'better_sqlite3_binary_host_mirror=https://registry.npmmirror.com/-/binary/better-sqlite3',
    'sass_binary_site=https://registry.npmmirror.com/-/binary/node-sass',
    'sharp_binary_host=https://registry.npmmirror.com/-/binary/sharp',
    'sharp_libvips_binary_host=https://registry.npmmirror.com/-/binary/sharp-libvips',
    'canvas_binary_host_mirror=https://registry.npmmirror.com/-/binary/canvas',
    '# 19以下版本',
    'puppeteer_download_host=https://registry.npmmirror.com/mirrors',
    '# 20以上版本',
    'PUPPETEER_DOWNLOAD_BASE_URL = https://registry.npmmirror.com/binaries/chrome-for-testing',
  ]

  fs.writeFileSync(`${process.cwd()}/.npmrc`, list.join('\n'))
}

/** 如果脚本是 node cfg.js --init则执行脚本 */
if (process.argv.includes('--init')) main()
