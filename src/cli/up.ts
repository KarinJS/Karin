#!/usr/bin/env node

import { exec } from 'child_process'
import { KarinInit } from 'karin/utils/init'

/** 获取包管理器 */
const pkg = new KarinInit().getRegistry()

let cmd = ''

/** 更新所有依赖到最新版本 */
switch (pkg) {
  case 'pnpm': {
    cmd = 'pnpm update --latest'
    break
  }
  case 'yarn': {
    cmd = 'yarn upgrade --latest'
    break
  }
  case 'npm': {
    cmd = 'npm update --latest'
    break
  }
  case 'cnpm': {
    cmd = 'cnpm update --latest'
    break
  }
}

exec(cmd, (error, stdout, stderr) => {
  if (error) {
    console.error(`[更新依赖] 发送错误:`)
    console.error(`error.stack: ${error.stack}`)
    console.error(`error.message: ${error.message}`)
    return
  }
  console.log(`[更新依赖] 更新完成: ${stdout}`)
  console.log(`[更新依赖] 更新错误: ${stderr}`)
})
