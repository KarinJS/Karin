import { lint } from './tools'
import { configPath } from '@/root'
import { defaultConfig } from './default'
import { requireFile } from '../fs/require'

import type { Renders } from '@/types/config'

const FILE = `${configPath}/render.json`
const cache = await lint<Renders>(defaultConfig.render, await requireFile(FILE))

/**
 * @description 获取渲染配置
 */
export const render = () => cache
