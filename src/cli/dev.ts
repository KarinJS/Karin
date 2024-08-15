import { KarinCli, Mode, Runner, Lang } from './index'

const karin = new KarinCli()
karin.start(Mode.Dev, Lang.Js, Runner.Node)
