#!/usr/bin/env node

/**
 * @description 入口函数
 * @param program
 */
async function main (
  program: typeof import('commander').program,
  karin: typeof import('./main')
) {
  const { version } = await import('./package').then((res) => res.pkg())
  program.version(version, '-v, --version', '显示版本号')
  program.command('.').description('前台启动').action(() => { karin.runFork() })
  program.command('start').description('前台启动').action(() => { karin.runFork() })
  program.command('pm2').description('后台运行').action(() => { karin.checkPM2() })
  program.command('stop').description('停止后台运行').action(() => { karin.stopPM2() })
  program.command('rs').description('重启pm2服务').action(() => { karin.restartPM2() })
  program.command('dev').description('JavaScript开发模式').action(() => { karin.runDev() })
  program.command('ts').description('TypeScript开发模式').action(() => { karin.runTsx() })
  program.command('log').description('查看日志').action(() => { karin.logPM2() })
  // program.command('up').description('更新依赖').action(() => karin.runFork())
  program.command('init').description('初始化karin').action(() => init())
  program.parse(process.argv)
}

/**
 * @description 初始化基本配置
 */
async function init () {
  const { init } = await import('../cli/cfg')
  await init()
}

import('commander').then(({ program }) => {
  import('./main').then((karin) => main(program, karin))
})
