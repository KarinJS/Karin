#!/usr/bin/env node

import { program } from 'commander'
import { KarinCli, Mode, Runner, Lang } from './index'

const cli = new KarinCli()

program.version(cli.pkg(true).version, '-v, --version', '显示版本号')
program.command('.').description('启动karin').action(() => cli.start(Mode.Prod, Lang.Js, Runner.Node))
program.command('start').description('启动karin').action(() => cli.start(Mode.Prod, Lang.Js, Runner.Node))
program.command('pm2').description('后台运行karin').action(() => cli.start(Mode.Prod, Lang.Js, Runner.Pm2))
program.command('stop').description('停止后台运行').action(() => cli.stop())
program.command('rs').description('重启pm2服务').action(() => cli.restart())
program.command('dev').description('JavaScript开发模式').action(() => cli.start(Mode.Dev, Lang.Js, Runner.Node))
program.command('ts').description('TypeScript开发模式').action(() => cli.start(Mode.Dev, Lang.Ts, Runner.Tsx))
program.command('log').description('查看日志').action(() => cli.log())
program.command('up').description('更新依赖').action(() => cli.update())
program.command('init').description('初始化karin').action(() => { import('./init') })
program.parse(process.argv)
