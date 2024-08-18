import { program } from 'commander'
import { KarinCli, Mode, Runner, Lang } from './index'

const karin = new KarinCli()
program.version(karin.pkg(true).version, '-v, --version', '显示版本号')
program.command('.').description('启动karin').action(() => karin.start(Mode.Prod, Lang.Js, Runner.Node))
program.command('start').description('启动karin').action(() => karin.start(Mode.Prod, Lang.Js, Runner.Node))
program.command('dev').description('dev开发模式').action(() => karin.start(Mode.Dev, Lang.Js, Runner.Node))
program.parse(process.argv)
